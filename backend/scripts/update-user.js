// Script to update user data in the database
const mongoose = require('mongoose');
const User = require('../models/user');
require('dotenv').config();

const updateUserData = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/scan_ai';
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected...');

    // Parameters (replace these with your actual values)
    const emailOrUsername = process.argv[2]; // Get from command line arguments
    const updateFields = {
      first_name: process.argv[3] || undefined,
      last_name: process.argv[4] || undefined,
      phone: process.argv[5] || undefined,
      address: process.argv[6] || undefined
    };

    if (!emailOrUsername) {
      console.error('Please provide an email or username as the first argument');
      process.exit(1);
    }

    // Remove undefined fields
    Object.keys(updateFields).forEach(key => 
      updateFields[key] === undefined && delete updateFields[key]
    );

    if (Object.keys(updateFields).length === 0) {
      console.log('No fields to update. Please provide at least one field to update.');
      process.exit(1);
    }

    // Find the user by email or username
    const user = await User.findOne({
      $or: [
        { email: emailOrUsername },
        { username: emailOrUsername }
      ]
    });

    if (!user) {
      console.error(`User with email/username "${emailOrUsername}" not found`);
      process.exit(1);
    }

    console.log('User found:', {
      id: user._id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      address: user.address
    });

    console.log('Applying updates:', updateFields);

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');
    
    console.log('User updated successfully!');
    console.log('Updated user data:', {
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      phone: updatedUser.phone,
      address: updatedUser.address
    });

  } catch (err) {
    console.error('Error updating user data:', err.message);
    if (err.name === 'ValidationError') {
      console.error('Validation errors:');
      for (const field in err.errors) {
        console.error(`- ${field}: ${err.errors[field].message}`);
      }
    }
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
  }
};

// Run the update function
updateUserData();
