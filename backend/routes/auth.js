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
    }    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '30d' }
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
    const { username, email, password, first_name, last_name, phone, address } = req.body;

    // Input validation
    if (!username || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: 'Please provide a valid email address' });
    }
    
    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters long' });
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
    }    // Create new user
    user = new User({
      username,
      email,
      password, // Will be hashed via pre-save hook in User model
      first_name: first_name || '',
      last_name: last_name || '',
      phone: phone || '',
      address: address || '',
      role: 'free',
      scansRemaining: 1,
      scanHistory: []
    });

    console.log('Creating new user with data:', {
      username,
      email,
      first_name: first_name || '',
      last_name: last_name || '',
      phone: phone || '',
      address: address || '',
      role: 'free'
    });

    await user.save();    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '30d' }
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

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { first_name, last_name, phone, address, current_password, new_password } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
      // Validate phone format if provided
    if (phone) {
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ msg: 'Please provide a valid phone number' });
      }
    }
    
    // Validate address if provided
    if (address && address.length > 200) {
      return res.status(400).json({ msg: 'Address must be less than 200 characters' });
    }
    
    // Update basic profile info
    if (first_name !== undefined) user.first_name = first_name;
    if (last_name !== undefined) user.last_name = last_name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
      console.log('Updating user profile with data:', {
      first_name: first_name !== undefined ? first_name : '(unchanged)',
      last_name: last_name !== undefined ? last_name : '(unchanged)',
      phone: phone !== undefined ? phone : '(unchanged)',
      address: address !== undefined ? address : '(unchanged)',
      password_change: current_password && new_password ? true : false
    });
      // Password change
    if (current_password && new_password) {
      // Validate new password strength
      if (new_password.length < 6) {
        return res.status(400).json({ msg: 'New password must be at least 6 characters long' });
      }
      
      // Verify current password
      const isMatch = await bcrypt.compare(current_password, user.password);
      
      if (!isMatch) {
        return res.status(400).json({ msg: 'Current password is incorrect' });
      }
      
      // Set new password - it will be hashed by the pre-save middleware
      user.password = new_password;
    } else if ((current_password && !new_password) || (!current_password && new_password)) {
      return res.status(400).json({ msg: 'Both current and new password are required to change password' });
    }
      await user.save();
    
    // Return updated user without password
    const updatedUser = await User.findById(req.user.id).select('-password');
    console.log('User profile updated successfully:', updatedUser);
    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating profile:', err);
    
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ msg: messages.join(', ') });
    }
    
    res.status(500).json({ msg: 'Server error updating profile' });  }
});

// Verify token route - used to check if the user's token is still valid
router.get('/verify', auth, async (req, res) => {
  try {
    // If auth middleware passes, token is valid
    res.status(200).json({ valid: true });
  } catch (err) {
    console.error('Error verifying token:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;