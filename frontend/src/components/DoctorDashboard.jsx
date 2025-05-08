import React, { useEffect, useState } from 'react';
import '../styles/DoctorDashboard.css';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const response = await fetch('http://localhost:5000/api/appointments/doctor', {
      headers: { 'x-auth-token': localStorage.getItem('token') },
    });
    const data = await response.json();
    setAppointments(data);
  };

  return (
    <div className="doctor-dashboard">
      <h2>Doctor Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Patient</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(appt => (
            <tr key={appt._id}>
              <td>{new Date(appt.date).toLocaleDateString()}</td>
              <td>{appt.time}</td>
              <td>{appt.userId.username}</td>
              <td><a href={`/scan-history/${appt.userId._id}`}>View Scan History</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorDashboard;