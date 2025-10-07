from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.models import User
from app.schemas.notification import (
    NotificationResponse,
    NotificationStats,
    NotificationMarkRead,
    AdminNotificationCreate,
    PersonalizedNotificationRequest
)
from app.services.notification_service import NotificationService
from app.api.auth import get_current_user, require_admin

router = APIRouter(prefix="/api/notifications", tags=["notifications"])

@router.get("", response_model=List[NotificationResponse])
async def get_notifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    unread_only: bool = Query(False),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all notifications for the current user (includes global announcements)"""
    notifications = NotificationService.get_user_notifications(
        db=db,
        user_id=current_user.id,
        skip=skip,
        limit=limit,
        unread_only=unread_only
    )
    return notifications

@router.get("/stats", response_model=NotificationStats)
async def get_notification_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get notification statistics (total and unread count)"""
    unread = NotificationService.get_unread_count(db=db, user_id=current_user.id)
    total = len(NotificationService.get_user_notifications(db=db, user_id=current_user.id))
    
    return NotificationStats(total=total, unread=unread)

@router.patch("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_as_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a specific notification as read"""
    notification = NotificationService.mark_as_read(
        db=db,
        notification_id=notification_id,
        user_id=current_user.id
    )
    
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    return notification

@router.patch("/read-all")
async def mark_all_notifications_as_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark all notifications as read for the current user"""
    count = NotificationService.mark_all_as_read(db=db, user_id=current_user.id)
    return {"message": f"Marked {count} notifications as read"}

@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a notification (only user's own personalized/direct notifications)"""
    success = NotificationService.delete_notification(
        db=db,
        notification_id=notification_id,
        user_id=current_user.id
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found or cannot be deleted"
        )
    
    return {"message": "Notification deleted successfully"}

@router.post("/personalized", response_model=NotificationResponse)
async def generate_personalized_notification(
    language: str = Query("en", regex="^(en|hi)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate an AI-powered personalized health notification based on user's history"""
    notification = await NotificationService.generate_personalized_notification(
        db=db,
        user=current_user,
        language=language
    )
    return notification

# Admin Routes
@router.post("/admin/create", response_model=NotificationResponse)
async def create_admin_notification(
    notification_data: AdminNotificationCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Admin only: Create announcement (broadcast to all) or direct notification to specific user
    - type='announcement' + user_id=None: Broadcast to all users
    - type='direct' + user_id=X: Send to specific user
    """
    if notification_data.type == "announcement" and notification_data.user_id is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Announcements must not have a user_id (set to null for broadcast)"
        )
    
    if notification_data.type == "direct" and notification_data.user_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Direct notifications must have a user_id"
        )
    
    # Verify user exists if direct notification
    if notification_data.type == "direct":
        from app.models.models import User as UserModel
        user = db.query(UserModel).filter(UserModel.id == notification_data.user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {notification_data.user_id} not found"
            )
    
    notification = NotificationService.create_notification(
        db=db,
        title=notification_data.title,
        message=notification_data.message,
        notification_type=notification_data.type,
        user_id=notification_data.user_id
    )
    
    return notification

@router.get("/admin/users")
async def get_users_for_notifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Admin only: Get list of users with their feedback summary for targeted notifications"""
    from app.models.models import User as UserModel
    
    users = db.query(UserModel).filter(UserModel.is_admin == False).offset(skip).limit(limit).all()
    
    users_data = []
    for user in users:
        feedback_summary = NotificationService.get_user_feedback_summary(db=db, user_id=user.id)
        users_data.append({
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "created_at": user.created_at,
            "feedback_summary": feedback_summary
        })
    
    return users_data

@router.post("/admin/broadcast-ai")
async def broadcast_ai_notifications_to_all(
    language: str = Query("en", regex="^(en|hi)$"),
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Admin only: Generate personalized AI notifications for ALL users
    This will create individual personalized notifications based on each user's history
    """
    from app.models.models import User as UserModel
    
    users = db.query(UserModel).filter(UserModel.is_admin == False).all()
    
    created_count = 0
    for user in users:
        try:
            await NotificationService.generate_personalized_notification(
                db=db,
                user=user,
                language=language
            )
            created_count += 1
        except Exception as e:
            print(f"Error creating notification for user {user.id}: {e}")
            continue
    
    return {
        "message": f"Generated {created_count} personalized notifications",
        "total_users": len(users)
    }
