import { drogonClient } from '../../../api/client';

export const authService = {
  // Matches your AuthRest login endpoint
  login: async (username, password) => {
    const data = await drogonClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    // If Drogon returns a JWT, store it
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  // Clears local session
  logout: () => {
    localStorage.removeItem('token');
    // Optional: Call a /auth/logout endpoint if your C++ backend tracks sessions
  }
};