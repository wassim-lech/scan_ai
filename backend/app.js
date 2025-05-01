const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const helpRoutes = require('./routes/help');
const appointmentRoutes = require('./routes/appointments');

const PORT = process.env.PORT || 5000;

// Initialize app
const app = express();

// Load environment variables
require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI); // Add this line for debugging

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Your React app URL
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/help', helpRoutes);
app.use('/api/appointments', appointmentRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));