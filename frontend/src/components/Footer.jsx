import React from 'react';
import '../styles/Footer.css'; // Updated path

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-col">
            <h3 className="text-xl">About Us</h3>
            <p>
              E-med is dedicated to providing cutting-edge AI solutions for healthcare, including chest X-ray analysis and doctor appointment scheduling.
            </p>
          </div>
          <div className="footer-col">
            <h3 className="text-xl">Quick Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/scan">Scan</a></li>
              <li><a href="/help">Help & Support</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3 className="text-xl">Contact</h3>
            <p>Email: support@emed.com</p>
            <p>Phone: (123) 456-7890</p>
            <div className="social-links">
              <a href="#" className="fab fa-facebook-f"></a>
              <a href="#" className="fab fa-twitter"></a>
              <a href="#" className="fab fa-linkedin-in"></a>
            </div>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; 2025 E-med. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;