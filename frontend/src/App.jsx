import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AppointmentForm from './components/AppointmentForm'; 
import HelpForm from './components/HelpForm';
import { LoginPage, SignupPage } from './components/Authpage';
import LandingPage from './components/LandingPage';
import ScanPage from './components/ScanPage';
import './styles/App.css';
import AdminDashboard from './components/AdminDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import UserProfile from './components/UserProfile';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/appointment" element={<AppointmentForm />} />
            <Route path="/help" element={<HelpForm />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;