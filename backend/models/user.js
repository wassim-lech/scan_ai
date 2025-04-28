const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['free', 'premium', 'doctor', 'admin'],
    default: 'free'
  },
  scansRemaining: { 
    type: Number, 
    default: 1 // Free users get 1 scan
  },
  scanHistory: [{
    date: { type: Date, default: Date.now },
    result: { type: String },
    imageUrl: { type: String }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Encrypt password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', UserSchema);