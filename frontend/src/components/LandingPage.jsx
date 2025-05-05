import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

// Import images
import robotDoctor from '../assets/RobotDoctor3.png';
import lungs from '../assets/lungs.png';
import futureHealth from '../assets/Rectangle 15.png';
import avatar1 from '../assets/avatar.jpg';
import avatar2 from '../assets/avatar2.jpg';

const LandingPage = () => {
    return (
        <div className="landing-page">
           
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Scan Your X-ray <br /><span>Using AI For instant diagnosis</span></h1>
                    <p>
                        Bringing the Future of Healthcare to Today, Using AI to Analyze X-ray Images in Real Time and Deliver Precise Diagnoses with Unparalleled Speed.
                    </p>
                </div>
                <div className="hero-imageRobot">
                    <img src={robotDoctor} className="robot-img" alt="Robot Doctor" />
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats">
                <div className="stat-box">
                    <h2>24/7</h2>
                    <p>Online Support</p>
                </div>
                <div className="stat-box">
                    <h2>100+</h2>
                    <p>Doctors</p>
                </div>
                <div className="stat-box">
                    <h2>1M+</h2>
                    <p>Active Patients</p>
                </div>
                <div className="stat-box">
                    <h2>20+</h2>
                    <p>Partner Hospitals</p>
                </div>
                <div className="stat-box">
                    <h2>100%</h2>
                    <p>AI Accuracy</p>
                </div>
            </section>

            {/* Services Section */}
            <section className="diagnosis-section">
                <div className="container">
                    <h2 className="section-title">Our Services</h2>
                    <div className="card-grid">
                        <div className="card">
                            <img src="https://img.icons8.com/ios/50/000000/lungs.png" alt="Pneumonia" className="card-icon" />
                            <h3 className="card-title">Pneumonia Detection</h3>
                            <p className="card-text">AI-powered analysis of chest X-rays to detect signs of pneumonia.</p>
                        </div>
                        <div className="card">
                            <img src="https://img.icons8.com/?size=100&id=MCedQoQ0mRmw&format=png&color=000000" alt="Diagnosis Records Icon" className="card-icon" />
                            <h3 className="card-title">Diagnosis Records</h3>
                            <p className="card-text">Access and manage your previous scans and reports easily.</p>
                        </div>
                        <div className="card">
                            <img src="https://img.icons8.com/?size=100&id=ewR2cudDTUEU&format=png&color=000000" alt="Book Appointment icon" className="card-icon" />
                            <h3 className="card-title">Book Appointment</h3>
                            <p className="card-text">Schedule a personalized consultation based on your results with medical experts.</p>
                        </div>
                        <div className="card">
                            <img src="https://img.icons8.com/?size=100&id=BBCvmukOhE9z&format=png&color=000000" alt="Consultation Icon" className="card-icon" />
                            <h3 className="card-title">Consultation</h3>
                            <p className="card-text">Connect with healthcare experts for diagnosis review.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="why-choose-us">
                <div className="choose-container">
                    <div className="choose-image">
                        <img src={lungs} alt="Lung Scan" />
                    </div>
                    <div className="choose-content">
                        <h2>Why Choose Us?</h2>
                        <ul className="reasons-list">
                            <li><i className="fa-solid fa-check" style={{ color: "#2461cc" }}></i> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                            <li><i className="fa-solid fa-check" style={{ color: "#2461cc" }}></i> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                            <li><i className="fa-solid fa-check" style={{ color: "#2461cc" }}></i> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                            <li><i className="fa-solid fa-check" style={{ color: "#2461cc" }}></i> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                            <li><i className="fa-solid fa-check" style={{ color: "#2461cc" }}></i> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                        </ul>
                        <Link to="/about" className="learn-more">Learn More →</Link>
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="testimonial-section">
                <div className="testimonial-container">
                    <div className="testimonial-text">
                        <h2>
                            What <span className="highlight">Our Patient</span><br />
                            Say About Us
                        </h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
                            Sem velit viverra amet faucibus.
                        </p>
                        <div className="avatars">
                            <img src={avatar1} alt="User 1" />
                            <img src={avatar2} alt="User 2" />
                            <img src={avatar1} alt="User 3" />
                            <img src={avatar2} alt="User 4" />
                            <img src={avatar1} alt="User 5" />
                            <span>100+ Reviews</span>
                        </div>
                    </div>
                    <div className="testimonial-card">
                        <div className="user-info">
                            <img src={avatar1} alt="Jane" className="user-avatar" />
                            <div>
                                <h4>Jane Cooper</h4>
                                <span>12/4/17</span>
                            </div>
                            <div className="stars">★★★★★</div>
                        </div>
                        <p className="testimonial-paragraph">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sem velit viverra amet faucibus.
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </p>
                    </div>
                </div>
            </section>

            {/* Future Section */}
            <section className="future-section">
                <div className="future-content">
                    <div className="text-block">
                        <h2>The Future <br /><span className="highlight">of Quality Health</span></h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nec risus feugiat lectus risus sed ullamcorper.
                            Auctor semper fermentum volutpat integer vel. In rhoncus elementum nunc, malesuada mi sed.
                        </p>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nec risus feugiat lectus risus sed ullamcorper.
                            Auctor semper fermentum volutpat integer vel. In rhoncus elementum nunc, malesuada mi sed.
                        </p>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nec risus feugiat lectus risus sed ullamcorper.
                        </p>
                        <Link to="/about" className="learn-more">Learn More →</Link>
                    </div>
                    <div className="image-block">
                        <img src={futureHealth} alt="AI Doctor" />
                    </div>
                </div>
            </section>

        </div>
    );
};

export default LandingPage;