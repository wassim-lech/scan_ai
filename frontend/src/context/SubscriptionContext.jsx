import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const SubscriptionContext = createContext();

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }) => {  // Default to free with 1 scan
  const [subscriptionStatus, setSubscriptionStatus] = useState('free');
  const [subscriptionDate, setSubscriptionDate] = useState(null);
  const [scansRemaining, setScansRemaining] = useState(1);
  const loadUserSubscription = async () => {
    try {
      // Get subscription data from backend to ensure it's up to date
      const token = localStorage.getItem('token');
      if (token) {
        const res = await api.get('/auth/user');
        const userData = res.data;
        
        // Set subscription status based on user role
        if (userData.role === 'premium') {
          setSubscriptionStatus('premium');
          setScansRemaining(userData.scansRemaining || 5);
          localStorage.setItem('subscriptionStatus', 'premium');
        } else if (userData.role === 'free') {
          setSubscriptionStatus('free');
          setScansRemaining(userData.scansRemaining || 1);
          localStorage.setItem('subscriptionStatus', 'free');
        } else if (userData.role === 'doctor' || userData.role === 'admin') {
          setSubscriptionStatus('unlimited');
          setScansRemaining(999);
          localStorage.setItem('subscriptionStatus', 'unlimited');
        }
        
        if (userData.subscriptionDate) {
          setSubscriptionDate(new Date(userData.subscriptionDate));
          localStorage.setItem('subscriptionDate', userData.subscriptionDate);
        }
      }
    } catch (err) {
      console.error('Error loading user subscription:', err);
      // Fallback to localStorage if API call fails
      const storedStatus = localStorage.getItem('subscriptionStatus');
      const storedDate = localStorage.getItem('subscriptionDate');
      
      if (storedStatus) {
        setSubscriptionStatus(storedStatus);
        
        // Set scans remaining based on subscription status
        if (storedStatus === 'premium') {
          setScansRemaining(5);
        } else if (storedStatus === 'free') {
          setScansRemaining(1);
        } else if (storedStatus === 'unlimited') {
          setScansRemaining(999);
        }
      }
      
      if (storedDate) {
        setSubscriptionDate(new Date(storedDate));
      }
    }
  };
  
  useEffect(() => {
    loadUserSubscription();
  }, []);  const upgradeToPremium = () => {
    setSubscriptionStatus('premium');
    setScansRemaining(5);
    setSubscriptionDate(new Date());
    
    // Save to localStorage
    localStorage.setItem('subscriptionStatus', 'premium');
    localStorage.setItem('subscriptionDate', new Date().toISOString());
    
    // Reload user subscription data from backend to ensure consistency
    loadUserSubscription();
  };
  const decrementScan = async () => {
    if (scansRemaining > 0) {
      const newRemaining = scansRemaining - 1;
      setScansRemaining(newRemaining);
      
      // After scan is processed, reload user data to ensure scan count is synced with backend
      try {
        // Small delay to ensure backend processing completes
        setTimeout(async () => {
          await loadUserSubscription();
        }, 1500);
      } catch (error) {
        console.error('Error refreshing user data after scan:', error);
      }
      
      return true;
    }
    return false;
  };
  
  const resetScans = () => {
    if (subscriptionStatus === 'premium') {
      setScansRemaining(5);
    } else {
      setScansRemaining(1);
    }
  };
  return (
    <SubscriptionContext.Provider 
      value={{ 
        subscriptionStatus, 
        subscriptionDate, 
        scansRemaining, 
        upgradeToPremium, 
        decrementScan,
        resetScans 
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionContext;
