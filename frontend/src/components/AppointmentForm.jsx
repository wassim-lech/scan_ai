// src/components/AppointmentForm.jsx
import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import '../styles/AppointmentForm.css';

const AppointmentForm = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.username || '',
    email: user?.email || '',
    doctor: '',
    date: '',
    time: '',
    notes: '',
  });
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Fetch doctors list
  useEffect(() => {
    if (user?.role === 'premium') {
      setIsLoading(true);
      fetch('http://localhost:5001/api/dashboard/doctors', {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch doctors');
          }
          return response.json();
        })
        .then(data => {
          setDoctors(data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching doctors:', error);
          setIsLoading(false);
        });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Create appointment object
      const appointmentData = {
        userId: user._id,
        doctor: formData.doctor,
        date: formData.date,
        time: formData.time,
        notes: formData.notes
      };
      
      // Submit to backend
      const response = await fetch('http://localhost:5001/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(appointmentData),
      });
      
      if (response.ok) {
        setNotification({
          type: 'success',
          message: 'Appointment request submitted! You will be notified when it is confirmed.'
        });
        
        // Reset form
        setFormData({
          name: user?.username || '',
          email: user?.email || '',
          doctor: '',
          date: '',
          time: '',
          notes: ''
        });
      } else {
        const error = await response.json();
        setNotification({
          type: 'error',
          message: error.msg || 'Submission failed. Please try again.'
        });
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: 'Error submitting form. Please try again later.'
      });
      console.error('Error submitting appointment:', err);
    } finally {
      setIsLoading(false);
      
      // Clear notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };
  return (
    <div className="appointment-container">
      <h2>Book an Appointment</h2>
      
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
          <button onClick={() => setNotification(null)}>×</button>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            disabled
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="doctor">
            {user?.role === 'premium' ? 'Select Doctor' : 'Doctor Assignment'}
          </label>
          {user?.role === 'premium' ? (
            <select 
              id="doctor" 
              name="doctor" 
              value={formData.doctor} 
              onChange={handleChange}
              required
            >
              <option value="">Choose a doctor</option>
              {isLoading ? (
                <option disabled>Loading doctors...</option>
              ) : (
                doctors.map((doc) => (
                  <option key={doc.id} value={doc.name}>
                    {doc.name}
                  </option>
                ))
              )}
            </select>
          ) : (
            <input
              type="text"
              value="A doctor will be assigned to you"
              disabled
            />
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="date">Preferred Date</label>
          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="time">Preferred Time</label>
          <input
            id="time"
            name="time"
            type="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Additional Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>
        
        <button type="submit" className="form-button" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Appointment'}
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;