from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.models import Symptom, User
from app.schemas.schemas import SymptomResponse, SymptomCreate
from app.api.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[SymptomResponse])
def get_all_symptoms(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all available symptoms."""
    symptoms = db.query(Symptom).offset(skip).limit(limit).all()
    return symptoms


@router.get("/{symptom_id}", response_model=SymptomResponse)
def get_symptom(symptom_id: int, db: Session = Depends(get_db)):
    """Get a specific symptom by ID."""
    symptom = db.query(Symptom).filter(Symptom.id == symptom_id).first()
    if not symptom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Symptom not found"
        )
    return symptom


@router.get("/search/{name}", response_model=List[SymptomResponse])
def search_symptoms(name: str, db: Session = Depends(get_db)):
    """Search symptoms by name."""
    symptoms = db.query(Symptom).filter(Symptom.name.ilike(f"%{name}%")).all()
    return symptoms


@router.post("/", response_model=SymptomResponse, status_code=status.HTTP_201_CREATED)
def create_symptom(
    symptom_data: SymptomCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new symptom (admin only)."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create symptoms"
        )
    
    # Check if symptom already exists
    existing = db.query(Symptom).filter(Symptom.name == symptom_data.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Symptom already exists"
        )
    
    new_symptom = Symptom(**symptom_data.dict())
    db.add(new_symptom)
    db.commit()
    db.refresh(new_symptom)
    
    return new_symptom
