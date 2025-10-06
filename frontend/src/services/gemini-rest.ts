// Alternative Gemini implementation using direct REST API
// This bypasses SDK issues and uses v1 endpoint directly

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1/models';

export interface ChatMessage {
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

/**
 * Generate response using direct REST API call
 * This uses v1 endpoint (not v1beta) which should be more stable
 */
export const generateHealthResponseREST = async (userPrompt: string): Promise<string> => {
  try {
    // Log API key status
    console.log('🔑 API Key present:', !!API_KEY);
    console.log('🔑 API Key length:', API_KEY?.length || 0);
    
    if (!API_KEY) {
      throw new Error('Gemini API key is not configured.');
    }

    // Enhanced prompt for health context and multilingual support
    const systemInstruction = `You are a helpful health assistant for a Health Symptom Predictor app. 
Your role is to:
- Provide general health information and guidance
- Help users understand symptoms and when to seek medical care
- Support queries in English, Hindi, or Hinglish (mix of both)
- Always remind users that this is not a substitute for professional medical advice
- Be empathetic, clear, and concise

IMPORTANT: Always include a disclaimer that users should consult healthcare professionals for serious concerns.`;

    const fullPrompt = `${systemInstruction}\n\nUser Query: ${userPrompt}\n\nYour Response:`;

    // Try gemini-1.5-pro first
    const url = `${API_ENDPOINT}/gemini-1.5-pro:generateContent?key=${API_KEY}`;
    
    console.log('📤 Sending REST API request to:', url.replace(API_KEY, 'xxx'));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Error:', errorData);
      throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Response received');
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No text in response');
    }

    console.log('✅ Response text length:', text.length);
    return text;
    
  } catch (error: any) {
    console.error('❌ REST API Error:', error);
    throw new Error(error?.message || 'Failed to generate response. Please try again.');
  }
};

/**
 * Test which models are available by trying different endpoints
 */
export const testModelsREST = async (): Promise<Record<string, boolean>> => {
  const models = [
    'gemini-pro',
    'gemini-1.5-pro',
    'gemini-1.5-pro-latest',
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
  ];

  const results: Record<string, boolean> = {};

  for (const modelName of models) {
    try {
      console.log(`🧪 Testing ${modelName}...`);
      const url = `${API_ENDPOINT}/${modelName}:generateContent?key=${API_KEY}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'test' }] }]
        })
      });

      results[modelName] = response.ok;
      console.log(`${response.ok ? '✅' : '❌'} ${modelName}: ${response.status}`);
      
    } catch (error) {
      results[modelName] = false;
      console.log(`❌ ${modelName}: error`);
    }
  }

  console.log('📊 Test results:', results);
  return results;
};
