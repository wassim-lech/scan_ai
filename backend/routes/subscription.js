// This route allows updating user scan counts and subscription status
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const User = require('../models/user');

// Update user scan count - can be used after consumption or to add additional scans
router.post('/update-scan-count', [auth, roleCheck(['admin', 'doctor'])], async (req, res) => {
  try {
    const { userId, scansCount } = req.body;
    
    if (!userId) {
      return res.status(400).json({ msg: 'User ID is required' });
    }
    
    if (scansCount === undefined || scansCount < 0) {
      return res.status(400).json({ msg: 'Valid scan count is required' });
    }
    
    // Find the user to update
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Update scan count
    user.scansRemaining = scansCount;
    await user.save();
    
    res.json({ 
      msg: 'Scan count updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        scansRemaining: user.scansRemaining
      }
    });
    
  } catch (err) {
    console.error('Error updating scan count:', err);
    res.status(500).json({ msg: 'Server error updating scan count' });
  }
});

// Add scans to a user (for admins only)
router.post('/add-scans', [auth, roleCheck(['admin'])], async (req, res) => {
  try {
    const { userId, scansToAdd } = req.body;
    
    if (!userId) {
      return res.status(400).json({ msg: 'User ID is required' });
    }
    
    if (!scansToAdd || scansToAdd <= 0) {
      return res.status(400).json({ msg: 'Valid number of scans to add is required' });
    }
    
    // Find the user to update
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Add scans
    user.scansRemaining += scansToAdd;
    await user.save();
    
    res.json({ 
      msg: `Added ${scansToAdd} scans successfully`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        scansRemaining: user.scansRemaining
      }
    });
    
  } catch (err) {
    console.error('Error adding scans:', err);
    res.status(500).json({ msg: 'Server error adding scans' });
  }
});

module.exports = router;
