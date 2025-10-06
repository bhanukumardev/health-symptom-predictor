from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User
from app.schemas.schemas import UserResponse, UserProfileUpdate
from app.api.auth import get_current_user
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/profile", response_model=UserResponse)
def get_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current user's profile information.
    Returns all user details including age, gender, weight for personalized medicine dosage.
    """
    return current_user


@router.put("/profile", response_model=UserResponse)
def update_user_profile(
    profile_update: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update current user's profile information.
    Allows updating: full_name, age, gender, weight.
    Email cannot be changed for security reasons.
    
    Updated information will be used for personalized medicine recommendations.
    """
    try:
        # Update allowed fields
        if profile_update.full_name is not None:
            current_user.full_name = profile_update.full_name
        
        if profile_update.age is not None:
            # Validate age
            if profile_update.age < 0 or profile_update.age > 150:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Age must be between 0 and 150"
                )
            current_user.age = profile_update.age
        
        if profile_update.gender is not None:
            # Validate gender
            if profile_update.gender not in ['M', 'F', 'O', None]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Gender must be 'M', 'F', or 'O'"
                )
            current_user.gender = profile_update.gender
        
        if profile_update.weight is not None:
            # Validate weight
            if profile_update.weight <= 0 or profile_update.weight > 500:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Weight must be between 0 and 500 kg"
                )
            current_user.weight = profile_update.weight
        
        # Commit changes to database
        db.commit()
        db.refresh(current_user)
        
        logger.info(f"Profile updated for user {current_user.email}")
        
        return current_user
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating profile: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}"
        )
