// Check if MongoDB is running
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');

mongoose.connect('mongodb://localhost:27017/scanAi', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // Timeout after 5s
})
  .then(() => {
    console.log('✅ MongoDB connection successful! Database is running properly.');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed!');
    console.error('Error details:', err.message);
    console.log('\nPossible solutions:');
    console.log('1. Make sure MongoDB is installed and running');
    console.log('2. Check if MongoDB service is started');
    console.log('3. Verify MongoDB is listening on the default port (27017)');
    console.log('4. Check if your firewall is blocking connections');
    process.exit(1);
  });
