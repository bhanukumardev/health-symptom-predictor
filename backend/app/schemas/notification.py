from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Literal

class NotificationBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=1)
    type: Literal['personalized', 'announcement', 'direct']

class NotificationCreate(NotificationBase):
    user_id: Optional[int] = None  # None for global announcements

class NotificationResponse(NotificationBase):
    id: int
    user_id: Optional[int]
    created_at: datetime
    is_read: bool
    
    class Config:
        from_attributes = True

class NotificationMarkRead(BaseModel):
    is_read: bool = True

class NotificationStats(BaseModel):
    total: int
    unread: int
    
class PersonalizedNotificationRequest(BaseModel):
    """Request to generate AI-powered personalized notification"""
    pass

class AdminNotificationCreate(BaseModel):
    """Admin creates announcement or direct notification"""
    title: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=1)
    type: Literal['announcement', 'direct']
    user_id: Optional[int] = None  # Required for 'direct', None for 'announcement'
