from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    age: Optional[int] = None
    gender: Optional[str] = None
    weight: Optional[float] = None  # Weight in kg for personalized dosage


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    created_at: datetime
    is_active: bool
    is_admin: bool
    
    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    """Schema for updating user profile. Email is excluded for security."""
    full_name: Optional[str] = None
    age: Optional[int] = Field(None, ge=0, le=150)
    gender: Optional[str] = Field(None, pattern="^(M|F|O)$")
    weight: Optional[float] = Field(None, gt=0, le=500)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None


# Symptom Schemas
class SymptomBase(BaseModel):
    name: str
    description: Optional[str] = None
    severity_level: Optional[int] = Field(None, ge=1, le=5)
    category: Optional[str] = None


class SymptomCreate(SymptomBase):
    pass


class SymptomResponse(SymptomBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Disease Schemas
class DiseaseBase(BaseModel):
    name: str
    description: Optional[str] = None
    severity: Optional[str] = None
    precautions: Optional[List[str]] = None
    common_symptoms: Optional[List[int]] = None


class DiseaseCreate(DiseaseBase):
    pass


class DiseaseResponse(DiseaseBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Prediction Schemas
class PredictionRequest(BaseModel):
    symptoms: List[str]  # List of symptom names
    age: Optional[int] = None
    gender: Optional[str] = None
    duration_days: Optional[int] = None
    additional_details: Optional[str] = None  # Free-text description in any language


class PredictionResponse(BaseModel):
    id: int
    predicted_disease: str
    confidence_score: float
    symptoms: List[str]
    timestamp: datetime
    recommendations: Optional[List[str]] = None
    precautions: Optional[List[str]] = None
    medicine_recommendations: Optional[str] = None  # Groq AI medicine advice
    ai_disclaimer: Optional[str] = None  # Disclaimer for AI-generated content
    additional_analysis: Optional[dict] = None  # AI analysis of additional details
    
    class Config:
        from_attributes = True


class PredictionDetail(PredictionResponse):
    user_id: int
    additional_info: Optional[dict] = None


# Feedback Schemas
class FeedbackCreate(BaseModel):
    prediction_id: int
    is_accurate: bool
    actual_diagnosis: Optional[str] = None
    comments: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)


class FeedbackResponse(BaseModel):
    id: int
    prediction_id: int
    is_accurate: bool
    actual_diagnosis: Optional[str] = None
    rating: Optional[int] = None
    created_at: datetime
    
    class Config:
        from_attributes = True
