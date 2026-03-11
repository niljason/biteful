const BASE_URL = 'http://localhost:5555'; // DOUBLE CHECK THIS PORT

export const drogonClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    mode: 'cors', // Explicitly set CORS mode
    ...options,
    headers,
  };

  console.group(`Requesting: ${endpoint}`);
  console.log('Options:', config);
  console.groupEnd();

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch Check:', error);
    throw error;
  }
};