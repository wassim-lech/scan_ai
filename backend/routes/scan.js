// backend/routes/scans.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/upload');
const User = require('../models/user');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

// Model API configuration
const modelApiService = require('../utils/modelApiService');

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

router.post('/upload', [auth, roleCheck(['free', 'premium', 'doctor', 'admin']), upload.single('file')], async (req, res) => {
  try {
    // Check if user has scans remaining (except for doctors and admins who have unlimited access)
    if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
      const user = await User.findById(req.user.id);
      if (user.scansRemaining <= 0) {
        return res.status(403).json({ msg: 'No scans remaining' });
      }
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
      // Send file to model API for prediction
    try {
      // Check if model API is running
      const isHealthy = await modelApiService.checkModelApiHealth();
      if (!isHealthy) {
        console.error('Model API is not running or model is not loaded');
        return res.status(503).json({
          msg: 'AI model service is not available',
          details: 'The AI model service is not running or the model failed to load. Please check the model API service.'
        });
      }
        // Get prediction from model API service
      const predictionResult = await modelApiService.getPrediction(req.file.path);
      
      // Update user document
      const user = await User.findById(req.user.id);
      
      // Only decrement scans for regular users
      if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
        user.scansRemaining -= 1;
      }
      
      // Add scan to history
      user.scanHistory.push({
        date: new Date(),
        result: predictionResult.prediction,
        confidence: predictionResult.confidence,
        imageUrl: req.file.filename,
        id: predictionResult.id
      });
      
      await user.save();
      
      res.json({
        msg: 'Scan processed successfully',
        prediction: predictionResult,
        scansRemaining: user.scansRemaining
      });
      
    } catch (error) {
      console.error('Error connecting to model API:', error);
      return res.status(500).json({ 
        msg: 'Error processing image with AI model',
        details: error.message 
      });
    }
  } catch (err) {
    console.error('Server error in scan upload:', err);
    res.status(500).json({ msg: 'Server error', details: err.message });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('scanHistory');
    
    // Sort the scan history by date (most recent first)
    const sortedHistory = user.scanHistory.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    
    res.json(sortedHistory);
  } catch (err) {
    console.error('Error fetching scan history:', err);
    res.status(500).json({ msg: 'Server error', details: err.message });
  }
});

// Get scan details by ID
router.get('/details/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.id);
    
    // Find the specific scan in user's history
    const scan = user.scanHistory.find(scan => scan.id === id);
    
    if (!scan) {
      return res.status(404).json({ msg: 'Scan not found' });
    }
    
    res.json(scan);
  } catch (err) {
    console.error('Error fetching scan details:', err);
    res.status(500).json({ msg: 'Server error', details: err.message });
  }
});
module.exports = router;