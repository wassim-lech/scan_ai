import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [helpRequests, setHelpRequests] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [usersRes, helpRes, apptRes] = await Promise.all([
      fetch('http://localhost:5000/api/admin/users', { headers: { 'x-auth-token': localStorage.getItem('token') } }),
      fetch('http://localhost:5000/api/help', { headers: { 'x-auth-token': localStorage.getItem('token') } }),
      fetch('http://localhost:5000/api/appointments', { headers: { 'x-auth-token': localStorage.getItem('token') } }),
    ]);
    setUsers(await usersRes.json());
    setHelpRequests(await helpRes.json());
    setAppointments(await apptRes.json());
  };

  const chartData = {
    labels: ['Free', 'Premium', 'Doctor', 'Admin'],
    datasets: [{
      label: 'Subscriptions',
      data: [users.filter(u => u.role === 'free').length, users.filter(u => u.role === 'premium').length, users.filter(u => u.role === 'doctor').length, users.filter(u => u.role === 'admin').length],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="charts">
        <Bar data={chartData} />
      </div>
      <div className="users">
        <h3>Users</h3>
        <ul>
          {users.map(user => (
            <li key={user._id}>{user.username} - {user.email} - {user.role} - Last Scan: {user.scanHistory[0]?.date}</li>
          ))}
        </ul>
      </div>
      <div className="help-requests">
        <h3>Help Requests</h3>
        <ul>
          {helpRequests.map(req => (
            <li key={req._id}>{req.subject} - {req.message}</li>
          ))}
        </ul>
      </div>
      <div className="calendar">
        <h3>Appointments Calendar</h3>
        <Calendar value={new Date()} />
      </div>
    </div>
  );
};

export default AdminDashboard;