import React, { createContext, useState, useContext, useEffect } from 'react';

const SubscriptionContext = createContext();

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState('free');
  const [subscriptionDate, setSubscriptionDate] = useState(null);
  const [scansRemaining, setScansRemaining] = useState(1);

  useEffect(() => {
    // Load subscription status from localStorage on initial render
    const storedStatus = localStorage.getItem('subscriptionStatus');
    const storedDate = localStorage.getItem('subscriptionDate');
    
    if (storedStatus) {
      setSubscriptionStatus(storedStatus);
      
      // Set scans remaining based on subscription status
      if (storedStatus === 'premium') {
        setScansRemaining(5);
      } else {
        setScansRemaining(1);
      }
    }
    
    if (storedDate) {
      setSubscriptionDate(new Date(storedDate));
    }
  }, []);
  const upgradeToPremium = () => {
    setSubscriptionStatus('premium');
    setScansRemaining(5);
    setSubscriptionDate(new Date());
    
    // Save to localStorage
    localStorage.setItem('subscriptionStatus', 'premium');
    localStorage.setItem('subscriptionDate', new Date().toISOString());
  };
  
  const decrementScan = () => {
    if (scansRemaining > 0) {
      const newRemaining = scansRemaining - 1;
      setScansRemaining(newRemaining);
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
