import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Use Gemini 1.5 Pro model (latest stable model with v1 API)
// Note: Using "gemini-1.5-pro-latest" for the most recent available model
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-pro-latest",
});

export interface ChatMessage {
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

/**
 * Generates a response from Gemini AI for health-related queries
 * Supports English, Hindi, and Hinglish languages
 */
export const generateHealthResponse = async (userPrompt: string): Promise<string> => {
  try {
    // Log API key status (without exposing the actual key)
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log('🔑 API Key present:', !!apiKey);
    console.log('🔑 API Key length:', apiKey?.length || 0);
    
    if (!apiKey) {
      throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
    }

    // Enhanced prompt for health context and multilingual support
    const systemPrompt = `You are a helpful health assistant for a Health Symptom Predictor app. 
Your role is to:
- Provide general health information and guidance
- Help users understand symptoms and when to seek medical care
- Support queries in English, Hindi, or Hinglish (mix of both)
- Always remind users that this is not a substitute for professional medical advice
- Be empathetic, clear, and concise

IMPORTANT: Always include a disclaimer that users should consult healthcare professionals for serious concerns.

User Query: ${userPrompt}

Your Response:`;

    console.log('📤 Sending request to Gemini API...');
    const result = await model.generateContent(systemPrompt);
    console.log('📥 Received response from Gemini API');
    const response = await result.response;
    const text = response.text();
    console.log('✅ Response text length:', text.length);
    return text;
  } catch (error: any) {
    console.error('❌ Gemini API Error:', error);
    console.error('❌ Error message:', error?.message);
    console.error('❌ Error details:', error?.response?.data || error?.status);
    throw new Error(error?.message || 'Failed to generate response. Please try again.');
  }
};

/**
 * Generates a streaming response (for future enhancement)
 */
export const generateHealthResponseStream = async (
  userPrompt: string,
  onChunk: (text: string) => void
): Promise<void> => {
  try {
    const systemPrompt = `You are a helpful health assistant for a Health Symptom Predictor app. 
Support queries in English, Hindi, or Hinglish. Be empathetic and concise.

User Query: ${userPrompt}

Your Response:`;

    const result = await model.generateContentStream(systemPrompt);
    
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      onChunk(chunkText);
    }
  } catch (error) {
    console.error('Gemini API Streaming Error:', error);
    throw new Error('Failed to generate response. Please try again.');
  }
};

/**
 * Test available models by trying different model names
 */
export const testModelAvailability = async (): Promise<string[]> => {
  const modelsToTest = [
    'gemini-pro',
    'gemini-1.5-pro',
    'gemini-1.5-pro-latest',
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'models/gemini-pro',
    'models/gemini-1.5-pro'
  ];
  
  const workingModels: string[] = [];
  
  for (const modelName of modelsToTest) {
    try {
      console.log(`🧪 Testing model: ${modelName}`);
      const testModel = genAI.getGenerativeModel({ model: modelName });
      await testModel.generateContent('test');
      console.log(`✅ ${modelName} works!`);
      workingModels.push(modelName);
    } catch (error: any) {
      console.log(`❌ ${modelName} failed:`, error.message);
    }
  }
  
  return workingModels;
};
