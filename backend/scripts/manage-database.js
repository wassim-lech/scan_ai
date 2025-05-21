// Comprehensive database update script
// This script can update users, appointments, and other data types
const mongoose = require('mongoose');
const User = require('../models/user');
const Appointment = require('../models/appointment');
require('dotenv').config();

// Connect to MongoDB
async function connectDB() {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/scan_ai';
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected...');
    return true;
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    return false;
  }
}

// User operations
const userOperations = {
  // Get user by email or username
  async getUser(identifier) {
    try {
      return await User.findOne({
        $or: [
          { email: identifier },
          { username: identifier }
        ]
      });
    } catch (err) {
      console.error('Error getting user:', err.message);
      return null;
    }
  },

  // Update user data
  async updateUser(identifier, updateData) {
    try {
      const user = await this.getUser(identifier);
      if (!user) {
        console.error(`User with identifier "${identifier}" not found`);
        return null;
      }

      console.log('Found user:', {
        id: user._id,
        username: user.username,
        email: user.email
      });

      // Update user data
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      console.log('User updated successfully!');
      return updatedUser;
    } catch (err) {
      console.error('Error updating user:', err.message);
      return null;
    }
  }
};

// Appointment operations
const appointmentOperations = {
  // Get all appointments for a user
  async getUserAppointments(userId) {
    try {
      return await Appointment.find({ userId }).sort({ date: 1 });
    } catch (err) {
      console.error('Error getting appointments:', err.message);
      return [];
    }
  },

  // Update appointment
  async updateAppointment(appointmentId, updateData) {
    try {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        console.error(`Appointment with ID "${appointmentId}" not found`);
        return null;
      }

      const updatedAppointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        updateData,
        { new: true, runValidators: true }
      );

      console.log('Appointment updated successfully!');
      return updatedAppointment;
    } catch (err) {
      console.error('Error updating appointment:', err.message);
      return null;
    }
  },

  // Update appointment status
  async updateAppointmentStatus(appointmentId, status) {
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      console.error(`Invalid status: ${status}. Must be 'pending', 'confirmed', or 'cancelled'`);
      return null;
    }

    return this.updateAppointment(appointmentId, { status });
  },

  // Create new appointment
  async createAppointment(appointmentData) {
    try {
      const newAppointment = new Appointment(appointmentData);
      await newAppointment.save();
      console.log('New appointment created successfully!');
      return newAppointment;
    } catch (err) {
      console.error('Error creating appointment:', err.message);
      return null;
    }
  }
};

// Main function to process commands
async function processCommand() {
  // Get command line arguments
  const args = process.argv.slice(2);
  const command = args[0];

  // Check if we have a command
  if (!command) {
    printUsage();
    process.exit(1);
  }

  // Connect to database
  const connected = await connectDB();
  if (!connected) {
    process.exit(1);
  }

  try {
    // Process different commands
    switch (command) {
      case 'user:get':
        await handleUserGet(args[1]);
        break;
      case 'user:update':
        await handleUserUpdate(args[1], args.slice(2));
        break;
      case 'appointment:list':
        await handleAppointmentList(args[1]);
        break;
      case 'appointment:update':
        await handleAppointmentUpdate(args[1], args[2], args[3]);
        break;
      case 'appointment:create':
        await handleAppointmentCreate(args.slice(1));
        break;
      default:
        console.error(`Unknown command: ${command}`);
        printUsage();
    }
  } catch (err) {
    console.error('Error processing command:', err);
  } finally {
    // Disconnect from database
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
  }
}

// Handle user:get command
async function handleUserGet(identifier) {
  if (!identifier) {
    console.error('Email or username is required');
    return;
  }

  const user = await userOperations.getUser(identifier);
  if (user) {
    console.log('User found:');
    console.log({
      id: user._id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      address: user.address,
      role: user.role
    });
  }
}

// Handle user:update command
async function handleUserUpdate(identifier, args) {
  if (!identifier) {
    console.error('Email or username is required');
    return;
  }

  if (args.length < 2) {
    console.error('At least one field and value are required');
    return;
  }

  // Parse field=value pairs
  const updateData = {};
  for (let i = 0; i < args.length; i += 2) {
    const field = args[i];
    const value = args[i + 1];
    
    if (value === undefined) {
      console.error(`Missing value for field: ${field}`);
      continue;
    }
    
    // Convert field names to match database fields
    switch (field) {
      case 'firstName':
        updateData.first_name = value;
        break;
      case 'lastName':
        updateData.last_name = value;
        break;
      case 'phone':
      case 'address':
      case 'role':
        updateData[field] = value;
        break;
      default:
        console.warn(`Unknown field: ${field}`);
    }
  }

  const updatedUser = await userOperations.updateUser(identifier, updateData);
  if (updatedUser) {
    console.log('Updated user data:');
    console.log({
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      phone: updatedUser.phone,
      address: updatedUser.address,
      role: updatedUser.role
    });
  }
}

