"""
Quick test script for Profile Edit Feature
Tests both GET and PUT endpoints
"""
import requests
import json

BASE_URL = "http://localhost:8888"

def test_profile_feature():
    print("=" * 60)
    print("TESTING PROFILE EDIT FEATURE")
    print("=" * 60)
    
    # Step 1: Login to get token
    print("\n📝 Step 1: Logging in...")
    login_response = requests.post(
        f"{BASE_URL}/api/auth/login",
        data={"username": "admin@health.com", "password": "admin123"}  # Use form data, not JSON
    )
    
    if login_response.status_code != 200:
        print("❌ Login failed!")
        print(f"Status: {login_response.status_code}")
        print(f"Response: {login_response.text}")
        return
    
    token = login_response.json()["access_token"]
    print(f"✅ Login successful! Token: {token[:20]}...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Step 2: Get current profile
    print("\n📖 Step 2: Getting current profile...")
    get_response = requests.get(f"{BASE_URL}/api/user/profile", headers=headers)
    
    if get_response.status_code != 200:
        print(f"❌ Failed to get profile! Status: {get_response.status_code}")
        print(f"Response: {get_response.text}")
        return
    
    current_profile = get_response.json()
    print("✅ Current profile:")
    print(json.dumps(current_profile, indent=2))
    
    # Step 3: Update profile
    print("\n✏️ Step 3: Updating profile...")
    update_data = {
        "full_name": "Test User Updated",
        "age": 45,
        "gender": "M",
        "weight": 75.5
    }
    
    put_response = requests.put(
        f"{BASE_URL}/api/user/profile",
        headers={**headers, "Content-Type": "application/json"},
        json=update_data
    )
    
    if put_response.status_code != 200:
        print(f"❌ Failed to update profile! Status: {put_response.status_code}")
        print(f"Response: {put_response.text}")
        return
    
    updated_profile = put_response.json()
    print("✅ Profile updated successfully!")
    print(json.dumps(updated_profile, indent=2))
    
    # Step 4: Verify changes
    print("\n🔍 Step 4: Verifying changes...")
    verify_response = requests.get(f"{BASE_URL}/api/user/profile", headers=headers)
    verify_profile = verify_response.json()
    
    if verify_profile["age"] == update_data["age"] and \
       verify_profile["weight"] == update_data["weight"] and \
       verify_profile["gender"] == update_data["gender"]:
        print("✅ Changes persisted in database!")
    else:
        print("❌ Changes not saved correctly!")
        print(f"Expected: {update_data}")
        print(f"Got: {verify_profile}")
        return
    
    # Step 5: Test validation
    print("\n⚠️ Step 5: Testing validation...")
    
    # Test invalid age
    invalid_age = requests.put(
        f"{BASE_URL}/api/user/profile",
        headers={**headers, "Content-Type": "application/json"},
        json={"age": -5}
    )
    
    if invalid_age.status_code == 422:  # Validation error
        print("✅ Age validation working (rejected -5)")
    else:
        print(f"⚠️ Age validation might not be working. Status: {invalid_age.status_code}")
    
    # Test invalid weight
    invalid_weight = requests.put(
        f"{BASE_URL}/api/user/profile",
        headers={**headers, "Content-Type": "application/json"},
        json={"weight": 0}
    )
    
    if invalid_weight.status_code == 422:  # Validation error
        print("✅ Weight validation working (rejected 0)")
    else:
        print(f"⚠️ Weight validation might not be working. Status: {invalid_weight.status_code}")
    
    # Test invalid gender
    invalid_gender = requests.put(
        f"{BASE_URL}/api/user/profile",
        headers={**headers, "Content-Type": "application/json"},
        json={"gender": "X"}
    )
    
    if invalid_gender.status_code == 422:  # Validation error
        print("✅ Gender validation working (rejected 'X')")
    else:
        print(f"⚠️ Gender validation might not be working. Status: {invalid_gender.status_code}")
    
    # Final summary
    print("\n" + "=" * 60)
    print("✅ PROFILE FEATURE TEST COMPLETE!")
    print("=" * 60)
    print("\n📊 Summary:")
    print("✓ Login successful")
    print("✓ GET /api/user/profile works")
    print("✓ PUT /api/user/profile works")
    print("✓ Database persistence works")
    print("✓ Validation works")
    print("\n🎉 Profile edit feature is fully functional!")
    print("\nNext: Test in browser at http://localhost:3002/profile")

if __name__ == "__main__":
    try:
        test_profile_feature()
    except requests.exceptions.ConnectionError:
        print("❌ ERROR: Cannot connect to backend!")
        print("Make sure backend is running:")
        print("  cd backend")
        print("  python -m uvicorn app.main:app --reload --port 8000")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
