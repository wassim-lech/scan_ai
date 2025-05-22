import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute, RoleProtectedRoute } from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import AuthPage from './components/Authpage';
import UserProfile from './components/UserProfile';
import ScanPage from './components/ScanPage';
import AdminDashboard from './components/AdminDashboard';
import DatabaseManager from './components/DatabaseManager';
import DoctorDashboard from './components/DoctorDashboard';
import AppointmentForm from './components/AppointmentForm';
import About from './components/About';
import SingleStepAppointmentPage from './components/SingleStepAppointmentPage';
import AppointmentSuccessPage from './components/AppointmentSuccessPage';
import HelpPage from './components/HelpPage';
import SubscriptionPlans from './components/SubscriptionPlans';
import BillingPage from './components/BillingPage';
import PremiumSuccessPage from './components/PremiumSuccessPage';
import './styles/App.css';
import './styles/SingleStepAppointment.css';

// Layout component that includes header and footer
const StandardLayout = ({ children }) => (
  <>
    <Header />
    <main className="main-content">{children}</main>
    <Footer />
  </>
);

// Layout for admin pages without the header
const AdminLayout = ({ children }) => (
  <div className="admin-layout" style={{ padding: 0, margin: 0, width: '100%', height: '100vh' }}>{children}</div>
);

// Clean layout without header and footer for the scan page
const CleanLayout = ({ children }) => (
  <div className="clean-layout" style={{ padding: 0, margin: 0, width: '100%', height: '100vh' }}>
    <main>{children}</main>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <ToastProvider>
          <Router>
            <div className="app-container">
              <Routes>
              {/* Admin route with no header */}
              <Route 
                path="/admin" 
                element={
                  <RoleProtectedRoute roles={['admin']}>
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </RoleProtectedRoute>
                } 
              />
              
              {/* Doctor route with no header */}
              <Route 
                path="/doctor" 
                element={
                  <RoleProtectedRoute roles={['doctor']}>
                    <AdminLayout>
                      <DoctorDashboard />
                    </AdminLayout>
                  </RoleProtectedRoute>
                } 
              />
              
              {/* All other routes with standard header */}
              <Route path="/" element={<StandardLayout><LandingPage /></StandardLayout>} />
              <Route path="/auth" element={<CleanLayout><AuthPage /></CleanLayout>} />
              <Route path="/help" element={<StandardLayout><HelpPage /></StandardLayout>} />
              <Route path="/subscription" element={<StandardLayout><SubscriptionPlans /></StandardLayout>} />
              <Route path="/about" element={<StandardLayout><About /></StandardLayout>} />
              {/* Protected routes with standard header */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<StandardLayout><UserProfile /></StandardLayout>} />
                <Route path="/scan" element={<StandardLayout><ScanPage /></StandardLayout>} />
                <Route path="/appointment" element={<StandardLayout><SingleStepAppointmentPage /></StandardLayout>} />
                <Route path="/appointment/success" element={<StandardLayout><AppointmentSuccessPage /></StandardLayout>} />
                <Route path="/billing" element={<StandardLayout><BillingPage /></StandardLayout>} />
                <Route path="/premium-success" element={<StandardLayout><PremiumSuccessPage /></StandardLayout>} />
              </Route>
                
                {/* Fallback route */}
                <Route path="*" element={<StandardLayout><Navigate to="/" replace /></StandardLayout>} />              </Routes>
            </div>
          </Router>
        </ToastProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;