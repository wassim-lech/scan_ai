// backend/routes/appointments.js
router.get('/doctor', [auth, roleCheck(['doctor'])], async (req, res) => {
    try {
      const appointments = await Appointment.find({ doctor: req.user.username });
      res.json(appointments);
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  });