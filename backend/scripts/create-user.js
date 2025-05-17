// Create a user with a specific role
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Get command line arguments
const username = process.argv[2];
const email = process.argv[3];
const password = process.argv[4];
const role = process.argv[5] || 'free'; // Default to free
const scansRemaining = role === 'premium' ? 5 : (role === 'free' ? 1 : 999);

// Validate inputs
if (!username || !email || !password) {
  console.error('Usage: node create-user.js <username> <email> <password> [role]');
  console.error('Role can be: free, premium, doctor, admin (default: free)');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/scanAi', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Load User model
const User = require('../models/user');

async function createUser() {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email },
        { username }
      ]
    });

    if (existingUser) {
      console.log('A user already exists with this email or username.');
      process.exit(1);
    }

    // Create new user
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user with hashed password
    const user = new User({
      username,
      email,
      password: hashedPassword, // Use hashed password
      role,
      scansRemaining,
      scanHistory: []
    });

    await user.save();
    
    console.log(`
========================================
    USER CREATED SUCCESSFULLY
========================================
Username: ${username}
Email: ${email}
Role: ${role}
Scans Remaining: ${scansRemaining}
========================================
    `);

  } catch (err) {
    console.error('Error creating user:', err);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}

// Execute the function
createUser();
