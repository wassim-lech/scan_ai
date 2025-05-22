const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Updated to match Vite's default frontend URL
  credentials: true,
  exposedHeaders: ['x-auth-token']
}));
app.use(express.json({ extended: false }));

// Add logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  if (req.method === 'POST') {
    console.log('Request body:', req.body);
  }
  next();
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/admin-database', require('./routes/admin-database'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/users', require('./routes/users'));
app.use('/api/help', require('./routes/help'));
app.use('/api/scans', require('./routes/scan'));
app.use('/api/subscription', require('./routes/subscription'));

// Serve uploaded files as static files
const path = require('path');
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('Serving static files from:', path.join(__dirname, 'uploads'));

// Add a special route to view a specific image by filename
app.get('/api/image/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, 'uploads', filename);
  
  // Log the request for debugging
  console.log(`Image request for: ${filename}, full path: ${imagePath}`);
  
  // Check if file exists
  if (!fs.existsSync(imagePath)) {
    console.log(`File not found: ${imagePath}`);
    return res.status(404).json({ error: 'Image not found' });
  }
  
  // Serve the file with proper content type based on extension
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') {
    res.setHeader('Content-Type', 'image/jpeg');
  } else if (ext === '.png') {
    res.setHeader('Content-Type', 'image/png');
  }
  
  res.sendFile(imagePath);
});

// Add other routes as needed

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/scanAi', { // Fixed case to match existing DB
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
})
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    console.log('Please make sure MongoDB is running and accessible');
    console.log('Error details:', err.message);
  });

const PORT = process.env.PORT || 5001; // Using consistent port defined in .env
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));