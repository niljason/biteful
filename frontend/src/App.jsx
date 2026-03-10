import React, { useState } from 'react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState({ text: '', isError: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: 'Processing...', isError: false });

    // Matches the 'type' logic in your AuthRest.cc
    const payload = {
      type: isLogin ? 'login' : 'signup',
      email: formData.email,
      password: formData.password,
      ...( !isLogin && { username: formData.username } )
    };

    try {
      const response = await fetch('http://localhost:5555/AuthRest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: isLogin ? 'Login Successful!' : 'Account Created!', isError: false });
        if (data.token) localStorage.setItem('token', data.token);
      } else {
        setMessage({ text: 'Action failed. Check your credentials.', isError: true });
      }
    } catch (error) {
      setMessage({ text: 'Error connecting to server.', isError: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full p-2 border rounded"
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
          <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className={`mt-4 text-sm text-center ${message.isError ? 'text-red-500' : 'text-green-500'}`}>
          {message.text}
        </p>

        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-4 text-sm text-blue-500 hover:underline"
        >
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;