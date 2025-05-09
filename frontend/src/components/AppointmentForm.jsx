// src/components/AppointmentForm.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/AppointmentForm.css';

const AppointmentForm = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.username || '',
    email: user?.email || '',
    doctor: '',
    date: '',
    notes: '',
  });

  const doctors = [
    { id: 1, name: 'Dr. John Smith', specialty: 'Pulmonology' },
    { id: 2, name: 'Dr. Jane Doe', specialty: 'Radiology' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://formspree.io/f/xzzenrwv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Appointment request submitted!');
        setFormData({ name: '', email: '', doctor: '', date: '', notes: '' });
      } else {
        alert('Submission failed.');
      }
    } catch (err) {
      alert('Error submitting form.');
    }
  };

  return (
    <div className="appointment-container">
      <h2>Book an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
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
            required
          />
        </div>
        {user?.role === 'premium' && (
          <div className="form-group">
            <label htmlFor="doctor">Select Doctor</label>
            <select id="doctor" name="doctor" value={formData.doctor} onChange={handleChange}>
              <option value="">Choose a doctor</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.name}>
                  {doc.name} ({doc.specialty})
                </option>
              ))}
            </select>
          </div>
        )}
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
          <label htmlFor="notes">Additional Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="form-button">
          Submit Appointment
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;