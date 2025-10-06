#!/usr/bin/env python3
"""Test the full prediction flow with Groq medicine recommendations"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_english_prediction():
    """Test prediction in English mode"""
    print("\n🧪 Testing ENGLISH prediction with Groq AI...\n")
    
    # Make prediction request
    payload = {
        "symptom_ids": [1, 2, 3]  # Fever, Cough, Fatigue
    }
    
    response = requests.post(
        f"{BASE_URL}/api/predictions/predict?language=en",
        json=payload
    )
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("\n✅ Response received!")
        print(f"\n📋 Predicted Disease: {data.get('predicted_disease')}")
        print(f"📊 Confidence: {data.get('confidence_score', 0) * 100:.1f}%")
        
        # Check for medicine recommendations
        if data.get('medicine_recommendations'):
            print("\n💊 MEDICINE RECOMMENDATIONS FOUND!")
            print("=" * 60)
            print(data['medicine_recommendations'][:500])  # First 500 chars
            print("=" * 60)
            return True
        else:
            print("\n❌ NO medicine_recommendations field in response!")
            print("\nFull response:")
            print(json.dumps(data, indent=2))
            return False
    else:
        print(f"\n❌ ERROR: {response.status_code}")
        print(response.text)
        return False

def test_hindi_prediction():
    """Test prediction in Hindi mode"""
    print("\n🧪 Testing HINDI prediction with Groq AI...\n")
    
    payload = {
        "symptom_ids": [1, 2, 3]  # Fever, Cough, Fatigue
    }
    
    response = requests.post(
        f"{BASE_URL}/api/predictions/predict?language=hi",
        json=payload
    )
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("\n✅ Response received!")
        print(f"\n📋 Predicted Disease: {data.get('predicted_disease')}")
        print(f"📊 Confidence: {data.get('confidence_score', 0) * 100:.1f}%")
        
        if data.get('medicine_recommendations'):
            print("\n💊 MEDICINE RECOMMENDATIONS IN HINDI FOUND!")
            print("=" * 60)
            print(data['medicine_recommendations'][:500])
            print("=" * 60)
            return True
        else:
            print("\n❌ NO medicine_recommendations field!")
            return False
    else:
        print(f"\n❌ ERROR: {response.status_code}")
        print(response.text)
        return False

if __name__ == "__main__":
    print("=" * 70)
    print("🧪 TESTING FULL PREDICTION FLOW WITH GROQ MEDICINE AI")
    print("=" * 70)
    
    # Test English
    english_ok = test_english_prediction()
    
    # Test Hindi
    print("\n" + "=" * 70)
    hindi_ok = test_hindi_prediction()
    
    # Summary
    print("\n" + "=" * 70)
    print("📊 TEST SUMMARY")
    print("=" * 70)
    print(f"English Prediction: {'✅ PASS' if english_ok else '❌ FAIL'}")
    print(f"Hindi Prediction: {'✅ PASS' if hindi_ok else '❌ FAIL'}")
    
    if english_ok and hindi_ok:
        print("\n🎉 ALL TESTS PASSED! Medicine recommendations working!")
    else:
        print("\n❌ TESTS FAILED! Check backend logs for errors.")
        print("\nPossible issues:")
        print("1. Backend not restarted after schema change")
        print("2. GROQ_API_KEY not loaded")
        print("3. Error in llm_service.py")
    
    print("=" * 70)
