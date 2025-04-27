// backend/routes/scans.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const User = require('../models/user');

router.post('/', [auth, roleCheck(['free', 'premium'])], async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.scansRemaining <= 0) {
      return res.status(403).json({ msg: 'No scans remaining' });
    }
    user.scansRemaining -= 1;
    user.scanHistory.push({ result: 'Sample result', imageUrl: 'sample.jpg' });
    await user.save();
    res.json({ msg: 'Scan completed', scansRemaining: user.scansRemaining });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;