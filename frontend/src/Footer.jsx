
// Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="row">
                    <div className="footer-col">
                        <h4>Company</h4>
                        <ul>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/services">Our Services</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/affiliate">Affiliate Program</Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Get Help</h4>
                        <ul>
                            <li><Link to="/faq">FAQs</Link></li>
                            <li><Link to="/payment">Payment options</Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Follow Us</h4>
                        <div className="social-links">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <br />
                <br />
                <br />
                <hr />
                <br />
                <div className="row">
                    <div className="copyright">
                        <p>&copy; 2024 SCANAI. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;