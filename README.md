# Scan-AI: AI-Powered X-ray Diagnosis Website

## Project Overview
The Scan-AI website is an innovative healthcare platform that leverages artificial intelligence (AI) to provide instant pneumonia detection from chest X-ray images. Designed to bridge the gap between advanced medical technology and accessible healthcare, Scan-AI aims to deliver fast, secure, and highly accurate diagnostic results to users worldwide. The platform is built using React for the frontend, with a focus on a user-friendly interface, and is intended to integrate with a backend system (currently under development) for processing uploaded X-rays.
This project is in active development, with core features including a landing page, a scan page for X-ray uploads, and supporting pages for appointments, help, login, and signup. The context revolves around improving healthcare accessibility by providing preliminary AI-driven insights, which can be followed up with professional medical consultation.
## Context
The healthcare industry faceschallenges such as delayed diagnoses, especially in remote or underserved areas where access to radiologists is limited. Pneumonia, a potentially life-threatening condition, requires timely detection for effective treatment. Scan-AI addresses this by utilizing AI to analyze chest X-rays with over 99% accuracy, offering a preliminary diagnosis within moments of uploading an image. This project is inspired by the need for scalable, cost-effective diagnostic tools and serves as a prototype for future expansion into other medical imaging analyses.
The website is designed for both general users (patients) and healthcare providers, with features like user authentication, appointment booking, and help support. Future integration with a backend API and a database (e.g., MongoDB) will enable personalized user experiences, scan history tracking, and secure data storage.
## Features
### Current Functionalities
#### Landing Page

A welcoming interfaceshowcasing the purpose of Scan-AI, including a hero section, statistics (e.g., 24/7 support, 100+ doctors, 1M+ active patients), services (pneumonia detection, diagnosis records, appointments, consultations), testimonials, and reasons to choose Scan-AI.
Responsive design with a navbar and footer for navigation.

#### Scan Page

Allows usersto upload chest X-ray images (JPG, PNG, JPEG) for AI-driven pneumonia detection.
Displays a user-friendly upload box with a drag-and-drop-like interface, showing the selected file name upon upload.
Provides instructions and accepted file formats.

#### Navbar and Sidebar

A responsive navbarwith links to Home, Scan, About, Help & Support, and Appointment pages.
A settings icon that toggles a sidebar with sections for General (e.g., Customers, Connections) and Account (e.g., General, Security, Notifications).
Dynamic sidebar content based on user authentication status (logged-in vs. logged-out views).
Mobile-friendly menu toggle.

#### Authentication Pages

Login and Signuppages for user authentication, supporting all user types (free, premium, doctor, and admin), integrated with an AuthContext for state management.

#### Appointment and Help Pages

For booking appointmentsand accessing help/support, expanded with form functionality for appointments, currently integrating Formspree.

#### Footer

Includes sectionsfor Company (About Us, Services, Privacy Policy), Get Help (FAQs, Payment Options), and social media links, with a copyright notice.

## Recent Updates

**Authentication System Fix (May 17, 2025)**:
- ✅ Fixed all authentication-related issues
- ✅ Consolidated server architecture
- ✅ Enhanced error handling and improved security
- ✅ Updated documentation and added troubleshooting guides

For detailed information about authentication fixes, see [AUTH_FIXES_FINAL.md](./AUTH_FIXES_FINAL.md).

## Functionalities That Are Still in Construction (Backend Side)

Backend Integration: Connect to a backend API to process uploaded X-rays and return AI-generated pneumonia detection results.
User Accounts: Store user data, scan history, and appointment details in a database (MongoDB).
Free plan users can only use the model once, while premium users can use it 5 times before their subscription expires.
Both user types can book appointments at the clinic, but premium users have access to a list of doctors to choose from when filling the appointment form.
The admin can view the traffic on the website as well as the user's requirements and answer them (from help form) and see the appointments scheduled for all the users and their scan history and account info
The doctor can view their patients' scan results and appointments


