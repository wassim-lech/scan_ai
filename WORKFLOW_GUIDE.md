# ScanAI - Complete Workflow Testing Guide

## Overview

This guide provides a comprehensive step-by-step process for testing the complete ScanAI application workflow, especially focusing on the pneumonia detection AI functionality. Follow these instructions to verify that all components are working together correctly.

## Prerequisites

- Windows system with PowerShell
- Python 3.8+ (Python 3.11 recommended)
- Node.js installed
- MongoDB running locally or connection string configured

## Step 1: Start All Services

Use our convenient startup script to launch all services at once:

```powershell
cd c:\Users\user\scan_ai
.\start-services.ps1
```

This will:
- Start the Model API on port 5005
- Start the Backend Server on port 5001
- Start the Frontend on port 5173

## Step 2: Verify Services are Running

### Model API
- Open your browser and navigate to: http://localhost:5005/api/health
- You should see a JSON response with status "online" and model "loaded"

### Backend Server
- Navigate to: http://localhost:5001/api/test
- You should see a message like "API is working"

### Frontend
- Navigate to: http://localhost:5173
- You should see the ScanAI application landing page

## Step 3: Test User Authentication

1. **Register a new user**
   - Click on "Sign Up" or "Register"
   - Fill in required details and submit
   - You should be redirected to the login page or directly logged in

2. **Log in with existing user**
   - Use the credentials you just created
   - Verify you can access protected routes

## Step 4: Test Pneumonia Detection

1. **Access scan feature**
   - Navigate to the scan section of the application

2. **Upload an image**
   - Choose a chest X-ray image
   - Click upload or submit
   - Wait for processing (this may take a few seconds)

3. **View results**
   - Verify that classification results appear
   - Check that the probability score is displayed
   - Confirm the image is visible in the results

## Step 5: Test Other Features

1. **Appointments**
   - Schedule a new appointment
   - View existing appointments
   - Cancel an appointment

2. **Help Requests**
   - Submit a help request
   - Check status of existing requests

3. **Admin Functions** (if you have admin access)
   - View user list
   - Manage appointments
   - View system statistics

## Troubleshooting

### Model API Issues

- **Server not starting**: 
  ```powershell
  cd c:\Users\user\scan_ai\backend\model_api
  .\quick_fix.ps1
  .\start_api_direct.ps1
  ```

- **Module not found errors**:
  ```powershell
  cd c:\Users\user\scan_ai\backend\model_api
  .\venv\Scripts\pip install flask flask-cors werkzeug==2.0.1 tensorflow==2.12.0 numpy==1.23.5 pillow==9.5.0 h5py==3.13.0
  ```

- **Port conflicts**: Check if another application is using port 5005

### Backend Server Issues

- **Connection errors**:
  ```powershell
  cd c:\Users\user\scan_ai\backend
  node utils/checkMongo.js
  ```

- **Module not found errors**:
  ```powershell
  cd c:\Users\user\scan_ai\backend
  npm install
  ```

### Frontend Issues

- **Build errors**:
  ```powershell
  cd c:\Users\user\scan_ai\frontend
  npm install
  npm run dev
  ```

- **Proxy errors**: Check that the backend server is running on port 5001

## Important Endpoints

- Frontend: http://localhost:5173
- Backend API: http://localhost:5001/api
- Model API: http://localhost:5005/api
- Health Check (Backend): http://localhost:5001/api/health
- Health Check (Model API): http://localhost:5005/api/health

## Additional Resources

- `API_SETUP_GUIDE.md`: Detailed instructions for the Model API
- `DEPENDENCY_FIXES.md`: Information about dependency resolution
- `TESTING_GUIDE.md`: General testing guidelines
