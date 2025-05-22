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
  } else if (subscriptionStatus === 'unlimited') {
    return (
      <div className="compact-subscription unlimited-active">
        <div className="compact-status">
          <div className="badge unlimited-badge">Unlimited</div>
          <div className="scans-info">
            Unlimited access
          </div>
        </div>
      </div>
    );
  } else if (subscriptionStatus === 'free') {
    return (
      <div className="compact-subscription free-active">
        <div className="compact-status">
          <div className="badge free-badge">Free</div>
          <div className="scans-info">
            <span className="scans-count">{scansRemaining}</span> scan{scansRemaining !== 1 ? 's' : ''} remaining
          </div>
        </div>
        
        <div className="compact-content">
          <div className="compact-message">
            <h4>Running low on scans?</h4>
            <p>Upgrade to Premium for 5 AI scans and priority support</p>
          </div>
          <button className="upgrade-button" onClick={handleUpgrade}>
            Upgrade Now
          </button>
        </div>
      </div>
    );
  }
};

export default CompactSubscription;
