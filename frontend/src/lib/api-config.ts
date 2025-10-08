// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888';

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    ME: `${API_BASE_URL}/api/auth/me`,
    PROFILE: `${API_BASE_URL}/api/user/profile`,
  },
  PREDICTIONS: {
    PREDICT: `${API_BASE_URL}/api/predictions/predict`,
    HISTORY: `${API_BASE_URL}/api/predictions/history`,
    FEEDBACK: `${API_BASE_URL}/api/predictions/feedback`,
  },
  SYMPTOMS: {
    LIST: `${API_BASE_URL}/api/symptoms`,
  },
};

// Helper function for authenticated requests
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('No authentication token found');
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Not authenticated. Please log in.');
  }
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  console.log('Making request to:', url);
  console.log('With headers:', headers);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('Response status:', response.status);

    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Unauthorized - please log in again');
    }

    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
