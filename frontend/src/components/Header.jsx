import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Header.css';

const Header = () => {
  const { isAuthenticated, user, logout, upgradeToPremium } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleSidebarItemClick = (index) => {
    setActiveItem(index);
  };

  const handleOverlayClick = () => {
    setSidebarVisible(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const sidebar = document.getElementById('sidebar');
      const icon = document.querySelector('.settings-icon');

      if (sidebar && icon) {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnIcon = icon.contains(event.target);

        if (!isClickInsideSidebar && !isClickOnIcon && sidebarVisible) {
          setSidebarVisible(false);
        }
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [sidebarVisible]);

  const sidebarItems = isAuthenticated
    ? [
        { icon: 'fa-solid fa-gear', text: 'General' },
        { icon: 'fa-solid fa-shield-halved', text: 'Security' },
        { icon: 'fa-solid fa-bell', text: 'Notifications' },
        { icon: 'fa-solid fa-user', text: 'Account' },
      ]
    : [
        { icon: 'fa-solid fa-info', text: 'About E-med' },
        { icon: 'fa-solid fa-lock', text: 'Login' },
        { icon: 'fa-solid fa-phone', text: 'Contact' },
      ];

  return (
    <>
      <header>
        <nav className="navbar">
          <Link to="/" className="logo">E-med</Link>
          <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/scan">Scan</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/help">Help & Support</Link></li>
          </ul>
          <div className={`nav-buttons ${menuOpen ? 'active' : ''}`}>
            {isAuthenticated ? (
              <>
                <span className="welcome-text">Welcome, {user?.username}</span>
                {user?.role === 'premium' && <span className="premium-badge">Premium</span>}
                <button onClick={logout} className="login-btn">Logout</button>
                {user?.role === 'free' && (
                  <button onClick={upgradeToPremium} className="login-btn">
                    Upgrade to Premium
                  </button>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="login-btn">Log in</Link>
                <Link to="/signup" className="signup-btn">Sign up</Link>
              </>
            )}
            <span className="settings-icon" onClick={toggleSidebar}>
              <i className="fa-solid fa-gear" style={{ color: '#1e57b8' }}></i>
            </span>
          </div>
          <div className="menu-toggle" onClick={toggleMenu}>☰</div>
        </nav>
      </header>

      <aside className={`sidebar ${sidebarVisible ? '' : 'hidden'}`} id="sidebar">
        <div className="sidebar-section">
          <h3 className="title">General</h3>
          <div className={`sidebar-item ${activeItem === 0 ? 'active' : ''}`} onClick={() => handleSidebarItemClick(0)}>
            <i className="fa-solid fa-user-group"></i><span>Customers</span><span className="badge">104</span>
          </div>
          <div className={`sidebar-item ${activeItem === 1 ? 'active' : ''}`} onClick={() => handleSidebarItemClick(1)}>
            <i className="fa-solid fa-link"></i><span>Connections</span><span className="badge">16</span>
          </div>
          <div className={`sidebar-item ${activeItem === 2 ? 'active' : ''}`} onClick={() => handleSidebarItemClick(2)}>
            <i className="fa-solid fa-paper-plane"></i><span>Email automation</span>
          </div>
          <div className={`sidebar-item ${activeItem === 3 ? 'active' : ''}`} onClick={() => handleSidebarItemClick(3)}>
            <i className="fa-solid fa-chart-bar"></i><span>Reporting</span>
          </div>
          <div className={`sidebar-item ${activeItem === 4 ? 'active' : ''}`} onClick={() => handleSidebarItemClick(4)}>
            <i className="fa-solid fa-users-gear"></i><span>Team members</span>
          </div>
          <div className={`sidebar-item ${activeItem === 5 ? 'active' : ''}`} onClick={() => handleSidebarItemClick(5)}>
            <i className="fa-solid fa-sliders"></i><span>Admin settings</span>
          </div>
        </div>
        <div className="sidebar-section">
          <h3 className="title">Account</h3>
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              className={`sidebar-item ${activeItem === 6 + index ? 'active' : ''}`}
              onClick={() => handleSidebarItemClick(6 + index)}
            >
              <i className={item.icon}></i><span>{item.text}</span>
            </div>
          ))}
        </div>
      </aside>
      <div className={`sidebar-overlay ${sidebarVisible ? '' : 'hidden'}`} onClick={handleOverlayClick}></div>
    </>
  );
};

export default Header;