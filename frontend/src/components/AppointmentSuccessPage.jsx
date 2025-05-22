import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, User, ArrowLeft, Award, FileText, MapPin, Mail, Phone } from 'lucide-react';
import '../styles/AppointmentSuccessPage.css';

// Temporary Button component replacement
const Button = ({ children, className, onClick, variant, size, asChild, ...props }) => {
  return (
    <button
      className={`btn ${className || ''}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const AppointmentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();  const { 
    appointment, 
    message,
    firstName, 
    lastName, 
    email, 
    phone, 
    appointmentDate, 
    selectedTimeSlot,
    selectedDoctor,
    appointmentPurpose,
    doctorEmail,
    doctorSpecialty
  } = location.state || {};
  
  // Format date for display
  const getFormattedDate = (dateString) => {
    if (!dateString) return 'Not specified';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="appointment-success-container">
      <div className="background-pattern"></div>
      
      <div className="success-header">
        <div className="success-icon">
          <CheckCircle size={40} className="check-icon" />
        </div>
        <h1>Appointment Confirmed!</h1>
        <p className="success-message">
          {message || 'Your appointment has been successfully scheduled. A confirmation email has been sent to your inbox.'}
        </p>
      </div>
      
      <div className="appointment-card">
        <div className="card-header">
          <div className="header-left">
            <h2>Appointment Details</h2>
            <span className="status-pill status-green">Confirmed</span>
          </div>
          <div className="header-right">
            <Award className="badge-icon" />
            <span>Smart-Care Clinic</span>
          </div>
        </div>
        
        <div className="card-content">
          <div className="info-row">
            <div className="info-item">
              <div className="info-icon">
                <Calendar />
              </div>
              <div className="info-text">
                <span className="label">Date</span>
                <span className="value">{getFormattedDate(appointmentDate)}</span>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">
                <Clock />
              </div>
              <div className="info-text">
                <span className="label">Time</span>
                <span className="value">{selectedTimeSlot || 'Not specified'}</span>
              </div>
            </div>
          </div>
          
          <div className="info-row">
            <div className="info-item">
              <div className="info-icon">
                <User />
              </div>
              <div className="info-text">
                <span className="label">Patient</span>
                <span className="value">{firstName} {lastName}</span>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">
                <FileText />
              </div>
              <div className="info-text">
                <span className="label">Reference</span>
                <span className="value">#{appointment?.id?.substring(0, 8) || '000-0000'}</span>
              </div>
            </div>
          </div>
          
          <div className="info-row">
            <div className="info-item">
              <div className="info-icon">
                <Mail />
              </div>
              <div className="info-text">
                <span className="label">Email</span>
                <span className="value">{email || 'Not provided'}</span>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">
                <Phone />
              </div>
              <div className="info-text">
                <span className="label">Phone</span>
                <span className="value">{phone || 'Not provided'}</span>
              </div>
            </div>
          </div>
          
          <div className="info-row">
            <div className="info-item">
              <div className="info-icon">
                <MapPin />
              </div>
              <div className="info-text">
                <span className="label">Location</span>
                <span className="value">Smart-Care Main Clinic</span>
              </div>
            </div>
              <div className="info-item">
              <div className="info-icon">
                <i className="fas fa-user-md" style={{ width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}></i>
              </div>
              <div className="info-text">
                <span className="label">Doctor</span>
                <span className="value">
                  {appointment?.doctor || selectedDoctor || 'Not assigned yet'}
                  {appointment?.doctorSpecialty || doctorSpecialty ? 
                    <span className="specialty-tag"> ({appointment?.doctorSpecialty || doctorSpecialty})</span> : ''
                  }
                </span>
              </div>
            </div>
          </div>
          
          <div className="info-row">
            <div className="info-item">
              <div className="info-icon">
                <i className="fas fa-clipboard-list" style={{ width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}></i>
              </div>
              <div className="info-text">
                <span className="label">Purpose</span>
                <span className="value">{appointmentPurpose || 'General consultation'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card-footer">
          <div className="appointment-note">
            <p>Please arrive 15 minutes before your scheduled time. If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
          </div>
          
          <div className="action-buttons">
            <button 
              className="action-btn secondary-btn"
              onClick={() => navigate('/appointment')}
            >
              <ArrowLeft className="btn-icon" />
              Book Another Appointment
            </button>
            
            <button 
              className="action-btn primary-btn"
              onClick={() => navigate('/')}
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSuccessPage;
