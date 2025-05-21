const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: String, required: true }, // Doctor's username
  date: { type: Date, required: true },
  time: { type: String, required: true }, // e.g., "14:00"
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'], 
    default: 'pending' 
  },
  reason: { type: String }, // Reason for the appointment
  scanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scan' }, // Reference to scan result
  notes: { type: String }, // Doctor's notes
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Appointment', AppointmentSchema);