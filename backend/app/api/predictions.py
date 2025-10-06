from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.models import Prediction, User, Feedback
from app.schemas.schemas import (
    PredictionRequest,
    PredictionResponse,
    PredictionDetail,
    FeedbackCreate,
    FeedbackResponse
)
from app.api.auth import get_current_user
from app.services.ml_service import predict_disease
from app.services.llm_service import get_medicine_advice
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


def cleanup_old_predictions(db: Session, user_id: int, max_predictions: int = 10):
    """
    Delete oldest predictions for a user, keeping only the most recent {max_predictions}.
    This prevents unlimited database growth while preserving recent history.
    
    Args:
        db: Database session
        user_id: User ID to clean up predictions for
        max_predictions: Maximum number of predictions to keep (default: 10)
    """
    try:
        # Count total predictions for this user
        total_count = db.query(Prediction).filter(Prediction.user_id == user_id).count()
        
        if total_count > max_predictions:
            # Calculate how many to delete
            delete_count = total_count - max_predictions
            
            # Get IDs of oldest predictions to delete
            oldest_predictions = db.query(Prediction.id).filter(
                Prediction.user_id == user_id
            ).order_by(Prediction.timestamp.asc()).limit(delete_count).all()
            
            oldest_ids = [pred.id for pred in oldest_predictions]
            
            # Delete associated feedback first (foreign key constraint)
            db.query(Feedback).filter(Feedback.prediction_id.in_(oldest_ids)).delete(synchronize_session=False)
            
            # Delete old predictions
            db.query(Prediction).filter(Prediction.id.in_(oldest_ids)).delete(synchronize_session=False)
            
            db.commit()
            logger.info(f"Cleaned up {delete_count} old predictions for user {user_id}. Kept last {max_predictions}.")
    except Exception as e:
        logger.error(f"Error cleaning up predictions for user {user_id}: {str(e)}")
        db.rollback()
        # Don't raise exception - cleanup failure shouldn't break prediction creation


@router.post("/predict", response_model=PredictionResponse)
async def make_prediction(
    prediction_data: PredictionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    language: str = Query("en", description="Language for medicine recommendations: 'en' or 'hi'")
):
    """
    Make a disease prediction based on symptoms.
    Includes Groq AI-powered medicine recommendations in user's selected language!
    Now with PERSONALIZED DOSAGE based on user's age, gender, and weight!
    Plus AI-POWERED analysis of additional details in Hindi/English/Hinglish!
    """
    try:
        # Step 1: Analyze additional details if provided
        additional_analysis = None
        if prediction_data.additional_details and len(prediction_data.additional_details.strip()) > 3:
            try:
                logger.info(f"Analyzing additional details: {prediction_data.additional_details[:100]}...")
                from app.services.llm_service import LLMService
                llm_service = LLMService()
                
                additional_analysis = await llm_service.analyze_additional_details(
                    additional_text=prediction_data.additional_details,
                    selected_symptoms=prediction_data.symptoms,
                    language=language
                )
                logger.info(f"Additional details analysis complete: {additional_analysis.get('success')}")
            except Exception as e:
                logger.error(f"Failed to analyze additional details: {str(e)}")
                # Continue without analysis if it fails
        
        # Call ML service for disease prediction
        result = predict_disease(
            symptoms=prediction_data.symptoms,
            age=prediction_data.age,
            gender=prediction_data.gender
        )
        
        # Get PERSONALIZED medicine recommendations from Groq AI
        medicine_advice = None
        try:
            logger.info(f"Fetching PERSONALIZED medicine recommendations for {result['disease']} in {language}")
            logger.info(f"User demographics: Age={current_user.age}, Gender={current_user.gender}, Weight={current_user.weight}")
            
            medicine_advice = await get_medicine_advice(
                disease=result["disease"],
                symptoms=prediction_data.symptoms,
                language=language,
                age=current_user.age,
                gender=current_user.gender,
                weight=current_user.weight
            )
        except Exception as e:
            logger.error(f"Failed to get medicine advice: {str(e)}")
            # Continue without medicine advice if it fails
        
        # Save prediction to database
        new_prediction = Prediction(
            user_id=current_user.id,
            symptoms=prediction_data.symptoms,
            predicted_disease_name=result["disease"],
            confidence_score=result["confidence"],
            additional_info={
                "age": prediction_data.age,
                "gender": prediction_data.gender,
                "duration_days": prediction_data.duration_days,
                "medicine_advice": medicine_advice.get("recommendations") if medicine_advice else None,
                "language": language,
                "additional_details": prediction_data.additional_details,
                "ai_analysis": additional_analysis.get("analysis") if additional_analysis and additional_analysis.get("success") else None
            }
        )
        
        db.add(new_prediction)
        db.commit()
        db.refresh(new_prediction)
        
        # ✨ AUTOMATIC HISTORY CLEANUP - Keep only last 10 predictions per user
        cleanup_old_predictions(db, current_user.id, max_predictions=10)
        
        # Prepare response with medicine recommendations
        response_data = {
            "id": new_prediction.id,
            "predicted_disease": result["disease"],
            "confidence_score": result["confidence"],
            "symptoms": prediction_data.symptoms,
            "timestamp": new_prediction.timestamp,
            "recommendations": result.get("recommendations", []),
            "precautions": result.get("precautions", [])
        }
        
        # Add Groq medicine advice if available
        if medicine_advice:
            response_data["medicine_recommendations"] = medicine_advice.get("recommendations")
            response_data["ai_disclaimer"] = medicine_advice.get("disclaimer")
        
        # Add additional details analysis if available
        if additional_analysis and additional_analysis.get("success"):
            response_data["additional_analysis"] = additional_analysis.get("analysis")
        
        return response_data
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )


