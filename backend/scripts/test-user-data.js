// Test script to verify user data fields are correctly saved
const mongoose = require('mongoose');
const User = require('../models/user');
require('dotenv').config();

const testUserData = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/scan_ai';
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected...');

    // Create a test user
    const testUser = {
      username: `test-user-${Date.now()}`,
      email: `test-${Date.now()}@example.com`,
      password: 'testpassword123',
      first_name: 'Test',
      last_name: 'User',
      phone: '+12345678901',
      address: '123 Test Street, Test City, TS 12345'
    };

    console.log('Creating test user with data:', {
      ...testUser,
      password: '******'
    });

    // Create the user in the database
    const user = new User(testUser);
    await user.save();
    console.log('Test user created with ID:', user._id);

    // Retrieve the user from the database
    const savedUser = await User.findById(user._id).select('-password');
    console.log('Retrieved user data:', savedUser);

    // Verify all fields were saved correctly
    console.log('\nVerification Results:');
    console.log('Username:', savedUser.username === testUser.username ? '✅ Correct' : '❌ Incorrect');
    console.log('Email:', savedUser.email === testUser.email ? '✅ Correct' : '❌ Incorrect');
    console.log('First Name:', savedUser.first_name === testUser.first_name ? '✅ Correct' : '❌ Incorrect');
    console.log('Last Name:', savedUser.last_name === testUser.last_name ? '✅ Correct' : '❌ Incorrect');
    console.log('Phone:', savedUser.phone === testUser.phone ? '✅ Correct' : '❌ Incorrect');
    console.log('Address:', savedUser.address === testUser.address ? '✅ Correct' : '❌ Incorrect');

    // Update the user
    const updateFields = {
      first_name: 'Updated',
      last_name: 'Name',
      phone: '+19876543210',
      address: '456 Updated Street, New City, UC 67890'
    };
    
    console.log('\nUpdating user with new data:', updateFields);
    
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');
    
    console.log('User updated successfully!');
    console.log('Updated user data:', updatedUser);
    
    // Verify update fields
    console.log('\nUpdate Verification Results:');
    console.log('First Name:', updatedUser.first_name === updateFields.first_name ? '✅ Correct' : '❌ Incorrect');
    console.log('Last Name:', updatedUser.last_name === updateFields.last_name ? '✅ Correct' : '❌ Incorrect');
    console.log('Phone:', updatedUser.phone === updateFields.phone ? '✅ Correct' : '❌ Incorrect');
    console.log('Address:', updatedUser.address === updateFields.address ? '✅ Correct' : '❌ Incorrect');

    // Clean up - delete the test user
    await User.findByIdAndDelete(user._id);
    console.log('\nTest user deleted successfully');

  } catch (err) {
    console.error('Error in test script:', err);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
  }
};

// Run the test
testUserData();
