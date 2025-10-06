from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.core.database import get_db
from app.models.models import User, Disease, Prediction, Feedback
from app.schemas.schemas import DiseaseResponse, DiseaseCreate
from app.api.auth import get_current_user
from app.core.security import get_password_hash
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


def verify_admin(current_user: User = Depends(get_current_user)):
    """Verify user is admin."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


@router.get("/diseases", response_model=List[DiseaseResponse])
def get_all_diseases(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    admin: User = Depends(verify_admin)
):
    """Get all diseases (admin only)."""
    diseases = db.query(Disease).offset(skip).limit(limit).all()
    return diseases


@router.post("/diseases", response_model=DiseaseResponse, status_code=status.HTTP_201_CREATED)
def create_disease(
    disease_data: DiseaseCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(verify_admin)
):
    """Create a new disease (admin only)."""
    existing = db.query(Disease).filter(Disease.name == disease_data.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Disease already exists"
        )
    
    new_disease = Disease(**disease_data.dict())
    db.add(new_disease)
    db.commit()
    db.refresh(new_disease)
    
    return new_disease


@router.get("/stats")
def get_statistics(
    db: Session = Depends(get_db),
    admin: User = Depends(verify_admin)
):
    """Get system statistics (admin only)."""
    total_users = db.query(func.count(User.id)).scalar()
    total_predictions = db.query(func.count(Prediction.id)).scalar()
    total_feedback = db.query(func.count(Feedback.id)).scalar()
    
    # Most common predicted diseases
    top_diseases = db.query(
        Prediction.predicted_disease_name,
        func.count(Prediction.id).label('count')
    ).group_by(Prediction.predicted_disease_name).order_by(
        func.count(Prediction.id).desc()
    ).limit(10).all()
    
    # Average confidence score
    avg_confidence = db.query(func.avg(Prediction.confidence_score)).scalar()
    
    # Feedback accuracy rate
    accurate_feedback = db.query(func.count(Feedback.id)).filter(
        Feedback.is_accurate == True
    ).scalar()
    
    accuracy_rate = (accurate_feedback / total_feedback * 100) if total_feedback > 0 else 0
    
    return {
        "total_users": total_users,
        "total_predictions": total_predictions,
        "total_feedback": total_feedback,
        "average_confidence": round(avg_confidence or 0, 2),
        "accuracy_rate": round(accuracy_rate, 2),
        "top_diseases": [
            {"disease": disease, "count": count}
            for disease, count in top_diseases
        ]
    }


@router.get("/users")
def get_all_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    admin: User = Depends(verify_admin)
):
    """Get all users (admin only)."""
    users = db.query(User).offset(skip).limit(limit).all()
    
    # Get prediction count for each user
    user_list = []
    for user in users:
        prediction_count = db.query(func.count(Prediction.id)).filter(
            Prediction.user_id == user.id
        ).scalar()
        
        user_list.append({
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "is_active": user.is_active,
            "is_admin": user.is_admin,
            "created_at": user.created_at,
            "prediction_count": prediction_count
        })
    
    return user_list


@router.get("/predictions")
def get_all_predictions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    admin: User = Depends(verify_admin)
):
    """Get all predictions (admin only)."""
    predictions = db.query(Prediction).order_by(Prediction.timestamp.desc()).offset(skip).limit(limit).all()
    
    # Include user email and feedback info
    prediction_list = []
    for pred in predictions:
        user = db.query(User).filter(User.id == pred.user_id).first()
        feedback = db.query(Feedback).filter(Feedback.prediction_id == pred.id).first()
        
        prediction_list.append({
            "id": pred.id,
            "user_email": user.email if user else "Unknown",
            "user_name": user.full_name if user else "Unknown",
            "symptoms": pred.symptoms_text or str(pred.symptoms),  # Use text version if available
            "predicted_disease": pred.predicted_disease_name,
            "confidence_score": pred.confidence_score,
            "timestamp": pred.timestamp,
            "additional_info": pred.additional_info,
            "has_feedback": feedback is not None,
            "is_accurate": feedback.is_accurate if feedback else None,
            "rating": feedback.rating if feedback else None
        })
    
    return prediction_list


@router.get("/feedback")
def get_all_feedback(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    admin: User = Depends(verify_admin)
):
    """Get all feedback (admin only)."""
    feedback_records = db.query(Feedback).order_by(Feedback.created_at.desc()).offset(skip).limit(limit).all()
    
    # Include prediction and user info
    feedback_list = []
    for fb in feedback_records:
        prediction = db.query(Prediction).filter(Prediction.id == fb.prediction_id).first()
        user = db.query(User).filter(User.id == prediction.user_id).first() if prediction else None
        
        feedback_list.append({
            "id": fb.id,
            "prediction_id": fb.prediction_id,
            "user_email": user.email if user else "Unknown",
            "user_name": user.full_name if user else "Unknown",
            "predicted_disease": prediction.predicted_disease_name if prediction else "Unknown",
            "confidence_score": prediction.confidence_score if prediction else 0,
            "is_accurate": fb.is_accurate,
            "rating": fb.rating,
            "actual_diagnosis": fb.actual_diagnosis,
            "comments": fb.comments,
            "created_at": fb.created_at
        })
    
    return feedback_list


@router.patch("/users/{user_id}/toggle-admin")
def toggle_user_admin(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(verify_admin)
):
    """Toggle user admin status (admin only)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent admin from removing their own admin access
    if user.id == admin.id:
        raise HTTPException(
            status_code=400,
            detail="Cannot modify your own admin status"
        )
    
    user.is_admin = not user.is_admin
    db.commit()
    
    return {"message": f"User admin status updated", "is_admin": user.is_admin}


