"""
Quick test script to verify Groq API is working
"""
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

print("=" * 60)
print("GROQ API TEST")
print("=" * 60)
print(f"API Key loaded: {GROQ_API_KEY[:20]}...{GROQ_API_KEY[-10:]}")
print()

# Test Groq API
url = "https://api.groq.com/openai/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {GROQ_API_KEY}",
    "Content-Type": "application/json"
}

payload = {
    "model": "llama-3.3-70b-versatile",
    "messages": [
        {
            "role": "system",
            "content": "You are a health assistant. Respond in English only."
        },
        {
            "role": "user",
            "content": "Suggest 2 common medicines for Common Cold. Keep it very brief."
        }
    ],
    "max_tokens": 200
}

print("Sending test request to Groq API...")
print()

try:
    response = requests.post(url, headers=headers, json=payload, timeout=30)
    
    if response.ok:
        data = response.json()
        ai_response = data['choices'][0]['message']['content']
        
        print("✅ SUCCESS! Groq API is working!")
        print()
        print("AI Response:")
        print("-" * 60)
        print(ai_response)
        print("-" * 60)
    else:
        print("❌ ERROR!")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
except Exception as e:
    print(f"❌ EXCEPTION: {str(e)}")

print()
print("=" * 60)
