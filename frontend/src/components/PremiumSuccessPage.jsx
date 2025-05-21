import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Crown } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import '../styles/PremiumSuccess.css';

const PremiumSuccessPage = () => {
  const navigate = useNavigate();
  const { subscriptionStatus } = useSubscription();
  const firstName = localStorage.getItem('firstName') || 'User';
  
  useEffect(() => {
    // Check if user actually has premium, if not redirect to subscription page
    if (subscriptionStatus !== 'premium') {
      navigate('/subscription');
      return;
    }
    
    // Auto-redirect after 8 seconds
    const timer = setTimeout(() => {
      navigate('/scan');
    }, 8000);
    
    return () => clearTimeout(timer);
  }, [navigate, subscriptionStatus]);
  
  return (
    <div className="premium-success-container">
      <div className="success-card">
        <div className="premium-badge">
          <Crown /> PREMIUM
        </div>
        
        <div className="crown-icon">
          <div className="crown-gradient">
            <Crown size={64} />
          </div>
        </div>
        
        <h1 className="success-title">Welcome to Premium!</h1>
        
        <p className="success-message">
          Congratulations {firstName}! Your premium subscription is
          now active with all exclusive features unlocked.
        </p>
        
        <hr className="divider" />
        
        <div className="benefits-section">
          <h2 className="benefits-title">Premium Benefits</h2>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon blue">
                <Check />
              </div>
              <h3 className="benefit-name">5 AI Scans</h3>
              <p className="benefit-description">Enhanced accuracy detection</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon orange">
                <Check />
              </div>
              <h3 className="benefit-name">Direct Doctor Appointment</h3>
              <p className="benefit-description">Priority scheduling</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon orange">
                <Check />
              </div>
              <h3 className="benefit-name">Radiologist Review</h3>
              <p className="benefit-description">Expert review within 24h</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon blue">
                <Check />
              </div>
              <h3 className="benefit-name">Priority Support</h3>
              <p className="benefit-description">Fast-track assistance</p>
            </div>
          </div>
        </div>
        
        <div className="action-buttons">
          <button 
            className="action-button primary"
            onClick={() => navigate('/scan')}
          >
            Start Premium Scan
          </button>
          
          <button
            className="action-button secondary"
            onClick={() => navigate('/profile')}
          >
            View Premium Profile
          </button>
        </div>
        
        <p className="redirect-notice">
          Redirecting to home page in a few seconds...
        </p>
      </div>
    </div>
  );
};

export default PremiumSuccessPage;