@router.patch("/users/{user_id}/toggle-active")
def toggle_user_active(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(verify_admin)
):
    """Toggle user active status (admin only)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent admin from deactivating themselves
    if user.id == admin.id:
        raise HTTPException(
            status_code=400,
            detail="Cannot deactivate your own account"
        )
    
    user.is_active = not user.is_active
    db.commit()
    
    return {"message": f"User active status updated", "is_active": user.is_active}


# Database initialization endpoints (no auth required for initial setup)
@router.post("/init-database")
async def init_database(db: Session = Depends(get_db)):
    """Initialize database with tables and seed data"""
    try:
        # Create all tables
        from app.core.database import engine, Base
        Base.metadata.create_all(bind=engine)
        
        # Check if admin user already exists
        admin_user = db.query(User).filter(User.email == "kumarbhanu818@gmail.com").first()
        if not admin_user:
            # Create admin user
            admin_user = User(
                email="kumarbhanu818@gmail.com",
                hashed_password=get_password_hash("Bhanu123@"),
                full_name="Bhanu Kumar Dev",
                is_admin=True,
                age=21,
                gender="male",
                weight=75.0
            )
            db.add(admin_user)
            db.commit()
            logger.info("Admin user created successfully")
        
        # Check if sample diseases exist
        sample_disease = db.query(Disease).first()
        if not sample_disease:
            # Add sample diseases
            diseases = [
                Disease(name="Common Cold", description="Viral infection of upper respiratory tract"),
                Disease(name="Flu", description="Influenza viral infection"),
                Disease(name="Headache", description="Pain in head or neck region"),
                Disease(name="Fever", description="Elevated body temperature"),
                Disease(name="Allergies", description="Immune system reaction to allergens")
            ]
            for disease in diseases:
                db.add(disease)
            
            db.commit()
            logger.info("Sample diseases added successfully")
        
        return {
            "message": "Database initialized successfully",
            "status": "success",
            "details": {
                "tables_created": True,
                "admin_user_created": True,
                "sample_data_added": True
            }
        }
        
    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database initialization failed: {str(e)}")


@router.get("/database-status")
async def database_status(db: Session = Depends(get_db)):
    """Check database status and existing data"""
    try:
        # Check if tables exist and have data
        user_count = db.query(User).count()
        disease_count = db.query(Disease).count()
        
        # Check if admin user exists
        admin_exists = db.query(User).filter(User.email == "kumarbhanu818@gmail.com").first() is not None
        
        return {
            "database_status": "connected",
            "tables_exist": True,
            "data_counts": {
                "users": user_count,
                "diseases": disease_count,
                "predictions": db.query(Prediction).count(),
                "feedback": db.query(Feedback).count()
            },
            "admin_user_exists": admin_exists
        }
        
    except Exception as e:
        logger.error(f"Database status check failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database status check failed: {str(e)}")


@router.post("/reset-admin-password")
async def reset_admin_password(db: Session = Depends(get_db)):
    """Reset admin password to default (for recovery purposes)"""
    try:
        # Find admin user by email
        admin_user = db.query(User).filter(User.email == "kumarbhanu818@gmail.com").first()
        
        if admin_user:
            # Update password and ensure admin status
            admin_user.hashed_password = get_password_hash("Bhanu123@")
            admin_user.is_admin = True
            admin_user.is_active = True
            admin_user.full_name = "Bhanu Kumar Dev"
            admin_user.age = 21
            admin_user.gender = "male"
            admin_user.weight = 75.0
            db.commit()
            
            return {
                "message": "Admin password reset successfully",
                "email": "kumarbhanu818@gmail.com",
                "password": "Bhanu123@",
                "is_admin": True,
                "status": "updated"
            }
        else:
            # Create new admin user if not exists
            admin_user = User(
                email="kumarbhanu818@gmail.com",
                hashed_password=get_password_hash("Bhanu123@"),
                full_name="Bhanu Kumar Dev",
                is_admin=True,
                is_active=True,
                age=21,
                gender="male",
                weight=75.0
            )
            db.add(admin_user)
            db.commit()
            
            return {
                "message": "Admin user created successfully",
                "email": "kumarbhanu818@gmail.com",
                "password": "Bhanu123@",
                "is_admin": True,
                "status": "created"
            }
        
    except Exception as e:
        logger.error(f"Admin password reset failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Admin password reset failed: {str(e)}")
