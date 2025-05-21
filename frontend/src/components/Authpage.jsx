import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import PasswordStrength from './PasswordStrength';
import '../styles/Auth.css';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, isAuthenticated, error } = useAuth();
  const toast = useToast();
  
  // Check if we're in signup mode from the URL state
  const [isLogin, setIsLogin] = useState(!(location.state?.isSignUp === true));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear error for this field when user types
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: ''
      });
    }
  };
    const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    
    if (isLogin) {
      if (!formData.email) errors.email = 'Email is required';
      else if (!emailRegex.test(formData.email)) errors.email = 'Please enter a valid email address';
      
      if (!formData.password) errors.password = 'Password is required';
    } else {
      if (!formData.username) errors.username = 'Username is required';
      if (!formData.firstName) errors.firstName = 'First name is required';
      if (!formData.lastName) errors.lastName = 'Last name is required';
      
      if (!formData.email) errors.email = 'Email is required';
      else if (!emailRegex.test(formData.email)) errors.email = 'Please enter a valid email address';
      
      if (!formData.password) errors.password = 'Password is required';
      if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
          if (!formData.phone) errors.phone = 'Phone number is required';
      else if (!phoneRegex.test(formData.phone)) errors.phone = 'Please enter a valid phone number';
      
      if (!formData.address) errors.address = 'Address is required';
      else if (formData.address.length > 200) errors.address = 'Address must be less than 200 characters';
    }
    
    return errors;
  };
    const handleSubmit = async (e) => {
    e.preventDefault();
      // Form validation
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Show first error as toast
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      return;
    }
    
    console.log("Submitting form:", isLogin ? "Login" : "Signup");
    console.log("Form data:", formData);
    
    setIsSubmitting(true);
    let success;
    try {
      if (isLogin) {
        // Just pass email and password for login
        success = await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        // Pass all fields for registration
        success = await register(formData);
      }
      
      console.log("Auth result:", success);
      
      if (success) {
        navigate('/profile');
      }
    } catch (err) {
      console.error("Auth error:", err);    } finally {
      setIsSubmitting(false);
    }
  };
  
  // This useEffect will run after the component is mounted and the DOM is available
  useEffect(() => {
    const addAccessibilityAttributes = () => {
      const formInputs = document.querySelectorAll('.auth-form input');
      formInputs.forEach(input => {
        const name = input.getAttribute('name');
        if (formErrors[name]) {
          input.setAttribute('aria-invalid', 'true');
        } else {
          input.setAttribute('aria-invalid', 'false');
        }
        input.setAttribute('aria-required', 'true');
      });
    };
      addAccessibilityAttributes();
  }, [formErrors]);
  
  return (
    <div className="auth-container">
      {/* Left side with image and welcome text */}
      <div className="auth-image-side">
        <div className="auth-welcome-content">
          <h1 className="auth-welcome-title">
            {isLogin ? 'Welcome back!' : 'Welcome to Smart Care'}
          </h1>
          <p className="auth-welcome-subtitle">
            The most advanced AI powered medical clinic
          </p>
        </div>
      </div>

      {/* Right side with form */}
      <div className="auth-form-side">
        <div className="auth-form-container">          <div className="auth-header">
            <h2>{isLogin ? 'Sign In' : 'Sign Up'}</h2>
            <p>{isLogin ? 'Sign in to your account' : 'Create your account'}</p>
          </div>
          
          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="form-group">
                  <label htmlFor="username">Username</label>                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose a username"
                      aria-required="true"
                      aria-invalid={!!formErrors.username}
                    />
                  {formErrors.username && <span className="error">{formErrors.username}</span>}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Your first name"
                      aria-required="true"
                      aria-invalid={!!formErrors.firstName}
                    />
                    {formErrors.firstName && <span className="error">{formErrors.firstName}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Your last name"
                      aria-required="true"
                      aria-invalid={!!formErrors.lastName}
                    />
                    {formErrors.lastName && <span className="error">{formErrors.lastName}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Your phone number"
                      aria-required="true"
                      aria-invalid={!!formErrors.phone}
                    />
                    {formErrors.phone && <span className="error">{formErrors.phone}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your email address"
                    />
                    {formErrors.email && <span className="error">{formErrors.email}</span>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Your address"
                  />
                  {formErrors.address && <span className="error">{formErrors.address}</span>}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="password">Password</label>                    <input
                      type={passwordVisible ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                    />
                    <button 
                      type="button" 
                      className="password-toggle"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      aria-label={passwordVisible ? "Hide password" : "Show password"}
                    >
                      <i className={`fas ${passwordVisible ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                    {!isLogin && <PasswordStrength password={formData.password} />}
                    {formErrors.password && <span className="error">{formErrors.password}</span>}
                  </div>
                  
                  <div className="form-group">                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      type={confirmPasswordVisible ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                    />
                    <button 
                      type="button" 
                      className="password-toggle"
                      onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                      aria-label={confirmPasswordVisible ? "Hide password" : "Show password"}
                    >
                      <i className={`fas ${confirmPasswordVisible ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                    {formErrors.confirmPassword && (
                      <span className="error">{formErrors.confirmPassword}</span>
                    )}
                  </div>
                </div>
              </>
            )}
            
            {isLogin && (
              <>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email address"
                  />
                  {formErrors.email && <span className="error">{formErrors.email}</span>}
                </div>
                  <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Your password"
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    aria-label={passwordVisible ? "Hide password" : "Show password"}
                  >
                    <i className={`fas ${passwordVisible ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                  {formErrors.password && <span className="error">{formErrors.password}</span>}
                </div></>
            )}
            
            <button type="submit" className="auth-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="loading-spinner"></span>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
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
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;