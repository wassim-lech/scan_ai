import React from 'react';
import '../styles/About.css';

// Import the images that are used in the component
import healthcareImg from '../assets/AI-in-healthcare.jpg';
import doctor1Img from '../assets/doctor1.jpg';
import doctor2Img from '../assets/doctor2.jpg';
import doctor3Img from '../assets/doctor3.avif';
import doctor4Img from '../assets/doctor4.jpg';
import doctor5Img from '../assets/doctor5.webp';
import doctor6Img from '../assets/doctor6.jpg';
import xrayIcon from '../assets/icons8-x-ray-96.png';
import reportIcon from '../assets/report.png';
import appointmentIcon from '../assets/appointment.png';

const About = () => {
  return (
    <div className="about-page-container">
      <section className="about-section">
        <div className="corner-frame left-frame"></div>
        <div className="corner-frame right-frame"></div>
      
        <div className="stat-box left-box">
          <h3>1M+</h3>
          <p>Trust By People</p>
        </div>
      
        <div className="stat-box right-box">
          <h3>99%+</h3>
          <p>AI Accuracy</p>
        </div>
      
        <div className="about-content">
          <p className="about-tag">About Us!</p>
          <h2 className="about-title">
            Providing <span>AI Care for Pneumonia Detection</span>
          </h2>
          <p className="about-description">
            where we provide personalized and comprehensive healthcare<br />
            services to help you live your best life
          </p>
        </div>
      </section>
      
      <section className="about-us">
        <div className="content">
          <span className="tag">Revolutionary!</span>
          <h1>Providing <span className="highlight">Fast</span> &Accurate Pneumonia Diagnosis</h1>
          <p>"At Smart-Care, we're transforming healthcare with AI-driven innovation. Our mission is to make early pneumonia detection fast, accurate, and accessible. Using state-of-the-art AI, we analyze X-rays with precision comparable to expert radiologists."</p>
          
        </div>
        <div className="image-container">
          <img src={healthcareImg} alt="Doctor and patient" />
          <div className="frame frame-1"></div>
          <div className="frame frame-2"></div>
        </div>
      </section>
        <section className="doctors-section">
        <h2>Our Medical Specialists</h2>
        <p className="subtitle">Meet our team of medical professionals specializing in various fields.</p>
        <div className="doctors-grid">
          {/* Doctor Card 1 - Cardiology */}
          <div className="doctor-card">
            <img src={doctor1Img} alt="Doctor Cardiology" />
            <h3>Doctor Cardiology</h3>
            <p>Cardiology Specialist</p>
            <div className="social-icons">
              <a href="#"><img src="https://img.icons8.com/?size=100&id=13912&format=png&color=000000" alt="Facebook" /></a>
              <a href="#"><img src="https://img.icons8.com/?size=100&id=xuvGCOXi8Wyg&format=png&color=000000" alt="Linkedin" /></a>
            </div>
          </div>
          
          {/* Doctor Card 2 - Pulmonology */}
          <div className="doctor-card">
            <img src={doctor2Img} alt="Doctor Pulmonology" />
            <h3>Doctor Pulmonology</h3>
            <p>Pulmonology Specialist</p>
            <div className="social-icons">
              <a href="#"><img src="https://img.icons8.com/?size=100&id=13912&format=png&color=000000" alt="Facebook" /></a>
              <a href="#"><img src="https://img.icons8.com/?size=100&id=xuvGCOXi8Wyg&format=png&color=000000" alt="Linkedin" /></a>
            </div>
          </div>
          
          {/* Doctor Card 3 - Neurology */}
          <div className="doctor-card">
            <img src={doctor3Img} alt="Doctor Neurology" />
            <h3>Doctor Neurology</h3>
            <p>Neurology Specialist</p>
            <div className="social-icons">
              <a href="#"><img src="https://img.icons8.com/?size=100&id=13912&format=png&color=000000" alt="Facebook" /></a>
              <a href="#"><img src="https://img.icons8.com/?size=100&id=xuvGCOXi8Wyg&format=png&color=000000" alt="Linkedin" /></a>
            </div>
          </div>
          
          {/* Doctor Card 4 - Pediatrics */}
          <div className="doctor-card">
            <img src={doctor4Img} alt="Doctor Pediatrics" />
            <h3>Doctor Pediatrics</h3>
            <p>Pediatrics Specialist</p>
            <div className="social-icons">
              <a href="#"><img src="https://img.icons8.com/?size=100&id=13912&format=png&color=000000" alt="Facebook" /></a>
              <a href="#"><img src="https://img.icons8.com/?size=100&id=xuvGCOXi8Wyg&format=png&color=000000" alt="Linkedin" /></a>
            </div>
          </div>
          
          {/* Doctor Card 5 - Orthopedics */}
          <div className="doctor-card">
            <img src={doctor5Img} alt="Doctor Orthopedics" />
            <h3>Doctor Orthopedics</h3>
            <p>Orthopedics Specialist</p>
            <div className="social-icons">
              <a href="#"><img src="https://img.icons8.com/?size=100&id=13912&format=png&color=000000" alt="Facebook" /></a>
              <a href="#"><img src="https://img.icons8.com/?size=100&id=xuvGCOXi8Wyg&format=png&color=000000" alt="Linkedin" /></a>
            </div>
          </div>
          
          {/* Doctor Card 6 - Emergency Medicine */}
          <div className="doctor-card">
            <img src={doctor6Img} alt="Doctor Emergency" />
            <h3>Doctor Emergency</h3>
            <p>Emergency Medicine Specialist</p>
            <div className="social-icons">
              <a href="#"><img src="https://img.icons8.com/?size=100&id=13912&format=png&color=000000" alt="Facebook" /></a>
              <a href="#"><img src="https://img.icons8.com/?size=100&id=xuvGCOXi8Wyg&format=png&color=000000" alt="Linkedin" /></a>
            </div>
          </div>
        </div>
        
        <p className="trusted-text">Trusted By Top Insurance Providers And Partners Worldwide</p>
      </section>
      
      <section className="features-section">
        <div className="features-header">
          <span className="section-label">Features</span>
          <h2>Discover Our Feature Packed Solution</h2>
          <p className="features-description">
            Our platform offers a wide range of features and benefits that will revolutionize the way you manage your healthcare.
          </p>
        </div>
        
        <div className="features-grid">
          {/* Feature Card 1 */}
          <div className="feature-card">
            <div className="feature-icon">
              <img src={xrayIcon} alt="X-ray" />
            </div>
            <h3>AI-Powered X-Ray Analysis</h3>
            <p>Our AI is trained on thousands of X-rays, validated by radiologists, ensuring reliable results you can trust.</p>
          </div>
          
          {/* Feature Card 2 */}
          <div className="feature-card">
            <div className="feature-icon">
              <img src={reportIcon} alt="results" />
            </div>
            <h3>Instant Results</h3>
            <p>Get clear, easy-to-understand insights within minutes of uploading your X-ray.</p>
          </div>
          
          {/* Feature Card 3 */}
          <div className="feature-card highlight">
            <div className="feature-icon">
              <img src={appointmentIcon} alt="appointment" />
            </div>
            <h3>Appointment Booking</h3>
            <p>Book consultations with licensed healthcare professionals directly through our platform, with flexible scheduling options.</p>
          </div>
        </div>      </section>

      
    </div>
  );
};

export default About;