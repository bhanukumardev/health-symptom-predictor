/**
 * Backend API integration for chatbot
 * All AI requests go through backend for security
 */

export interface ChatMessage {
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

interface BackendChatRequest {
  message: string;
  history?: Array<{
    role: string;
    content: string;
  }>;
}

interface BackendChatResponse {
  response: string;
  status: string;
}

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Sends a message to the backend chat API and returns AI response
 * @param userMessage - User's message
 * @param chatHistory - Optional chat history for context
 * @returns AI-generated response
 */
export const generateHealthResponse = async (
  userMessage: string,
  chatHistory?: ChatMessage[]
): Promise<string> => {
  try {
    console.log('📤 Sending message to backend API:', userMessage.substring(0, 50) + '...');
    
    // Convert chat history to backend format if provided
    const history = chatHistory
      ?.filter(msg => msg.type !== 'bot' || msg.text) // Filter out empty messages
      .map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      }))
      .slice(-10); // Keep last 10 messages for context
    
    const requestBody: BackendChatRequest = {
      message: userMessage,
      ...(history && history.length > 0 ? { history } : {})
    };
    
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Server error: ${response.status} ${response.statusText}`
      );
    }
    
    const data: BackendChatResponse = await response.json();
    console.log('📥 Received response from backend');
    
    return data.response;
    
  } catch (error: any) {
    console.error('❌ Backend API Error:', error);
    
    // Provide user-friendly error messages
    if (error.message?.includes('fetch')) {
      throw new Error('Unable to connect to server. Please ensure the backend is running on http://localhost:8000');
    } else if (error.message?.includes('rate limit')) {
      throw new Error('Too many requests. Please wait a moment and try again.');
    } else {
      throw new Error(error.message || 'Failed to get response from AI assistant. Please try again.');
    }
  }
};

/**
 * Health check for backend chat service
 * @returns Health status of the chat service
 */
export const checkChatHealth = async (): Promise<{
  status: string;
  service: string;
  llm_model: string;
  api_key_configured: boolean;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/health`);
    
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
};

export default {
  generateHealthResponse,
  checkChatHealth,
};
