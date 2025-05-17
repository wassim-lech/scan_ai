import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from token
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await api.get('/auth/user');
        setUser(res.data);
        console.log('User loaded successfully:', res.data);
      } catch (err) {
        console.error('Error loading user:', err);
        console.error('Response data:', err.response?.data);
        console.error('Response status:', err.response?.status);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);
  // Login
  const login = async (formData) => {
    setError(null);
    try {
      console.log('Login attempt with:', formData);
      console.log('API URL being used:', '/auth/login'); // For debugging
      
      const res = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });
      
      console.log('Login response:', res.data);
      localStorage.setItem('token', res.data.token);
      
      // Get user data
      const userRes = await api.get('/auth/user');
      console.log('User data retrieved:', userRes.data);
      
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
  // Register
  const register = async (formData) => {
    setError(null);
    try {
      console.log('Registration attempt with:', formData);
      console.log('API URL being used:', '/auth/signup'); // For debugging
      
      const res = await api.post('/auth/signup', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      console.log('Registration response:', res.data);
      localStorage.setItem('token', res.data.token);
      
      // Get user data
      const userRes = await api.get('/auth/user');
      console.log('User data retrieved after registration:', userRes.data);
      
      setUser(userRes.data);
      return true;
    } catch (err) {
      console.error('Registration error details:', err);
      console.error('Response data:', err.response?.data);
      console.error('Response status:', err.response?.status);
      setError(err.response?.data?.msg || 'Registration failed');
      return false;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  // Upgrade to premium
  const upgradeToPremium = async () => {
    try {
      const res = await api.post('/auth/upgrade-to-premium', {});
      console.log('Upgrade response:', res.data);
      setUser(res.data.user);
      return true;
    } catch (err) {
      console.error('Upgrade error details:', err);
      console.error('Response data:', err.response?.data);
      setError(err.response?.data?.msg || 'Upgrade failed');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        upgradeToPremium,
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