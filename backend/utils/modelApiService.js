/**
 * Model API Service - Helper functions for communicating with the Flask model API
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Configuration
const MODEL_API_BASE_URL = 'http://localhost:5005/api';
const CLEANUP_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours in ms

/**
 * Check if the model API is online
 * @returns {Promise<boolean>} True if API is online, false otherwise
 */
async function checkModelApiHealth() {
  try {
    const response = await axios.get(`${MODEL_API_BASE_URL}/health`);
    const isLoaded = response.data.model === 'loaded';
    
    // Log health check details
    console.log('Model API Health Check:');
    console.log(`- Status: ${response.data.status}`);
    console.log(`- Model: ${response.data.model}`);
    
    if (response.data.model_file_exists !== undefined) {
      console.log(`- Model file exists: ${response.data.model_file_exists}`);
      console.log(`- Model file path: ${response.data.model_path}`);
      console.log(`- Model file size: ${response.data.model_file_size_mb} MB`);
    }
    
    if (!isLoaded) {
      console.error('Model API is available but model is not loaded!');
      if (response.data.model_file_exists === false) {
        console.error(`Model file does not exist at: ${response.data.model_path}`);
      }
    }
    
    return isLoaded;
  } catch (error) {
    console.error('Error checking model API health:', error.message);
    return false;
  }
}

/**
 * Send a file to the model API for prediction
 * @param {string} filePath Path to the file to predict
 * @returns {Promise<object>} Prediction results
 */
async function getPrediction(filePath) {
  try {
    // Check if API is online first
    const isHealthy = await checkModelApiHealth();
    if (!isHealthy) {
      throw new Error('Model API is not available');
    }
    
    // Create form data
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    
    // Send request
    const response = await axios.post(`${MODEL_API_BASE_URL}/predict`, form, {
      headers: {
        ...form.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    
    return response.data;
    
  } catch (error) {
    console.error('Error getting prediction:', error.message);
    throw error;
  }
}

/**
 * Trigger cleanup of old files on the model API
 * @returns {Promise<object>} Cleanup status
 */
async function triggerCleanup() {
  try {
    const response = await axios.post(`${MODEL_API_BASE_URL}/cleanup`);
    console.log('Model API cleanup triggered:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error triggering cleanup:', error.message);
    return { status: 'error', message: error.message };
  }
}

// Periodically trigger cleanup
setInterval(async () => {
  try {
    await triggerCleanup();
  } catch (error) {
    console.error('Scheduled cleanup failed:', error);
  }
}, CLEANUP_INTERVAL);

// Export functions
module.exports = {
  checkModelApiHealth,
  getPrediction,
  triggerCleanup
};
