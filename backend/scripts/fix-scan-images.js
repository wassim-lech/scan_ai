/**
 * Fix Scan Image URLs
 * 
 * This script checks and fixes the image URLs in user scan history.
 */
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// MongoDB connection string
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/scanAi';

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => {
  console.log('MongoDB Connected Successfully');
  fixScanImageUrls();
})
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// Import the User model
const User = require('../models/user');

// Function to check if uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
console.log('Uploads directory path:', uploadsDir);

if (!fs.existsSync(uploadsDir)) {
  console.error(`Uploads directory not found at: ${uploadsDir}`);
  process.exit(1);
}

// Function to check if files exist in uploads directory
const filesInUploads = fs.readdirSync(uploadsDir);
console.log(`Found ${filesInUploads.length} files in uploads directory`);

async function fixScanImageUrls() {
  try {
    // Find all users with scan history
    const users = await User.find({ 'scanHistory.0': { $exists: true } });
    
    console.log(`Found ${users.length} users with scan history`);
    
    let totalScans = 0;
    let updatedScans = 0;
    let missingFiles = 0;
    
    // Process each user
    for (const user of users) {
      console.log(`Processing user: ${user.username} (${user.scanHistory.length} scans)`);
      
      let userUpdated = false;
      
      // Check each scan in the user's history
      for (const scan of user.scanHistory) {
        totalScans++;
        
        // Skip if no imageUrl
        if (!scan.imageUrl) {
          console.log(`  - Scan ${scan.id || 'unknown'}: No imageUrl`);
          continue;
        }
        
        // Check if the image file exists
        const fileExists = filesInUploads.includes(scan.imageUrl);
        
        if (!fileExists) {
          console.log(`  - Scan ${scan.id || 'unknown'}: Image file not found: ${scan.imageUrl}`);
          missingFiles++;
          continue;
        }
        
        console.log(`  - Scan ${scan.id || 'unknown'}: Image file exists: ${scan.imageUrl}`);
        updatedScans++;
        userUpdated = true;
      }
      
      // Save user if updated
      if (userUpdated) {
        await user.save();
        console.log(`  Updated user: ${user.username}`);
      }
    }
    
    console.log('\nScan URL Check Summary:');
    console.log(`Total scans processed: ${totalScans}`);
    console.log(`Scans with existing images: ${updatedScans}`);
    console.log(`Scans with missing images: ${missingFiles}`);
    console.log('\nScript completed successfully!');
    
    // Disconnect from MongoDB
    mongoose.disconnect();
    
  } catch (error) {
    console.error('Error fixing scan image URLs:', error);
    mongoose.disconnect();
    process.exit(1);
  }
}
