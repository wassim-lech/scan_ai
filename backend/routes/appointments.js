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
  const { date, time, doctorId, reason } = req.body;
  try {
    const existing = await Appointment.findOne({ date, time });
    if (existing) return res.status(400).json({ msg: 'Slot already booked' });
    
    const user = req.user;
    const appointment = new Appointment({
      userId: user.id,
      date,
      time,
      doctor: doctorId,
      reason: reason || 'Regular checkup'
    });
    
    await appointment.save();
    res.status(201).json({ msg: 'Appointment booked', appointment });
  } catch (err) {
    console.error('Error booking appointment:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// View doctor's patients (for doctors)
router.get('/doctor/patients', [auth, roleCheck(['doctor'])], async (req, res) => {
  try {
    // Find all appointments for this doctor
    const doctorAppointments = await Appointment.find({ doctor: req.user.username })
      .populate('userId', 'name email phone');
    
    // Extract unique patients
    const uniquePatients = {};
    doctorAppointments.forEach(appointment => {
      if (appointment.userId && typeof appointment.userId === 'object') {
        const patientId = appointment.userId._id.toString();
        if (!uniquePatients[patientId]) {
          uniquePatients[patientId] = {
            _id: patientId,
            name: appointment.userId.name,
            email: appointment.userId.email,
            phone: appointment.userId.phone,
            lastVisit: appointment.date
          };
        } else if (new Date(appointment.date) > new Date(uniquePatients[patientId].lastVisit)) {
          // Update last visit date if this appointment is more recent
          uniquePatients[patientId].lastVisit = appointment.date;
        }
      }
    });
    
    res.json(Object.values(uniquePatients));
  } catch (err) {
    console.error('Error fetching doctor patients:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// View patient scan results (for doctors)
router.get('/doctor/scan-results', [auth, roleCheck(['doctor'])], async (req, res) => {
  try {
    // Find all appointments for this doctor
    const doctorAppointments = await Appointment.find({ doctor: req.user.username })
      .populate('userId', 'name')
      .populate('scanId');
    
    // Extract scan results
    const scanResults = doctorAppointments
      .filter(appointment => appointment.scanId)
      .map(appointment => {
        return {
          _id: appointment.scanId._id,
          patientName: appointment.userId?.name || 'Unknown Patient',
          scanDate: appointment.scanId.createdAt || appointment.date,
          scanType: appointment.scanId.type || 'X-Ray',
          diagnosis: appointment.scanId.result,
          confidence: appointment.scanId.confidence
        };
      });
    
    res.json(scanResults);
  } catch (err) {
    console.error('Error fetching scan results:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

  module.exports = router;