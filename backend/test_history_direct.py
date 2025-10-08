"""
Direct API Test - Check what's wrong with history endpoint
"""
import requests

BASE_URL = "http://localhost:8888"

print("="*80)
print("🔍 DEBUGGING HISTORY ENDPOINT")
print("="*80)

# Get a valid token first
print("\n1. Testing login...")
response = requests.post(
    f"{BASE_URL}/api/auth/login",
    data={
        "username": "admin@test.com",  # Try admin
        "password": "admin123"
    }
)

if response.status_code != 200:
    print(f"❌ Login failed: {response.status_code}")
    print(response.text)
    
    # Try creating admin user
    print("\n2. Creating admin user...")
    response = requests.post(
        f"{BASE_URL}/api/auth/register",
        json={
            "email": "admin@test.com",
            "password": "admin123",
            "name": "Admin User",
            "age": 30,
            "gender": "male",
            "weight": 70.0
        }
    )
    print(f"Register status: {response.status_code}")
    if response.status_code == 200:
        print("✅ Admin user created")
        # Login again
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            data={
                "username": "admin@test.com",
                "password": "admin123"
            }
        )

if response.status_code == 200:
    token = response.json()["access_token"]
    print(f"✅ Got token: {token[:20]}...")
    
    # Test history endpoint
    print("\n3. Testing history endpoint...")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/api/predictions/history", headers=headers)
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"✅ Success! Got {len(response.json())} predictions")
        print(response.json())
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
else:
    print(f"❌ Cannot get token: {response.status_code}")
    print(response.text)

print("\n" + "="*80)
