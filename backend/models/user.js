const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Check if the model already exists before defining it
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  first_name: {
    type: String,
    default: ''
  },
  last_name: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: true,
    unique: true
  },  phone: {
    type: String,
    default: '',
    validate: {
      validator: function(v) {
        // Allow empty string or validate phone format
        return v === '' || /^\+?[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    type: String,
    default: '',
    trim: true,
    maxlength: [200, 'Address cannot be more than 200 characters']
  },
  password: {
    type: String,
    required: true
  },  role: {
    type: String,
    enum: ['free', 'premium', 'doctor', 'admin'],
    default: 'free'
  },
  specialty: {
    type: String,
    default: '',
    required: function() { return this.role === 'doctor'; }
  },
  scansRemaining: {
    type: Number,
    default: 1
  },
  subscriptionDate: {
    type: Date,
    default: null
  },scanHistory: {
    type: Array,
    default: []
  },
  notifications: {
    type: [{
      type: {
        type: String,
        enum: ['appointment', 'scan', 'system'],
        required: true
      },
      message: {
        type: String,
        required: true
      },
      status: {
        type: String,
        enum: ['unread', 'read'],
        default: 'unread'
      },
      data: {
        type: mongoose.Schema.Types.Mixed
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
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