// Reset passwords for multiple users (admin, doctor, test user)
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/scanAi', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    console.log('Please make sure MongoDB is running and accessible');
    process.exit(1);
  });

// Load User model
const User = require('../models/user');

// Define users to reset
const usersToReset = [
  { email: 'admin@gmail.com', role: 'admin', newPassword: 'Admin123!', displayName: 'Admin' },
  { email: 'doctor@gmail.com', role: 'doctor', newPassword: 'Doctor123!', displayName: 'Doctor' },
  { email: 'test@example.com', role: 'free', newPassword: 'Test123!', displayName: 'Test User' }
];

async function resetUserPassword(email, role, newPassword, displayName) {
  try {
    // Find user
    const user = await User.findOne({ 
      email: email,
      ...(role ? { role: role } : {})
    });

    if (!user) {
      console.log(`❌ ${displayName} user with email ${email} not found`);
      return false;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user
    user.password = hashedPassword;
    await user.save();

    console.log(`✅ ${displayName} password reset successfully`);
    console.log(`   Email: ${email}`);
    console.log(`   New password: ${newPassword}`);
    console.log(`   Role: ${user.role}`);
    console.log('-----------------------------------');
    
    return true;
  } catch (err) {
    console.error(`❌ Error resetting ${displayName} password:`, err);
    return false;
  }
}

async function resetAllPasswords() {
  console.log('=============================================');
  console.log('  SCAN AI - MULTIPLE PASSWORD RESET UTILITY');
  console.log('=============================================');
  
  let successCount = 0;
  
  // Reset each user's password
  for (const user of usersToReset) {
    const success = await resetUserPassword(
      user.email, 
      user.role, 
      user.newPassword, 
      user.displayName
    );
    
    if (success) successCount++;
  }
  
  console.log('=============================================');
  console.log(`Reset ${successCount}/${usersToReset.length} passwords successfully`);
  console.log('=============================================');

  // Close MongoDB connection
  mongoose.connection.close();
}

// Run the function
resetAllPasswords();
