import React from 'react';
import '../styles/PasswordStrength.css';

const PasswordStrength = ({ password }) => {
  // Calculate password strength
  const getStrength = (password) => {
    let score = 0;
    
    // Add length score
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Add complexity score
    if (/[A-Z]/.test(password)) score += 1; // Has uppercase
    if (/[a-z]/.test(password)) score += 1; // Has lowercase
    if (/[0-9]/.test(password)) score += 1; // Has number
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special char
    
    return score;
  };
  
  const strength = password ? getStrength(password) : 0;
  
  const getStrengthLabel = (strength) => {
    if (strength === 0) return '';
    if (strength < 3) return 'Weak';
    if (strength < 5) return 'Medium';
    return 'Strong';
  };
  
  const getStrengthClass = (strength) => {
    if (strength === 0) return '';
    if (strength < 3) return 'weak';
    if (strength < 5) return 'medium';
    return 'strong';
  };
  
  // Don't show anything if password field is empty
  if (!password) return null;
  
  return (
    <div className="password-strength-container">
      <div className="password-strength-bars">
        <div className={`strength-bar ${strength >= 1 ? getStrengthClass(strength) : ''}`}></div>
        <div className={`strength-bar ${strength >= 2 ? getStrengthClass(strength) : ''}`}></div>
        <div className={`strength-bar ${strength >= 3 ? getStrengthClass(strength) : ''}`}></div>
        <div className={`strength-bar ${strength >= 4 ? getStrengthClass(strength) : ''}`}></div>
        <div className={`strength-bar ${strength >= 5 ? getStrengthClass(strength) : ''}`}></div>
        <div className={`strength-bar ${strength >= 6 ? getStrengthClass(strength) : ''}`}></div>
      </div>
      <span className={`strength-text ${getStrengthClass(strength)}`}>
        {getStrengthLabel(strength)}
      </span>
    </div>
  );
};

export default PasswordStrength;
