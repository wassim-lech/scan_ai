import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/DoctorDashboard.module.css';

const DoctorDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [scanResults, setScanResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const headers = {
        'x-auth-token': token
      };

      // Fetch doctor's appointments
      const appointmentsResponse = await fetch('http://localhost:5001/api/appointments/doctor', {
        headers
      });
      
      if (appointmentsResponse.ok) {
        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData);
        
        // Extract unique patients from appointments
        const uniquePatientIds = [...new Set(appointmentsData.map(appt => 
          appt.userId?._id || appt.userId
        ))];
        
        // Fetch patient details
        const patientsResponse = await fetch('http://localhost:5001/api/appointments/doctor/patients', {
          headers
        });
        
        if (patientsResponse.ok) {
          const patientsData = await patientsResponse.json();
          setPatients(patientsData);
        }
        
        // Fetch patient scan results
        const scanResultsResponse = await fetch('http://localhost:5001/api/appointments/doctor/scan-results', {
          headers
        });
        
        if (scanResultsResponse.ok) {
          const scanResultsData = await scanResultsResponse.json();
          setScanResults(scanResultsData);
        }

        // Calculate statistics
        setStats({
          totalAppointments: appointmentsData.length,
          pendingAppointments: appointmentsData.filter(a => a.status === 'pending').length,
          completedAppointments: appointmentsData.filter(a => a.status === 'completed').length,
          totalPatients: uniquePatientIds.length
        });
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching doctor data:', error);
      setIsLoading(false);
    }
  };

  // Helper functions for formatting
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusPillStyle = (status) => {
    switch (status?.toLowerCase()) {
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
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    // Smoothly scroll to section
    const element = document.getElementById(section);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <Link to="/" className={styles.logo} style={{ textDecoration: 'none', color: 'inherit' }}>
          <i className="fas fa-user-md" style={{ marginRight: 8 }}></i>Doctor Portal
        </Link>
        <ul className={styles.navLinks}>
          <li className={`${styles.navItem} ${activeSection === 'dashboard' ? styles.active : ''}`} onClick={() => handleSectionChange('dashboard')}>
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </li>
          <li className={`${styles.navItem} ${activeSection === 'appointments' ? styles.active : ''}`} onClick={() => handleSectionChange('appointments')}>
            <i className="fas fa-calendar-check"></i>
            <span>View Appointments</span>
          </li>
          <li className={`${styles.navItem} ${activeSection === 'patients' ? styles.active : ''}`} onClick={() => handleSectionChange('patients')}>
            <i className="fas fa-users"></i>
            <span>View Patient Lists</span>
          </li>
          <li className={`${styles.navItem} ${activeSection === 'scanResults' ? styles.active : ''}`} onClick={() => handleSectionChange('scanResults')}>
            <i className="fas fa-x-ray"></i>
            <span>View Patient Results</span>
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
        </button>
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle} style={{ cursor: 'pointer' }} onClick={() => handleSectionChange('dashboard')}>
            Doctor Dashboard
          </h1>
          
          <div className={styles.userProfile}>
            <div className={styles.userAvatar}>D</div>
            <span>Doctor</span>
          </div>
        </div>

        <section id="dashboard">
          <div className={styles.statsContainer}>
            <div className={styles.statCard}>
              <div className={styles.statCardHeader}>
                <div className={styles.statCardTitle}>Total Appointments</div>
                <div className={styles.statCardIcon}>
                  <i className="fas fa-calendar-check"></i>
                </div>
              </div>
              <div className={styles.statCardValue}>
                {stats ? stats.totalAppointments.toLocaleString() : '...'}
              </div>
              <div className={`${styles.statCardChange} ${styles.positiveChange}`}>
                <i className="fas fa-arrow-up"></i> All time appointments
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statCardHeader}>
                <div className={styles.statCardTitle}>Total Patients</div>
                <div className={styles.statCardIcon}>
                  <i className="fas fa-users"></i>
                </div>
              </div>
              <div className={styles.statCardValue}>
                {stats ? stats.totalPatients.toLocaleString() : '...'}
              </div>
              <div className={`${styles.statCardChange} ${styles.positiveChange}`}>
                <i className="fas fa-arrow-up"></i> Unique patients
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statCardHeader}>
                <div className={styles.statCardTitle}>Pending Appointments</div>
                <div className={styles.statCardIcon}>
                  <i className="fas fa-clock"></i>
                </div>
              </div>
              <div className={styles.statCardValue}>
                {stats ? stats.pendingAppointments.toLocaleString() : '...'}
              </div>
              <div className={`${styles.statCardChange} ${styles.positiveChange}`}>
                <i className="fas fa-arrow-up"></i> Awaiting attention
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statCardHeader}>
                <div className={styles.statCardTitle}>Completed Appointments</div>
                <div className={styles.statCardIcon}>
                  <i className="fas fa-check-circle"></i>
                </div>
              </div>
              <div className={styles.statCardValue}>
                {stats ? stats.completedAppointments.toLocaleString() : '...'}
              </div>
              <div className={`${styles.statCardChange} ${styles.positiveChange}`}>
                <i className="fas fa-arrow-up"></i> Successfully completed
              </div>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <div className={styles.tableTitle}>Today's Appointments</div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className={styles.loadingMessage}>Loading appointments...</td>
                  </tr>
                ) : appointments.length > 0 ? (
                  appointments
                    .filter(appointment => {
                      const today = new Date();
                      const appointmentDate = new Date(appointment.appointmentDate);
                      return appointmentDate.setHours(0,0,0,0) === today.setHours(0,0,0,0);
                    })
                    .map((appointment) => (
                      <tr key={appointment._id}>
                        <td>{appointment.userId?.name || 'Patient'}</td>
                        <td>{appointment.time || 'N/A'}</td>
                        <td>{appointment.reason || 'Not specified'}</td>
                        <td>
                          <span className={`${styles.statusPill} ${getStatusPillStyle(appointment.status)}`}>
                            {appointment.status || 'Pending'}
                          </span>
                        </td>
                        <td>
                          <button className={`${styles.actionBtn} ${styles.viewBtn}`}>
                            <i className="fas fa-eye"></i>
                          </button>
                          <button className={`${styles.actionBtn} ${styles.editBtn}`}>
                            <i className="fas fa-edit"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="5" className={styles.noData}>No appointments for today</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section id="appointments">
          <h2 className={styles.pageTitle} style={{ marginBottom: '20px' }}>View Appointments</h2>
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <div className={styles.tableTitle}>All Appointments</div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className={styles.loadingMessage}>Loading appointments...</td>
                  </tr>
                ) : appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{appointment.userId?.name || 'Patient'}</td>
                      <td>{formatDate(appointment.appointmentDate)}</td>
                      <td>{appointment.time || 'N/A'}</td>
                      <td>{appointment.reason || 'Not specified'}</td>
                      <td>
                        <span className={`${styles.statusPill} ${getStatusPillStyle(appointment.status)}`}>
                          {appointment.status || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <button className={`${styles.actionBtn} ${styles.viewBtn}`}>
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className={`${styles.actionBtn} ${styles.editBtn}`}>
                          <i className="fas fa-edit"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className={styles.noData}>No appointments available</td>
                  </tr>
                )}
              </tbody>
            </table>
            <ul className={styles.pagination}>
              <li className={styles.active}><a href="#">1</a></li>
              <li><a href="#">2</a></li>
              <li><a href="#">3</a></li>
            </ul>
          </div>
        </section>

        <section id="patients">
          <h2 className={styles.pageTitle} style={{ marginBottom: '20px' }}>View Patient Lists</h2>
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <div className={styles.tableTitle}>Your Patients</div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Last Visit</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className={styles.loadingMessage}>Loading patients...</td>
                  </tr>
                ) : patients.length > 0 ? (
                  patients.map((patient) => (
                    <tr key={patient._id}>
                      <td>{patient.name}</td>
                      <td>{patient.email}</td>
                      <td>{patient.phone || 'N/A'}</td>
                      <td>{patient.lastVisit ? formatDate(patient.lastVisit) : 'Never'}</td>
                      <td>
                        <span className={`${styles.statusPill} ${styles.statusBlue}`}>
                          {patient.status || 'Active'}
                        </span>
                      </td>
                      <td>
                        <button className={`${styles.actionBtn} ${styles.viewBtn}`}>
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className={`${styles.actionBtn} ${styles.editBtn}`}>
                          <i className="fas fa-edit"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className={styles.noData}>No patients available</td>
                  </tr>
                )}
              </tbody>
            </table>
            <ul className={styles.pagination}>
              <li className={styles.active}><a href="#">1</a></li>
              <li><a href="#">2</a></li>
              <li><a href="#">3</a></li>
            </ul>
          </div>
        </section>

        <section id="scanResults">
          <h2 className={styles.pageTitle} style={{ marginBottom: '20px' }}>View Patient Results</h2>
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <div className={styles.tableTitle}>AI Scan Results</div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Scan Date</th>
                  <th>Scan Type</th>
                  <th>AI Result</th>
                  <th>Confidence</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className={styles.loadingMessage}>Loading scan results...</td>
                  </tr>
                ) : scanResults.length > 0 ? (
                  scanResults.map((result) => (
                    <tr key={result._id}>
                      <td>{result.patientName}</td>
                      <td>{formatDate(result.scanDate)}</td>
                      <td>{result.scanType || 'X-Ray'}</td>
                      <td>
                        <span className={`${styles.statusPill} ${getStatusPillStyle(result.diagnosis)}`}>
                          {result.diagnosis}
                        </span>
                      </td>
                      <td>{result.confidence ? `${result.confidence}%` : 'N/A'}</td>
                      <td>
                        <button className={`${styles.actionBtn} ${styles.viewBtn}`}>
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className={`${styles.actionBtn} ${styles.editBtn}`}>
                          <i className="fas fa-edit"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className={styles.noData}>No scan results available</td>
                  </tr>
                )}
              </tbody>
            </table>
            <ul className={styles.pagination}>
              <li className={styles.active}><a href="#">1</a></li>
              <li><a href="#">2</a></li>
              <li><a href="#">3</a></li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DoctorDashboard;