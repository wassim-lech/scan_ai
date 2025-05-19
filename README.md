# ScanAI - Pneumonia Detection Application

ScanAI is a comprehensive healthcare application that utilizes artificial intelligence to detect pneumonia from chest X-ray images. The application provides user authentication, appointment scheduling, and immediate pneumonia detection results.

## 🔧 Recent Improvements

### Dependency Compatibility Fixes (May 2025)
We've resolved critical dependency conflicts that prevented the model API from functioning correctly:

- Fixed Flask and Werkzeug version compatibility
- Resolved NumPy and TensorFlow version conflicts
- Created properly configured virtual environment
- Added robust startup scripts for all components
- Fixed port configuration conflicts across the application

### Authentication Enhancements
- Improved admin login functionality
- Enhanced user role management
- Added secure password handling

## 🚀 Getting Started

### Prerequisites
- Windows with PowerShell
- Python 3.8+ (Python 3.11 recommended)
- Node.js 18+ installed
- MongoDB running locally or connection string configured

### Quick Start

The easiest way to run ScanAI is using our one-click startup script:

```powershell
cd c:\Users\user\scan_ai
.\start-services.ps1
```

This will:
1. Start the pneumonia detection model API server
2. Start the backend API server
3. Start the frontend development server

Then open http://localhost:5173 in your browser to access the application.

### Manual Startup

If you prefer to start the components individually:

1. **Start the Model API**:
```powershell
cd c:\Users\user\scan_ai\backend\model_api
.\start_api_direct.ps1
```

2. **Start the Backend**:
```powershell
cd c:\Users\user\scan_ai\backend
.\start-server.ps1
```

3. **Start the Frontend**:
```powershell
cd c:\Users\user\scan_ai\frontend
npm run dev
```

## 📂 Project Structure

- **frontend/** - React-based user interface
- **backend/** - Express.js REST API server
  - **model_api/** - Flask server for AI model hosting
  - **routes/** - API endpoints
  - **models/** - MongoDB schemas
  - **controllers/** - Business logic
  - **middleware/** - Authentication & request processing

## 🔍 Documentation

For more detailed information, please see the following guides:

- [Workflow Guide](WORKFLOW_GUIDE.md) - Complete testing workflow
- [API Setup Guide](backend/model_api/API_SETUP_GUIDE.md) - Model API configuration
- [Dependency Fixes](DEPENDENCY_FIXES.md) - Dependency resolution details
- [Testing Guide](TESTING_GUIDE.md) - Component testing instructions

## ⚙️ System Configuration

| Component | Port | Technology |
|-----------|------|------------|
| Frontend  | 5173 | React + Vite |
| Backend   | 5001 | Node.js + Express |
| Model API | 5005 | Python + Flask |
| Database  | 27017 | MongoDB |

## 🔒 Security Considerations

- JWT-based authentication
- Role-based access control
- Secure password hashing
- Input validation

## 🧪 Testing

To test the system:
1. Start all components using `start-services.ps1`
2. Navigate to http://localhost:5173
3. Create a user account or log in
4. Upload an X-ray image for analysis

## 📞 Support

For any issues:
1. Check the troubleshooting section in [WORKFLOW_GUIDE.md](WORKFLOW_GUIDE.md)
2. Run the appropriate quick fix scripts in the model_api directory
3. Verify all services are running on the correct ports
