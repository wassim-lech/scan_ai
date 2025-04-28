// backend/routes/appointments.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const Appointment = require('../models/appointment');

// Create an appointment (for users)
router.post('/', auth, async (req, res) => {
    try {
      const { doctor, date, time } = req.body;
      const appointment = new Appointment({
        userId: req.user.id,
        doctor,
        date,
        time,
      });
      await appointment.save();
      res.status(201).json({ msg: 'Appointment created', appointment });
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  });
  
  // View user's appointments (for users)
  router.get('/', auth, async (req, res) => {
    try {
      const appointments = await Appointment.find({ userId: req.user.id });
      res.json(appointments);
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  });
  
  // View doctor's appointments (for doctors)
  router.get('/doctor', [auth, roleCheck(['doctor'])], async (req, res) => {
    try {
      const appointments = await Appointment.find({ doctor: req.user.username });
      res.json(appointments);
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  });
  
  module.exports = router;