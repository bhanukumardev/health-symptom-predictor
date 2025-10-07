from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional
from datetime import datetime, timedelta
import os
from groq import Groq

from app.models.notification import Notification
from app.models.models import User, Prediction, Feedback
from app.schemas.notification import NotificationCreate, NotificationResponse

# Lazy initialize Groq client to avoid issues during import
_groq_client = None

def get_groq_client():
    """Lazy initialization of Groq client"""
    global _groq_client
    if _groq_client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY environment variable is not set")
        _groq_client = Groq(api_key=api_key)
    return _groq_client

class NotificationService:
    
    @staticmethod
    def create_notification(
        db: Session,
        title: str,
        message: str,
        notification_type: str,
        user_id: Optional[int] = None
    ) -> Notification:
        """Create a new notification"""
        notification = Notification(
            user_id=user_id,
            title=title,
            message=message,
            type=notification_type
        )
        db.add(notification)
        db.commit()
        db.refresh(notification)
        return notification
    
    @staticmethod
    def get_user_notifications(
        db: Session,
        user_id: int,
        skip: int = 0,
        limit: int = 50,
        unread_only: bool = False
    ) -> List[Notification]:
        """Get notifications for a specific user (including global announcements)"""
        query = db.query(Notification).filter(
            or_(
                Notification.user_id == user_id,  # Direct or personalized
                Notification.user_id.is_(None)    # Global announcements
            )
        )
        
        if unread_only:
            query = query.filter(Notification.is_read == False)
        
        query = query.order_by(Notification.created_at.desc())
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def get_unread_count(db: Session, user_id: int) -> int:
        """Get count of unread notifications for user"""
        return db.query(Notification).filter(
            and_(
                or_(
                    Notification.user_id == user_id,
                    Notification.user_id.is_(None)
                ),
                Notification.is_read == False
            )
        ).count()
    
    @staticmethod
    def mark_as_read(db: Session, notification_id: int, user_id: int) -> Optional[Notification]:
        """Mark a notification as read"""
        notification = db.query(Notification).filter(
            Notification.id == notification_id,
            or_(
                Notification.user_id == user_id,
                Notification.user_id.is_(None)
            )
        ).first()
        
        if notification:
            notification.is_read = True
            db.commit()
            db.refresh(notification)
        
        return notification
    
    @staticmethod
    def mark_all_as_read(db: Session, user_id: int) -> int:
        """Mark all notifications as read for a user"""
        count = db.query(Notification).filter(
            or_(
                Notification.user_id == user_id,
                Notification.user_id.is_(None)
            ),
            Notification.is_read == False
        ).update({"is_read": True})
        db.commit()
        return count
    
    @staticmethod
    def delete_notification(db: Session, notification_id: int, user_id: int) -> bool:
        """
        Delete a notification (only user's own personalized/direct notifications)
        Users cannot delete global announcements
        Returns: True if deleted, False if not found
        """
        notification = db.query(Notification).filter(
            Notification.id == notification_id,
            Notification.user_id == user_id  # Can only delete own notifications
        ).first()
        
        if not notification:
            return False
        
        db.delete(notification)
        db.commit()
        return True
    
    @staticmethod
    def delete_notification(db: Session, notification_id: int, user_id: int) -> bool:
        """Delete a notification (only user's own notifications)"""
        notification = db.query(Notification).filter(
            Notification.id == notification_id,
            Notification.user_id == user_id
        ).first()
        
        if notification:
            db.delete(notification)
            db.commit()
            return True
        return False
    
    @staticmethod
    async def generate_personalized_notification(
        db: Session,
        user: User,
        language: str = "en"
    ) -> Notification:
        """Generate AI-powered personalized health notification based on user history"""
        
        # Get user's recent prediction history (last 30 days)
        recent_date = datetime.utcnow() - timedelta(days=30)
        predictions = db.query(Prediction).filter(
            Prediction.user_id == user.id,
            Prediction.created_at >= recent_date
        ).order_by(Prediction.created_at.desc()).limit(10).all()
        
        # Get user's feedback
        feedbacks = db.query(Feedback).filter(
            Feedback.prediction_id.in_([p.id for p in predictions])
        ).all()
        
        # Build context for AI
        if not predictions:
            # No history, send welcome notification
            if language == "hi":
                title = "स्वागत है! 🏥"
                message = "आपके स्वास्थ्य यात्रा में आपका स्वागत है। लक्षणों का विश्लेषण शुरू करें और व्यक्तिगत स्वास्थ्य सुझाव प्राप्त करें।"
            else:
                title = "Welcome to Health Symptom Predictor! 🏥"
                message = "Start analyzing your symptoms to get personalized health insights and recommendations powered by AI."
            
            return NotificationService.create_notification(
                db=db,
                title=title,
                message=message,
                notification_type="personalized",
                user_id=user.id
            )
        
        # Prepare context for Groq AI
        prediction_summary = "\n".join([
            f"- Predicted: {p.predicted_disease_name or f'Disease ID {p.predicted_disease_id}'}, Confidence: {p.confidence_score:.0%}, Date: {p.created_at.strftime('%Y-%m-%d')}"
            for p in predictions[:5]
        ])
        
        feedback_summary = "\n".join([
            f"- Rating: {f.rating}/5, Accurate: {'Yes' if f.is_accurate else 'No'}"
            for f in feedbacks[:5]
        ]) if feedbacks else "No feedback provided yet."
        
        user_info = f"Age: {user.age if user.age else 'N/A'}, Gender: {user.gender if user.gender else 'N/A'}"
        
        # Create prompt for Groq
        system_prompt = """You are a compassionate healthcare AI assistant. Generate a personalized health notification 
        based on the user's prediction history. The notification should:
        - Be encouraging and supportive
        - Provide actionable health advice
        - Be concise (2-3 sentences, max 200 words)
        - Be warm and professional
        - Focus on prevention and wellness
        - NOT diagnose or replace medical advice
        """
        
        if language == "hi":
            system_prompt += "\n- Respond in Hindi language"
            user_prompt = f"""
उपयोगकर्ता की जानकारी:
{user_info}

हाल की भविष्यवाणियां:
{prediction_summary}

फीडबैक:
{feedback_summary}

उपयोगकर्ता के स्वास्थ्य इतिहास के आधार पर एक व्यक्तिगत स्वास्थ्य सूचना तैयार करें। सकारात्मक, प्रोत्साहित करने वाला और कार्रवाई योग्य सलाह दें।
"""
        else:
            user_prompt = f"""
User Information:
{user_info}

Recent Predictions:
{prediction_summary}

Feedback:
{feedback_summary}

Create a personalized health notification based on the user's history. Be positive, encouraging, and provide actionable advice.
"""
        
        try:
            # Call Groq API
            groq_client = get_groq_client()
            response = groq_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=300
            )
            
            ai_message = response.choices[0].message.content.strip()
            
            # Create notification
            title = "Your Personalized Health Insight 💡" if language == "en" else "आपकी व्यक्तिगत स्वास्थ्य सलाह 💡"
            
            return NotificationService.create_notification(
                db=db,
                title=title,
                message=ai_message,
                notification_type="personalized",
                user_id=user.id
            )
            
        except Exception as e:
            print(f"Error generating personalized notification: {e}")
            # Fallback notification
            if language == "hi":
                title = "स्वास्थ्य सलाह 💡"
                message = "नियमित व्यायाम, संतुलित आहार और पर्याप्त नींद आपके स्वास्थ्य के लिए महत्वपूर्ण हैं। अपनी देखभाल करते रहें!"
            else:
                title = "Health Tip 💡"
                message = "Regular exercise, balanced diet, and adequate sleep are key to maintaining good health. Keep taking care of yourself!"
            
            return NotificationService.create_notification(
                db=db,
                title=title,
                message=message,
                notification_type="personalized",
                user_id=user.id
            )
    
    @staticmethod
    def get_all_users_for_admin(db: Session) -> List[User]:
        """Get all users for admin to send targeted notifications"""
        return db.query(User).filter(User.is_admin == False).all()
    
    @staticmethod
    def get_user_feedback_summary(db: Session, user_id: int) -> dict:
        """Get feedback summary for a user (for admin to decide on notifications)"""
        feedbacks = db.query(Feedback).join(Prediction).filter(
            Prediction.user_id == user_id
        ).all()
        
        if not feedbacks:
            return {"total": 0, "average_rating": 0, "accuracy_rate": 0}
        
        total = len(feedbacks)
        avg_rating = sum(f.rating for f in feedbacks if f.rating) / total if total > 0 else 0
        accurate_count = sum(1 for f in feedbacks if f.is_accurate)
        accuracy_rate = (accurate_count / total * 100) if total > 0 else 0
        
        return {
            "total": total,
            "average_rating": round(avg_rating, 2),
            "accuracy_rate": round(accuracy_rate, 2)
        }
