const express = require('express');
const app = express();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/help', helpRoutes);
app.use('/api/appointments', appointmentRoutes);
const authRoutes = require('./routes/api/auth');
app.use('/api/auth', authRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));