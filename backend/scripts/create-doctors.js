// Doctor specialties with doctor users creation script
const mongoose = require('mongoose');
const User = require('../models/user');
require('dotenv').config();

// Connect to MongoDB database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Define the doctors by specialties
const doctors = [  {
    username: 'doctor_cardiology',
    first_name: 'Doctor',
    last_name: 'Cardiology',
    email: 'doctor1@gmail.com',
    password: 'doctor',
    role: 'doctor',
    specialty: 'Cardiology'
  },
  {
    username: 'doctor_pulmonology',
    first_name: 'Doctor',
    last_name: 'Pulmonology',
    email: 'doctor2@gmail.com',
    password: 'doctor',
    role: 'doctor',
    specialty: 'Pulmonology'
  },  {
    username: 'doctor_neurology',
    first_name: 'Doctor',
    last_name: 'Neurology',
    email: 'doctor3@gmail.com',
    password: 'doctor',
    role: 'doctor',
    specialty: 'Neurology'
  },
  {
    username: 'doctor_pediatrics',
    first_name: 'Doctor',
    last_name: 'Pediatrics',
    email: 'doctor4@gmail.com',
    password: 'doctor',
    role: 'doctor',
    specialty: 'Pediatrics'
  },  {
    username: 'doctor_orthopedics',
    first_name: 'Doctor',
    last_name: 'Orthopedics',
    email: 'doctor5@gmail.com',
    password: 'doctor',
    role: 'doctor',
    specialty: 'Orthopedics'
  },
  {
    username: 'doctor_emergency',
    first_name: 'Doctor',
    last_name: 'Emergency',
    email: 'doctor6@gmail.com',
    password: 'doctor',
    role: 'doctor',
    specialty: 'Emergency Medicine'
  },
];

async function createDoctors() {
  try {
    // Create each doctor, checking if they already exist
    for (const doctor of doctors) {
      // Check if the doctor already exists by email
      const existingDoctor = await User.findOne({ email: doctor.email });
      
      if (existingDoctor) {
        console.log(`Doctor ${doctor.first_name} ${doctor.last_name} already exists`);
      } else {
        // Create the new doctor
        const newDoctor = new User(doctor);
        await newDoctor.save();
        console.log(`Created doctor: ${doctor.first_name} ${doctor.last_name}`);
      }
    }
    
    console.log('Doctor creation completed');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating doctors:', error);
    mongoose.disconnect();
  }
}

// Run the doctor creation function
createDoctors();
