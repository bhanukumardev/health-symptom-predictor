import Groq from "groq-sdk";

// Initialize Groq client with API key
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true, // For frontend use (move to backend in production)
});

export interface ChatMessage {
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

/**
 * Generates a response from Groq AI for health-related queries
 * Supports English, Hindi, and Hinglish languages
 * Uses Llama 3 model for fast, accurate responses
 */
export const generateHealthResponse = async (userPrompt: string): Promise<string> => {
  try {
    // Log API key status (without exposing the actual key)
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    console.log('🔑 Groq API Key present:', !!apiKey);
    console.log('🔑 API Key length:', apiKey?.length || 0);
    
    if (!apiKey) {
      throw new Error('Groq API key is not configured. Please add VITE_GROQ_API_KEY to your .env file.');
    }

    console.log('📤 Sending request to Groq API...');
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a helpful health assistant for a Health Symptom Predictor app. 

Your responsibilities:
- Provide general health information and guidance
- Help users understand symptoms and when to seek medical care
- Support queries in English, Hindi, or Hinglish (mixed Hindi-English)
- Always be empathetic, clear, and concise
- Use simple language that's easy to understand

IMPORTANT GUIDELINES:
1. Always include a disclaimer that this is not a substitute for professional medical advice
2. Recommend consulting healthcare professionals for serious concerns
3. Respond in the same language as the user's query (English, Hindi, or Hinglish)
4. Keep responses brief and to the point (2-3 paragraphs max)
5. Use bullet points for symptoms or lists when appropriate

Remember: You are an assistant, not a replacement for doctors.`
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      model: "llama-3.3-70b-versatile", // Latest supported model (Oct 2025) - Fast, accurate, multilingual
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.9,
    });

    console.log('📥 Received response from Groq API');
    
    const responseText = completion.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error('No response text received from Groq API');
    }

    console.log('✅ Response text length:', responseText.length);
    return responseText;
    
  } catch (error: any) {
    console.error('❌ Groq API Error:', error);
    console.error('❌ Error message:', error?.message);
    console.error('❌ Error details:', error?.response?.data || error?.status);
    
    // Provide user-friendly error messages
    if (error?.message?.includes('API key')) {
      throw new Error('API key is invalid or not configured properly.');
    } else if (error?.message?.includes('rate limit')) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    } else if (error?.message?.includes('quota')) {
      throw new Error('API quota exceeded. Please try again later.');
    } else {
      throw new Error(error?.message || 'Failed to generate response. Please try again.');
    }
  }
};

/**
 * Generates a streaming response (for future enhancement)
 * This allows for real-time text generation display
 */
export const generateHealthResponseStream = async (
  userPrompt: string,
  onChunk: (text: string) => void
): Promise<void> => {
  try {
    const stream = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful health assistant. Support queries in English, Hindi, or Hinglish. Be empathetic and concise."
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    console.error('Groq API Streaming Error:', error);
    throw new Error('Failed to generate streaming response. Please try again.');
  }
};

/**
 * Test the Groq API connection
 */
export const testGroqConnection = async (): Promise<boolean> => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: "Hello" }],
      model: "llama-3.3-70b-versatile",
      max_tokens: 10,
    });
    
    return !!completion.choices[0]?.message?.content;
  } catch (error) {
    console.error('Groq connection test failed:', error);
    return false;
  }
};
