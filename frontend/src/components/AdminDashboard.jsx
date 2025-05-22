import React, { useState, useEffect, useRef } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/AdminDashboard.module.css';
import DatabaseManager from './DatabaseManager';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showInquiryPage, setShowInquiryPage] = useState(false);
  const [showDatabaseManager, setShowDatabaseManager] = useState(false);
  const navigate = useNavigate();
  
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState(null);
  const [recentPatients, setRecentPatients] = useState([]);  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const headers = {
        'x-auth-token': token
      };

      // Fetch main dashboard stats
      const dashboardResponse = await fetch('http://localhost:5001/api/dashboard/dashboard', {
        headers
      });
      
      if (!dashboardResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const dashboardStats = await dashboardResponse.json();
      setDashboardData(dashboardStats);
      
      // Fetch recent patients with scan history
      const patientsResponse = await fetch('http://localhost:5001/api/dashboard/recent-patients', {
        headers
      });
      
      if (patientsResponse.ok) {
        const patientsData = await patientsResponse.json();
        setRecentPatients(patientsData);
      }
      
      // Fetch all appointments for the admin dashboard
      // First, try upcoming appointments
      const upcomingResponse = await fetch('http://localhost:5001/api/dashboard/upcoming-appointments', {
        headers
      });
      
      if (upcomingResponse.ok) {
        const upcomingData = await upcomingResponse.json();
        setUpcomingAppointments(upcomingData);
      }
      
      // Now, fetch completed appointments
      const completedResponse = await fetch('http://localhost:5001/api/dashboard/completed-appointments', {
        headers
      });
      
      if (completedResponse.ok) {
        const completedData = await completedResponse.json();
        setCompletedAppointments(completedData);
      }
      
      // If API endpoints don't return data, fall back to fetching directly from appointments
      if ((!upcomingResponse.ok || upcomingAppointments.length === 0) &&
          (!completedResponse.ok || completedAppointments.length === 0)) {
        try {
          const allAppointmentsResponse = await fetch('http://localhost:5001/api/appointments/all', {
            headers
          });
          
          if (allAppointmentsResponse.ok) {
            const allAppointmentsData = await allAppointmentsResponse.json();
            
            // Split appointments into upcoming and completed
            const now = new Date();
            const upcoming = [];
            const completed = [];
            
            allAppointmentsData.forEach(appointment => {
              const appointmentDate = new Date(appointment.date);
              const formattedAppointment = {
                id: appointment._id,
                patientName: appointment.userId ? 
                  `${appointment.userId.first_name || ''} ${appointment.userId.last_name || ''}` : 
                  'Unknown User',
                email: appointment.userId ? appointment.userId.email : '',
                doctor: appointment.doctor,
                date: appointment.date,
                time: appointment.time,
                status: appointment.status,
                reason: appointment.reason || 'General consultation'
              };
              
              if (appointmentDate >= now && 
                  (appointment.status === 'pending' || appointment.status === 'confirmed')) {
                upcoming.push(formattedAppointment);
              } else {
                completed.push(formattedAppointment);
              }
            });
            
            if (upcoming.length > 0) setUpcomingAppointments(upcoming);
            if (completed.length > 0) setCompletedAppointments(completed);
          }
        } catch (err) {
          console.error('Error fetching all appointments:', err);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return false;
    }
  };
  // Fetch dashboard data when component mounts
  useEffect(() => {
    const initCharts = async () => {
      try {
        await fetchDashboardData();
      } catch (error) {
        console.error('Failed to initialize dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initCharts();
  }, [navigate]);

  // Helper functions for formatting
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusPillStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'completed':
      case 'confirmed':
      case 'resolved':
      case 'checked in':
        return styles.statusGreen;
      case 'pneumonia':
      case 'cancelled':
      case 'pending':
      case 'not booked':
        return styles.statusRed;
      default:
        return styles.statusBlue;
    }
  };  // Use real data for charts if available, otherwise use the mock data
  const scansData = dashboardData && dashboardData.scanData ? {
    labels: dashboardData.scanData.map(item => item.month),
    datasets: [{
      label: 'Scans',
      data: dashboardData.scanData.map(item => item.count),
      borderColor: '#0070f3',
      backgroundColor: 'rgba(0, 112, 243, 0.1)',
      fill: true,
      tension: 0.3
    }]
  } : {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Scans',
      data: [150, 220, 280, 350, 420, 390, 480, 520, 490, 550, 600, 650],
      borderColor: '#0070f3',
      backgroundColor: 'rgba(0, 112, 243, 0.1)',
      fill: true,
      tension: 0.3
    }]
  };  const diagnosesData = dashboardData && dashboardData.scanStats && dashboardData.scanStats.diagnosisBreakdown ? {
    labels: Object.keys(dashboardData.scanStats.diagnosisBreakdown),
    datasets: [{
      data: Object.values(dashboardData.scanStats.diagnosisBreakdown),
      backgroundColor: ['#34c759', '#ff3b30', '#ffcc00'],
      borderWidth: 0
    }]
  } : {
    labels: ['Healthy', 'Pneumonia', 'Other Conditions'],
    datasets: [{
      data: [65, 25, 10],
      backgroundColor: ['#34c759', '#ff3b30', '#ffcc00'],
      borderWidth: 0
    }]
  };  const appointmentsData = dashboardData && dashboardData.appointmentsByDay ? {
    labels: dashboardData.appointmentsByDay.map(item => item.day),
    datasets: [{
      label: 'Appointments',
      data: dashboardData.appointmentsByDay.map(item => item.count),
      backgroundColor: '#0070f3'
    }]
  } : {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Appointments',
      data: [45, 30, 38, 42, 50, 25, 15],
      backgroundColor: '#0070f3'
    }]
  };  const growthData = dashboardData && dashboardData.growthData ? {
    labels: dashboardData.growthData.map(item => item.month),
    datasets: [{
      label: 'New Users',
      data: dashboardData.growthData.map(item => item.count),
      borderColor: '#34c759',
      backgroundColor: 'rgba(52, 199, 89, 0.1)',
      fill: true,
      tension: 0.4
    }]
  } : {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'New Users',
      data: [100, 130, 150, 190, 240, 280, 320, 380, 430, 490, 540, 600],
      borderColor: '#34c759',
      backgroundColor: 'rgba(52, 199, 89, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    cutout: '70%'
  };  const handleSectionChange = (section) => {
    if (section === 'inquiries') {
      setShowInquiryPage(true);
      setShowDatabaseManager(false);
    } else if (section === 'database') {
      setShowDatabaseManager(true);
      setShowInquiryPage(false);
      setActiveSection('database');
    } else {
      setShowInquiryPage(false);
      setShowDatabaseManager(false);
      setActiveSection(section);
      const element = document.getElementById(section);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // View appointment details
  const viewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentModal(true);
  };

  // Close appointment modal
  const closeAppointmentModal = () => {
    setShowAppointmentModal(false);
    setSelectedAppointment(null);
  };

  // Update appointment status
  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/appointments/status/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Refresh dashboard data to get updated appointments
        await fetchDashboardData();
        setShowAppointmentModal(false);
        // Alert user of successful status update
        alert(`Appointment status updated to ${newStatus}`);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.msg || 'Failed to update appointment status'}`);
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('Failed to update appointment status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <Link to="/" className={styles.logo} style={{ textDecoration: 'none', color: 'inherit' }}>
          <i className="fas fa-home" style={{ marginRight: 8 }}></i>Smart Care
        </Link>
        <ul className={styles.navLinks}>
          <li className={`${styles.navItem} ${activeSection === 'dashboard' ? styles.active : ''}`} onClick={() => handleSectionChange('dashboard')}>
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </li>
          <li className={`${styles.navItem} ${activeSection === 'analytics' ? styles.active : ''}`} onClick={() => handleSectionChange('analytics')}>
            <i className="fas fa-chart-line"></i>
            <span>Analytics</span>
          </li>
          <li className={`${styles.navItem} ${activeSection === 'appointments' ? styles.active : ''}`} onClick={() => handleSectionChange('appointments')}>
            <i className="fas fa-calendar-check"></i>
            <span>Appointments</span>
          </li>          <li className={`${styles.navItem} ${showInquiryPage ? styles.active : ''}`} onClick={() => handleSectionChange('inquiries')}>
            <i className="fas fa-question-circle"></i>
            <span>Inquiries</span>
          </li>
          <li className={`${styles.navItem} ${activeSection === 'database' ? styles.active : ''}`} onClick={() => handleSectionChange('database')}>
            <i className="fas fa-database"></i>
            <span>Database Manager</span>
          </li>
          <li className={styles.navItem}>
            <i className="fas fa-cog"></i>
            <span>Settings</span>
          </li>
          <li className={styles.navItem}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', width: '100%' }}>
              <i className="fas fa-home"></i>
              <span>Return Home</span>
            </Link>
          </li>
        </ul>
        <button className={styles.logoutBtn}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>      </aside>
      {showDatabaseManager ? (
        <main className={styles.mainContent}>
          <div className={styles.header}>
            <h1 className={styles.pageTitle} style={{ cursor: 'pointer' }} onClick={() => handleSectionChange('database')}>
              Database Manager
            </h1>
            
            <div className={styles.userProfile}>
              <div className={styles.userAvatar}>A</div>
              <span>Admin</span>
            </div>
          </div>
          
          <DatabaseManager />
        </main>
      ) : !showInquiryPage ? (
        <main className={styles.mainContent}>
          <div className={styles.header}>
            <h1 className={styles.pageTitle} style={{ cursor: 'pointer' }} onClick={() => handleSectionChange('dashboard')}>
              Dashboard
            </h1>
            
            <div className={styles.userProfile}>
              <div className={styles.userAvatar}>A</div>
              <span>Admin</span>
            </div>
          </div>          <section id="dashboard">
            <div className={styles.statsContainer}>
              <div className={styles.statCard}>
                <div className={styles.statCardHeader}>
                  <div className={styles.statCardTitle}>Total Scans</div>
                  <div className={styles.statCardIcon}>
                    <i className="fas fa-x-ray"></i>
                  </div>
                </div>
                <div className={styles.statCardValue}>
                  {dashboardData ? dashboardData.scanStats.total.toLocaleString() : '...'}
                </div>
                <div className={`${styles.statCardChange} ${styles.positiveChange}`}>
                  <i className="fas fa-arrow-up"></i> 12% than last month
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statCardHeader}>
                  <div className={styles.statCardTitle}>Active Patients</div>
                  <div className={styles.statCardIcon}>
                    <i className="fas fa-users"></i>
                  </div>
                </div>
                <div className={styles.statCardValue}>
                  {dashboardData ? dashboardData.userStats.total.toLocaleString() : '...'}
                </div>
                <div className={`${styles.statCardChange} ${styles.positiveChange}`}>
                  <i className="fas fa-arrow-up"></i> 8% than last month
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statCardHeader}>
                  <div className={styles.statCardTitle}>Today's Appointments</div>
                  <div className={styles.statCardIcon}>
                    <i className="fas fa-calendar-day"></i>
                  </div>
                </div>
                <div className={styles.statCardValue}>
                  {dashboardData ? dashboardData.appointmentStats.confirmed.toLocaleString() : '...'}
                </div>
                <div className={`${styles.statCardChange} ${styles.negativeChange}`}>
                  <i className="fas fa-arrow-down"></i> 3% than yesterday
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statCardHeader}>
                  <div className={styles.statCardTitle}>AI Accuracy</div>
                  <div className={styles.statCardIcon}>
                    <i className="fas fa-robot"></i>
                  </div>
                </div>
                <div className={styles.statCardValue}>97.8%</div>
                <div className={`${styles.statCardChange} ${styles.positiveChange}`}>
                  <i className="fas fa-arrow-up"></i> 1.2% than last week
                </div>
              </div>
            </div>
            
            <div className={styles.chartsContainer}>
              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <div className={styles.chartTitle}>Scans Performance</div>
                </div>
                <div className={styles.chartSubtitle}>Monthly scan volume for the past year</div>
                <div className={styles.chartContainer}>
                  <Line data={scansData} options={options} />
                </div>
              </div>

              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <div className={styles.chartTitle}>Diagnosis Distribution</div>
                </div>
                <div className={styles.chartSubtitle}>Overall diagnosis results</div>
                <div className={styles.chartContainer}>
                  <Doughnut data={diagnosesData} options={doughnutOptions} />
                </div>
              </div>
            </div>

            <div className={styles.tableContainer}>
              <div className={styles.tableHeader}>
                <div className={styles.tableTitle}>Recent Patients</div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Scan Result</th>
                    <th>Appointment</th>
                    <th>Last Visit</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className={styles.loadingMessage}>Loading patient data...</td>
                    </tr>
                  ) : recentPatients.length > 0 ? (
                    recentPatients.map((patient) => (
                      <tr key={patient.id}>
                        <td>{patient.name}</td>
                        <td>{patient.email}</td>
                        <td>
                          <span className={`${styles.statusPill} ${getStatusPillStyle(patient.diagnosis)}`}>
                            {patient.diagnosis}
                          </span>
                        </td>
                        <td>
                          <span className={`${styles.statusPill} ${styles.statusBlue}`}>
                            {patient.role === 'premium' ? 'Premium' : 'Standard'}
                          </span>
                        </td>
                        <td>{formatDate(patient.date)}</td>
                        <td>
                          <button className={`${styles.actionBtn} ${styles.viewBtn}`}><i className="fas fa-eye"></i></button>
                          <button className={`${styles.actionBtn} ${styles.deleteBtn}`}><i className="fas fa-trash"></i></button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className={styles.noData}>No patient data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <ul className={styles.pagination}>
                <li className={styles.active}><a href="#">1</a></li>
                <li><a href="#">2</a></li>
                <li><a href="#">3</a></li>              </ul>
            </div>
          </section>
          
          <section id="analytics">
            <h2 className={styles.pageTitle} style={{ marginBottom: '20px' }}>Analytics</h2>
            <div className={styles.chartsContainer}>
              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <div className={styles.chartTitle}>Weekly Appointments</div>
                </div>
                <div className={styles.chartSubtitle}>Appointments by day of week</div>
                <div className={styles.chartContainer}>
                  <Bar data={appointmentsData} options={options} />
                </div>
              </div>

              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <div className={styles.chartTitle}>User Growth</div>
                </div>
                <div className={styles.chartSubtitle}>Monthly new user registrations</div>
                <div className={styles.chartContainer}>
                  <Line data={growthData} options={options} />
                </div>
              </div>
            </div>
          </section>          <section id="appointments">
            <h2 className={styles.pageTitle} style={{ marginBottom: '20px' }}>Appointments</h2>
            <div className={styles.tableContainer}>
              <div className={styles.tableHeader}>
                <div className={styles.tableTitle}>Upcoming Appointments</div>
                <div className={styles.tableActions}>
                  <button className={styles.refreshBtn} onClick={() => {
                    setIsLoading(true);
                    fetchDashboardData().then(() => setIsLoading(false));
                  }}>
                    <i className="fas fa-sync-alt"></i> Refresh
                  </button>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Doctor</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="7" className={styles.loadingMessage}>Loading appointments...</td>
                    </tr>
                  ) : upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.patientName}</td>
                        <td>{formatDate(appointment.date)}</td>
                        <td>{appointment.time}</td>
                        <td>{appointment.doctor}</td>
                        <td>{appointment.reason || 'General consultation'}</td>
                        <td>
                          <span className={`${styles.statusPill} ${getStatusPillStyle(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </td>                        <td>
                          <button 
                            className={`${styles.actionBtn} ${styles.viewBtn}`} 
                            title="View Details"
                            onClick={() => viewAppointmentDetails(appointment)}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            className={`${styles.actionBtn} ${styles.editBtn}`} 
                            title="Edit Appointment"
                            onClick={() => viewAppointmentDetails(appointment)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className={styles.noData}>No upcoming appointments</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {upcomingAppointments.length > 5 && (
                <ul className={styles.pagination}>
                  <li className={styles.active}><a href="#">1</a></li>
                  <li><a href="#">2</a></li>
                  <li><a href="#">3</a></li>
                </ul>
              )}
            </div>

            <div className={styles.tableContainer}>
              <div className={styles.tableHeader}>
                <div className={styles.tableTitle}>Completed Appointments</div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Doctor</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className={styles.loadingMessage}>Loading appointments...</td>
                    </tr>
                  ) : completedAppointments.length > 0 ? (
                    completedAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.patientName}</td>
                        <td>{formatDate(appointment.date)}</td>
                        <td>{appointment.time}</td>
                        <td>{appointment.doctor}</td>
                        <td>
                          <span className={`${styles.statusPill} ${getStatusPillStyle(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </td>                        <td>
                          <button 
                            className={`${styles.actionBtn} ${styles.viewBtn}`} 
                            title="View Details"
                            onClick={() => viewAppointmentDetails(appointment)}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          {appointment.status !== 'cancelled' && (
                            <button 
                              className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                              title="Cancel Appointment"
                              onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className={styles.noData}>No completed appointments</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {completedAppointments.length > 5 && (
                <ul className={styles.pagination}>
                  <li className={styles.active}><a href="#">1</a></li>
                  <li><a href="#">2</a></li>
                  <li><a href="#">3</a></li>
                </ul>
              )}
            </div>
          </section>
        </main>
      ) : (
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <h1 className={styles.pageTitle}>Patient Inquiries</h1>
            <div className={styles.searchBar}>
              <input type="text" placeholder="Search inquiries..." />
            </div>
            <div className={styles.userProfile}>
              <div className={styles.userAvatar}>A</div>
              <span>Admin</span>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <div className={styles.tableTitle}>Recent Inquiries</div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Question</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Michael Johnson</td>
                  <td>How do I upload my X-ray scan for analysis?</td>
                  <td>May 8, 2025</td>
                  <td><span className={`${styles.statusPill} ${styles.statusRed}`}>Pending</span></td>
                  <td>
                    <button className={`${styles.actionBtn} ${styles.viewBtn}`}><i className="fas fa-reply"></i></button>
                  </td>
                </tr>
                <tr>
                  <td>Sarah Williams</td>
                  <td>When will my X-ray results be available?</td>
                  <td>May 7, 2025</td>
                  <td><span className={`${styles.statusPill} ${styles.statusBlue}`}>In Progress</span></td>
                  <td>
                    <button className={`${styles.actionBtn} ${styles.viewBtn}`}><i className="fas fa-reply"></i></button>
                  </td>
                </tr>
                <tr>
                  <td>David Thompson</td>
                  <td>How accurate is the AI diagnosis system?</td>
                  <td>May 7, 2025</td>
                  <td><span className={`${styles.statusPill} ${styles.statusGreen}`}>Resolved</span></td>
                  <td>
                    <button className={`${styles.actionBtn} ${styles.viewBtn}`}><i className="fas fa-eye"></i></button>
                  </td>
                </tr>
                <tr>
                  <td>Lisa Anderson</td>
                  <td>Can I schedule an appointment through the app?</td>
                  <td>May 6, 2025</td>
                  <td><span className={`${styles.statusPill} ${styles.statusGreen}`}>Resolved</span></td>
                  <td>
                    <button className={`${styles.actionBtn} ${styles.viewBtn}`}><i className="fas fa-eye"></i></button>
                  </td>
                </tr>
                <tr>
                  <td>Robert Martinez</td>
                  <td>Is my medical data secure on this platform?</td>
                  <td>May 6, 2025</td>
                  <td><span className={`${styles.statusPill} ${styles.statusBlue}`}>In Progress</span></td>
                  <td>
                    <button className={`${styles.actionBtn} ${styles.viewBtn}`}><i className="fas fa-reply"></i></button>
                  </td>
                </tr>
                <tr>
                  <td>Jennifer Clark</td>
                  <td>How can I access my previous scan results?</td>
                  <td>May 5, 2025</td>
                  <td><span className={`${styles.statusPill} ${styles.statusGreen}`}>Resolved</span></td>
                  <td>
                    <button className={`${styles.actionBtn} ${styles.viewBtn}`}><i className="fas fa-eye"></i></button>
                  </td>
                </tr>
                <tr>
                  <td>Thomas Rodriguez</td>
                  <td>What insurance plans do you accept?</td>
                  <td>May 5, 2025</td>
                  <td><span className={`${styles.statusPill} ${styles.statusGreen}`}>Resolved</span></td>
                  <td>
                    <button className={`${styles.actionBtn} ${styles.viewBtn}`}><i className="fas fa-eye"></i></button>
                  </td>
                </tr>
                <tr>
                  <td>Amanda Lewis</td>
                  <td>Can I get a second opinion after an AI diagnosis?</td>
                  <td>May 4, 2025</td>
                  <td><span className={`${styles.statusPill} ${styles.statusGreen}`}>Resolved</span></td>
                  <td>
                    <button className={`${styles.actionBtn} ${styles.viewBtn}`}><i className="fas fa-eye"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
            <ul className={styles.pagination}>
              <li className={styles.active}><a href="#">1</a></li>
              <li><a href="#">2</a></li>
              <li><a href="#">3</a></li>
            </ul>
          </div>

          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <div className={styles.tableTitle}>Inquiry Detail</div>
            </div>
            <div style={{ padding: '20px' }}>
              <h3>How do I upload my X-ray scan for analysis?</h3>
              <p style={{ margin: '15px 0', color: 'var(--text-light)' }}>From: Michael Johnson - May 8, 2025</p>
              <div style={{ backgroundColor: 'var(--secondary-color)', padding: '15px', borderRadius: '8px', margin: '20px 0' }}>
                <p>Hello, I recently registered on the E-med platform and would like to upload my X-ray for analysis. I have the X-ray saved as a JPEG file on my computer. Could you please guide me through the process of uploading it for AI analysis? Also, how long does it typically take to get results back?</p>
              </div>
              <div>
                <h4 style={{ marginBottom: '10px' }}>Reply</h4>
                <textarea style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', minHeight: '150px' }} placeholder="Type your response here..."></textarea>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
                  <button style={{ padding: '10px 20px', backgroundColor: 'var(--white)', color: 'var(--text-dark)', border: '1px solid var(--border-color)', borderRadius: '5px', marginRight: '10px', cursor: 'pointer' }}>Cancel</button>
                  <button style={{ padding: '10px 20px', backgroundColor: 'var(--primary-color)', color: 'var(--white)', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Send Reply</button>
                </div>
              </div>
            </div>
          </div>        </div>
      )}
      
      {/* Appointment Detail Modal */}
      {showAppointmentModal && selectedAppointment && (
        <div className={styles.modalOverlay} onClick={closeAppointmentModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Appointment Details</h3>
              <button className={styles.closeModalBtn} onClick={closeAppointmentModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.appointmentDetail}>
                <span className={styles.detailLabel}>Patient:</span>
                <span className={styles.detailValue}>{selectedAppointment.patientName}</span>
              </div>
              <div className={styles.appointmentDetail}>
                <span className={styles.detailLabel}>Date:</span>
                <span className={styles.detailValue}>{formatDate(selectedAppointment.date)}</span>
              </div>
              <div className={styles.appointmentDetail}>
                <span className={styles.detailLabel}>Time:</span>
                <span className={styles.detailValue}>{selectedAppointment.time}</span>
              </div>
              <div className={styles.appointmentDetail}>
                <span className={styles.detailLabel}>Doctor:</span>
                <span className={styles.detailValue}>{selectedAppointment.doctor}</span>
              </div>
              <div className={styles.appointmentDetail}>
                <span className={styles.detailLabel}>Reason:</span>
                <span className={styles.detailValue}>{selectedAppointment.reason || 'General consultation'}</span>
              </div>
              <div className={styles.appointmentDetail}>
                <span className={styles.detailLabel}>Status:</span>
                <span className={`${styles.statusPill} ${getStatusPillStyle(selectedAppointment.status)}`}>
                  {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                </span>
              </div>
              
              <div className={styles.statusUpdateSection}>
                <h4>Update Status</h4>
                <div className={styles.statusBtnGroup}>
                  <button 
                    disabled={updatingStatus || selectedAppointment.status === 'pending'} 
                    className={`${styles.statusBtn} ${selectedAppointment.status === 'pending' ? styles.activeStatusBtn : ''}`}
                    onClick={() => updateAppointmentStatus(selectedAppointment.id, 'pending')}
                  >
                    Pending
                  </button>
                  <button 
                    disabled={updatingStatus || selectedAppointment.status === 'confirmed'} 
                    className={`${styles.statusBtn} ${selectedAppointment.status === 'confirmed' ? styles.activeStatusBtn : ''}`}
                    onClick={() => updateAppointmentStatus(selectedAppointment.id, 'confirmed')}
                  >
                    Confirmed
                  </button>
                  <button 
                    disabled={updatingStatus || selectedAppointment.status === 'completed'} 
                    className={`${styles.statusBtn} ${selectedAppointment.status === 'completed' ? styles.activeStatusBtn : ''}`}
                    onClick={() => updateAppointmentStatus(selectedAppointment.id, 'completed')}
                  >
                    Completed
                  </button>
                  <button 
                    disabled={updatingStatus || selectedAppointment.status === 'cancelled'} 
                    className={`${styles.statusBtn} ${selectedAppointment.status === 'cancelled' ? styles.activeStatusBtn : ''}`}
                    onClick={() => updateAppointmentStatus(selectedAppointment.id, 'cancelled')}
                  >
                    Cancelled
                  </button>
                </div>
                {updatingStatus && <p className={styles.updatingMessage}>Updating status...</p>}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.closeBtn} onClick={closeAppointmentModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;