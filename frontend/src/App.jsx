import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { LoginPage, SignupPage } from './components/Authpage';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<PlaceholderHomePage />} /> {/* Use PlaceholderHomePage for now */}
            <Route path="/scan" element={<PlaceholderHomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

const PlaceholderHomePage = () => {
  return (
    <div className="content-container">
      <div className="blue-content-box">
        <h1>Page Coming Soon</h1>
        <p>This page is under construction.</p>
      </div>
    </div>
  );
};

export default App;