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
      const profileIcon = document.querySelector(`.${styles.profileIcon}`);

      if (sidebar && profileIcon) {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnIcon = profileIcon.contains(event.target);

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
          <Link to="/" className={styles.logo}>Smart-Care</Link>
          <ul className={`${styles.navLinks} ${menuOpen ? styles.navLinksActive : ''}`}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/scan">Scan</Link></li>
            <li><Link to="/appointment">Appointment</Link></li>

            <li><Link to="/about">About</Link></li>
            <li><Link to="/help">Help & Support</Link></li>
          </ul>          <div className={`${styles.navButtons} ${menuOpen ? styles.navButtonsActive : ''}`}>
            {isAuthenticated ? (
              <>
                <div className={styles.profileSection}>
                  
                  <div className={styles.profileIcon} onClick={toggleSidebar}>
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt="Profile" />
                    ) : (
                      <div className={`${styles.defaultAvatar} ${
                        user?.role === 'premium' ? styles.goldBorder : 
                        user?.role === 'free' ? styles.blueBorder : 
                        user?.role === 'doctor' ? styles.greenBorder : 
                        styles.purpleBorder
                      }`}>
                        {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                  </div>
                  <span 
                    className={`${styles.username} ${
                      user?.role === 'premium' ? styles.goldText : 
                      user?.role === 'free' ? styles.blueText : 
                      user?.role === 'doctor' ? styles.greenText : 
                      styles.purpleText
                    }`}
                  >
                    {user?.username}
                  </span>
                </div>
              </>
            ) : (
              <>
                {/* Changed from /login to /auth to match the route in App.jsx */}
                <Link to="/auth" className={styles.loginBtn}>Log in</Link>
                {/* Added state to indicate signup mode when navigating to AuthPage */}
                <Link to="/auth" state={{ isSignUp: true }} className={styles.signupBtn}>Sign up</Link>
              </>
            )}
          </div>
          <div className={styles.menuToggle} onClick={toggleMenu}>☰</div>
        </nav>      </header>
      <aside className={`${styles.sidebar} ${sidebarVisible ? styles.sidebarVisible : ''}`} id="sidebar">
        {/* Admin Section */}
        {isAuthenticated && user?.role === 'admin' && (
          <div className={styles.sidebarSection}>
            <h3 className={styles.title}>General</h3>
            <Link to="/admin">
              <div className={`${styles.sidebarItem} ${activeItem === 0 ? styles.sidebarItemActive : ''}`} onClick={() => handleSidebarItemClick(0)}>
                <i className="fa-solid fa-user-group"></i><span>Total Users</span><p className="badge">104</p>
              </div>
            </Link>
            <Link to="/admin">
              <div className={`${styles.sidebarItem} ${activeItem === 1 ? styles.sidebarItemActive : ''}`} onClick={() => handleSidebarItemClick(1)}>
                <i className="fa-solid fa-chart-bar"></i><span>Reporting</span>
              </div>
            </Link>
            <Link to="/admin">
              <div className={`${styles.sidebarItem} ${activeItem === 2 ? styles.sidebarItemActive : ''}`} onClick={() => handleSidebarItemClick(2)}>
                <i className="fa-solid fa-users-gear"></i><span>Team members</span>
              </div>
            </Link>
            <Link to="/admin">
              <div className={`${styles.sidebarItem} ${activeItem === 3 ? styles.sidebarItemActive : ''}`} onClick={() => handleSidebarItemClick(3)}>
                <i className="fa-solid fa-sliders"></i><span>Admin settings</span>
              </div>
            </Link>
          </div>
        )}
        
        {/* Doctor Section */}
        {isAuthenticated && user?.role === 'doctor' && (
          <div className={styles.sidebarSection}>
            <h3 className={styles.title}>General</h3>
            <Link to="/doctor">
              <div className={`${styles.sidebarItem} ${activeItem === 0 ? styles.sidebarItemActive : ''}`} onClick={() => handleSidebarItemClick(0)}>
                <i className="fa-solid fa-user-group"></i><span>Total Patients</span><span className="badge">42</span>
              </div>
            </Link>
            <Link to="/doctor">
              <div className={`${styles.sidebarItem} ${activeItem === 1 ? styles.sidebarItemActive : ''}`} onClick={() => handleSidebarItemClick(1)}>
                <i className="fa-solid fa-chart-bar"></i><span>Reporting</span>
              </div>
            </Link>
            <Link to="/doctor">
              <div className={`${styles.sidebarItem} ${activeItem === 2 ? styles.sidebarItemActive : ''}`} onClick={() => handleSidebarItemClick(2)}>
                <i className="fa-solid fa-calendar-check"></i><span>Appointments</span>
              </div>
            </Link>
            <Link to="/doctor">
              <div className={`${styles.sidebarItem} ${activeItem === 3 ? styles.sidebarItemActive : ''}`} onClick={() => handleSidebarItemClick(3)}>
                <i className="fa-solid fa-lungs-virus"></i><span>Scan Reviews</span>
              </div>
            </Link>
          </div>
        )}
        
        {/* Account Section for all authenticated users */}
        <div className={styles.sidebarSection}>
          <h3 className={styles.title}>Account</h3>
          {isAuthenticated && (
            <>
              <Link to="/profile">
                <div className={`${styles.sidebarItem} ${activeItem === 4 ? styles.sidebarItemActive : ''}`} onClick={() => handleSidebarItemClick(4)}>
                  <i className="fa-solid fa-user"></i><span>Manage Account</span>
                </div>
              </Link>
              <Link to="/scan">
                <div className={`${styles.sidebarItem} ${activeItem === 5 ? styles.sidebarItemActive : ''}`} onClick={() => handleSidebarItemClick(5)}>
                  <i className="fa-solid fa-square-poll-horizontal"></i><span>Scan History</span>
                </div>
              </Link>
              <Link to="/profile">
                <div className={`${styles.sidebarItem} ${activeItem === 6 ? styles.sidebarItemActive : ''}`} onClick={() => handleSidebarItemClick(6)}>
                  <i className="fa-solid fa-bell"></i><span>Notifications</span>
                </div>
              </Link>
              <Link to="/subscription">
                <div className={`${styles.sidebarItem} ${activeItem === 7 ? styles.sidebarItemActive : ''}`} onClick={() => handleSidebarItemClick(7)}>
                  <i className="fa-solid fa-dollar-sign"></i><span>Subscription</span>
                </div>
              </Link>
              <div className={`${styles.sidebarItem} ${activeItem === 8 ? styles.sidebarItemActive : ''}`} onClick={logout}>
                <i className="fa-solid fa-arrow-right-from-bracket"></i><span>Logout</span>
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