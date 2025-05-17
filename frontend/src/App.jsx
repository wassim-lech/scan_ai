import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, RoleProtectedRoute } from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import AuthPage from './components/Authpage';
import UserProfile from './components/UserProfile';
import ScanPage from './components/ScanPage';
import AdminDashboard from './components/AdminDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import AppointmentForm from './components/AppointmentForm';
import HelpPage from './components/HelpPage';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/help" element={<HelpPage />} />
              
              {/* Protected routes (require authentication) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/scan" element={<ScanPage />} />
                <Route path="/appointment" element={<AppointmentForm />} />
              </Route>
              
              {/* Admin-only routes */}
              <Route 
                path="/admin" 
                element={<RoleProtectedRoute roles={['admin']}><AdminDashboard /></RoleProtectedRoute>} 
              />
              
              {/* Doctor-only routes */}
              <Route 
                path="/doctor" 
                element={<RoleProtectedRoute roles={['doctor']}><DoctorDashboard /></RoleProtectedRoute>} 
              />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;