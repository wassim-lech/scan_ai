const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/auth');

// Load environment variables
require('dotenv').config();

// Initialize app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// In your backend app.js
app.use(cors({
  origin: 'http://localhost:3000', // your React app URL
  credentials: true
}));