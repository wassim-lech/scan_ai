import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import '../styles/SubscriptionPlans.css';

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  
  const handleGetPremium = () => {
    navigate('/billing');
  };
  
  const handleStartFree = () => {
    navigate('/scan');
  };
  
  return (
    <div className="subscription-container">
      <h2 className="section-title">Choose Your Plan</h2>
      <p className="section-subtitle">Select the plan that works best for your needs</p>
      
      <div className="plans-container">
        {/* Basic Plan */}
        <div className="plan-card">
          <div className="plan-header">
            <h3 className="plan-name">Basic Plan</h3>
            <p className="plan-audience">For one-timers and testers</p>
            <h2 className="plan-price">Free</h2>
          </div>
          
          <div className="plan-features">
            <div className="feature-item">
              <Check className="icon check" /> 
              <span>1 Scan</span>
            </div>
            <div className="feature-item">
              <Check className="icon check" /> 
              <span>Early Diagnosis</span>
            </div>
            <div className="feature-item">
              <Check className="icon check" /> 
              <span>Result Report</span>
            </div>
            <div className="feature-item">
              <X className="icon x" /> 
              <span>Direct Doctor Appointment</span>
            </div>
            <div className="feature-item">
              <X className="icon x" /> 
              <span>Priority Support</span>
            </div>
          </div>
          
          <button className="plan-button basic" onClick={handleStartFree}>Start Free Analysis</button>
        </div>
        
        {/* Premium Plan */}
        <div className="plan-card premium">
          <div className="recommended-badge">Recommended</div>
          <div className="plan-header">
            <h3 className="plan-name">Premium Plan</h3>
            <p className="plan-audience">Get the full treatment</p>
            <h2 className="plan-price">$23.77</h2>
          </div>
          
          <div className="plan-features">
            <div className="feature-item">
              <Check className="icon check" /> 
              <span>5 AI Scans</span>
            </div>
            <div className="feature-item">
              <Check className="icon check" /> 
              <span>Direct Doctor Appointment</span>
            </div>
            <div className="feature-item">
              <Check className="icon check" /> 
              <span>Direct Radiologist Review</span>
            </div>
            <div className="feature-item">
              <Check className="icon check" /> 
              <span>Priority Support</span>
            </div>
            <div className="feature-item">
              <Check className="icon check" /> 
              <span>Advanced Results Analysis</span>
            </div>
          </div>
          
          <button className="plan-button premium" onClick={handleGetPremium}>Get Premium</button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
