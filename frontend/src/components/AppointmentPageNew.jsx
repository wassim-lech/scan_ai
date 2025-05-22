import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Clock, Calendar, ArrowLeft, ArrowRight, CheckCircle, User, Mail, Phone, AlertCircle, X, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/AppointmentFormNew.css';

const AppointmentPageNew = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: '',
    time: ''
  });

  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];
  
  // Check authentication and pre-fill form if user is logged in
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Handle date selection
  const handleDateSelection = (e) => {
    setAppointmentDate(e.target.value);
    if (errors.date) setErrors({...errors, date: ''});
  };

  // Handle time slot selection
  const handleTimeSlotSelection = (time) => {
    setSelectedTimeSlot(time);
    if (errors.time) setErrors({...errors, time: ''});
  };

  // Validate form fields
  const validateStep = (step) => {
    let valid = true;
    const newErrors = {...errors};
    
    if (step === 1) {
      // Validate personal information fields
      if (!firstName.trim()) {
        newErrors.firstName = 'First name is required';
        valid = false;
      }
      
      if (!lastName.trim()) {
        newErrors.lastName = 'Last name is required';
        valid = false;
      }
      
      if (!email.trim()) {
        newErrors.email = 'Email is required';
        valid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        newErrors.email = 'Invalid email format';
        valid = false;
      }
      
      if (!phone.trim()) {
        newErrors.phone = 'Phone number is required';
        valid = false;
      }
    }
    
    if (step === 2) {
      // Validate date and time selection
      if (!appointmentDate) {
        newErrors.date = 'Please select a date';
        valid = false;
      }
      
      if (!selectedTimeSlot) {
        newErrors.time = 'Please select a time slot';
        valid = false;
      }
    }
    
    setErrors(newErrors);
    return valid;
  };

  // Handle next button click
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle previous button click
  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };  // Convert 12-hour time format (like "11:00 AM") to 24-hour format (like "11:00")
  const convertTo24HourFormat = (timeStr) => {
    if (!timeStr) return '';
    
    // Parse the time string
    const [timePart, modifier] = timeStr.split(' ');
    let [hours, minutes] = timePart.split(':');
    
    // Convert hours to number for manipulation
    hours = parseInt(hours, 10);
    
    // Convert to 24-hour format
    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
    
    // Format back to string, ensuring 2 digits
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }
    
    setLoading(true);
      // Convert time to 24-hour format
    const time24Format = convertTo24HourFormat(selectedTimeSlot);
    
    // Ensure date is in proper format (YYYY-MM-DD)
    let formattedDate = appointmentDate;
    if (appointmentDate) {
      try {
        const dateObj = new Date(appointmentDate);
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toISOString().split('T')[0];
        }
      } catch (error) {
        console.error('Error formatting date:', error);
      }
    }
    
    // Create appointment data
    const appointmentData = {
      doctor: "Dr. Smith", // You can allow selection of doctors in future
      date: formattedDate,
      time: time24Format,
      firstName,
      lastName,
      email,
      phone,
      reason: "General consultation" // This could be added as a field in the form
    };
    
    try {
      // Send appointment data to the backend
      const response = await fetch('http://localhost:5001/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({
          doctor: appointmentData.doctor,
          date: appointmentData.date,
          time: appointmentData.time,
          reason: appointmentData.reason
        })
      });
        if (!response.ok) {
        const errorData = await response.json().catch(() => ({ msg: 'Unknown error' }));
        console.error('Server error:', errorData);
        throw new Error(errorData.msg || 'Failed to create appointment');
      }
      
      const data = await response.json();
      console.log('Appointment created successfully:', data);
      
      // Navigate to success page
      navigate('/appointment/success', {
        state: {
          appointment: {
            id: data.appointment._id || 'app-' + Math.random().toString(36).substr(2, 9),
            date: appointmentDate,
            time: selectedTimeSlot
          },
          firstName,
          lastName,
          email,
          phone
        }
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert(`Booking failed: ${error.message || 'Unknown error occurred. Please try again.'}`);
      setErrors({
        ...errors,
        submit: `Failed to book appointment: ${error.message || 'Please try again.'}`
      });
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
    return (
    <div className="appointment-container">
      
      {/* Form content */}
      <form onSubmit={handleSubmit}>
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="form-section">
            <h2 className="personal-info-title">Personal Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (errors.firstName) setErrors({...errors, firstName: ''});
                  }}
                  placeholder="Enter your first name"
                  className={errors.firstName ? 'error' : ''}
                />
                {errors.firstName && <p className="error-message">{errors.firstName}</p>}
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (errors.lastName) setErrors({...errors, lastName: ''});
                  }}
                  placeholder="Enter your last name"
                  className={errors.lastName ? 'error' : ''}
                />
                {errors.lastName && <p className="error-message">{errors.lastName}</p>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({...errors, email: ''});
                  }}
                  placeholder="Enter your email"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <p className="error-message">{errors.email}</p>}
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors({...errors, phone: ''});
                  }}
                  placeholder="Enter your phone number"
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <p className="error-message">{errors.phone}</p>}
              </div>
            </div>
            
            <div className="form-navigation">
              <div></div>
              <button type="button" className="btn btn-primary" onClick={handleNext}>
                Next <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </div>
        )}
        
        {/* Step 2: Appointment Timing */}
        {currentStep === 2 && (
          <div className="form-section">
            <h2 className="personal-info-title">Select Appointment Time</h2>
              <div className="form-group">
              <label htmlFor="appointmentDate">Date</label>
              <input
                id="appointmentDate"
                type="date"
                min={getTodayDate()}
                value={appointmentDate}
                onChange={handleDateSelection}
                className={errors.date ? 'error' : ''}
              />
              {!appointmentDate && <p>Please select a date</p>}
              {errors.date && <p className="error-message">{errors.date}</p>}
            </div>
              <div className="form-group">
              <label>Time Slot</label>
              <div className="time-slots-grid">
                {timeSlots.map((time) => (
                  <div
                    key={time}
                    className={`time-slot ${selectedTimeSlot === time ? 'selected' : ''}`}
                    onClick={() => handleTimeSlotSelection(time)}
                  >
                    {time}
                  </div>
                ))}
              </div>
              {selectedTimeSlot ? null : <p>Please select a time slot</p>}
              {errors.time && <p className="error-message">{errors.time}</p>}
            </div>
            
            <div className="form-navigation">
              <button type="button" className="btn btn-outline" onClick={handlePrevious}>
                <ArrowLeft size={16} className="mr-2" /> Back
              </button>
              <button type="button" className="btn btn-primary" onClick={handleNext}>
                Next <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </div>
        )}
          {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <div className="form-section">
            <h2 className="personal-info-title">Confirm Appointment</h2>
            
            <div className="confirmation-details">
              <div className="confirmation-group">
                <div className="confirmation-label">
                  <User size={18} className="icon" /> Patient Name
                </div>
                <div className="confirmation-value">{firstName} {lastName}</div>
              </div>
              
              <div className="confirmation-group">
                <div className="confirmation-label">
                  <Mail size={18} className="icon" /> Email
                </div>
                <div className="confirmation-value">{email}</div>
              </div>
              
              <div className="confirmation-group">
                <div className="confirmation-label">
                  <Phone size={18} className="icon" /> Phone
                </div>
                <div className="confirmation-value">{phone}</div>
              </div>
                <div className="confirmation-group">
                <div className="confirmation-label">
                  <Calendar size={18} className="icon" /> Date
                </div>
                <div className="confirmation-value">
                  {appointmentDate ? (() => {
                    try {
                      return new Date(appointmentDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      });
                    } catch (err) {
                      console.error('Date formatting error:', err);
                      return appointmentDate; // Fallback to raw date string if formatting fails
                    }
                  })() : 'No date selected'}
                </div>
              </div>
              
              <div className="confirmation-group">
                <div className="confirmation-label">
                  <Clock size={18} className="icon" /> Time
                </div>
                <div className="confirmation-value">{selectedTimeSlot || '—'}</div>
              </div>
            </div>            <div className="form-navigation">
              <button type="button" className="btn btn-outline" onClick={handlePrevious}>
                <ArrowLeft size={16} className="mr-2" /> Back
              </button>
              <button 
                type="button" 
                className="confirm-booking-btn" 
                onClick={handleSubmit} 
                disabled={loading}
              >
                {loading ? (
                  <>Processing...</>
                ) : (
                  <>Confirm Booking <Check size={16} className="ml-2" /></>
                )}
              </button>
            </div>
            {errors.submit && (
              <div className="error-message" style={{ marginTop: '10px', textAlign: 'center' }}>
                {errors.submit}
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default AppointmentPageNew;
