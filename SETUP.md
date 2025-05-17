# SCAN AI Application

A medical imaging application for AI-enhanced scan analysis.

## Authentication Issue Resolution Complete

As of May 17, 2025, we have successfully fixed all authentication issues:

1. ✅ Consolidated server files to use only server.js as the main entry point
2. ✅ Fixed CORS configuration to allow frontend requests from http://localhost:5173
3. ✅ Corrected database name case sensitivity issue (scanAi vs scanai)
4. ✅ Standardized API endpoint usage throughout the application
5. ✅ Enhanced error handling and improved server logging
6. ✅ Updated all port references to consistently use port 5001

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following content:
   ```
   JWT_SECRET=b5c9d8a31f7e6035208c4e96dd72591b0a7f8e2d4c6b9e3a5d7f8e9c1b3a5d7
   MONGO_URI=mongodb://localhost:27017/scanAi
   PORT=5001
   ```

4. Start the backend server:
   ```
   npm start
   ```
   Or for development with auto-restart:
   ```
   npm run dev
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

3. Create a `.env` file with the following content:
   ```
   VITE_API_URL=http://localhost:5001/api
   VITE_ENABLE_API_LOGS=true
   ```

4. Start the frontend development server:
   ```
   npm run dev
   ```

## Important Notes

- The backend runs on port 5001 by default
- The frontend runs on port 5173 by default (Vite's default port)
- MongoDB should be running locally with a database named "scanAi"
- All authentication requests are made to the `/api/auth/*` endpoints

## Troubleshooting

If you encounter issues with authentication:

1. Check MongoDB is running and accessible
2. Verify CORS settings in `backend/server.js` match your frontend URL
3. Ensure API endpoints in frontend components use the correct URL/port
4. Check browser console for detailed error messages
5. Server logs will show detailed authentication flow information

For more details, see the [AUTH_FIXES.md](./AUTH_FIXES.md) file.
