// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// User registration
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Check if user exists
    let existingUser = await User.findOne({ $or: [{ email }, { username }] });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ msg: 'Email already in use' });
      } else {
        return res.status(400).json({ msg: 'Username already taken' });
      }
    }
    
    // Default role is 'free' if not specified or if trying to register as admin
    const userRole = (role && role !== 'admin') ? role : 'free';
    
    // Set initial scans based on role
    const scansRemaining = userRole === 'premium' ? 5 : 1;
    
    // Create new user - password will be hashed by the pre-save hook
    user = new User({ 
      username, 
      email, 
      password,
      role: userRole,
      scansRemaining
    });
    
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );
    
    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check for user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    
    // Validate password - using the method we added to the UserSchema
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    
    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );
    
    res.json({ token });
  } catch (err) {
    console.error(err.message);
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
    res.status(500).send('Server Error');
  }
});

// Upgrade to premium account
router.post('/upgrade-to-premium', auth, async (req, res) => {
  try {
    // Find user and update role
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    user.role = 'premium';
    user.scansRemaining = 5; // Give 5 more scans
    
    await user.save();
    
    res.json({ msg: 'Account upgraded to premium', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Refresh scan count for premium users
router.post('/refresh-scans', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    if (user.role !== 'premium') {
      return res.status(403).json({ msg: 'Only premium users can refresh scans' });
    }
    
    user.scansRemaining = 5; // Refresh to 5 scans
    await user.save();
    
    res.json({ msg: 'Scans refreshed', scansRemaining: user.scansRemaining });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;