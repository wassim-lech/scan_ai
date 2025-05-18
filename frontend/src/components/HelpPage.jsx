// src/components/HelpForm.jsx
import React, { useState, useContext } from 'react';
import  AuthContext  from '../context/AuthContext';
import '../styles/HelpPage.css';
/*
const HelpForm = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/help', formData); // Updated port
      alert(response.data.msg);
      setFormData({ subject: '', message: '' });
    } catch (err) {
      alert(err.response?.data?.msg || 'Error submitting help request');
    }
  };

  return (
    <div className="help-container">
      <h2>Help & Support</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="form-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default HelpForm;
*/
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faUserGroup, 
  faLink, 
  faLungsVirus, 
  faUsersGear, 
  faSliders,
  faCalendarCheck,
  faBell,
  faSquarePollHorizontal,
  faCreditCard,
  faArrowRightFromBracket,
  faMinus,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';

const HelpPage = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const toggleMenu = () => {
    // Mobile menu toggle functionality would go here
    console.log("Toggle mobile menu");
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const toggleQuestion = (index) => {
    setExpandedQuestions({
      ...expandedQuestions,
      [index]: !expandedQuestions[index]
    });
  };

  const faqs = [
    {
      question: "How does the AI detect diseases from X-ray images?",
      answer: "Our AI model is trained on thousands of X-ray images to recognize patterns associated with Pneumonia. Once you upload an image, the AI analyzes it and provides an instant prediction with high accuracy rates [...]"
    },
    {
      question: "Is my medical data safe and private?",
      answer: "Yes. We prioritize your privacy and follow strict data protection protocols. All uploaded images and personal information are encrypted and stored securely. Your data will never be shared with third parties without your explicit consent [...]"
    },
    {
      question: "What should I do if the AI result seems unclear or incorrect?",
      answer: "While our AI is highly accurate, it's not a replacement for a certified medical diagnosis. If you're unsure about a result, we recommend consulting a licensed healthcare professional. You can also contact our support for clarification [...]"
    },
    {
      question: "What's included in the premium account?",
      answer: "With a premium account, you get faster diagnosis, access to detailed AI analysis reports, priority customer support, and exclusive features like multi-image comparison and early access to new AI models [...]"
    },
    {
      question: "Do I need to create an account to use E-med?",
      answer: "Yes, creating a free account allows you to scan your X-ray, save your results, track past diagnoses, and access more features. A premium account unlocks even more advanced tools and support [...]"
    }
  ];

  const categories = [
    {
      icon: "https://img.icons8.com/?size=100&id=IC8Udo8SeAzf&format=png&color=000000",
      title: "Platform Setup & Configuration",
      description: "Guidance on setting up the web-based platform, configuring user settings, and ensuring proper integration with AI model for chest X-ray analysis."
    },
    {
      icon: "https://img.icons8.com/?size=100&id=YqCybz8LMZbL&format=png&color=000000",
      title: "Account & Data Security",
      description: "Support for securing user accounts, managing patient data privacy, and ensuring compliance with healthcare data regulations"
    },
    {
      icon: "https://img.icons8.com/?size=100&id=cWhjh7IgpFHy&format=png&color=000000",
      title: "Image Upload & Scan",
      description: "Assistance with uploading chest X-ray images, troubleshooting image quality issues, formats...etc"
    },
    {
      icon: "https://img.icons8.com/?size=100&id=zRjaj6TelNUx&format=png&color=000000",
      title: "Notifications & Alerts",
      description: "Help with setting up and managing notifications in the UI, such as alerts for completed analyses or system updates."
    },
    {
      icon: "https://img.icons8.com/?size=100&id=7hKVwP7dqp0p&format=png&color=000000",
      title: "Appointments",
      description: "View, edit or schedule consultations and follow-ups."
    },
    {
      icon: "https://img.icons8.com/?size=100&id=QG2AdfmrWrmB&format=png&color=000000",
      title: "Emergency Guide",
      description: "Quick steps for urgent health situations."
    },
    {
      icon: "https://img.icons8.com/?size=100&id=XlopqpVPxSyn&format=png&color=000000",
      title: "Feedback & Ratings",
      description: "Share your experience with doctors or services."
    },
    {
      icon: "https://img.icons8.com/?size=100&id=lP0gJtpbD9xN&format=png&color=000000",
      title: "Premium Account",
      description: "Unlock advanced AI scans, priority support, and full medical reports."
    }
  ];

  const otherWays = [
    {
      icon: "https://img.icons8.com/?size=100&id=bb0YrM1TkgdG&format=png&color=000000",
      title: "User Guides & Tutorials",
      description: "Explore our detailed tutorials and documentation designed to walk you through every feature of E-med. Whether you're uploading X-rays, reviewing AI diagnoses, or managing your account, [...]",
      buttonText: "Read more"
    },
    {
      icon: "assets/first-aid_17625430.png",
      title: "Emergency Medical ressources",
      description: "In critical moments, quick access to accurate information matters. Our emergency resources section provides you with essential contacts, first-response guidelines, and immediate steps t[...]",
      buttonText: "Read more"
    },
    {
      icon: "assets/contact3.jpg",
      title: "We've got your back",
      description: "If you have any questions or need any support, please don't hesitate to contact our friendly support team.",
      buttonText: "Contact us"
    }
  ];

  return (
    <div className="help-page">
     
      
      <aside className={`sidebar ${!sidebarVisible ? 'hidden' : ''}`} id="sidebar">
        <div className="sidebar-section">
          <h3 className="title">General</h3>
          <div className="sidebar-item"><FontAwesomeIcon icon={faUserGroup} /><span>About</span></div>
          <div className="sidebar-item"><FontAwesomeIcon icon={faLink} /><span>Show Ai Confidence</span></div>
          <div className="sidebar-item"><FontAwesomeIcon icon={faLungsVirus} /><span>Scan Now</span></div>
          <div className="sidebar-item"><FontAwesomeIcon icon={faUserGroup} /><span>Contacts</span></div>
          <div className="sidebar-item"><FontAwesomeIcon icon={faUsersGear} /><span>FAQs</span></div>
          <div className="sidebar-item"><FontAwesomeIcon icon={faSliders} /><span>Language Selector</span></div>
        </div>
        
        <div className="sidebar-section">
          <h3 className="title">Account</h3>
          <div className="sidebar-item active"><FontAwesomeIcon icon={faCalendarCheck} /><span>Appointments</span></div>
          <div className="sidebar-item"><FontAwesomeIcon icon={faBell} /><span>Notifications</span></div>
          <div className="sidebar-item"><FontAwesomeIcon icon={faSquarePollHorizontal} /><span>Scan History</span></div>
          <div className="sidebar-item"><FontAwesomeIcon icon={faCreditCard} /><span>Payment Options</span></div>
          <div className="sidebar-item"><FontAwesomeIcon icon={faArrowRightFromBracket} /><span>Logout</span></div>
          <div className="sidebar-item"><FontAwesomeIcon icon={faMinus} /><span>Delete My Account</span></div>
        </div>
      </aside>
      
      <div 
        className={`sidebar-overlay ${!sidebarVisible ? 'hidden' : ''}`} 
        id="sidebarOverlay"
        onClick={toggleSidebar}
      ></div> 

      {/* Help Section */}
      <div className="help-section">
        <h1>How Can We Help?</h1>
        <div className="search-bar">
          <input type="text" placeholder="Search for help on specific topics" />
          <button>Search</button>
        </div>
      </div>

      {/* Categories Section */}
      <div className="categories-section">
        {categories.map((category, index) => (
          <div className="category-card" key={index}>
            <div className="icon">
              <img src={category.icon} alt={category.title} />
            </div>
            <h3>{category.title}</h3>
            <p>{category.description}</p>
          </div>
        ))}
      </div>

      {/* Other Ways Section */}
      <div className="other-ways-section">
        <h2>Other ways to get help</h2>
        <div className="other-ways-grid">
          {otherWays.map((way, index) => (
            <div className="other-ways-card" key={index}>
              <div className="icon">
                <img src={way.icon} alt={way.title} />
              </div>
              <h3>{way.title}</h3>
              <p>{way.description}</p>
              <button>{way.buttonText}</button>
            </div>
          ))}
        </div>
      </div>

      <section>
        <h1 className="title-FAQ">FAQs</h1>
        <div className="questions-container">
          {faqs.map((faq, index) => (
            <div className="question" key={index}>
              <button onClick={() => toggleQuestion(index)}>
                <span>{faq.question}</span>
                <span>
                  <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className={expandedQuestions[index] ? 'rotate' : ''} 
                  />
                </span>
              </button>
              <p className={expandedQuestions[index] ? 'show' : ''}>{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="ask-section">
          <h3>Didn't find an answer?</h3>
          <div className="button-group">
            <button className="contact-button">Contact support</button>
            <button className="feedback-button">Leave us feedback</button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HelpPage;