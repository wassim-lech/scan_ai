// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const User = require('../models/user');
const Appointment = require('../models/appointment');

router.get('/users', [auth, roleCheck(['admin'])], async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/appointments', [auth, roleCheck(['admin'])], async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;