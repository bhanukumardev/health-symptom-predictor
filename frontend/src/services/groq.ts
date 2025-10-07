
export interface ChatMessage {
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

// Call backend API for Groq-powered features
export const generateHealthResponse = async (userPrompt: string): Promise<string> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add auth header if needed
      },
      body: JSON.stringify({ message: userPrompt })
    });
    if (!response.ok) {
      throw new Error('Failed to get response from backend.');
    }
    const data = await response.json();
    return data.response || '';
  } catch (error: any) {
    console.error('Groq API Error:', error);
    throw new Error(error?.message || 'Failed to generate response. Please try again.');
  }
};
