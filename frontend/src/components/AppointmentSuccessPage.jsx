import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, User, ArrowLeft } from 'lucide-react';

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
  const navigate = useNavigate();
  const { firstName, lastName, email, phone, appointmentDate, selectedTimeSlot } = location.state || {};
  
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
    <div className="min-h-screen flex flex-col">
      <div className="background-pattern"></div>
      
      <main className="flex-grow pt-20 pb-20 px-6">
        <div className="max-w-2xl mx-auto my-12">
          <div className="neuro-card p-8 md:p-12 shadow-xl rounded-2xl text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Appointment Confirmed!
            </h1>
            
            <p className="text-gray-600 mb-8">
              Your appointment has been successfully scheduled. A confirmation email has been sent to your inbox.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="font-medium text-lg mb-4 text-gray-700">Appointment Details</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center text-gray-500 mb-1">
                    <User className="h-4 w-4 mr-2" />
                    <span>Patient</span>
                  </div>
                  <p className="font-medium">{firstName} {lastName}</p>
                </div>
                
                <div>
                  <div className="flex items-center text-gray-500 mb-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Date</span>
                  </div>
                  <p className="font-medium">{getFormattedDate(appointmentDate)}</p>
                </div>
                
                <div>
                  <div className="flex items-center text-gray-500 mb-1">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Time</span>
                  </div>
                  <p className="font-medium">{selectedTimeSlot || 'Not specified'}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/appointment')}
                className="flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Book Another Appointment
              </Button>
              
              <Button 
                onClick={() => navigate('/')}
                className="flex items-center justify-center"
              >
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppointmentSuccessPage;
