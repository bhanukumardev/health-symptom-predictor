from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.symptom import Symptom
from app.models.disease import Disease
from app.models.medicine import Medicine
from app.models.medical_history import MedicalHistory
from app.core.security import get_password_hash
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/init-database")
async def init_database(db: Session = Depends(get_db)):
    """Initialize database with tables and seed data"""
    try:
        # Import all models to ensure tables are created
        from app.models import user, symptom, disease, medicine, medical_history
        
        # Create all tables
        from app.database import engine, Base
        Base.metadata.create_all(bind=engine)
        
        # Check if admin user already exists
        admin_user = db.query(User).filter(User.email == "admin@healthpredictor.com").first()
        if not admin_user:
            # Create admin user
            admin_user = User(
                username="admin",
                email="admin@healthpredictor.com",
                hashed_password=get_password_hash("admin123"),
                full_name="System Administrator",
                is_admin=True,
                age=30,
                gender="male",
                weight=70.0,
                height=175.0
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
        
        # Check if sample symptoms exist
        sample_symptom = db.query(Symptom).first()
        if not sample_symptom:
            # Add sample symptoms
            symptoms = [
                Symptom(name="Cough", description="Repetitive reflex that helps clear airways"),
                Symptom(name="Runny Nose", description="Excess nasal discharge"),
                Symptom(name="Sore Throat", description="Pain or irritation in throat"),
                Symptom(name="Body Aches", description="Muscle pain throughout body"),
                Symptom(name="Fatigue", description="Extreme tiredness or exhaustion"),
                Symptom(name="Sneezing", description="Sudden expulsion of air from nose"),
                Symptom(name="Nausea", description="Feeling of sickness in stomach")
            ]
            for symptom in symptoms:
                db.add(symptom)
            
            db.commit()
            logger.info("Sample symptoms added successfully")
        
        # Check if sample medicines exist
        sample_medicine = db.query(Medicine).first()
        if not sample_medicine:
            # Add sample medicines
            medicines = [
                Medicine(
                    name="Paracetamol",
                    generic_name="Acetaminophen",
                    dosage="500mg",
                    frequency="Every 6-8 hours",
                    description="Pain reliever and fever reducer"
                ),
                Medicine(
                    name="Ibuprofen",
                    generic_name="Ibuprofen",
                    dosage="400mg",
                    frequency="Every 6-8 hours",
                    description="Anti-inflammatory pain reliever"
                ),
                Medicine(
                    name="Cetirizine",
                    generic_name="Cetirizine",
                    dosage="10mg",
                    frequency="Once daily",
                    description="Antihistamine for allergies"
                )
            ]
            for medicine in medicines:
                db.add(medicine)
            
            db.commit()
            logger.info("Sample medicines added successfully")
        
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
        symptom_count = db.query(Symptom).count()
        medicine_count = db.query(Medicine).count()
        
        # Check if admin user exists
        admin_exists = db.query(User).filter(User.email == "admin@healthpredictor.com").first() is not None
        
        return {
            "database_status": "connected",
            "tables_exist": True,
            "data_counts": {
                "users": user_count,
                "diseases": disease_count,
                "symptoms": symptom_count,
                "medicines": medicine_count
            },
            "admin_user_exists": admin_exists
        }
        
    except Exception as e:
        logger.error(f"Database status check failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database status check failed: {str(e)}")