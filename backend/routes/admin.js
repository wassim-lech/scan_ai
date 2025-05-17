// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const User = require('../models/user');
const Appointment = require('../models/appointment');

// Get all users (admin only)
router.get('/users', [auth, roleCheck(['admin'])], async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Error retrieving users:', err);
    res.status(500).json({ msg: 'Server error', details: err.message });
  }
});

// Create a new user (admin only)
router.post('/create-user', [auth, roleCheck(['admin'])], async (req, res) => {
  try {
    const { username, email, password, role, scansRemaining } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      if (user.email === email) {
        return res.status(400).json({ msg: 'Email already in use' });
      } else {
        return res.status(400).json({ msg: 'Username already taken' });
      }
    }

    // Create new user with specified role
    user = new User({
      username,
      email,
      password,
      role: role || 'free',
      scansRemaining: scansRemaining || 1,
      scanHistory: []
    });

    await user.save();

    // Don't send the password back
    user.password = undefined;

    res.json(user);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ msg: 'Server error', details: err.message });
  }
});

// Get user by ID (admin only)
router.get('/users/:id', [auth, roleCheck(['admin'])], async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Error getting user:', err);
    res.status(500).json({ msg: 'Server error', details: err.message });
  }
});

// Update user (admin only)
router.put('/users/:id', [auth, roleCheck(['admin'])], async (req, res) => {
  try {
    const { username, email, role, scansRemaining } = req.body;
    
    // Build user object
    const userFields = {};
    if (username) userFields.username = username;
    if (email) userFields.email = email;
    if (role) userFields.role = role;
    if (scansRemaining !== undefined) userFields.scansRemaining = scansRemaining;
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ msg: 'Server error', details: err.message });
  }
});

// Delete user (admin only)
router.delete('/users/:id', [auth, roleCheck(['admin'])], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    await user.deleteOne();
    
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ msg: 'Server error', details: err.message });
  }
});

router.get('/appointments', [auth, roleCheck(['admin'])], async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    console.error('Error retrieving appointments:', err);
    res.status(500).json({ msg: 'Server error', details: err.message });
  }
});

module.exports = router;