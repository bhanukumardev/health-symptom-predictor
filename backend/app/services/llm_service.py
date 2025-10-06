"""
LLM Service for Groq AI Integration
Handles all AI chatbot and health reasoning using Groq's LLM API
Direct HTTP requests for maximum compatibility
"""
import requests
from app.core.config import settings
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)


class LLMService:
    """Service for Groq LLM API integration using direct HTTP"""
    
    def __init__(self):
        """Initialize Groq API configuration"""
        self.api_url = "https://api.groq.com/openai/v1/chat/completions"
        self.model = "llama-3.3-70b-versatile"  # Latest supported model
        logger.info("LLM Service initialized (using direct HTTP requests)")
    
    def _get_headers(self):
        """Get API request headers with auth token"""
        if not settings.GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY is not configured in environment variables")
        
        return {
            "Authorization": f"Bearer {settings.GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
    
    async def generate_health_response(
        self,
        user_message: str,
        chat_history: Optional[List[Dict[str, str]]] = None
    ) -> str:
        """
        Generate health-related response using Groq LLM
        
        Args:
            user_message: User's health question or symptom description
            chat_history: Optional list of previous messages for context
        
        Returns:
            AI-generated response text
        """
        try:
            # Build messages array with system prompt and chat history
            messages = [
                {
                    "role": "system",
                    "content": self._get_system_prompt()
                }
            ]
            
            # Add chat history if provided
            if chat_history:
                for msg in chat_history:
                    messages.append({
                        "role": msg.get("role", "user"),
                        "content": msg.get("content", "")
                    })
            
            # Add current user message
            messages.append({
                "role": "user",
                "content": user_message
            })
            
            logger.info(f"Generating response for: {user_message[:50]}...")
            
            # Prepare request payload
            payload = {
                "model": self.model,
                "messages": messages,
                "temperature": 0.7,
                "max_tokens": 1024,
                "top_p": 0.9,
            }
            
            # Call Groq API via HTTP
            response = requests.post(
                self.api_url,
                headers=self._get_headers(),
                json=payload,
                timeout=30
            )
            
            # Check for errors
            if not response.ok:
                error_detail = response.json() if response.text else {}
                logger.error(f"Groq API error: {response.status_code} - {error_detail}")
                raise Exception(f"Groq API error: {response.status_code} - {error_detail.get('error', {}).get('message', 'Unknown error')}")
            
            # Parse response
            data = response.json()
            response_text = data['choices'][0]['message']['content']
            logger.info(f"Response generated successfully ({len(response_text)} chars)")
            
            return response_text
            
        except Exception as e:
            logger.error(f"Error generating LLM response: {str(e)}")
            raise Exception(f"Failed to generate AI response: {str(e)}")
    
    async def analyze_symptoms_with_ai(
        self,
        symptoms: List[str],
        predicted_disease: str,
        confidence: float
    ) -> str:
        """
        Use AI to provide additional context and explanation for ML predictions
        
        Args:
            symptoms: List of symptoms entered by user
            predicted_disease: Disease predicted by ML model
            confidence: Confidence score from ML model
        
        Returns:
            AI-generated explanation and recommendations
        """
        try:
            prompt = f"""
Based on the following information from our ML model:

**Predicted Disease:** {predicted_disease}
**Confidence:** {confidence:.2%}
**Symptoms:** {', '.join(symptoms)}

Please provide:
1. A brief explanation of this disease
2. Common causes and risk factors
3. When to seek immediate medical attention
4. General self-care recommendations (if appropriate)

Keep your response concise, empathetic, and always include a disclaimer about consulting healthcare professionals.
            """
            
            return await self.generate_health_response(prompt)
            
        except Exception as e:
            logger.error(f"Error in symptom analysis: {str(e)}")
            raise
    
    async def get_disease_information(self, disease_name: str) -> str:
        """
        Get detailed information about a specific disease
        
        Args:
            disease_name: Name of the disease
        
        Returns:
            AI-generated disease information
        """
        try:
            prompt = f"""
Provide comprehensive information about {disease_name}, including:

1. **Overview:** What is this condition?
2. **Common Symptoms:** What are the typical signs?
3. **Causes:** What causes this condition?
4. **Treatment:** What are the common treatment approaches?
5. **Prevention:** How can it be prevented?
6. **When to See a Doctor:** What are the warning signs?

Keep the information accurate, easy to understand, and include appropriate medical disclaimers.
            """
            
            return await self.generate_health_response(prompt)
            
        except Exception as e:
            logger.error(f"Error getting disease info: {str(e)}")
            raise
    
    async def get_medicine_recommendations(
        self,
        disease_name: str,
        symptoms: List[str],
        language: str = "en",
        age: Optional[int] = None,
        gender: Optional[str] = None,
        weight: Optional[float] = None
    ) -> Dict[str, any]:
        """
        Generate medicine recommendations and health advice for predicted disease
        Responds in user's selected language (English or Hindi)
        Now includes personalized dosage based on age, gender, and weight!
        
        Args:
            disease_name: Predicted disease name
            symptoms: List of symptoms
            language: Target language ('hi' for Hindi, 'en' for English)
            age: Patient age for personalized dosage
            gender: Patient gender (M/F/O)
            weight: Patient weight in kg for dosage calculation
        
        Returns:
            Dictionary with personalized medicines, dosage, precautions, diet tips, and warnings
        """
        try:
            symptoms_str = ', '.join(symptoms)
            
            # Build demographic info string
            demo_info = []
            if age:
                demo_info.append(f"Age: {age} years" if language == "en" else f"उम्र: {age} साल")
            if gender:
                gender_map = {"M": "Male/पुरुष", "F": "Female/महिला", "O": "Other/अन्य"}
                demo_info.append(f"Gender: {gender_map.get(gender, gender)}")
            if weight:
                demo_info.append(f"Weight: {weight} kg" if language == "en" else f"वजन: {weight} किलो")
            
            demographic_str = ", ".join(demo_info) if demo_info else ("Not provided" if language == "en" else "उपलब्ध नहीं")
            
            # Create language-specific prompts with demographic personalization
            if language == "hi":
                lang_instruction = """
आप एक प्रमाणित भारतीय स्वास्थ्य सलाहकार हैं। 
**महत्वपूर्ण नियम: केवल सरल हिंदी में उत्तर दें। कोई अंग्रेजी शब्द नहीं (सिर्फ दवाई के नाम अंग्रेजी में)।**
ग्रामीण लोगों के लिए आसान भाषा का उपयोग करें।
"""
                prompt = f"""{lang_instruction}

**रोगी की जानकारी (Patient Details):**
{demographic_str}

**रोग (Disease):** {disease_name}
**लक्षण (Symptoms):** {symptoms_str}

**कृपया व्यक्तिगत सलाह दें (रोगी की उम्र/वजन के अनुसार):**

1. **सामान्य दवाइयां (OTC Medicines) - विस्तृत खुराक:**
   - हर दवाई का नाम, ताकत (जैसे 500mg, 10mg)
   - कितनी मात्रा: आधी गोली/पूरी गोली/कैप्सूल/चम्मच (ml)
   - दिन में कितनी बार: सुबह/दोपहर/रात
   - कितने दिन तक लेनी है
   - **उम्र के हिसाब से खुराक:** बच्चे/बड़े/बुजुर्ग के लिए अलग बताएं
   - उदाहरण: "पैरासिटामोल 500mg - 1 पूरी गोली, दिन में 3 बार (सुबह-दोपहर-रात), खाने के बाद, 3 दिन तक"

2. **घरेलू उपचार (Home Remedies):**
   - पारंपरिक और सुरक्षित घरेलू नुस्खे
   - आहार सुझाव (क्या खाएं, कितनी मात्रा में)

2. **घरेलू उपचार (Home Remedies):**
   - पारंपरिक और सुरक्षित घरेलू नुस्खे
   - आहार सुझाव (क्या खाएं, कितनी मात्रा में)

3. **सावधानियां (Precautions):**
   - उम्र के हिसाब से विशेष सावधानी (बच्चे/गर्भवती महिला/बुजुर्ग)
   - क्या करें और क्या न करें
   - संक्रमण से बचाव

4. **डॉक्टर को कब दिखाएं (When to See Doctor):**
   - गंभीर संकेत जिनमें तुरंत डॉक्टर से मिलना जरूरी है
   - इस उम्र के मरीज के लिए आपातकालीन लक्षण

**विशेष ध्यान:**
- अगर रोगी बच्चा है (18 साल से कम): बहुत सावधानी से, कम खुराक बताएं
- अगर महिला है: गर्भावस्था/स्तनपान के लिए चेतावनी दें
- अगर बुजुर्ग है (60+ साल): डॉक्टर से मिलने की सलाह दें

**सभी जानकारी केवल सरल हिंदी में दें। कोई अंग्रेजी वाक्य या शब्द नहीं।**

**अस्वीकरण:** यह जानकारी केवल शिक्षा के लिए है। गंभीर स्थिति में डॉक्टर से सलाह लें।
"""
            else:
                # English mode with demographic personalization
                lang_instruction = """
You are a certified health advisor for India, specializing in safe medication guidance.
**IMPORTANT: Respond ONLY in simple, clear English.**
Use everyday language that rural and general users can understand. No medical jargon.
"""
                prompt = f"""{lang_instruction}

**Patient Information:**
{demographic_str}

**Disease:** {disease_name}
**Symptoms:** {symptoms_str}

**Please provide personalized advice based on patient's age/weight:**

1. **Over-the-Counter (OTC) Medicines - Detailed Dosage:**
   - Medicine name, strength (e.g., 500mg, 10mg)
   - Exact amount: half tablet/full tablet/capsule/teaspoon (ml)
   - How many times per day: morning/afternoon/night
   - Duration: how many days
   - **Age-specific dosage:** Mention different doses for children/adults/elderly
   - Example: "Paracetamol 500mg - 1 full tablet, 3 times daily (morning-afternoon-night), after meals, for 3 days"

2. **Home Remedies:**
   - Traditional and safe home remedies
   - Diet suggestions (what to eat, quantities)

3. **Precautions:**
   - Age-specific warnings (children/pregnant women/elderly)
   - Do's and don'ts
   - How to prevent spreading infection

4. **When to See a Doctor:**
   - Serious signs requiring immediate doctor consultation
   - Emergency symptoms specific to this age group

**Special Attention:**
- If patient is a child (under 18): Be very cautious, prescribe lower doses
- If female patient: Warn about pregnancy/breastfeeding considerations
- If elderly (60+ years): Recommend doctor consultation

**Provide all information in simple English only. No Hindi words or sentences.**

**Disclaimer:** This information is for educational purposes only. Consult a doctor for serious conditions.
"""
            
            logger.info(f"Generating medicine recommendations for: {disease_name} in {language}")
            
            # Get AI response
            response = await self.generate_health_response(prompt)
            
            return {
                "success": True,
                "disease": disease_name,
                "language": language,
                "recommendations": response,
                "disclaimer": "यह जानकारी केवल सामान्य मार्गदर्शन के लिए है। कृपया गंभीर स्थिति में डॉक्टर से परामर्श करें।" if language == "hi" else "This information is for general guidance only. Please consult a doctor for serious conditions."
            }
            
        except Exception as e:
            logger.error(f"Error generating medicine recommendations: {str(e)}")
            raise
    
    async def analyze_additional_details(
        self,
        additional_text: str,
        selected_symptoms: List[str],
        language: str = "en"
    ) -> Dict[str, any]:
        """
        Analyze user's free-text additional details using AI
        Extracts symptoms, context, and important information from Hindi/English/Hinglish text
        
        Args:
            additional_text: User's free-form text (can be Hindi/English/Hinglish)
            selected_symptoms: Symptoms already selected
            language: UI language for response formatting
        
        Returns:
            Dictionary with extracted symptoms, severity, context, and red flags
        """
        try:
            if not additional_text or len(additional_text.strip()) < 3:
                return {
                    "success": False,
                    "message": "No additional details provided"
                }
            
            # Create language-agnostic prompt that works for Hindi/English/Hinglish
            prompt = f"""You are a medical symptom analyzer. The user has written additional health details.

**User's selected symptoms:** {', '.join(selected_symptoms)}

**User's additional details (in their own language):**
"{additional_text}"

**Your task:**
Analyze the text and extract:

1. **Additional Symptoms** - Any symptoms NOT already in the selected list: {', '.join(selected_symptoms)}
   - List each new symptom clearly
   - If no new symptoms, say "None"

2. **Severity Indicators** - Duration, intensity, frequency
   - Example: "3 days", "very painful", "getting worse"

3. **Important Context** - Medical history, medications, recent events
   - Example: "after eating", "pregnant", "diabetic"

4. **Red Flags** - Serious warning signs needing immediate attention
   - Example: "severe pain", "blood", "difficulty breathing"

5. **Language Used** - Detect if user wrote in: English, Hindi, or Hinglish

**Format your response as JSON:**
```json
{{
  "additional_symptoms": ["symptom1", "symptom2"],
  "severity": "mild/moderate/severe with details",
  "context": "important background information",
  "red_flags": ["warning1", "warning2"] or "None",
  "language_detected": "English/Hindi/Hinglish",
  "summary": "Brief summary in {language} language for display"
}}
```

**IMPORTANT:** 
- Be thorough but concise
- Recognize Hindi, English, and Hinglish text
- Extract symptoms even if written in local language
- Identify red flags that need doctor consultation
"""
            
            logger.info(f"Analyzing additional details: {additional_text[:100]}...")
            
            # Get AI response
            response = await self.generate_health_response(prompt)
            
            # Try to parse JSON response
            try:
                # Extract JSON from response if it's wrapped in markdown
                import json
                import re
                
                # Remove markdown code blocks if present
                json_match = re.search(r'```(?:json)?\s*(\{.*\})\s*```', response, re.DOTALL)
                if json_match:
                    json_str = json_match.group(1)
                else:
                    # Try to find JSON object in response
                    json_match = re.search(r'\{.*\}', response, re.DOTALL)
                    json_str = json_match.group(0) if json_match else response
                
                analysis = json.loads(json_str)
                
                return {
                    "success": True,
                    "analysis": analysis,
                    "raw_response": response
                }
                
            except Exception as parse_error:
                logger.warning(f"Could not parse JSON response, returning raw: {parse_error}")
                return {
                    "success": True,
                    "analysis": {
                        "summary": response[:500],  # First 500 chars
                        "additional_symptoms": [],
                        "red_flags": "Check raw response"
                    },
                    "raw_response": response
                }
            
        except Exception as e:
            logger.error(f"Error analyzing additional details: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "message": "Failed to analyze additional details"
            }
    
    def _get_system_prompt(self) -> str:
        """
        Returns the system prompt that defines the AI's behavior
        """
        return """You are a helpful health assistant for a Health Symptom Predictor app. 

CRITICAL INSTRUCTION - MUST FOLLOW:
**You MUST respond in the EXACT same language as the user's question.**
- User writes in English → You respond ONLY in English
- User writes in Hindi → You respond ONLY in Hindi  
- User writes in Hinglish → You respond ONLY in Hinglish
- DO NOT change or translate the language
- MATCH the user's language precisely

Example:
- User: "What are symptoms of fever?" → Answer in ENGLISH only
- User: "बुखार के लक्षण क्या हैं?" → Answer in HINDI only
- User: "Fever ke symptoms kya hain?" → Answer in HINGLISH only

Your responsibilities:
- Provide general health information and guidance
- Help users understand symptoms and when to seek medical care
- Always be empathetic, clear, and concise
- Use simple language that's easy to understand

IMPORTANT GUIDELINES:
1. Always include a disclaimer that this is not a substitute for professional medical advice
2. Recommend consulting healthcare professionals for serious concerns
3. Keep responses brief and to the point (2-3 paragraphs max)
4. Use bullet points for symptoms or lists when appropriate
5. Never provide specific medical diagnoses or prescribe treatments
6. Encourage users to seek emergency care for serious symptoms

Remember: You are an assistant, not a replacement for doctors. RESPOND IN THE USER'S LANGUAGE!"""


# Singleton instance
llm_service = LLMService()


# Helper functions for easy access
async def ask_health_assistant(message: str, history: Optional[List[Dict]] = None) -> str:
    """Quick helper to ask the health assistant"""
    return await llm_service.generate_health_response(message, history)


async def analyze_prediction(symptoms: List[str], disease: str, confidence: float) -> str:
    """Quick helper to analyze ML predictions with AI"""
    return await llm_service.analyze_symptoms_with_ai(symptoms, disease, confidence)


async def get_disease_info(disease: str) -> str:
    """Quick helper to get disease information"""
    return await llm_service.get_disease_information(disease)


async def get_medicine_advice(
    disease: str, 
    symptoms: List[str], 
    language: str = "en",
    age: Optional[int] = None,
    gender: Optional[str] = None,
    weight: Optional[float] = None
) -> Dict:
    """Quick helper to get personalized medicine recommendations based on demographics"""
    return await llm_service.get_medicine_recommendations(
        disease, symptoms, language, age, gender, weight
    )

