"""
Comprehensive Backend Test - Verify all Supabase connections work
"""
import requests
import json

BASE_URL = "https://health-symptom-predictor.onrender.com"

print("=" * 60)
print("COMPREHENSIVE BACKEND TEST")
print("=" * 60)

# Test 1: Health Check
print("\n1. Testing Health Endpoint...")
try:
    response = requests.get(f"{BASE_URL}/health", timeout=10)
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
    if response.status_code == 200:
        print("   ✅ Health check passed!")
    else:
        print(f"   ❌ Health check failed!")
except Exception as e:
    print(f"   ❌ Error: {e}")

# Test 2: Root Endpoint
print("\n2. Testing Root Endpoint...")
try:
    response = requests.get(f"{BASE_URL}/", timeout=10)
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
    if response.status_code == 200:
        print("   ✅ Root endpoint passed!")
    else:
        print(f"   ❌ Root endpoint failed!")
except Exception as e:
    print(f"   ❌ Error: {e}")

# Test 3: Login (requires database)
print("\n3. Testing Login Endpoint (Database Connection)...")
try:
    login_data = {
        "username": "kumarbhanu818@gmail.com",
        "password": "Bhanu123@"
    }
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        data=login_data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        timeout=10
    )
    print(f"   Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Login successful!")
        print(f"   Token type: {data.get('token_type')}")
        token = data.get('access_token')
        
        # Test 4: Get Profile (authenticated request)
        print("\n4. Testing Profile Endpoint (Authenticated)...")
        headers = {"Authorization": f"Bearer {token}"}
        profile_response = requests.get(f"{BASE_URL}/api/users/me", headers=headers, timeout=10)
        print(f"   Status: {profile_response.status_code}")
        
        if profile_response.status_code == 200:
            profile = profile_response.json()
            print(f"   ✅ Profile retrieved!")
            print(f"   User: {profile.get('email')}")
            print(f"   Name: {profile.get('full_name')}")
            print(f"   Admin: {profile.get('is_admin')}")
        else:
            print(f"   ❌ Profile failed: {profile_response.text}")
            
    else:
        print(f"   ❌ Login failed!")
        print(f"   Response: {response.text}")
    print("\n   💡 This indicates DATABASE_URL on Render needs to be updated!")
    print("   Please update DATABASE_URL on Render dashboard to the transaction pooler string:")
    print("   postgresql://postgres.txhohvmugqptewlvuhfn:Bhanu123%40@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require")
        
except Exception as e:
    print(f"   ❌ Error: {e}")

print("\n" + "=" * 60)
print("TEST SUMMARY")
print("=" * 60)
print("\nIf health check works but login fails:")
print("→ Update DATABASE_URL on Render dashboard")
print("→ Go to: https://dashboard.render.com/")
print("→ Select: health-symptom-predictor service")
print("→ Navigate to: Environment tab")
print("→ Update DATABASE_URL to Supabase connection string")
print("=" * 60)
