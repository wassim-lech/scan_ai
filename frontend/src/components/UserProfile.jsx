import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: user?.username || '', email: user?.email || '' });

  useEffect(() => {
    setFormData({ name: user?.username || '', email: user?.email || '' });
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <p>Tier: {user?.role}</p>
      <p>Scans Used: {user?.scanHistory.length} / {user?.role === 'premium' ? 5 : 1}</p>
      <p>Upcoming Appointments: {user?.appointments?.length || 0}</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <button type="submit">Save Changes</button>
      </form>
      <h3>Scan History</h3>
      <ul>
        {user?.scanHistory.map((scan, index) => (
          <li key={index}>{new Date(scan.date).toLocaleDateString()} - {scan.result}</li>
        ))}
      </ul>
      <h3>Appointment History</h3>
      <ul>
        {user?.appointments?.map((appt, index) => (
          <li key={index}>{new Date(appt.date).toLocaleDateString()} - {appt.time}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfile;