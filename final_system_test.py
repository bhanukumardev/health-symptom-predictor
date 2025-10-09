#!/usr/bin/env python3
"""
Final System Test - Verify Complete Health Symptom Predictor Deployment
Tests both backend and frontend after database migration
"""
import requests
import json
import time
import sys
import os
from datetime import datetime

# Configuration - Use environment variables
BACKEND_URL = os.getenv('BACKEND_URL', 'https://your-backend.app')
FRONTEND_URL = os.getenv('FRONTEND_URL', 'https://your-frontend.app')
# Admin credentials - use environment variables
ADMIN_EMAIL = os.getenv('ADMIN_EMAIL', 'admin@example.com')
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'defaultpassword')

def print_header(text):
    print("\n" + "="*60)
    print(f" {text}")
    print("="*60)

def print_step(step_num, description):
    print(f"\n{step_num}. {description}")
    print("-" * 50)

def test_endpoint(name, url, method="GET", data=None, headers=None, expected_status=200):
    """Test an endpoint and return response data"""
    try:
        print(f"Testing {name}...")
        
        if method == "GET":
            response = requests.get(url, headers=headers, timeout=30)
        elif method == "POST":
            if headers and "application/json" in headers.get("Content-Type", ""):
                response = requests.post(url, json=data, headers=headers, timeout=30)
            else:
                response = requests.post(url, data=data, headers=headers, timeout=30)
        
        print(f"  Status: {response.status_code}")
        
        if response.status_code == expected_status:
            print(f"  ✅ {name} PASSED")
            try:
                return response.json()
            except:
                return {"success": True, "text": response.text[:100]}
        else:
            print(f"  ❌ {name} FAILED")
            print(f"  Response: {response.text[:200]}")
            return None
            
    except Exception as e:
        print(f"  ❌ {name} ERROR: {str(e)}")
        return None

def main():
    print_header("HEALTH SYMPTOM PREDICTOR - FINAL SYSTEM TEST")
    print(f"Timestamp: {datetime.now().isoformat()}")
    print(f"Backend: {BACKEND_URL}")
    print(f"Frontend: {FRONTEND_URL}")
    
    all_tests_passed = True
    token = None
    
    # Test 1: Backend Health Check
    print_step(1, "Backend Health Check")
    health_result = test_endpoint("Health Check", f"{BACKEND_URL}/health")
    if not health_result:
        print("\n❌ CRITICAL: Backend health check failed!")
        print("   This usually means:")
        print("   - Render service is not running")
        print("   - Backend crashed during startup")
        print("   - Network connectivity issues")
        all_tests_passed = False
    
    # Test 2: Backend Root Endpoint
    print_step(2, "Backend Root Endpoint")
    root_result = test_endpoint("Root Endpoint", f"{BACKEND_URL}/")
    if not root_result:
        all_tests_passed = False
    
    # Test 3: Database Connection (Login)
    print_step(3, "Database Connection Test (Login)")
    login_data = {
        "username": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    }
    login_headers = {"Content-Type": "application/x-www-form-urlencoded"}
    login_result = test_endpoint(
        "Admin Login", 
        f"{BACKEND_URL}/api/auth/login", 
        method="POST", 
        data=login_data, 
        headers=login_headers
    )
    
    if login_result and "access_token" in login_result:
        token = login_result["access_token"]
        print(f"  ✅ Database connection successful!")
        print(f"  Token received: {token[:20]}...")
    else:
        print(f"\n❌ CRITICAL: Database connection failed!")
        print("   This means DATABASE_URL on Render is still incorrect.")
        print("   Please check RENDER_DATABASE_URL_URGENT_FIX.md")
        all_tests_passed = False
    
    # Test 4: Authenticated Endpoints (if login worked)
    if token:
        print_step(4, "Authenticated Endpoints")
        auth_headers = {"Authorization": f"Bearer {token}"}
        
        # Test profile
        profile_result = test_endpoint(
            "User Profile", 
            f"{BACKEND_URL}/api/user/profile", 
            headers=auth_headers
        )
        if not profile_result:
            all_tests_passed = False
        
        # Test symptoms list (instead of diseases)
        symptoms_result = test_endpoint(
            "Symptoms List", 
            f"{BACKEND_URL}/api/symptoms/"
        )
        if not symptoms_result:
            all_tests_passed = False
        else:
            print(f"  Found {len(symptoms_result) if isinstance(symptoms_result, list) else 'some'} symptoms")
            
        # Test prediction history
        history_result = test_endpoint(
            "Prediction History", 
            f"{BACKEND_URL}/api/predictions/history", 
            headers=auth_headers
        )
        if not history_result:
            all_tests_passed = False
    
    # Test 5: Frontend Accessibility
    print_step(5, "Frontend Accessibility")
    try:
        print("Testing frontend accessibility...")
        response = requests.get(FRONTEND_URL, timeout=30)
        if response.status_code == 200:
            print(f"  ✅ Frontend accessible (Status: {response.status_code})")
            if "Health Predictor" in response.text or "Health Symptom" in response.text:
                print("  ✅ Frontend content loaded correctly")
            else:
                print("  ⚠️  Frontend loaded but content may be incorrect")
        else:
            print(f"  ❌ Frontend not accessible (Status: {response.status_code})")
            all_tests_passed = False
    except Exception as e:
        print(f"  ❌ Frontend test error: {str(e)}")
        all_tests_passed = False
    
    # Final Results
    print_header("FINAL TEST RESULTS")
    
    if all_tests_passed:
        print("🎉 ALL TESTS PASSED! 🎉")
        print("\n✅ Your Health Symptom Predictor is FULLY OPERATIONAL!")
        print(f"\n🌐 Access your application:")
        print(f"   Frontend: {FRONTEND_URL}")
        print(f"   API Docs: {BACKEND_URL}/docs")
        print(f"\n👑 Admin Login:")
        print(f"   Email: {ADMIN_EMAIL}")
        print(f"   Password: Check ADMIN_PASSWORD environment variable")
        print("\n🚀 Your app is ready for users!")
        
    else:
        print("❌ Some tests failed. Issues to address:")
        print("\n📋 Common Solutions:")
        print("1. DATABASE_URL not updated on deployment platform")
        print("   → Check your deployment platform's environment variables")
        print("2. Service not fully deployed")
        print("   → Wait 2-3 minutes after DATABASE_URL change")
        print("3. Database connection issues")
        print("   → Verify database connection string is correct")
        print(f"\n🔍 Debug URLs:")
        print(f"   Backend: {BACKEND_URL}")
        print(f"   Frontend: {FRONTEND_URL}")
        
    print("\n" + "="*60)
    return 0 if all_tests_passed else 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)