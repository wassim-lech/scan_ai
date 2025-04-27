import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Updated path: ./context/AuthContext
import '../styles/Header.css';

const Header = () => {
    const { isAuthenticated, user, logout, upgradeToPremium } = useContext(AuthContext);

    return (
        <header className="header">
            <nav className="nav">
                <div className="flex items-center">
                    <Link to="/" className="nav-logo">E-med</Link>
                    <div className="nav-links">
                        <Link to="/">Home</Link>
                        <Link to="/scan">Scan</Link>
                        <Link to="/about">About</Link>
                        <Link to="/appointment">Book Appointment</Link>     

                        <Link to="/help">Help & Support</Link>
                    </div>
                </div>
                <div className="user-actions">
                    {isAuthenticated ? (
                        <>
                            <span>Welcome, {user?.username}</span>
                            {user?.role === 'premium' && <span className="premium-badge">Premium</span>}
                            <button onClick={logout} className="btn btn-outline">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline">Log in</Link>
                            <Link to="/signup" className="btn btn-primary">Sign up</Link>

                        </>
                    )}
                    {isAuthenticated && user?.role === 'free' && (
                        <button onClick={upgradeToPremium} className="btn btn-primary">
                            Upgrade to Premium
                        </button>
                    )}
                    <button className="btn-icon" aria-label="Settings">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Header;