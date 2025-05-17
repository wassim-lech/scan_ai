// Script to create first admin user
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

// Load User model dynamically
const User = require('../models/user');

// Admin user details (you can change these)
const adminUser = {
  username: process.argv[2] || 'admin',
  email: process.argv[3] || 'admin@scanai.com',
  password: process.argv[4] || 'Admin123!',  // Will be hashed
  role: 'admin',
  scansRemaining: 999,
  scanHistory: []
};

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: adminUser.email },
        { username: adminUser.username }
      ]
    });

    if (existingUser) {
      console.log('An admin user already exists with this email or username.');
      
      // If the user exists but is not an admin, promote them
      if (existingUser.role !== 'admin') {
        existingUser.role = 'admin';
        existingUser.scansRemaining = 999;
        await existingUser.save();
        console.log(`User ${existingUser.username} has been promoted to admin.`);
      } else {
        console.log('This user is already an admin.');
      }
      
      process.exit(0);
    }

    // Create new admin user
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    
    // Hash password
    const hashedPassword = await bcrypt.hash(adminUser.password, salt);
    
    // Create user with hashed password
    const user = new User({
      username: adminUser.username,
      email: adminUser.email,
      password: hashedPassword, // Use hashed password
      role: adminUser.role,
      scansRemaining: adminUser.scansRemaining,
      scanHistory: adminUser.scanHistory
    });

    await user.save();
    
    console.log(`
========================================
    ADMIN USER CREATED SUCCESSFULLY
========================================
Username: ${adminUser.username}
Email: ${adminUser.email}
Role: ${adminUser.role}
========================================
IMPORTANT: Keep these credentials safe!
    `);

    process.exit(0);
  } catch (err) {
    console.error('Error creating admin user:', err);
    process.exit(1);
  }
}

// Run the function
createAdminUser();
