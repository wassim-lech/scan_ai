import React, { useState, useEffect } from 'react';
import '../styles/Toast.css';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onClose && onClose();
      }, 300); // Allow time for fade-out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast ${type} ${visible ? 'visible' : 'hidden'}`}>
      <div className="toast-content">
        {type === 'success' && <i className="fas fa-check-circle toast-icon"></i>}
        {type === 'error' && <i className="fas fa-exclamation-circle toast-icon"></i>}
        {type === 'info' && <i className="fas fa-info-circle toast-icon"></i>}
        <p>{message}</p>
      </div>
      <button className="toast-close" onClick={() => setVisible(false)}>
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default Toast;
