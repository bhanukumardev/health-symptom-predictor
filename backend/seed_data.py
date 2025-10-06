from app.core.database import SessionLocal
from app.models.models import Symptom, Disease
import json

# Create session
db = SessionLocal()

# Add symptoms
symptoms_data = [
    {"name": "Fever", "description": "Elevated body temperature", "severity_level": 3, "category": "General"},
    {"name": "Cough", "description": "Persistent coughing", "severity_level": 2, "category": "Respiratory"},
    {"name": "Fatigue", "description": "Extreme tiredness", "severity_level": 2, "category": "General"},
    {"name": "Headache", "description": "Pain in the head", "severity_level": 2, "category": "Neurological"},
    {"name": "Sore Throat", "description": "Pain in the throat", "severity_level": 2, "category": "Respiratory"},
    {"name": "Runny Nose", "description": "Nasal congestion with discharge", "severity_level": 1, "category": "Respiratory"},
    {"name": "Body Ache", "description": "Muscle pain throughout the body", "severity_level": 3, "category": "General"},
    {"name": "Difficulty Breathing", "description": "Shortness of breath", "severity_level": 4, "category": "Respiratory"},
    {"name": "Chest Pain", "description": "Pain in the chest area", "severity_level": 4, "category": "Cardiovascular"},
    {"name": "Nausea", "description": "Feeling of sickness", "severity_level": 2, "category": "Digestive"},
    {"name": "Vomiting", "description": "Forceful expulsion of stomach contents", "severity_level": 3, "category": "Digestive"},
    {"name": "Diarrhea", "description": "Loose or watery bowel movements", "severity_level": 3, "category": "Digestive"},
    {"name": "Loss of Taste", "description": "Inability to taste food", "severity_level": 2, "category": "Sensory"},
    {"name": "Loss of Smell", "description": "Inability to smell", "severity_level": 2, "category": "Sensory"},
    {"name": "Chills", "description": "Feeling cold and shivering", "severity_level": 3, "category": "General"},
]

for symptom_data in symptoms_data:
    # Check if symptom already exists
    existing = db.query(Symptom).filter(Symptom.name == symptom_data["name"]).first()
    if not existing:
        symptom = Symptom(**symptom_data)
        db.add(symptom)

# Add diseases
diseases_data = [
    {
        "name": "Common Cold",
        "description": "A viral infection of the upper respiratory tract",
        "severity": "Mild",
        "precautions": [
            "Get plenty of rest",
            "Stay hydrated",
            "Use over-the-counter cold medications",
            "Avoid close contact with others"
        ],
        "common_symptoms": [1, 2, 5, 6]  # Fever, Cough, Sore Throat, Runny Nose
    },
    {
        "name": "Flu (Influenza)",
        "description": "A viral infection that attacks the respiratory system",
        "severity": "Moderate",
        "precautions": [
            "Get plenty of rest",
            "Stay home to avoid spreading",
            "Take antiviral medication if prescribed",
            "Keep warm and hydrated"
        ],
        "common_symptoms": [1, 2, 3, 7, 15]  # Fever, Cough, Fatigue, Body Ache, Chills
    },
    {
        "name": "COVID-19",
        "description": "A coronavirus disease that can cause severe respiratory illness",
        "severity": "Moderate to Severe",
        "precautions": [
            "Self-isolate immediately",
            "Get tested for confirmation",
            "Monitor oxygen levels",
            "Wear a mask around others"
        ],
        "common_symptoms": [1, 2, 13, 14]  # Fever, Cough, Loss of Taste, Loss of Smell
    },
    {
        "name": "Gastroenteritis",
        "description": "Inflammation of the stomach and intestines",
        "severity": "Moderate",
        "precautions": [
            "Stay hydrated with clear fluids",
            "Eat bland foods (BRAT diet)",
            "Wash hands frequently",
            "Rest and avoid solid foods initially"
        ],
        "common_symptoms": [10, 11, 12]  # Nausea, Vomiting, Diarrhea
    },
    {
        "name": "Migraine",
        "description": "A severe headache disorder",
        "severity": "Moderate",
        "precautions": [
            "Rest in a dark, quiet room",
            "Apply cold compress to forehead",
            "Take prescribed migraine medication",
            "Avoid triggers (bright lights, loud sounds)"
        ],
        "common_symptoms": [4, 10]  # Headache, Nausea
    }
]

for disease_data in diseases_data:
    # Check if disease already exists
    existing = db.query(Disease).filter(Disease.name == disease_data["name"]).first()
    if not existing:
        disease = Disease(**disease_data)
        db.add(disease)

# Commit changes
db.commit()
db.close()

print("✅ Test data added successfully!")
print(f"📊 Added {len(symptoms_data)} symptoms")
print(f"🏥 Added {len(diseases_data)} diseases")