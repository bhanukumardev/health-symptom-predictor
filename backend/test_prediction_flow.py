import requests
import json
import os

BASE_URL = os.getenv("BACKEND_URL", "http://localhost:8888")

# Test 1: Login - Use environment variables
print("=" * 50)
print("Testing Login...")
login_data = {
    "email": os.getenv("ADMIN_EMAIL", "admin@example.com"),
    "password": os.getenv("ADMIN_PASSWORD", "defaultpassword")
}
response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    token = data.get("access_token")
    print(f"✓ Login successful! Token: {token[:20]}...")
else:
    print(f"✗ Login failed: {response.text}")
    exit(1)

# Test 2: Make Prediction
print("\n" + "=" * 50)
print("Testing Prediction...")
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}
prediction_data = {
    "symptoms": ["Fever", "Cough", "Fatigue"]
}
response = requests.post(f"{BASE_URL}/api/predictions/predict", 
                        json=prediction_data, 
                        headers=headers)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"✓ Prediction successful!")
    print(f"  Disease: {data.get('predicted_disease')}")
    print(f"  Confidence: {data.get('confidence_score') * 100:.1f}%")
    print(f"  ID: {data.get('id')}")
else:
    print(f"✗ Prediction failed: {response.text}")

# Test 3: Get History
print("\n" + "=" * 50)
print("Testing History...")
response = requests.get(f"{BASE_URL}/api/predictions/history", headers=headers)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"✓ History retrieved! Found {len(data)} predictions")
else:
    print(f"✗ History failed: {response.text}")

print("\n" + "=" * 50)
print("All tests completed!")