@router.get("/history", response_model=List[PredictionDetail])
def get_prediction_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 10  # ✨ Default to 10 to match auto-cleanup limit
):
    """Get user's prediction history (last 10 by default)."""
    predictions = db.query(Prediction).filter(
        Prediction.user_id == current_user.id
    ).order_by(Prediction.timestamp.desc()).offset(skip).limit(limit).all()
    
    history_items = []
    for pred in predictions:
        additional_info = pred.additional_info or {}

        history_items.append({
            "id": pred.id,
            "predicted_disease": pred.predicted_disease_name,
            "confidence_score": pred.confidence_score,
            "symptoms": pred.symptoms,
            "timestamp": pred.timestamp,
            "user_id": pred.user_id,
            "additional_info": additional_info,
            "medicine_recommendations": additional_info.get("medicine_advice"),
            "additional_analysis": additional_info.get("ai_analysis"),
        })

    return history_items


@router.get("/{prediction_id}", response_model=PredictionDetail)
def get_prediction(
    prediction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific prediction by ID."""
    prediction = db.query(Prediction).filter(
        Prediction.id == prediction_id,
        Prediction.user_id == current_user.id
    ).first()
    
    if not prediction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prediction not found"
        )
    
    return {
        "id": prediction.id,
        "predicted_disease": prediction.predicted_disease_name,
        "confidence_score": prediction.confidence_score,
        "symptoms": prediction.symptoms,
        "timestamp": prediction.timestamp,
        "user_id": prediction.user_id,
        "additional_info": prediction.additional_info
    }


@router.post("/feedback", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
def submit_feedback(
    feedback_data: FeedbackCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit feedback for a prediction."""
    # Verify prediction belongs to user
    prediction = db.query(Prediction).filter(
        Prediction.id == feedback_data.prediction_id,
        Prediction.user_id == current_user.id
    ).first()
    
    if not prediction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prediction not found"
        )
    
    # Check if feedback already exists
    existing = db.query(Feedback).filter(
        Feedback.prediction_id == feedback_data.prediction_id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Feedback already submitted for this prediction"
        )
    
    new_feedback = Feedback(**feedback_data.dict())
    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)
    
    return new_feedback
