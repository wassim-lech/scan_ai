const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/user'); // Make sure this path matches your file structure

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth API is working' });
});

// Login route
router.post('/login', async (req, res) => {
  try {
    console.log('Login request body:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ msg: 'Please provide email and password' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch ? 'Yes' : 'No');

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1d' }
    );    console.log('Login successful, token generated');
    res.json({ token });
  } catch (err) {
    console.error('Login error details:', err);
    
    // Handle specific error types
    if (err.name === 'ValidationError') {
      console.log('Validation error detected');
      return res.status(400).json({ msg: 'Invalid input data' });
    }
    
    // Better error message for frontend
    res.status(500).json({ 
      msg: 'Server error during login. Please try again.', 
      details: err.message
    });
  }
});

// Registration route
router.post('/signup', async (req, res) => {
  try {
    console.log('Registration request body:', req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    console.log('Checking if user exists...');
    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      if (user.email === email) {
        return res.status(400).json({ msg: 'Email already in use' });
      } else {
        return res.status(400).json({ msg: 'Username already taken' });
      }
    }

    // Create new user
    user = new User({
      username,
      email,
      password, // Will be hashed via pre-save hook in User model
      role: 'free',
      scansRemaining: 1,
      scanHistory: []
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1d' }
    );    console.log('Registration successful, token generated');
    res.status(201).json({ token });
  } catch (err) {
    console.error('Registration error details:', err);
    
    // Check for MongoDB duplicate key error
    if (err.name === 'MongoError' || err.code === 11000) {
      console.log('Duplicate key error detected');
      return res.status(400).json({ msg: 'User already exists with that email or username' });
    }
    
    // Check for validation errors
    if (err.name === 'ValidationError') {
      console.log('Validation error detected');
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ msg: messages.join(', ') });
    }
    
    // Generic error
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
});

// Get authenticated user
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Error getting user:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;