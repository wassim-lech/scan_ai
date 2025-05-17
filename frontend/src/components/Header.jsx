import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/Header.module.css';

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
      const icon = document.querySelector(`.${styles.settingsIcon}`);

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
        <nav className={styles.navbar}>
          <Link to="/" className={styles.logo}>E-med</Link>
          <ul className={`${styles.navLinks} ${menuOpen ? styles.navLinksActive : ''}`}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/scan">Scan</Link></li>
            <li><Link to="/appointment">Appointment</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/help">Help & Support</Link></li>
          </ul>
          <div className={`${styles.navButtons} ${menuOpen ? styles.navButtonsActive : ''}`}>
            {isAuthenticated ? (
              <>
                <span className={styles.welcomeText}>Welcome, {user?.username}</span>
                {user?.role === 'premium' && <span className={styles.premiumBadge}>Premium</span>}
                <button onClick={logout} className={styles.loginBtn}>Logout</button>
                {user?.role === 'free' && (
                  <button onClick={upgradeToPremium} className={styles.loginBtn}>
                    Upgrade to Premium
                  </button>
                )}
              </>
            ) : (
              <>
                {/* Changed from /login to /auth to match the route in App.jsx */}
                <Link to="/auth" className={styles.loginBtn}>Log in</Link>
                {/* Added state to indicate signup mode when navigating to AuthPage */}
                <Link to="/auth" state={{ isSignUp: true }} className={styles.signupBtn}>Sign up</Link>
              </>
            )}
            <span className={styles.settingsIcon} onClick={toggleSidebar}>
              <i className="fa-solid fa-gear" style={{ color: '#1e57b8' }}></i>
            </span>
          </div>
          <div className={styles.menuToggle} onClick={toggleMenu}>☰</div>
        </nav>
      </header>

      <aside className={`${styles.sidebar} ${sidebarVisible ? styles.sidebarVisible : ''}`} id="sidebar">
        <div className={styles.sidebarSection}>
          <h3 className={styles.title}>General</h3>
          <div className={`${styles.sidebarItem} ${activeItem === 0 ? styles.sidebarItemActive : ''}`} onClick={() => handleSidebarItemClick(0)}>
            <i className="fa-solid fa-user-group"></i><span>Customers</span><span className="badge">104</span>
          </div>
          <div className={`${styles.sidebarItem} ${activeItem === 1 ? styles.sidebarItemActive : ''}`} onClick={() => handleSidebarItemClick(1)}>
            <i className="fa-solid fa-link"></i><span>Connections</span><span className="badge">16</span>
          </div>
          <div className={`${styles.sidebarItem} ${activeItem === 2 ? styles.sidebarItemActive : ''}`} onClick={() => handleSidebarItemClick(2)}>
            <i className="fa-solid fa-paper-plane"></i><span>Email automation</span>
          </div>
          <div className={`${styles.sidebarItem} ${activeItem === 3 ? styles.sidebarItemActive : ''}`} onClick={() => handleSidebarItemClick(3)}>
            <i className="fa-solid fa-chart-bar"></i><span>Reporting</span>
          </div>
          <div className={`${styles.sidebarItem} ${activeItem === 4 ? styles.sidebarItemActive : ''}`} onClick={() => handleSidebarItemClick(4)}>
            <i className="fa-solid fa-users-gear"></i><span>Team members</span>
          </div>
          <div className={`${styles.sidebarItem} ${activeItem === 5 ? styles.sidebarItemActive : ''}`} onClick={() => handleSidebarItemClick(5)}>
            <i className="fa-solid fa-sliders"></i><span>Admin settings</span>
          </div>
        </div>
        <div className={styles.sidebarSection}>
          <h3 className={styles.title}>Account</h3>
          {isAuthenticated && (
            <>
              <div className={`${styles.sidebarItem} ${activeItem === 6 ? styles.sidebarItemActive : ''}`} onClick={() => handleSidebarItemClick(6)}>
                <i className="fa-solid fa-gear"></i><span>Appointments</span>
              </div>
              <div className={`${styles.sidebarItem} ${activeItem === 7 ? styles.sidebarItemActive : ''}`} onClick={() => handleSidebarItemClick(7)}>
                <i className="fa-solid fa-bell"></i><span>Notifications</span>
              </div>
              <div className={`${styles.sidebarItem} ${activeItem === 8 ? styles.sidebarItemActive : ''}`} onClick={() => handleSidebarItemClick(8)}>
                <i className="fa-solid fa-square-poll-horizontal"></i><span>Scan History</span>
              </div>
              <div className={`${styles.sidebarItem} ${activeItem === 9 ? styles.sidebarItemActive : ''}`} onClick={() => handleSidebarItemClick(9)}>
                <i className="fa-solid fa-credit-card"></i><span>Payment Options</span>
              </div>
              <div className={`${styles.sidebarItem} ${activeItem === 10 ? styles.sidebarItemActive : ''}`} onClick={logout}>
                <i className="fa-solid fa-arrow-right-from-bracket"></i><span>Logout</span>
              </div>
              <div className={`${styles.sidebarItem} ${activeItem === 11 ? styles.sidebarItemActive : ''}`} onClick={() => handleSidebarItemClick(11)}>
                <i className="fa-solid fa-minus"></i><span>Delete My Account</span>
              </div>
            </>
          )}
          {!isAuthenticated && sidebarItems.map((item, index) => (
            <div
              key={index}
              className={`${styles.sidebarItem} ${activeItem === 6 + index ? styles.sidebarItemActive : ''}`}
              onClick={() => handleSidebarItemClick(6 + index)}
            >
              <i className={item.icon}></i><span>{item.text}</span>
            </div>
          ))}
        </div>
      </aside>
      <div className={`${styles.sidebarOverlay} ${sidebarVisible ? '' : styles.sidebarOverlayHidden}`} onClick={handleOverlayClick}></div>
    </>
  );
};

export default Header;