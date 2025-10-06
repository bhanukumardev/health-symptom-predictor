import joblib
import os
from typing import List, Dict
import numpy as np

# This is a placeholder ML service
# In production, you'll load your trained model

class DiseasePredictor:
    def __init__(self):
        self.model = None
        self.symptom_mapping = self._load_symptom_mapping()
        self.disease_info = self._load_disease_info()
        
    def _load_symptom_mapping(self) -> Dict[str, int]:
        """Load symptom to index mapping."""
        # This should be loaded from a file or database
        return {
            "fever": 0,
            "cough": 1,
            "fatigue": 2,
            "headache": 3,
            "sore throat": 4,
            "runny nose": 5,
            "body ache": 6,
            "difficulty breathing": 7,
            "chest pain": 8,
            "nausea": 9,
            "vomiting": 10,
            "diarrhea": 11,
            "loss of taste": 12,
            "loss of smell": 13,
            "chills": 14
        }
    
    def _load_disease_info(self) -> Dict[str, dict]:
        """Load disease information."""
        return {
            "Common Cold": {
                "precautions": [
                    "Get plenty of rest",
                    "Stay hydrated",
                    "Use over-the-counter cold medications",
                    "Avoid close contact with others"
                ],
                "recommendations": [
                    "Symptoms usually resolve within 7-10 days",
                    "Consult a doctor if symptoms worsen",
                    "Monitor for fever above 101°F"
                ]
            },
            "Flu (Influenza)": {
                "precautions": [
                    "Get plenty of rest",
                    "Stay home to avoid spreading",
                    "Take antiviral medication if prescribed",
                    "Keep warm and hydrated"
                ],
                "recommendations": [
                    "See a doctor within 48 hours for antiviral treatment",
                    "Monitor for breathing difficulties",
                    "Recovery typically takes 1-2 weeks"
                ]
            },
            "COVID-19": {
                "precautions": [
                    "Self-isolate immediately",
                    "Get tested for confirmation",
                    "Monitor oxygen levels",
                    "Wear a mask around others"
                ],
                "recommendations": [
                    "Consult healthcare provider for guidance",
                    "Seek emergency care if breathing becomes difficult",
                    "Inform close contacts"
                ]
            },
            "Gastroenteritis": {
                "precautions": [
                    "Stay hydrated with clear fluids",
                    "Eat bland foods (BRAT diet)",
                    "Wash hands frequently",
                    "Rest and avoid solid foods initially"
                ],
                "recommendations": [
                    "Symptoms usually improve within 48 hours",
                    "See a doctor if symptoms persist beyond 3 days",
                    "Watch for signs of dehydration"
                ]
            },
            "Migraine": {
                "precautions": [
                    "Rest in a dark, quiet room",
                    "Apply cold compress to forehead",
                    "Take prescribed migraine medication",
                    "Avoid triggers (bright lights, loud sounds)"
                ],
                "recommendations": [
                    "Keep a headache diary",
                    "Consider preventive medications",
                    "Consult a neurologist for chronic migraines"
                ]
            }
        }
    
    def predict(self, symptoms: List[str], age: int = None, gender: str = None) -> Dict:
        """
        Make a disease prediction based on symptoms.
        
        Args:
            symptoms: List of symptom names
            age: Patient age (optional)
            gender: Patient gender (optional)
            
        Returns:
            Dictionary with prediction results
        """
        # Simple rule-based prediction for demo
        # In production, replace with actual ML model prediction
        
        symptom_lower = [s.lower() for s in symptoms]
        
        # Rule-based logic (simplified)
        if "fever" in symptom_lower and "cough" in symptom_lower:
            if "loss of taste" in symptom_lower or "loss of smell" in symptom_lower:
                disease = "COVID-19"
                confidence = 0.85
            elif "body ache" in symptom_lower and "fatigue" in symptom_lower:
                disease = "Flu (Influenza)"
                confidence = 0.78
            else:
                disease = "Common Cold"
                confidence = 0.72
        elif "nausea" in symptom_lower or "vomiting" in symptom_lower or "diarrhea" in symptom_lower:
            disease = "Gastroenteritis"
            confidence = 0.81
        elif "headache" in symptom_lower and len(symptom_lower) <= 2:
            disease = "Migraine"
            confidence = 0.69
        else:
            disease = "Common Cold"
            confidence = 0.65
        
        disease_data = self.disease_info.get(disease, {})
        
        return {
            "disease": disease,
            "confidence": confidence,
            "precautions": disease_data.get("precautions", []),
            "recommendations": disease_data.get("recommendations", [])
        }


# Global predictor instance
predictor = DiseasePredictor()


def predict_disease(symptoms: List[str], age: int = None, gender: str = None) -> Dict:
    """
    Wrapper function to make predictions.
    
    Args:
        symptoms: List of symptom names
        age: Patient age (optional)
        gender: Patient gender (optional)
        
    Returns:
        Prediction results dictionary
    """
    return predictor.predict(symptoms, age, gender)
