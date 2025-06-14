const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');

// Get user's notifications
router.get('/notifications', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user.notifications);
  } catch (err) {
    console.error('Error getting notifications:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Mark notification as read
router.put('/notifications/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Find the notification in the user's notifications array
    const notification = user.notifications.id(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }
    
    // Update the notification status
    notification.status = 'read';
    
    await user.save();
    
    res.json(user.notifications);
  } catch (err) {
    console.error('Error updating notification:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Error getting user profile:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all doctors
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('username first_name last_name email specialty');
    res.json(doctors);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get doctors by specialty
router.get('/doctors/specialty/:specialty', async (req, res) => {
  try {
    const { specialty } = req.params;
    const doctors = await User.find({ 
      role: 'doctor', 
      specialty: new RegExp(specialty, 'i') 
    }).select('username first_name last_name email specialty');
    res.json(doctors);
  } catch (err) {
    console.error(`Error fetching doctors by specialty ${req.params.specialty}:`, err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
