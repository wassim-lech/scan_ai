const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Direct test route to verify server is working
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit!');
  res.json({ message: 'API server is working!' });
});

// Connect to MongoDB
// For local MongoDB connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/scanai';
console.log('Connecting to MongoDB:', mongoURI);

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin')); // If you have this route
// Add other routes as needed

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test endpoint available at: http://localhost:${PORT}/api/test`);
});