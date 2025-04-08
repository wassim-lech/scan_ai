// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage, SignupPage } from './Authpage';
import Header from './Header';
import Footer from './Footer';
import './App.css';

const PlaceholderHomePage = () => {
    return (
        <div className="content-container">
            <div className="blue-content-box">
                <h1>Homepage Coming Soon</h1>
                <p>This page is under construction.</p>
            </div>
        </div>
    );
};

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<PlaceholderHomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;