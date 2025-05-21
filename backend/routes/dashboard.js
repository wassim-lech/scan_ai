// Admin dashboard data routes
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const User = require('../models/user');
const Appointment = require('../models/appointment');
const HelpRequest = require('../models/helpRequest');

// Get dashboard overview data (admin only)
router.get('/dashboard', [auth, roleCheck('admin')], async (req, res) => {
  try {
    // Get user statistics
    const totalUsers = await User.countDocuments();
    const doctorUsers = await User.countDocuments({ role: 'doctor' });
    const premiumUsers = await User.countDocuments({ role: 'premium' });
    const freeUsers = await User.countDocuments({ role: 'free' });

    // Get appointment statistics
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const confirmedAppointments = await Appointment.countDocuments({ status: 'confirmed' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });

    // Get scan statistics
    const usersWithScans = await User.find({ 'scanHistory.0': { $exists: true } });
    let totalScans = 0;
    let diagnosisBreakdown = { Healthy: 0, Pneumonia: 0, Other: 0 };
    
    usersWithScans.forEach(user => {
      totalScans += user.scanHistory.length;
      user.scanHistory.forEach(scan => {
        if (scan.result === 'Healthy') {
          diagnosisBreakdown.Healthy++;
        } else if (scan.result === 'Pneumonia') {
          diagnosisBreakdown.Pneumonia++;
        } else {
          diagnosisBreakdown.Other++;
        }
      });
    });

    // Get growth data - users registered per month
    const now = new Date();
    const currentYear = now.getFullYear();
    const monthlyGrowth = [];
    
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(currentYear, month, 1);
      const endDate = new Date(currentYear, month + 1, 0);
      
      const count = await User.countDocuments({
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      });
      
      monthlyGrowth.push({
        month: startDate.toLocaleString('default', { month: 'short' }),
        count
      });
    }
    
    // Get monthly scan counts
    const monthlyScans = [];
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(currentYear, month, 1);
      const endDate = new Date(currentYear, month + 1, 0);
      
      let count = 0;
      for (const user of usersWithScans) {
        const scansThisMonth = user.scanHistory.filter(scan => {
          const scanDate = new Date(scan.date);
          return scanDate >= startDate && scanDate <= endDate;
        });
        count += scansThisMonth.length;
      }
      
      monthlyScans.push({
        month: startDate.toLocaleString('default', { month: 'short' }),
        count
      });
    }

    // Weekly appointments breakdown
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyAppointments = Array(7).fill(0);
    
    const allAppointments = await Appointment.find();
    allAppointments.forEach(appointment => {
      const day = new Date(appointment.date).getDay();
      weeklyAppointments[day]++;
    });
    
    const appointmentsByDay = daysOfWeek.map((day, index) => ({
      day,
      count: weeklyAppointments[index]
    }));

    // Send dashboard data
    res.json({
      userStats: {
        total: totalUsers,
        doctors: doctorUsers,
        premium: premiumUsers,
        free: freeUsers
      },
      appointmentStats: {
        total: totalAppointments,
        pending: pendingAppointments,
        confirmed: confirmedAppointments,
        cancelled: cancelledAppointments
      },
      scanStats: {
        total: totalScans,
        diagnosisBreakdown
      },
      growthData: monthlyGrowth,
      scanData: monthlyScans,
      appointmentsByDay
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get recent patients (admin only)
router.get('/recent-patients', [auth, roleCheck('admin')], async (req, res) => {
  try {
    const recentPatients = await User.find({
      'scanHistory.0': { $exists: true }
    })
    .sort({ 'scanHistory.date': -1 })
    .limit(5)
    .select('username first_name last_name email role scanHistory');
    
    // Format data for frontend
    const formattedPatients = recentPatients.map(patient => {
      const latestScan = patient.scanHistory.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      )[0];
      
      return {
        id: patient._id,
        name: `${patient.first_name} ${patient.last_name}`,
        email: patient.email,
        role: patient.role,
        diagnosis: latestScan.result,
        date: latestScan.date
      };
    });
    
    res.json(formattedPatients);
  } catch (error) {
    console.error('Error fetching recent patients:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get upcoming appointments (admin only)
router.get('/upcoming-appointments', [auth, roleCheck('admin')], async (req, res) => {
  try {
    const now = new Date();
    
    const upcomingAppointments = await Appointment.find({
      date: { $gte: now },
      status: { $in: ['pending', 'confirmed'] }
    })
    .sort({ date: 1 })
    .limit(5)
    .populate('userId', 'username first_name last_name email');
    
    // Format data for frontend
    const formattedAppointments = upcomingAppointments.map(appointment => {
      return {
        id: appointment._id,
        patientName: `${appointment.userId.first_name} ${appointment.userId.last_name}`,
        email: appointment.userId.email,
        doctor: appointment.doctor,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status
      };
    });
    
    res.json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get completed appointments (admin only)
router.get('/completed-appointments', [auth, roleCheck('admin')], async (req, res) => {
  try {
    const now = new Date();
    
    const completedAppointments = await Appointment.find({
      $or: [
        { date: { $lt: now } },
        { status: 'cancelled' }
      ]
    })
    .sort({ date: -1 })
    .limit(5)
    .populate('userId', 'username first_name last_name email');
    
    // Format data for frontend
    const formattedAppointments = completedAppointments.map(appointment => {
      return {
        id: appointment._id,
        patientName: `${appointment.userId.first_name} ${appointment.userId.last_name}`,
        email: appointment.userId.email,
        doctor: appointment.doctor,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status
      };
    });
    
    res.json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching completed appointments:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get doctors list (for appointment form)
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('username first_name last_name');
    
    const formattedDoctors = doctors.map(doctor => ({
      id: doctor._id,
      name: `Dr. ${doctor.first_name} ${doctor.last_name}`,
      username: doctor.username
    }));
    
    res.json(formattedDoctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
