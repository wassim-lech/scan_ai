//backend/app.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const helpRoutes = require('./routes/help');
const appointmentRoutes = require('./routes/appointments'); // Add this

const PORT = process.env.PORT || 5000;

// Initialize app
const app = express();


// Load environment variables
require('dotenv').config();


// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // your React app URL
  credentials: true
}));

// authentication
app.use('/api/auth', authRoutes);
// admin user
app.use('/api/admin', adminRoutes);
// help
app.use('/api/help', helpRoutes);
// appointments
app.use('/api/appointments', appointmentRoutes); 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));