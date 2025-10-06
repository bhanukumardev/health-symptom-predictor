from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, JSON, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    age = Column(Integer)
    gender = Column(String(10))
    weight = Column(Float)  # Weight in kg for personalized dosage
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    
    # Relationships
    predictions = relationship("Prediction", back_populates="user")


class Symptom(Base):
    __tablename__ = "symptoms"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    description = Column(Text)
    severity_level = Column(Integer)  # 1-5 scale
    category = Column(String)  # e.g., respiratory, digestive, neurological
    created_at = Column(DateTime, default=datetime.utcnow)


class Disease(Base):
    __tablename__ = "diseases"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    description = Column(Text)
    precautions = Column(JSON)  # List of precautions
    severity = Column(String)  # mild, moderate, severe, critical
    common_symptoms = Column(JSON)  # List of common symptom IDs
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    predictions = relationship("Prediction", back_populates="disease")


class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    symptoms = Column(JSON, nullable=False)  # List of symptom IDs/names
    symptoms_text = Column(Text)  # Plain text symptoms for display
    predicted_disease_id = Column(Integer, ForeignKey("diseases.id"))
    predicted_disease_name = Column(String)
    confidence_score = Column(Float)  # 0.0 to 1.0
    created_at = Column(DateTime, default=datetime.utcnow)
    timestamp = Column(DateTime, default=datetime.utcnow)  # Alias for compatibility
    additional_info = Column(JSON)  # Age, gender, duration, etc.
    
    # Relationships
    user = relationship("User", back_populates="predictions")
    disease = relationship("Disease", back_populates="predictions")
    feedback = relationship("Feedback", back_populates="prediction", uselist=False)


class Feedback(Base):
    __tablename__ = "feedback"
    
    id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(Integer, ForeignKey("predictions.id"), nullable=False)
    is_accurate = Column(Boolean)
    actual_diagnosis = Column(String)
    comments = Column(Text)
    rating = Column(Integer)  # 1-5 stars
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    prediction = relationship("Prediction", back_populates="feedback")