// Handle appointment:list command
async function handleAppointmentList(userIdentifier) {
  if (!userIdentifier) {
    console.error('User email or username is required');
    return;
  }

  const user = await userOperations.getUser(userIdentifier);
  if (!user) {
    return;
  }

  const appointments = await appointmentOperations.getUserAppointments(user._id);
  if (appointments.length === 0) {
    console.log('No appointments found for this user');
    return;
  }

  console.log(`Found ${appointments.length} appointments:`);
  appointments.forEach(appointment => {
    console.log({
      id: appointment._id,
      doctor: appointment.doctor,
      date: appointment.date.toDateString(),
      time: appointment.time,
      status: appointment.status,
      createdAt: appointment.createdAt.toDateString()
    });
  });
}

// Handle appointment:update command
async function handleAppointmentUpdate(appointmentId, field, value) {
  if (!appointmentId) {
    console.error('Appointment ID is required');
    return;
  }

  if (!field || !value) {
    console.error('Field and value are required');
    return;
  }

  const updateData = {};
  switch (field) {
    case 'date':
      updateData.date = new Date(value);
      break;
    case 'time':
      updateData.time = value;
      break;
    case 'status':
      if (!['pending', 'confirmed', 'cancelled'].includes(value)) {
        console.error(`Invalid status: ${value}. Must be 'pending', 'confirmed', or 'cancelled'`);
        return;
      }
      updateData.status = value;
      break;
    case 'doctor':
      updateData.doctor = value;
      break;
    default:
      console.error(`Unknown field: ${field}`);
      return;
  }

  const updatedAppointment = await appointmentOperations.updateAppointment(appointmentId, updateData);
  if (updatedAppointment) {
    console.log('Updated appointment:');
    console.log({
      id: updatedAppointment._id,
      doctor: updatedAppointment.doctor,
      date: updatedAppointment.date.toDateString(),
      time: updatedAppointment.time,
      status: updatedAppointment.status
    });
  }
}

// Handle appointment:create command
async function handleAppointmentCreate(args) {
  if (args.length < 4) {
    console.error('User identifier, doctor, date, and time are required');
    return;
  }

  const [userIdentifier, doctor, dateStr, time] = args;
  const status = args[4] || 'pending';

  if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
    console.error(`Invalid status: ${status}. Must be 'pending', 'confirmed', or 'cancelled'`);
    return;
  }

  // Get user
  const user = await userOperations.getUser(userIdentifier);
  if (!user) {
    return;
  }

  // Create appointment
  const appointmentData = {
    userId: user._id,
    doctor,
    date: new Date(dateStr),
    time,
    status
  };

  const newAppointment = await appointmentOperations.createAppointment(appointmentData);
  if (newAppointment) {
    console.log('New appointment created:');
    console.log({
      id: newAppointment._id,
      doctor: newAppointment.doctor,
      date: newAppointment.date.toDateString(),
      time: newAppointment.time,
      status: newAppointment.status
    });
  }
}

// Print usage information
function printUsage() {
  console.log(`
Database Management Script - Usage:

USER COMMANDS:
  node scripts/manage-database.js user:get <email|username>
  node scripts/manage-database.js user:update <email|username> firstName "John" lastName "Doe" phone "+1234567890" address "123 Main St"

APPOINTMENT COMMANDS:
  node scripts/manage-database.js appointment:list <email|username>
  node scripts/manage-database.js appointment:update <appointmentId> <field> <value>
  node scripts/manage-database.js appointment:create <email|username> <doctor> <date> <time> [status]

Examples:
  node scripts/manage-database.js user:get user@example.com
  node scripts/manage-database.js user:update john.doe firstName "John" lastName "Doe"
  node scripts/manage-database.js appointment:list user@example.com
  node scripts/manage-database.js appointment:update 60a1e2c3a4b5c6d7e8f9a0b1 status confirmed
  node scripts/manage-database.js appointment:create user@example.com "Dr. Smith" "2025-06-15" "14:30"
  `);
}

// Execute the main function
processCommand();
