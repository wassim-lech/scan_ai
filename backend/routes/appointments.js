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
  
router.get('/slots', auth, async (req, res) => {
  const { date } = req.query;
  try {
    const slots = await Appointment.find({ date: new Date(date) });
    res.json(slots.map(slot => slot.time));
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/book', [auth, roleCheck(['free', 'premium'])], async (req, res) => {
  const { date, time, doctorId } = req.body;
  try {
    const existing = await Appointment.findOne({ date, time });
    if (existing) return res.status(400).json({ msg: 'Slot already booked' });
    const appointment = new Appointment({
      userId: req.user.id,
      date,
      time,
      doctorId: user.role === 'premium' ? doctorId : null,
    });
    await appointment.save();
    res.status(201).json({ msg: 'Appointment booked', appointment });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});
  module.exports = router;