const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/scan_ai', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/help', require('./routes/help'));
app.use('/api/scan', require('./routes/scan'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));