import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import '../styles/CompactSubscription.css';

const CompactSubscription = () => {
  const navigate = useNavigate();
  const { subscriptionStatus, scansRemaining } = useSubscription();
  
  const handleUpgrade = () => {
    navigate('/subscription');
  };
  
  if (subscriptionStatus === 'premium') {
    return (
      <div className="compact-subscription premium-active">
        <div className="compact-status">
          <div className="badge premium-badge">Premium</div>
          <div className="scans-info">
            <span className="scans-count">{scansRemaining}</span> scans remaining
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="compact-subscription">
      <div className="compact-content">
        <div className="compact-message">
          <h4>Running low on scans?</h4>
          <p>Upgrade to Premium for 5 AI scans and priority support</p>
        </div>
        <button className="upgrade-button" onClick={handleUpgrade}>
          Upgrade Now
        </button>
      </div>
      
      <div className="compact-features">
        <div className="feature">
          <Check size={16} className="check-icon" />
          <span>5 AI Scans</span>
        </div>
        <div className="feature">
          <Check size={16} className="check-icon" />
          <span>Direct Doctor Review</span>
        </div>
      </div>
    </div>
  );
};

export default CompactSubscription;
