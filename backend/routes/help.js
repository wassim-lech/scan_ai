// backend/routes/help.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const HelpRequest = require('../models/helpRequest');

router.post('/', auth, async (req, res) => {
  try {
    const { subject, message } = req.body;
    const helpRequest = new HelpRequest({
      userId: req.user.id,
      subject,
      message,
    });
    await helpRequest.save();
    res.status(201).json({ msg: 'Help request submitted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/', [auth, roleCheck(['admin'])], async (req, res) => {
  try {
    const helpRequests = await HelpRequest.find().populate('userId', 'username email');
    res.json(helpRequests);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;