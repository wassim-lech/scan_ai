// Admin routes for database management
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const User = require('../models/user');
const Appointment = require('../models/appointment');

// Get all users (admin only)
router.get('/users', [auth, roleCheck('admin')], async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get a specific user (admin only)
router.get('/users/:id', [auth, roleCheck('admin')], async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update a user (admin only)
router.put('/users/:id', [auth, roleCheck('admin')], async (req, res) => {  try {
    const { 
      first_name, 
      last_name, 
      phone, 
      address, 
      role, 
      scansRemaining,
      newPassword
    } = req.body;

    // Find user by ID
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update user fields if provided
    if (first_name !== undefined) user.first_name = first_name;
    if (last_name !== undefined) user.last_name = last_name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (role !== undefined && ['free', 'premium', 'doctor', 'admin'].includes(role)) {
      user.role = role;
    }
    if (scansRemaining !== undefined) user.scansRemaining = scansRemaining;
    
    // Handle password change if provided
    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ msg: 'Password must be at least 6 characters long' });
      }
      user.password = newPassword; // Will be hashed by the pre-save middleware
    }

    console.log('Updating user:', {
      id: user._id,
      fields_updated: {
        first_name: first_name !== undefined,
        last_name: last_name !== undefined,
        phone: phone !== undefined,
        address: address !== undefined,
        role: role !== undefined,
        scansRemaining: scansRemaining !== undefined
      }
    });

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all appointments (admin only)
router.get('/appointments', [auth, roleCheck('admin')], async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('userId', 'username email first_name last_name')
      .sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update an appointment (admin only)
router.put('/appointments/:id', [auth, roleCheck('admin')], async (req, res) => {
  try {
    const { doctor, date, time, status } = req.body;

    // Find appointment by ID
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    // Update appointment fields if provided
    if (doctor !== undefined) appointment.doctor = doctor;
    if (date !== undefined) appointment.date = new Date(date);
    if (time !== undefined) appointment.time = time;
    if (status !== undefined && ['pending', 'confirmed', 'cancelled'].includes(status)) {
      appointment.status = status;
    }

    console.log('Updating appointment:', {
      id: appointment._id,
      fields_updated: {
        doctor: doctor !== undefined,
        date: date !== undefined,
        time: time !== undefined,
        status: status !== undefined
      }
    });

    await appointment.save();
    res.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update a scan record (admin only)
router.put('/scans/:userId/:scanId', [auth, roleCheck('admin')], async (req, res) => {
  try {
    const { result, confidence, date } = req.body;
    const { userId, scanId } = req.params;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Find scan in user's scan history
    const scanIndex = user.scanHistory.findIndex(scan => scan.id === scanId);
    if (scanIndex === -1) {
      return res.status(404).json({ msg: 'Scan record not found' });
    }

    // Update scan fields if provided
    if (result !== undefined) user.scanHistory[scanIndex].result = result;
    if (confidence !== undefined) user.scanHistory[scanIndex].confidence = confidence;
    if (date !== undefined) user.scanHistory[scanIndex].date = new Date(date);

    console.log('Updating scan record:', {
      userId,
      scanId,
      fields_updated: {
        result: result !== undefined,
        confidence: confidence !== undefined,
        date: date !== undefined
      }
    });

    await user.save();
    res.json(user.scanHistory[scanIndex]);
  } catch (error) {
    console.error('Error updating scan record:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
