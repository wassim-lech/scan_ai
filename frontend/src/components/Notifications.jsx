// src/components/Notifications.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Notifications.css';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user._id) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/users/notifications`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/users/notifications/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ status: 'read' })
      });

      if (!response.ok) {
        throw new Error('Failed to update notification');
      }

      // Update notifications locally
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification._id === notificationId 
            ? { ...notification, status: 'read' } 
            : notification
        )
      );
    } catch (err) {
      console.error('Error updating notification:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Group notifications by date
  const groupedNotifications = notifications.reduce((acc, notification) => {
    const date = new Date(notification.createdAt).toLocaleDateString('en-US');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(notification);
    return acc;
  }, {});

  if (isLoading) {
    return <div className="notifications-loading">Loading notifications...</div>;
  }

  if (error) {
    return <div className="notifications-error">{error}</div>;
  }

  if (notifications.length === 0) {
    return <div className="notifications-empty">No notifications yet</div>;
  }

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      
      {Object.keys(groupedNotifications).map(date => (
        <div key={date} className="notification-date-group">
          <h3 className="notification-date">{date}</h3>
          
          {groupedNotifications[date].map(notification => (
            <div 
              key={notification._id} 
              className={`notification-card ${notification.status === 'unread' ? 'unread' : ''}`}
              onClick={() => markAsRead(notification._id)}
            >
              <div className="notification-icon">
                {notification.type === 'appointment' && <i className="fas fa-calendar"></i>}
                {notification.type === 'scan' && <i className="fas fa-x-ray"></i>}
                {notification.type === 'system' && <i className="fas fa-bell"></i>}
              </div>
              
              <div className="notification-content">
                <p className="notification-message">{notification.message}</p>
                <span className="notification-time">{formatDate(notification.createdAt)}</span>
              </div>
              
              {notification.status === 'unread' && (
                <div className="notification-status"></div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Notifications;