Real-time Results: Display AI analysis results on the Scan page after processing.
Appointment Scheduling: Implement a form to book consultations with healthcare providers.
Security Enhancements: Implement secure file uploads and user authentication with JWT or OAuth.

Technologies Used
Frontend

React: For building the user interface with reusable components.
HTML/CSS: For structuring and styling the pages (custom CSS without frameworks like Tailwind).
JavaScript: For interactivity and state management.
Font Awesome: For icons in the navbar, sidebar, and footer.

Backend

Node.js/Express: For API development.
MongoDB: For database storage.
AI Model: Integration with a CNN model for X-ray analysis (using TensorFlow).

Development Tools

Vite: For fast React development and hot reloading.
npm: For package management.

Installation and Setup
Prerequisites

Node.js (v16 or later)
npm (v8 or later)
Git (for cloning the repository)

Steps

Clone the Repository:
git clone https://github.com/your-username/scan-ai.git
cd scan-ai


Install Dependencies:

Navigate to the frontend directory:cd frontend
npm install


Navigate to the root directory and install backend dependencies:npm install




Run the Development Server:

For the frontend:cd frontend
npm run dev


Open your browser and visit http://localhost:5173/ to see the landing page.


For the backend:node server.js


Ensure MongoDB is running locally or configured with a remote URI.




Build for Production (Optional):

Frontend:cd frontend
npm run build


This generates a production-ready build in the frontend/dist folder.





Project Structure
scan-ai/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── AppointmentForm.jsx
│   │   │   ├── HelpForm.jsx
│   │   │   ├── About.jsx
│   │   │   └── Authpage.jsx (LoginPage, SignupPage)
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   └── ScanPage.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   ├── ScanPage.css
│   │   │   └── About.css
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── vite.config.js
├── SCAN_AI/
│   ├── config/
│   │   └── config.js
│   ├── controllers/
│   │   ├── middleware.js
│   │   ├── auth.js
│   │   └── modelsCheck.js
│   ├── middleware/
│   │   └── auth.js
│   ├── authjs/
│   │   └── auth.js
│   ├── models/
│   │   ├── appointment.js
│   │   ├── helpRequest.js
│   │   └── user.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── appointment.js
│   │   ├── auth.js
│   │   ├── help.js
│   │   ├── scan.js
│   │   └── env.js
│   ├── db.js
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── server.js
│   └── node_modules/
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
└── README.md

Usage

Navigate the Website: Use the navbar to switch between pages (Home, Scan, etc.).
Upload X-ray: On the Scan page, click "Upload Files" to select a chest X-ray image. The file name will be displayed (backend processing is pending).
Sidebar: Click the settings icon to toggle the sidebar, which adjusts content based on login status.
Mobile View: Resize the browser or use a mobile device to test the responsive navbar.

Known Issues

Backend Not Integrated: The upload feature logs the file name but doesn’t process the X-ray yet.
Authentication Placeholder: Login and Signup pages are placeholders; AuthContext needs full implementation.
Database Connection: MongoDB integration is unresolved (e.g., queryTxt ETIMEOUT error).
About Page Missing: The /about route in the navbar lacks a corresponding component (About.jsx needs to be created).

Contributing
We welcome contributions to enhance Scan-AI! To contribute:

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

## Setup and Installation

For detailed setup instructions, please refer to the [SETUP.md](./SETUP.md) guide. Here's a quick start guide:

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the backend server:
   ```
   npm start
   ```
   
   Or use the PowerShell script we created:
   ```
   .\start-server.ps1
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

4. Access the application at http://localhost:5173 in your web browser

## License
This project is under the MIT License - see the LICENSE file for details.

## Contact
For questions or collaboration, please contact [your-email@example.com] or open an issue on the GitHub repository.

## Acknowledgments

- Inspired by the need for accessible healthcare diagnostics
- Thanks to the open-source community for tools like React, Express, and MongoDB
- Special thanks to everyone who contributed to fixing the authentication issues

