"""
Quick History Test - Check if history endpoint is working
"""

import requests

BASE_URL = "http://localhost:8000"

print("="*80)
print("🧪 QUICK HISTORY TEST")
print("="*80)

# Step 1: Try to get history without login (should fail with 401)
print("\n📝 Step 1: Test history endpoint without auth (should fail)")
response = requests.get(f"{BASE_URL}/api/predictions/history")
print(f"Status: {response.status_code}")
if response.status_code == 401:
    print("✅ Endpoint is protected (good!)")
else:
    print(f"Response: {response.text}")

# Step 2: Check if backend is healthy
print("\n📝 Step 2: Check backend health")
try:
    response = requests.get(f"{BASE_URL}/docs")
    if response.status_code == 200:
        print("✅ Backend is running and accessible")
    else:
        print(f"⚠️ Backend responded with status {response.status_code}")
except Exception as e:
    print(f"❌ Cannot reach backend: {e}")

# Step 3: Instructions
print("\n" + "="*80)
print("📋 NEXT STEPS:")
print("="*80)
print("1. Open your browser to http://localhost:3002")
print("2. Login with your credentials")
print("3. Click on the History page (📜 icon)")
print("4. Open browser DevTools (F12) and check the Console tab")
print("5. Look for any error messages")
print("\nCommon issues:")
print("  - Token expired → Logout and login again")
print("  - CORS error → Check backend CORS settings")
print("  - 500 error → Check backend terminal for error logs")
print("="*80)
