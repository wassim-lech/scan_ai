import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const AuthPage = () => {
  const location = useLocation();
  // Check if we were directed here with signup mode
  const initialIsLogin = !(location.state?.isSignUp === true);
  
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const { login, register, isAuthenticated, error } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (isLogin) {
      if (!formData.email) errors.email = 'Email is required';
      if (!formData.password) errors.password = 'Password is required';
    } else {
      if (!formData.username) errors.username = 'Username is required';
      if (!formData.email) errors.email = 'Email is required';
      if (!formData.password) errors.password = 'Password is required';
      if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    console.log("Submitting form:", isLogin ? "Login" : "Signup");
    console.log("Form data:", formData);
    
    let success;
    try {
      if (isLogin) {
        success = await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        console.log("Attempting registration with:", {
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
        success = await register({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
      }
      
      console.log("Auth result:", success);
      
      if (success) {
        navigate('/profile');
      }
    } catch (err) {
      console.error("Auth error:", err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
          <p>Access your account or create a new one</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
              />
              {formErrors.username && <span className="error">{formErrors.username}</span>}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {formErrors.email && <span className="error">{formErrors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            {formErrors.password && <span className="error">{formErrors.password}</span>}
          </div>
          
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
              {formErrors.confirmPassword && <span className="error">{formErrors.confirmPassword}</span>}
            </div>
          )}
          
          <button type="submit" className="auth-btn">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        
        <div className="auth-switch">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              className="switch-btn"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;