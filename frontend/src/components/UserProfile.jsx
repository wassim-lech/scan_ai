import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext, { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import '../styles/UserProfile.css';

const UserProfile = () => {  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const [userInfo, setUserInfo] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // State for appointments
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  
  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      setLoadingAppointments(true);
      const response = await api.get('/appointments');
      
      // Format the appointment data
      const formattedAppointments = response.data.map(apt => ({
        id: apt._id,
        date: new Date(apt.date).toLocaleDateString(),
        time: apt.time,
        doctor: apt.doctor,
        reason: apt.reason || 'General consultation',
        status: apt.status.charAt(0).toUpperCase() + apt.status.slice(1) // Capitalize status
      }));
      
      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({ type: 'error', message: 'Failed to load your appointments' });
    } finally {
      setLoadingAppointments(false);
    }
  };
  
  // Update userInfo when user data changes
  useEffect(() => {
    if (user) {
      setUserInfo(prev => ({
        ...prev,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      }));
    }
  }, [user]);
  
  // Fetch appointments when tab changes to appointments
  useEffect(() => {
    if (activeTab === 'appointments') {
      fetchAppointments();
    }
  }, [activeTab]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value
    });
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Get user's initials for avatar placeholder
  const getUserInitials = () => {
    return userInfo.firstName.charAt(0) + (userInfo.lastName ? userInfo.lastName.charAt(0) : '');
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form fields
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    
    if (userInfo.phone && !phoneRegex.test(userInfo.phone)) {
      toast.error('Please enter a valid phone number');
      return;
    }
    
    if (userInfo.address && userInfo.address.length > 200) {
      toast.error('Address must be less than 200 characters');
      return;
    }
    
    if (userInfo.newPassword && !userInfo.currentPassword) {
      toast.error('Current password is required to set a new password');
      return;
    }
    if (userInfo.newPassword && userInfo.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }
    
    if (userInfo.newPassword && userInfo.newPassword !== userInfo.confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Make API call to update user profile using the API utility
      const response = await api.put('/auth/profile', {
        first_name: userInfo.firstName,
        last_name: userInfo.lastName,
        phone: userInfo.phone,
        address: userInfo.address,
        // Only include password fields if user is trying to change password
        ...(userInfo.currentPassword && {
          current_password: userInfo.currentPassword,
          new_password: userInfo.newPassword
        })
      });
        if (response.status === 200) {
        toast.success('Profile information updated successfully!');
        
        // Refresh user data in context
        await refreshUser();
        
        // Clear password fields
        setUserInfo({
          ...userInfo,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error(`Failed to update profile: ${response.data?.msg || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating your profile.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const { logout } = useAuth();
    const handleLogout = () => {
    logout();
    navigate('/');
  };

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
              <span>{userInfo.firstName} {userInfo.lastName}</span>
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        </div>
      </div>
        
      <div className="profile-tabs-container">
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
        </div>
      </div>

      <div className="profile-content">
        {activeTab === 'profile' && (
          <div className="profile-info">
            <div className="profile-section avatar-section">
              <div className="section-content">
                <div className="avatar-container">
                  <div className="avatar">
                    {profileImage ? (
                      <img src={profileImage} alt="User avatar" />
                    ) : (
                      <div className="avatar-placeholder">
                        {getUserInitials()}
                      </div>
                    )}
                  </div>
                  <div className="avatar-info">
                    <h2>Howdy, {userInfo.firstName}!</h2>
                    <p>Last login <strong>12 mins ago</strong> from <strong>127.0.0.1</strong></p>
                    <span className="verified-badge">
                      <i className="fas fa-check-circle"></i> Verified
                    </span>
                  </div>
                </div>
                <div className="avatar-upload">
                  <h3>Avatar</h3>
                  <button className="upload-btn" onClick={triggerFileInput}>
                    <i className="fas fa-upload"></i> Upload
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    style={{ display: 'none' }} 
                    accept="image/*"
                  />
                  <p className="upload-info">Max 500kb</p>
                </div>
              </div>
            </div>
            <div className="profile-section">
              <h3>Personal Information</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <div className="input-with-icon">
                      <i className="fas fa-user input-icon"></i>
                      <input 
                        type="text" 
                        id="firstName" 
                        name="firstName" 
                        value={userInfo.firstName} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    <p className="input-help">Required. Your first name</p>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <div className="input-with-icon">
                      <i className="fas fa-user input-icon"></i>
                      <input 
                        type="text" 
                        id="lastName" 
                        name="lastName" 
                        value={userInfo.lastName} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    <p className="input-help">Required. Your last name</p>
                  </div>
                </div>
                  <div className="form-row">
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
                    <label htmlFor="phone">Phone Number</label>
                    <div className="input-with-icon">
                      <i className="fas fa-phone input-icon"></i>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        value={userInfo.phone} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    <p className="input-help">Optional. Your phone number</p>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <div className="input-with-icon">
                    <i className="fas fa-map-marker-alt input-icon"></i>
                    <input 
                      type="text" 
                      id="address" 
                      name="address" 
                      value={userInfo.address} 
                      onChange={handleInputChange}
                    />
                  </div>
                  <p className="input-help">Optional. Your address</p>
                </div>
              
                <div className="password-section">
                  <h3>Password Management</h3>
                  
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
                    <p className="input-help">Required to change password</p>
                  </div>
                  
                  <div className="form-row">
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
                      <p className="input-help">Leave blank if not changing</p>
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
                      <p className="input-help">Must match new password</p>
                    </div>
                  </div>                </div>
                
                <div className="form-actions">
                  <button type="submit" className="save-btn" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="loading-spinner"></span>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                  <button type="button" className="logout-btn" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="table-container">            <div className="table-header">
              <h3>Your Appointments</h3>
              <button className="book-btn" onClick={() => navigate('/appointment')}>
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
              </thead>              <tbody>
                {loadingAppointments ? (
                  <tr>
                    <td colSpan="6" className="loading-cell">
                      <div className="loading-spinner"></div>
                      <span>Loading your appointments...</span>
                    </td>
                  </tr>
                ) : appointments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-message">
                      <p>You don't have any appointments yet.</p>
                      <Link to="/appointment" className="book-link">
                        Book your first appointment
                      </Link>
                    </td>
                  </tr>
                ) : (
                  appointments.map(appointment => (
                    <tr key={appointment.id}>
                      <td>{appointment.date}</td>
                      <td>{appointment.time}</td>
                      <td>{appointment.doctor}</td>
                      <td>{appointment.reason}</td>
                      <td>
                        <span className={`status-pill ${
                          appointment.status === 'Confirmed' ? 'status-blue' : 
                          appointment.status === 'Completed' ? 'status-green' :
                          appointment.status === 'Cancelled' ? 'status-red' :
                          'status-yellow'
                        }`}>
                          {appointment.status}
                        </span>
                      </td>                      <td>
                        <button 
                          className="action-btn view-btn" 
                          title="View Appointment Details"
                          onClick={() => {
                            // Create detailed view in a popup or navigate to detailed view
                            toast.info(`Viewing details for appointment on ${appointment.date}`);
                          }}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button 
                          className="action-btn edit-btn"
                          title="Edit Appointment"
                          onClick={() => navigate('/appointment', { state: { appointmentToEdit: appointment } })}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="action-btn delete-btn"
                          title="Cancel Appointment"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to cancel this appointment?')) {
                              toast.info('Appointment cancellation feature will be available soon');
                            }
                          }}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'scan-history' && (
          <div className="table-container">            <div className="table-header">
              <h3>Your Scan History</h3>
              <button className="upload-scan-btn" onClick={() => navigate('/scan')}>
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
                    <td>{scan.doctor}</td>                    <td>
                      <button 
                        className="action-btn view-btn"
                        title="View Scan Details" 
                        onClick={() => {
                          navigate('/scan', { 
                            state: { 
                              view: 'history',
                              selectedScan: scan 
                            } 
                          });
                        }}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button 
                        className="action-btn download-btn"
                        title="Download Scan" 
                        onClick={() => {
                          navigate('/scan', { 
                            state: { 
                              view: 'history',
                              selectedScan: scan,
                              downloadPdf: true
                            } 
                          });
                        }}
                      >
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