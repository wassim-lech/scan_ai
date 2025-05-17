// List all users in the database
const mongoose = require('mongoose');
require('dotenv').config();

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

async function listAllUsers() {
  try {
    // Find all users
    const users = await User.find({}).select('-password');
    
    console.log('\n========================================');
    console.log('           ALL USERS IN DATABASE        ');
    console.log('========================================');
    
    if (users.length === 0) {
      console.log('No users found in the database.');
    } else {
      users.forEach((user, index) => {
        console.log(`\nUSER #${index + 1}:`);
        console.log(`Username: ${user.username}`);
        console.log(`Email: ${user.email}`);
        console.log(`Role: ${user.role}`);
        console.log(`Scans Remaining: ${user.scansRemaining}`);
        console.log(`Created: ${user.createdAt}`);
        console.log('----------------------------------------');
      });
      
      console.log(`\nTotal users: ${users.length}`);
      
      // Count by role
      const roleCounts = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});
      
      console.log('\nUsers by role:');
      Object.entries(roleCounts).forEach(([role, count]) => {
        console.log(`${role}: ${count}`);
      });
    }
    
  } catch (err) {
    console.error('Error listing users:', err);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}

// Execute the function
listAllUsers();
