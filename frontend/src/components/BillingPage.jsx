import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import '../styles/BillingPage.css';

const BillingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { upgradeToPremium } = useSubscription();
  
  // Initialize form with user data if available
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    
    // Card validation
    if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) 
      newErrors.cardNumber = 'Card number must be 16 digits';
      
    if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
    else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate))
      newErrors.expiryDate = 'Use format MM/YY';
      
    if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
    else if (!/^\d{3,4}$/.test(formData.cvv))
      newErrors.cvv = 'CVV must be 3 or 4 digits';
      
    if (!formData.cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const formatCardNumber = (e) => {
    let { value } = e.target;
    value = value.replace(/\D/g, ''); // Remove non-digits
    value = value.replace(/(.{4})/g, '$1 ').trim(); // Add space every 4 digits
    
    setFormData({
      ...formData,
      cardNumber: value.substring(0, 19) // Limit to 16 digits + 3 spaces
    });
  };
  
  const formatExpiryDate = (e) => {
    let { value } = e.target;
    value = value.replace(/\D/g, ''); // Remove non-digits
    
    if (value.length > 2) {
      value = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    }
    
    setFormData({
      ...formData,
      expiryDate: value
    });
  };
    const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      
      // Simulate API call with timeout
      setTimeout(() => {
        // Update subscription through context
        upgradeToPremium();
        
        // Save user's first name for success page
        localStorage.setItem('firstName', formData.firstName);
        
        // Redirect to success page
        navigate('/premium-success');
        setLoading(false);
      }, 1500);
    }
  };
  
  return (
    <div className="billing-container">
      <div className="billing-card">
        <div className="billing-header">
          <h2>Complete Your Purchase</h2>
          <p>Premium Plan - $23.77</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={errors.firstName ? 'error' : ''}
                />
                {errors.firstName && <p className="error-message">{errors.firstName}</p>}
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={errors.lastName ? 'error' : ''}
                />
                {errors.lastName && <p className="error-message">{errors.lastName}</p>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <p className="error-message">{errors.email}</p>}
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <p className="error-message">{errors.phone}</p>}
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Payment Details</h3>
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={formatCardNumber}
                maxLength="19"
                className={errors.cardNumber ? 'error' : ''}
              />
              {errors.cardNumber && <p className="error-message">{errors.cardNumber}</p>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={formatExpiryDate}
                  maxLength="5"
                  className={errors.expiryDate ? 'error' : ''}
                />
                {errors.expiryDate && <p className="error-message">{errors.expiryDate}</p>}
              </div>
              
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  maxLength="4"
                  className={errors.cvv ? 'error' : ''}
                />
                {errors.cvv && <p className="error-message">{errors.cvv}</p>}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="cardholderName">Cardholder Name</label>
              <input
                type="text"
                id="cardholderName"
                name="cardholderName"
                placeholder="Name as it appears on card"
                value={formData.cardholderName}
                onChange={handleInputChange}
                className={errors.cardholderName ? 'error' : ''}
              />
              {errors.cardholderName && <p className="error-message">{errors.cardholderName}</p>}
            </div>
          </div>
          
          <div className="billing-summary">
            <h3>Order Summary</h3>
            <div className="summary-item">
              <span>Premium Plan</span>
              <span>$23.77</span>
            </div>
            <div className="summary-item total">
              <span>Total</span>
              <span>$23.77</span>
            </div>
          </div>
          
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? (
              <div className="loading-spinner"></div>
            ) : 'Complete Purchase'}
          </button>
          
          <p className="secure-notice">
            <span className="lock-icon">🔒</span> Your payment information is secure and encrypted
          </p>
        </form>
      </div>
    </div>
  );
};

export default BillingPage;
