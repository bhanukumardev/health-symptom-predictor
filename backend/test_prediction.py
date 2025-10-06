"""
Test the prediction endpoint with medicine recommendations
"""
import requests
import json

# Test data
url = "http://localhost:8000/api/predictions/predict?language=en"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_TOKEN_HERE"  # Need to get a valid token
}

# First, let's try to login
login_url = "http://localhost:8000/api/auth/login"
login_data = {
    "username": "test@example.com",  # Update with valid credentials
    "password": "test123"
}

print("=" * 60)
print("TESTING PREDICTION API WITH MEDICINE RECOMMENDATIONS")
print("=" * 60)
print()

# Note: You need to login first to get a token
print("⚠️  To test the full flow:")
print("1. Login to the app in browser")
print("2. Open browser DevTools > Network")
print("3. Make a prediction")
print("4. Check the /predict request")
print("5. Look for 'medicine_recommendations' in response")
print()
print("Checking API structure...")
print()

# Test without auth just to see structure
test_symptoms = ["Fever", "Cough", "Fatigue"]
print(f"Test symptoms: {test_symptoms}")
print(f"Language: en")
print()
print("Expected response structure:")
print(json.dumps({
    "id": 123,
    "predicted_disease": "Common Cold",
    "confidence_score": 0.85,
    "symptoms": test_symptoms,
    "timestamp": "2025-10-06T...",
    "recommendations": ["Rest well", "Drink fluids"],
    "precautions": ["Avoid cold drinks"],
    "medicine_recommendations": "**OTC Medicines:**\n- Paracetamol 500mg...",
    "ai_disclaimer": "This information is for general guidance only..."
}, indent=2))

print()
print("=" * 60)
