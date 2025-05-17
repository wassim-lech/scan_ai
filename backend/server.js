/**
 * SCAN AI - BACKEND SERVER
 * 
 * RECOMMENDATIONS FOR IMPROVED STABILITY:
 * --------------------------------------
 * 1. CONSOLIDATE SERVER FILES: Consider removing app.js and using only this server.js file to avoid port conflicts
 *    and confusion about which file is the main entry point.
 * 
 * 2. CONSISTENT API USAGE: Use the api.js utility consistently across all frontend components instead
 *    of direct axios calls to ensure consistent headers and error handling.
 * 
 * 3. ERROR MONITORING: Monitor these server logs carefully during login/signup operations to catch 
 *    authentication issues early.
 * 
 * 4. DATABASE NAMING: Maintain consistent database naming conventions (scanAi vs scanai) to avoid
 *    case sensitivity issues, especially when deploying to Linux environments.
 * 
 * 5. ENVIRONMENT CONFIG: Continue using .env files for configuration but ensure values are synchronized
 *    across environments.
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Updated to match Vite's default frontend URL
  credentials: true,
  exposedHeaders: ['x-auth-token']
}));
app.use(express.json({ extended: false }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/scanAi', { // Fixed case to match existing DB
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
})
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    console.log('Please make sure MongoDB is running and accessible');
  });

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin')); // Admin routes
app.use('/api/scans', require('./routes/scan'));
// Add other routes as needed

/**
 * AUTHENTICATION TROUBLESHOOTING:
 * ------------------------------
 * If login/signup issues persist, check the following:
 * 
 * 1. MongoDB Connection: Ensure database is running (fixed case sensitivity issue with scanAi)
 * 2. JWT Token: Check that token is properly stored and included in request headers
 * 3. CORS: Make sure frontend origin matches the CORS configuration above
 * 4. Port Configuration: Ensure frontend API calls are using the correct port (5001)
 * 5. Error Handling: See detailed error messages in the console logs
 */

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
  });
}

// Add a test route to check if server is working
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).json({ 
    message: 'Server error occurred',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

const PORT = process.env.PORT || 5001; // Changed to 5001 to avoid conflicts
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`Server running on port ${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`API base URL: http://localhost:${PORT}/api`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`MongoDB: ${process.env.MONGO_URI || 'mongodb://localhost:27017/scanAi'}`);
  console.log('='.repeat(50));
});