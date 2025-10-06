"""
Test History Management - Auto-Cleanup & Expandable Details

This script tests:
1. Auto-cleanup of old predictions (limit to 10)
2. API response includes medicine_recommendations and additional_analysis
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

# Test credentials
TEST_EMAIL = "admin@test.com"
TEST_PASSWORD = "admin123"

def login():
    """Login and get access token"""
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        data={
            "username": TEST_EMAIL,
            "password": TEST_PASSWORD
        }
    )
    if response.status_code == 200:
        token = response.json()["access_token"]
        print("✅ Login successful")
        return token
    else:
        print(f"❌ Login failed: {response.status_code}")
        print(response.text)
        return None

def create_prediction(token, index):
    """Create a test prediction"""
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test data with different symptoms for variety
    symptoms_list = [
        ["fever", "cough", "fatigue"],
        ["headache", "nausea", "vomiting"],
        ["chest_pain", "shortness_of_breath", "fever"],
        ["abdominal_pain", "diarrhea", "fever"],
        ["joint_pain", "muscle_pain", "fatigue"],
        ["skin_rash", "itching", "fever"],
        ["back_pain", "numbness", "weakness"],
        ["sore_throat", "fever", "cough"],
        ["runny_nose", "sneezing", "congestion"],
        ["loss_of_appetite", "weight_loss", "fever"],
        ["dizziness", "blurred_vision", "headache"],
        ["anxiety", "palpitations", "sweating"],
    ]
    
    symptom_set = symptoms_list[index % len(symptoms_list)]
    
    payload = {
        "symptoms": symptom_set,
        "additional_details": f"Test prediction #{index + 1} - Testing auto-cleanup functionality"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/predictions/predict",
        headers=headers,
        json=payload
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Prediction #{index + 1} created: {data['predicted_disease']} ({data['confidence_score']:.2%})")
        return True
    else:
        print(f"❌ Prediction #{index + 1} failed: {response.status_code}")
        print(response.text)
        return False

def get_history(token):
    """Get prediction history"""
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(
        f"{BASE_URL}/api/predictions/history",
        headers=headers
    )
    
    if response.status_code == 200:
        predictions = response.json()
        print(f"\n📜 History retrieved: {len(predictions)} predictions")
        print("\n" + "="*80)
        
        for i, pred in enumerate(predictions, 1):
            print(f"\n🔹 Prediction #{i}")
            print(f"   ID: {pred['id']}")
            print(f"   Disease: {pred['predicted_disease']}")
            print(f"   Confidence: {pred['confidence_score']:.2%}")
            print(f"   Symptoms: {', '.join(pred['symptoms'])}")
            print(f"   Time: {pred['timestamp']}")
            
            # Check for new fields
            if pred.get('medicine_recommendations'):
                print(f"   💊 Medicine: ✅ Present ({len(pred['medicine_recommendations'])} chars)")
            else:
                print(f"   💊 Medicine: ❌ Not present")
            
            if pred.get('additional_analysis'):
                print(f"   🔍 AI Analysis: ✅ Present")
                if pred['additional_analysis'].get('summary'):
                    print(f"      Summary: {pred['additional_analysis']['summary'][:100]}...")
            else:
                print(f"   🔍 AI Analysis: ❌ Not present")
        
        print("\n" + "="*80)
        return predictions
    else:
        print(f"❌ Failed to get history: {response.status_code}")
        print(response.text)
        return []

def main():
    print("="*80)
    print("🧪 HISTORY MANAGEMENT TEST")
    print("="*80)
    
    # Step 1: Login
    print("\n📝 Step 1: Login")
    token = login()
    if not token:
        print("❌ Cannot proceed without login")
        return
    
    # Step 2: Check current history
    print("\n📝 Step 2: Check current history")
    current_history = get_history(token)
    current_count = len(current_history)
    print(f"\n📊 Current prediction count: {current_count}")
    
    # Step 3: Create predictions to exceed limit
    print("\n📝 Step 3: Create predictions to test auto-cleanup")
    predictions_to_create = max(12 - current_count, 2)  # Create at least 2, max to reach 12
    print(f"   Creating {predictions_to_create} predictions...")
    
    for i in range(predictions_to_create):
        create_prediction(token, current_count + i)
    
    # Step 4: Check history again
    print("\n📝 Step 4: Verify auto-cleanup (should be max 10)")
    final_history = get_history(token)
    final_count = len(final_history)
    
    # Step 5: Verify results
    print("\n📝 Step 5: Test Results")
    print("="*80)
    
    if final_count <= 10:
        print(f"✅ AUTO-CLEANUP WORKING: {final_count} predictions (≤ 10)")
    else:
        print(f"❌ AUTO-CLEANUP FAILED: {final_count} predictions (> 10)")
    
    # Check API response structure
    if final_history:
        sample = final_history[0]
        
        checks = {
            "id": "id" in sample,
            "predicted_disease": "predicted_disease" in sample,
            "confidence_score": "confidence_score" in sample,
            "symptoms": "symptoms" in sample,
            "timestamp": "timestamp" in sample,
            "medicine_recommendations": "medicine_recommendations" in sample,
            "additional_analysis": "additional_analysis" in sample,
        }
        
        print("\n📋 API Response Structure:")
        for field, present in checks.items():
            status = "✅" if present else "❌"
            print(f"   {status} {field}")
        
        if all(checks.values()):
            print("\n✅ ALL FIELDS PRESENT IN API RESPONSE")
        else:
            print("\n⚠️ SOME FIELDS MISSING IN API RESPONSE")
    
    print("\n" + "="*80)
    print("🎉 TEST COMPLETE")
    print("="*80)

if __name__ == "__main__":
    main()
