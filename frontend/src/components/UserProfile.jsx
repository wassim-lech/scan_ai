import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/UserProfile.css';
const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'doe.doe.doe@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle the form submission
    alert('Profile information updated!');
  };

  // Mock data for appointments
  const appointments = [
    { id: 1, date: 'May 15, 2025', time: '10:30 AM', doctor: 'Dr. Smith', reason: 'X-ray Follow-up', status: 'Confirmed' },
    { id: 2, date: 'Jun 02, 2025', time: '09:00 AM', doctor: 'Dr. Johnson', reason: 'Regular Checkup', status: 'Pending' },
    { id: 3, date: 'Jun 18, 2025', time: '02:15 PM', doctor: 'Dr. Martinez', reason: 'Lung Examination', status: 'Confirmed' }
  ];

  // Mock data for scan history
  const scanHistory = [
    { id: 1, date: 'Apr 10, 2025', type: 'Chest X-ray', result: 'Healthy', doctor: 'Dr. Lee' },
    { id: 2, date: 'Feb 22, 2025', type: 'Chest X-ray', result: 'Pneumonia', doctor: 'Dr. Johnson' },
    { id: 3, date: 'Jan 05, 2025', type: 'Chest X-ray', result: 'Healthy', doctor: 'Dr. Smith' },
    { id: 4, date: 'Oct 18, 2024', type: 'Chest X-ray', result: 'Healthy', doctor: 'Dr. Martinez' }
  ];

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <div className="header-content">
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
          </div>
          <div className="user-actions">
            <div className="notifications">
              <i className="fas fa-bell"></i>
            </div>
            <div className="user-info">
              <span>{userInfo.name}</span>
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        </div>
        
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fas fa-user"></i> Profile
          </button>
          <button 
            className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <i className="fas fa-calendar-check"></i> Appointments
          </button>
          <button 
            className={`tab-btn ${activeTab === 'scan-history' ? 'active' : ''}`}
            onClick={() => setActiveTab('scan-history')}
          >
            <i className="fas fa-x-ray"></i> Scan History
          </button>
          <button className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>

      <div className="profile-content">
        {activeTab === 'profile' && (
          <div className="profile-info">
            <div className="profile-section avatar-section">
              <div className="section-content">
                <div className="avatar-container">
                  <div className="avatar">
                    <img src="https://via.placeholder.com/150" alt="User avatar" />
                  </div>
                  <div className="avatar-info">
                    <h2>Howdy, {userInfo.name}!</h2>
                    <p>Last login <strong>12 mins ago</strong> from <strong>127.0.0.1</strong></p>
                    <span className="verified-badge">
                      <i className="fas fa-check-circle"></i> Verified
                    </span>
                  </div>
                </div>
                <div className="avatar-upload">
                  <h3>Avatar</h3>
                  <button className="upload-btn">
                    <i className="fas fa-upload"></i> Upload
                  </button>
                  <p className="upload-info">Max 500kb</p>
                </div>
              </div>
            </div>
            <div className="profile-section">
              <h3>Personal Information</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <div className="input-with-icon">
                    <i className="fas fa-user input-icon"></i>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={userInfo.name} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <p className="input-help">Required. Your name</p>
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">E-mail</label>
                  <div className="input-with-icon">
                    <i className="fas fa-envelope input-icon"></i>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={userInfo.email} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <p className="input-help">Required. Your e-mail</p>
                </div>

                <div className="form-group">
                  <label htmlFor="currentPassword">Current password</label>
                  <div className="input-with-icon">
                    <i className="fas fa-lock input-icon"></i>
                    <input 
                      type="password" 
                      id="currentPassword" 
                      name="currentPassword" 
                      value={userInfo.currentPassword} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <p className="input-help">Required. Your current password</p>
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">New password</label>
                  <div className="input-with-icon">
                    <i className="fas fa-lock input-icon"></i>
                    <input 
                      type="password" 
                      id="newPassword" 
                      name="newPassword" 
                      value={userInfo.newPassword} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <p className="input-help">Required. New password</p>
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm password</label>
                  <div className="input-with-icon">
                    <i className="fas fa-lock input-icon"></i>
                    <input 
                      type="password" 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      value={userInfo.confirmPassword} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <p className="input-help">Required. New password one more time</p>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="save-btn">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="table-container">
            <div className="table-header">
              <h3>Your Appointments</h3>
              <button className="book-btn">
                <i className="fas fa-plus"></i> Book New Appointment
              </button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Doctor</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(appointment => (
                  <tr key={appointment.id}>
                    <td>{appointment.date}</td>
                    <td>{appointment.time}</td>
                    <td>{appointment.doctor}</td>
                    <td>{appointment.reason}</td>
                    <td>
                      <span className={`status-pill ${appointment.status === 'Confirmed' ? 'status-blue' : 'status-yellow'}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn view-btn">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="action-btn edit-btn">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="action-btn delete-btn">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'scan-history' && (
          <div className="table-container">
            <div className="table-header">
              <h3>Your Scan History</h3>
              <button className="upload-scan-btn">
                <i className="fas fa-upload"></i> Upload New Scan
              </button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Scan Type</th>
                  <th>Result</th>
                  <th>Doctor</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {scanHistory.map(scan => (
                  <tr key={scan.id}>
                    <td>{scan.date}</td>
                    <td>{scan.type}</td>
                    <td>
                      <span className={`status-pill ${scan.result === 'Healthy' ? 'status-green' : 'status-red'}`}>
                        {scan.result}
                      </span>
                    </td>
                    <td>{scan.doctor}</td>
                    <td>
                      <button className="action-btn view-btn">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="action-btn download-btn">
                        <i className="fas fa-download"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;