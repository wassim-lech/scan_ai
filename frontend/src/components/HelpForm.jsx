// src/components/HelpForm.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/HelpForm.css';

const HelpForm = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/help', formData);
      alert(response.data.msg);
      setFormData({ subject: '', message: '' });
    } catch (err) {
      alert(err.response?.data?.msg || 'Error submitting help request');
    }
  };

  return (
    <div className="help-container">
      <h2>Help & Support</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="form-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default HelpForm;