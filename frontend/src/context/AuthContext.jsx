import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api'; // Make sure to import the corrected api utility

// Create context
export const AuthContext = createContext();

// Hook for using the context
export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in (on page load)
  useEffect(() => {
    const checkLoggedIn = async () => {
      setLoading(true);
      
      // Check if token exists in localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        // Get user data with token
        const res = await api.get('/auth/user');
        setUser(res.data);
      } catch (err) {
        console.error('Authentication error:', err.response?.data || err.message);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);

  // Login user
  const login = async (formData) => {
    setError(null);
    try {
      console.log('Login attempt with:', formData);
      console.log('API URL:', 'http://localhost:5000/api/auth/login'); // Log the full URL for debugging
      
      const res = await api.post('/auth/login', formData);
      console.log('Login response:', res.data);
      
      localStorage.setItem('token', res.data.token);
      
      // Get user data after successful login
      const userRes = await api.get('/auth/user');
      console.log('User data:', userRes.data);
      
      setUser(userRes.data);
      return true;
    } catch (err) {
      console.error('Login error details:', err);
      console.error('Response data:', err.response?.data);
      console.error('Response status:', err.response?.status);
      
      setError(err.response?.data?.msg || 'Invalid credentials');
      return false;
    }
  };

  // Register user  
  const register = async (formData) => {
    setError(null);
    try {
      console.log('Registration attempt with:', formData);
      
      const res = await api.post('/auth/signup', formData);
      console.log('Registration response:', res.data);
      
      localStorage.setItem('token', res.data.token);
      
      // Get user data after successful registration
      const userRes = await api.get('/auth/user');
      setUser(userRes.data);
      return true;
    } catch (err) {
      console.error('Registration error:', err.response?.data || err);
      setError(err.response?.data?.msg || 'Registration failed');
      return false;
    }
  };

  // Rest of your AuthContext code...

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout: () => {
          localStorage.removeItem('token');
          setUser(null);
        },
        upgradeToPremium: async () => {
          try {
            const res = await api.post('/auth/upgrade-to-premium');
            setUser(res.data.user);
            return true;
          } catch (err) {
            setError(err.response?.data?.msg || 'Upgrade failed');
            return false;
          }
        },
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isDoctor: user?.role === 'doctor',
        isPremium: user?.role === 'premium'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;