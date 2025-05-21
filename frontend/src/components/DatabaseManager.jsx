import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import '../styles/DatabaseManager.css';

const DatabaseManager = () => {
  const { user, isAdmin } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedScan, setSelectedScan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({});

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Fetch data based on active tab
  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'users' || activeTab === 'scans') {
        const response = await api.get('/admin/users');
        setUsers(response.data);
      } else if (activeTab === 'appointments') {
        const response = await api.get('/admin/appointments');
        setAppointments(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  // Handle selecting a user
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      role: user.role || 'free',
      scansRemaining: user.scansRemaining || 0,
      newPassword: '',
      showPasswordField: false
    });
  };

  // Handle selecting an appointment
  const handleSelectAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      doctor: appointment.doctor,
      date: formatDateForInput(appointment.date),
      time: appointment.time,
      status: appointment.status
    });
  };

  // Handle selecting a scan from history
  const handleSelectScan = (scan, user) => {
    setSelectedUser(user);
    setSelectedScan(scan);
    setFormData({
      result: scan.result,
      confidence: scan.confidence,
      date: formatDateForInput(scan.date)
    });
  };
  // Format date for displaying
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format date for input fields
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle updating user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.put(`/admin/users/${selectedUser._id}`, formData);
      
      // Update local state
      setUsers(users.map(u => 
        u._id === selectedUser._id ? { ...u, ...formData } : u
      ));
      
      setSelectedUser({ ...selectedUser, ...formData });
      toast.success('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  // Handle updating appointment
  const handleUpdateAppointment = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if the status has changed
      const statusChanged = selectedAppointment.status !== formData.status;
      const originalStatus = selectedAppointment.status;
      
      // Send notification if status changed
      if (statusChanged) {
        // Add notification data to the request
        const notificationData = {
          type: 'appointment',
          message: `Your appointment on ${formatDate(selectedAppointment.date)} at ${selectedAppointment.time} has been ${formData.status}`,
          userId: selectedAppointment.userId
        };
        
        // Update with notification
        const response = await api.put(`/admin/appointments/${selectedAppointment._id}`, {
          ...formData,
          notification: notificationData
        });
      } else {
        // Regular update without notification
        const response = await api.put(`/admin/appointments/${selectedAppointment._id}`, formData);
      }
      
      // Update local state
      setAppointments(appointments.map(a => 
        a._id === selectedAppointment._id ? { ...a, ...formData } : a
      ));
      
      setSelectedAppointment({ ...selectedAppointment, ...formData });
      
      if (statusChanged) {
        toast.success(`Appointment updated and notification sent to patient. Status changed from ${originalStatus} to ${formData.status}`);
      } else {
        toast.success('Appointment updated successfully');
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle updating scan
  const handleUpdateScan = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.put(`/admin/scans/${selectedUser._id}/${selectedScan.id}`, formData);
      
      // Update local state
      const updatedUsers = users.map(u => {
        if (u._id === selectedUser._id) {
          const updatedScanHistory = u.scanHistory.map(scan => 
            scan.id === selectedScan.id ? { ...scan, ...formData } : scan
          );
          return { ...u, scanHistory: updatedScanHistory };
        }
        return u;
      });
      
      setUsers(updatedUsers);
      
      // Update selected user
      const updatedUser = updatedUsers.find(u => u._id === selectedUser._id);
      setSelectedUser(updatedUser);
      
      // Update selected scan
      const updatedScan = updatedUser.scanHistory.find(scan => scan.id === selectedScan.id);
      setSelectedScan(updatedScan);
      
      toast.success('Scan record updated successfully');
    } catch (error) {
      console.error('Error updating scan:', error);
      toast.error('Failed to update scan record. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter appointments based on search term
  const filteredAppointments = appointments.filter(appointment => 
    appointment.doctor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If not admin, redirect or show unauthorized message
  if (!isAdmin) {
    return (
      <div className="database-manager unauthorized">
        <h2>Unauthorized Access</h2>
        <p>You need administrator privileges to access this page.</p>
      </div>
    );
  }

  return (
    <div className="database-manager">
      <h1>Database Manager</h1>
      
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} 
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`} 
          onClick={() => setActiveTab('appointments')}
        >
          Appointments
        </button>
        <button 
          className={`tab-btn ${activeTab === 'scans' ? 'active' : ''}`} 
          onClick={() => setActiveTab('scans')}
        >
          Scan History
        </button>
      </div>
      
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>
      
      <div className="database-content">
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="content-area">
            {activeTab === 'users' && (
              <div className="user-management">
                <div className="list-panel">
                  <h2>Users</h2>
                  <div className="item-list">
                    {filteredUsers.map(user => (
                      <div 
                        key={user._id} 
                        className={`list-item ${selectedUser?._id === user._id ? 'active' : ''}`}
                        onClick={() => handleSelectUser(user)}
                      >
                        <div className="item-name">{user.first_name} {user.last_name} ({user.username})</div>
                        <div className="item-detail">{user.email}</div>
                        <div className="item-detail">Role: {user.role}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="detail-panel">
                  {selectedUser ? (
                    <div className="edit-form">
                      <h2>Edit User</h2>
                      <form onSubmit={handleUpdateUser}>
                        <div className="form-group">
                          <label>First Name</label>
                          <input 
                            type="text" 
                            name="first_name" 
                            value={formData.first_name} 
                            onChange={handleInputChange} 
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Last Name</label>
                          <input 
                            type="text" 
                            name="last_name" 
                            value={formData.last_name} 
                            onChange={handleInputChange} 
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Email</label>
                          <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleInputChange} 
                            disabled
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Phone</label>
                          <input 
                            type="text" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleInputChange} 
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Address</label>
                          <input 
                            type="text" 
                            name="address" 
                            value={formData.address} 
                            onChange={handleInputChange} 
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Role</label>
                          <select 
                            name="role" 
                            value={formData.role} 
                            onChange={handleInputChange}
                          >
                            <option value="free">Free</option>
                            <option value="premium">Premium</option>
                            <option value="doctor">Doctor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                          <div className="form-group">
                          <label>Scans Remaining</label>
                          <input 
                            type="number" 
                            name="scansRemaining" 
                            value={formData.scansRemaining} 
                            onChange={handleInputChange} 
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>
                            <input 
                              type="checkbox" 
                              checked={formData.showPasswordField} 
                              onChange={() => setFormData({
                                ...formData, 
                                showPasswordField: !formData.showPasswordField,
                                newPassword: ''
                              })} 
                              style={{ marginRight: '8px' }}
                            />
                            Change Password
                          </label>
                        </div>
                        
                        {formData.showPasswordField && (
                          <div className="form-group">
                            <label>New Password</label>
                            <input 
                              type="password" 
                              name="newPassword" 
                              value={formData.newPassword} 
                              onChange={handleInputChange} 
                              placeholder="Enter new password (min. 6 characters)"
                            />
                            <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                              Password must be at least 6 characters long
                            </small>
                          </div>
                        )}
                        
                        <button type="submit" className="update-btn">
                          Update User
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="no-selection">
                      <p>Select a user to edit</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'appointments' && (
              <div className="appointment-management">
                <div className="list-panel">
                  <h2>Appointments</h2>
                  <div className="item-list">
                    {filteredAppointments.map(appointment => (
                      <div 
                        key={appointment._id} 
                        className={`list-item ${selectedAppointment?._id === appointment._id ? 'active' : ''}`}
                        onClick={() => handleSelectAppointment(appointment)}
                      >
                        <div className="item-name">
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </div>
                        <div className="item-detail">Doctor: {appointment.doctor}</div>
                        <div className="item-detail">Status: {appointment.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="detail-panel">
                  {selectedAppointment ? (
                    <div className="edit-form">
                      <h2>Edit Appointment</h2>
                      <form onSubmit={handleUpdateAppointment}>
                        <div className="form-group">
                          <label>Doctor</label>
                          <input 
                            type="text" 
                            name="doctor" 
                            value={formData.doctor} 
                            onChange={handleInputChange} 
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Date</label>
                          <input 
                            type="date" 
                            name="date" 
                            value={formData.date} 
                            onChange={handleInputChange} 
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Time</label>
                          <input 
                            type="time" 
                            name="time" 
                            value={formData.time} 
                            onChange={handleInputChange} 
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Status</label>
                          <select 
                            name="status" 
                            value={formData.status} 
                            onChange={handleInputChange}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                        
                        <button type="submit" className="update-btn">
                          Update Appointment
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="no-selection">
                      <p>Select an appointment to edit</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'scans' && (
              <div className="scan-management">
                <div className="list-panel">
                  <h2>Users with Scans</h2>
                  <div className="item-list">
                    {filteredUsers
                      .filter(user => user.scanHistory && user.scanHistory.length > 0)
                      .map(user => (
                        <div key={user._id} className="list-item">
                          <div className="item-name">{user.first_name} {user.last_name}</div>
                          <div className="item-detail">{user.email}</div>
                          <div className="scan-list">
                            <strong>Scan History ({user.scanHistory.length}):</strong>
                            {user.scanHistory.map(scan => (
                              <div 
                                key={scan.id} 
                                className={`scan-item ${selectedScan?.id === scan.id ? 'active' : ''}`}
                                onClick={() => handleSelectScan(scan, user)}
                              >
                                <div>Result: {scan.result}</div>
                                <div>Date: {new Date(scan.date).toLocaleDateString()}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
                
                <div className="detail-panel">
                  {selectedScan ? (
                    <div className="edit-form">
                      <h2>Edit Scan Record</h2>
                      <form onSubmit={handleUpdateScan}>
                        <div className="form-group">
                          <label>Result</label>
                          <input 
                            type="text" 
                            name="result" 
                            value={formData.result} 
                            onChange={handleInputChange} 
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Confidence</label>
                          <input 
                            type="text" 
                            name="confidence" 
                            value={formData.confidence} 
                            onChange={handleInputChange} 
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Date</label>
                          <input 
                            type="date" 
                            name="date" 
                            value={formData.date} 
                            onChange={handleInputChange} 
                          />
                        </div>
                        
                        {selectedScan.imageUrl && (
                          <div className="form-group">
                            <label>Scan Image</label>
                            <div className="scan-image">
                              <img 
                                src={`/api/uploads/${selectedScan.imageUrl}`} 
                                alt="Scan" 
                              />
                            </div>
                          </div>
                        )}
                        
                        <button type="submit" className="update-btn">
                          Update Scan Record
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="no-selection">
                      <p>Select a scan to edit</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseManager;
