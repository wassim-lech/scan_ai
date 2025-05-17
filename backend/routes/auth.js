const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Test route - should be accessible at /api/auth/test
router.get('/test', (req, res) => {
  console.log('Auth test endpoint hit!');
  res.json({ message: 'Auth API is working!' });
});

// Login route
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const { email, password } = req.body;

    // Check for user with that email
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('User not found with email:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch ? 'Yes' : 'No');

    if (!isMatch) {
      console.log('Password incorrect for user:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // User matched, create and return token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1d' }
    );
    console.log('Login successful, token generated for user:', email);
    
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Registration route
router.post('/signup', async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);
    const { username, email, password } = req.body;
    
    // Check if user exists
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
      password, // Will be hashed in the pre-save hook
      role: 'free',
      scansRemaining: 1
    });
    
    // Save user to database
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1d' }
    );
    
    res.status(201).json({ token });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get authenticated user
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;