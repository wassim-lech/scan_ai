const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Check if the model already exists before defining it
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['free', 'premium', 'doctor', 'admin'],
    default: 'free'
  },
  scansRemaining: {
    type: Number,
    default: 1
  },
  scanHistory: {
    type: Array,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) return next();
  
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    
    // Hash password
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Use mongoose.models to check if the model exists before creating a new one
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);