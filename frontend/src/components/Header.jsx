import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import '../styles/Header.css';

const Header = () => {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);
    
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header>
            <nav className="navbar">
                <Link to="/" className="logo">E-med</Link>
                <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/scan">Scan</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/help">Help & Support</Link></li>
                </ul>
                <div className="nav-buttons">
                    {isAuthenticated ? (
                        <>
                            <span className="welcome-text">Welcome, {user?.username}</span>
                            {user?.role === 'premium' && <span className="premium-badge">Premium</span>}
                            <button onClick={logout} className="login-btn">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="login-btn">Log in</Link>
                            <Link to="/signup" className="signup-btn">Sign up</Link>
                        </>
                    )}
                    <span className="settings-icon">
                        <i className="fa-solid fa-gear"></i>
                    </span>
                </div>
                <div className="menu-toggle" onClick={toggleMenu}>☰</div>
            </nav>
        </header>
    );
};

export default Header;