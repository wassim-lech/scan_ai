// backend/scripts/add-doctors.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('config');
const User = require('../models/user');

// Connect to MongoDB
const db = config.get('mongoURI');

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => {
    console.error('Database connection error:', err.message);
    process.exit(1);
  });

// Array of doctors to add
const doctors = [
  {
    username: 'dr.smith',
    first_name: 'John',
    last_name: 'Smith',
    email: 'dr.smith@smartcare.com',
    password: 'Password123!',
    role: 'doctor',
    specialty: 'Pulmonologist'
  },
  {
    username: 'dr.johnson',
    first_name: 'Emily',
    last_name: 'Johnson',
    email: 'dr.johnson@smartcare.com',
    password: 'Password123!',
    role: 'doctor',
    specialty: 'Radiologist'
  },
  {
    username: 'dr.martinez',
    first_name: 'Carlos',
    last_name: 'Martinez',
    email: 'dr.martinez@smartcare.com',
    password: 'Password123!',
    role: 'doctor',
    specialty: 'General Practitioner'
  },
  {
    username: 'dr.patel',
    first_name: 'Priya',
    last_name: 'Patel',
    email: 'dr.patel@smartcare.com',
    password: 'Password123!',
    role: 'doctor',
    specialty: 'Pulmonary Specialist'
  },
  {
    username: 'dr.wong',
    first_name: 'Michael',
    last_name: 'Wong',
    email: 'dr.wong@smartcare.com',
    password: 'Password123!',
    role: 'doctor',
    specialty: 'Internal Medicine'
  }
];

async function addDoctors() {
  try {
    for (const doctorData of doctors) {
      // Check if doctor already exists
      const existingDoctor = await User.findOne({ 
        $or: [
          { email: doctorData.email },
          { username: doctorData.username }
        ]
      });

      if (existingDoctor) {
        // Update existing doctor's specialty if needed
        if (existingDoctor.specialty !== doctorData.specialty) {
          existingDoctor.specialty = doctorData.specialty;
          await existingDoctor.save();
          console.log(`Updated specialty for ${doctorData.username} to ${doctorData.specialty}`);
        } else {
          console.log(`Doctor ${doctorData.username} already exists with specialty ${doctorData.specialty}`);
        }
      } else {
        // Create new doctor
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(doctorData.password, salt);

        // Create user
        const newDoctor = new User({
          ...doctorData,
          password: hashedPassword
        });

        await newDoctor.save();
        console.log(`Added new doctor: ${doctorData.username} (${doctorData.specialty})`);
      }
    }

    console.log('All doctors processed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error adding doctors:', err);
    process.exit(1);
  }
}

// Run the function
addDoctors();
