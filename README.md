SCAN-AI AI-Powered X-ray Diagnosis Website

Project Overview

The SCAN-AI website is an innovative healthcare platform that leverages artificial intelligence (AI) to provide instant pneumonia detection from chest X-ray images. Designed to bridge the gap between advanced medical technology and accessible healthcare, E-med aims to deliver fast, secure, and highly accurate diagnostic results to users worldwide. The platform is built using React for the frontend, with a focus on a user-friendly interface, and is intended to integrate with a backend system (currently under development) for processing uploaded X-rays.
This project is in active development, with core features including a landing page, a scan page for X-ray uploads, and supporting pages for appointments, help, login, and signup. The context revolves around improving healthcare accessibility by providing preliminary AI-driven insights, which can be followed up with professional medical consultation.
Context
The healthcare industry faces challenges such as delayed diagnoses, especially in remote or underserved areas where access to radiologists is limited. Pneumonia, a potentially life-threatening condition, requires timely detection for effective treatment. E-med addresses this by utilizing AI to analyze chest X-rays with over 99% accuracy, offering a preliminary diagnosis within moments of uploading an image. This project is inspired by the need for scalable, cost-effective diagnostic tools and serves as a prototype for future expansion into other medical imaging analyses.
The website is designed for both general users (patients) and healthcare providers, with features like user authentication, appointment booking, and help support. Future integration with a backend API and a database (e.g., MongoDB) will enable personalized user experiences, scan history tracking, and secure data storage.
Features
Current Functionalities

Landing Page:

A welcoming interface showcasing the purpose of E-med, including a hero section, statistics (e.g., 24/7 support, 100+ doctors, 1M+ active patients), services (pneumonia detection, diagnosis records, appointments, consultations), testimonials, and reasons to choose E-med.
Responsive design with a navbar and footer for navigation.


Scan Page:

Allows users to upload chest X-ray images (JPG, PNG, JPEG) for AI-driven pneumonia detection.
Displays a user-friendly upload box with a drag-and-drop-like interface, showing the selected file name upon upload.
Provides instructions and accepted file formats.


Navbar and Sidebar:

A responsive navbar with links to Home, Scan, About, Help & Support, and Appointment pages.
A settings icon that toggles a sidebar with sections for General (e.g., Customers, Connections) and Account (e.g., General, Security, Notifications).
Dynamic sidebar content based on user authentication status (logged-in vs. logged-out views).
Mobile-friendly menu toggle.


Authentication Pages:

Login and Signup pages for user authentication,for all of the user types (free,premium,doctor and admin) integrated with an AuthContext for state management.


Appointment and Help Pages:

For booking appointments and accessing help/support, expanded with form functionality for the appointments currently integrating formspree.


Footer:

Includes sections for Company (About Us, Services, Privacy Policy), Get Help (FAQs, Payment Options), and social media links, with a copyright notice.



Functionalities that are still in construction(backdend side)

Backend Integration: Connect to a backend API to process uploaded X-rays and return AI-generated pneumonia detection results.
User Accounts: Store user data, scan history, and appointment details in a database ( MongoDB).
the freeplan users can only use the model once,while the premium can use it 5 times,after that his sybscription expires and they can book appointments to the clinic but the premium user can also have a list of doctors to choose from when filling the appointment form
Real-time Results: Display AI analysis results on the Scan page after processing.
Appointment Scheduling: Implementing a form to book consultations with healthcare providers.
Security Enhancements: Implement secure file uploads and user authentication with JWT or OAuth.

Technologies Used

Frontend:

React: For building the user interface with reusable components.
HTML/CSS: For structuring and styling the pages (custom CSS without frameworks like Tailwind).
JavaScript: For interactivity and state management.
Font Awesome: For icons in the navbar, sidebar, and footer.


Backend:

Node.js/Express: For API development.
MongoDB: For database storage.
AI Model: Integration with a cnn model for X-ray analysis (using TensorFlow).


Development Tools:

Vite: For fast React development and hot reloading.
npm: For package management.



Installation and Setup
Prerequisites

Node.js (v16 or later)
npm (v8 or later)
Git (for cloning the repository)

Steps



Install Dependencies:

Navigate to the frontend directory:cd frontend
npm install




Run the Development Server:
npm run dev


Open your browser and visit http://localhost:5173/ to see the landing page.


Build for Production (Optional):
npm run build


This generates a production-ready build in the dist folder.



Project Structure
e-med/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── AppointmentForm.jsx
│   │   │   ├── HelpForm.jsx
│   │   │   └── Authpage.jsx (LoginPage, SignupPage)
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   └── ScanPage.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   └── ScanPage.css
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── vite.config.js
├── README.md
└── (future backend directory)

Usage

Navigate the Website: Use the navbar to switch between pages (Home, Scan, etc.).
Upload X-ray: On the Scan page, click "Upload Files" to select a chest X-ray image. The file name will be displayed (backend processing is pending).
Sidebar: Click the settings icon to toggle the sidebar, which adjusts content based on login status.
Mobile View: Resize the browser or use a mobile device to test the responsive navbar.

Known Issues

Backend Not Integrated: The upload feature logs the file name but doesn’t process the X-ray yet.
Authentication Placeholder: Login and Signup pages are placeholders; AuthContext needs full implementation.
Database Connection: MongoDB integration is unresolved (e.g., queryTxt ETIMEOUT error).
About Page Missing: The /about route in the navbar lacks a corresponding component.

Contributing
We welcome contributions to enhance E-med! To contribute:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Make your changes and commit them (git commit -m "Add your message").
Push to the branch (git push origin feature/your-feature).
Open a pull request with a description of your changes.

Areas for Help

Backend Development: Implement an API to process X-ray images with an AI model.
Database Setup: Resolve MongoDB connection issues and design the schema.
UI/UX Improvements: Enhance the design of the Scan page or add animations.
Testing: Write unit and integration tests for components.
Security: Add file upload validation and secure authentication.

License
This project is under the MIT License - see the LICENSE file for details.
Contact
For questions or collaboration, please contact [your-email@example.com] or open an issue on the GitHub repository.
Acknowledgments

Inspired by the need for accessible healthcare diagnostics.
Thanks to the open-source community for tools like React and Font Awesome.


Note: Replace https://github.com/your-username/e-med.git and [your-email@example.com] with your actual repository URL and email. Add a LICENSE file if not already present.
