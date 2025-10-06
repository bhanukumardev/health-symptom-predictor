"""
Quick test to see medicine dosage recommendations
"""
import asyncio
import os
from app.services.llm_service import LLMService

async def test_dosage():
    print("=" * 60)
    print("TESTING MEDICINE DOSAGE RECOMMENDATIONS")
    print("=" * 60)
    
    # Set API key
    os.environ['GROQ_API_KEY'] = 'your_groq_api_key_here'  # Use real key from .env in production
    
    service = LLMService()
    
    # Test Case 1: Adult male with weight
    print("\n📋 Test Case 1: Adult Male (42 years, 70kg)")
    print("-" * 60)
    result = await service.get_medicine_recommendations(
        disease_name="Common Cold",
        symptoms=["Fever", "Cough", "Headache"],
        language="en",
        age=42,
        gender="M",
        weight=70.0
    )
    print(result.get("recommendations", "No recommendations"))
    
    # Test Case 2: Female (child)
    print("\n\n📋 Test Case 2: Child Female (8 years, 25kg)")
    print("-" * 60)
    result = await service.get_medicine_recommendations(
        disease_name="Common Cold",
        symptoms=["Fever", "Cough"],
        language="en",
        age=8,
        gender="F",
        weight=25.0
    )
    print(result.get("recommendations", "No recommendations"))
    
    # Test Case 3: Hindi language
    print("\n\n📋 Test Case 3: Adult in Hindi (35 years, 60kg)")
    print("-" * 60)
    result = await service.get_medicine_recommendations(
        disease_name="Gastroenteritis",
        symptoms=["Nausea", "Vomiting", "Diarrhea"],
        language="hi",
        age=35,
        gender="F",
        weight=60.0
    )
    print(result.get("recommendations", "No recommendations"))
    
    print("\n" + "=" * 60)
    print("✅ Test complete! Check the dosage details above.")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(test_dosage())
