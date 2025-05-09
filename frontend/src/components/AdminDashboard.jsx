import React, { useState, useEffect, useRef } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import styles from '../styles/AdminDashboard.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showInquiryPage, setShowInquiryPage] = useState(false);

  const scansData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Scans',
      data: [150, 220, 280, 350, 420, 390, 480, 520, 490, 550, 600, 650],
      borderColor: '#0070f3',
      backgroundColor: 'rgba(0, 112, 243, 0.1)',
      fill: true,
      tension: 0.3
    }]
  };

  const diagnosesData = {
    labels: ['Healthy', 'Pneumonia', 'Other Conditions'],
    datasets: [{
      data: [65, 25, 10],
      backgroundColor: ['#34c759', '#ff3b30', '#ffcc00'],
      borderWidth: 0
    }]
  };

  const appointmentsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Appointments',
      data: [45, 30, 38, 42, 50, 25, 15],
      backgroundColor: '#0070f3'
    }]
  };

  const growthData = {
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
  };

  const handleSectionChange = (section) => {
    if (section === 'inquiries') {
      setShowInquiryPage(true);
    } else {
      setShowInquiryPage(false);
      setActiveSection(section);
      const element = document.getElementById(section);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>E-med</div>
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
          </li>
          <li className={`${styles.navItem} ${showInquiryPage ? styles.active : ''}`} onClick={() => handleSectionChange('inquiries')}>
            <i className="fas fa-question-circle"></i>
            <span>Inquiries</span>
          </li>
          <li className={styles.navItem}>
            <i className="fas fa-cog"></i>
            <span>Settings</span>
          </li>
        </ul>
        <button className={styles.logoutBtn}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </aside>

      {!showInquiryPage ? (
        <main className={styles.mainContent}>
          <div className={styles.header}>
            <h1 className={styles.pageTitle}>Dashboard</h1>
            <div className={styles.searchBar}>
              <input type="text" placeholder="Search..." />
            </div>
            <div className={styles.userProfile}>
              <div className={styles.userAvatar}>A</div>
              <span>Admin</span>
            </div>
          </div>

          <section id="dashboard">
            <div className={styles.statsContainer}>
              <div className={styles.statCard}>
                <div className={styles.statCardHeader}>
                  <div className={styles.statCardTitle}>Total Scans</div>
                  <div className={styles.statCardIcon}>
                    <i className="fas fa-x-ray"></i>
                  </div>
                </div>
                <div className={styles.statCardValue}>5,283</div>
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
                <div className={styles.statCardValue}>1,247</div>
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
                <div className={styles.statCardValue}>48</div>
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
                  <tr>
                    <td>John Smith</td>
                    <td>john.smith@example.com</td>
                    <td><span className={`${styles.statusPill} ${styles.statusGreen}`}>Healthy</span></td>
                    <td><span className={`${styles.statusPill} ${styles.statusBlue}`}>Booked</span></td>
                    <td>May 3, 2025</td>
                    <td>
                      <button className={`${styles.actionBtn} ${styles.viewBtn}`}><i className="fas fa-eye"></i></button>
                      <button className={`${styles.actionBtn} ${styles.deleteBtn}`}><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                  <tr>
                    <td>Emily Johnson</td>
                    <td>emily.j@example.com</td>
                    <td><span className={`${styles.statusPill} ${styles.statusRed}`}>Pneumonia</span></td>
                    <td><span className={`${styles.statusPill} ${styles.statusGreen}`}>Completed</span></td>
                    <td>May 2, 2025</td>
                    <td>
                      <button className={`${styles.actionBtn} ${styles.viewBtn}`}><i className="fas fa-eye"></i></button>
                      <button className={`${styles.actionBtn} ${styles.deleteBtn}`}><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                  <tr>
                    <td>Michael Brown</td>
                    <td>michael.b@example.com</td>
                    <td><span className={`${styles.statusPill} ${styles.statusGreen}`}>Healthy</span></td>
                    <td><span className={`${styles.statusPill} ${styles.statusRed}`}>Not Booked</span></td>
                    <td>May 1, 2025</td>
                    <td>
                      <button className={`${styles.actionBtn} ${styles.viewBtn}`}><i className="fas fa-eye"></i></button>
                      <button className={`${styles.actionBtn} ${styles.deleteBtn}`}><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                  <tr>
                    <td>Sarah Wilson</td>
                    <td>sarah.w@example.com</td>
                    <td><span className={`${styles.statusPill} ${styles.statusGreen}`}>Healthy</span></td>
                    <td><span className={`${styles.statusPill} ${styles.statusBlue}`}>Booked</span></td>
                    <td>Apr 30, 2025</td>
                    <td>
                      <button className={`${styles.actionBtn} ${styles.viewBtn}`}><i className="fas fa-eye"></i></button>
                      <button className={`${styles.actionBtn} ${styles.deleteBtn}`}><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                  <tr>
                    <td>David Lee</td>
                    <td>david.lee@example.com</td>
                    <td><span className={`${styles.statusPill} ${styles.statusRed}`}>Pneumonia</span></td>
                    <td><span className={`${styles.statusPill} ${styles.statusBlue}`}>Booked</span></td>
                    <td>Apr 29, 2025</td>
                    <td>
                      <button className={`${styles.actionBtn} ${styles.viewBtn}`}><i className="fas fa-eye"></i></button>
                      <button className={`${styles.actionBtn} ${styles.deleteBtn}`}><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <ul className={styles.pagination}>
                <li className={styles.active}><a href="#">1</a></li>
                <li><a href="#">2</a></li>
                <li><a href="#">3</a></li>
                <li><a href="#">4</a></li>
                <li><a href="#">5</a></li>
              </ul>
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

            <div className={styles.tableContainer}>
              <div className={styles.tableHeader}>
                <div className={styles.tableTitle}>Clients Progress</div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Company</th>
                    <th>City</th>
                    <th>Progress</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Howell Hand</td>
                    <td>Kiehn-Green</td>
                    <td>Emelyside</td>
                    <td>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: '60%' }}></div>
                      </div>
                    </td>
                    <td>Mar 3, 2025</td>
                    <td>
                      <button className={`${styles.actionBtn} ${styles.viewBtn}`}><i className="fas fa-eye"></i></button>
                      <button className={`${styles.actionBtn} ${styles.deleteBtn}`}><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                  <tr>
                    <td>Hope Howe</td>
                    <td>Nolan Inc</td>
                    <td>Paristown</td>
                    <td>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: '70%' }}></div>
                      </div>
                    </td>
                    <td>Dec 1, 2025</td>
                    <td>
                      <button className={`${styles.actionBtn} ${styles.viewBtn}`}><i className="fas fa-eye"></i></button>
                      <button className={`${styles.actionBtn} ${styles.deleteBtn}`}><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                  <tr>
                    <td>Nelson Jerde</td>
                    <td>Nitzsche LLC</td>
                    <td>Jailynbury</td>
                    <td>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: '50%' }}></div>
                      </div>
                    </td>
                    <td>May 18, 2025</td>
                    <td>
                      <button className={`${styles.actionBtn} ${styles.viewBtn}`}><i className="fas fa-eye"></i></button>
                      <button className={`${styles.actionBtn} ${styles.deleteBtn}`}><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                  <tr>
                    <td>Kim Weimann</td>
                    <td>Brown-Lueilwitz</td>
                    <td>New Emie</td>
                    <td>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: '40%' }}></div>
                      </div>
                    </td>
                    <td>May 4, 2025</td>
                    <td>
                      <button className={`${styles.actionBtn} ${styles.viewBtn}`}><i className="fas fa-eye"></i></button>
                      <button className={`${styles.actionBtn} ${styles.deleteBtn}`}><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                  <tr>
                    <td>Justice O'Reilly</td>
                    <td>Lakin-Muller</td>
                    <td>New Kacie</td>
                    <td>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: '35%' }}></div>
                      </div>
                    </td>
                    <td>Mar 27, 2025</td>
                    <td>
                      <button className={`${styles.actionBtn} ${styles.viewBtn}`}><i className="fas fa-eye"></i></button>
                      <button className={`${styles.actionBtn} ${styles.deleteBtn}`}><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <ul className={styles.pagination}>
                <li className={styles.active}><a href="#">1</a></li>
                <li><a href="#">2</a></li>
                <li><a href="#">3</a></li>
                <li><a href="#">4</a></li>
              </ul>
            </div>
          </section>

          <section id="appointments">
            <h2 className={styles.pageTitle} style={{ marginBottom: '20px' }}>Appointments</h2>
            <div className={styles.tableContainer}>
              <div className={styles.tableHeader}>
                <div className={styles.tableTitle}>Upcoming Appointments</div>
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
                  <tr>
                    <td>Robert Johnson</td>
                    <td>May 10, 2025</td>
                    <td>10:00 AM</td>
                    <td>Dr. Smith</td>
                    <td>X-ray Follow-up</td>
                    <td><span className={`${styles.statusPill} ${styles.statusBlue}`}>Confirmed</span></td>
                    <td>
                      <button className={`${styles.actionBtn} ${styles.viewBtn}`}><i className="fas fa-eye"></i></button>
                      <button className={`${styles.actionBtn} ${styles.deleteBtn}`}><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                  <tr>
                    <td>Jennifer Wilson</td>
                    <td>May 10, 2025</td>
                    <td>11:30 AM</td>
                    <td>Dr. Martinez</td>
                    <td>Pneumonia Treatment</td>
                    <td><span className={`${styles.statusPill} ${styles.statusBlue}`}>Confirmed</span></td>
                    <td>
                      <button className={`${styles.actionBtn} ${styles.viewBtn}`}><i className="fas fa-eye"></i></button>
                      <button className={`${styles.actionBtn} ${styles.deleteBtn}`}><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                  <tr>
                    <td>Thomas Brown</td>
                    <td>May 10, 2025</td>
                    <td>2:15 PM</td>
                    <td>Dr. Lee</td>
                    <td>Routine Checkup</td>
                    <td><span className={`${styles.statusPill} ${styles.statusGreen}`}>Checked In</span></td>
                    <td>
                      <button className={`${styles.actionBtn} ${styles.viewBtn}`}><i className="fas fa-eye"></i></button>
                      <button className={`${styles.actionBtn} ${styles.deleteBtn}`}><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                  <tr>
                    <td>Patricia Davis</td>
                    <td>May 11, 2025</td>
                    <td>9:00 AM</td>
                    <td>Dr. Johnson</td>
                    <td>X-ray Scan</td>
                    <td><span className={`${styles.statusPill} ${styles.statusBlue}`}>Confirmed</span></td>
                    <td>
                      <button className={`${styles.actionBtn} ${styles.viewBtn}`}><i className="fas fa-eye"></i></button>
                      <button className={`${styles.actionBtn} ${styles.deleteBtn}`}><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                  <tr>
                    <td>Richard Miller</td>
                    <td>May 11, 2025</td>
                    <td>10:45 AM</td>
                    <td>Dr. Garcia</td>
                    <td>Lung Examination</td>
                    <td><span className={`${styles.statusPill} ${styles.statusBlue}`}>Confirmed</span></td>
                    <td>
                      <button className={`${styles.actionBtn} ${styles.viewBtn}`}><i className="fas fa-eye"></i></button>
                      <button className={`${styles.actionBtn} ${styles.deleteBtn}`}><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                </tbody>
              </table>
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
                    <th>Doctor</th>
                    <th>Diagnosis</th>
                    <th>Follow-up</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Christopher Allen</td>
                    <td>May 3, 2025</td>
                    <td>Dr. Roberts</td>
                    <td><span className={`${styles.statusPill} ${styles.statusGreen}`}>Healthy</span></td>
                    <td>Not Required</td>
                    <td>
                      <button className={`${styles.actionBtn} ${styles.viewBtn}`}><i className="fas fa-eye"></i></button>
                    </td>
                  </tr>
                  <tr>
                    <td>Jessica Scott</td>
                    <td>May 2, 2025</td>
                    <td>Dr. Lee</td>
                    <td><span className={`${styles.statusPill} ${styles.statusRed}`}>Pneumonia</span></td>
                    <td>May 16, 2025</td>
                    <td>
                      <button className={`${styles.actionBtn} ${styles.viewBtn}`}><i className="fas fa-eye"></i></button>
                    </td>
                  </tr>
                  <tr>
                    <td>Kevin Young</td>
                    <td>May 2, 2025</td>
                    <td>Dr. Martinez</td>
                    <td><span className={`${styles.statusPill} ${styles.statusGreen}`}>Healthy</span></td>
                    <td>Not Required</td>
                    <td>
                      <button className={`${styles.actionBtn} ${styles.viewBtn}`}><i className="fas fa-eye"></i></button>
                    </td>
                  </tr>
                  <tr>
                    <td>Amanda Turner</td>
                    <td>May 1, 2025</td>
                    <td>Dr. Johnson</td>
                    <td><span className={`${styles.statusPill} ${styles.statusRed}`}>Pneumonia</span></td>
                    <td>May 15, 2025</td>
                    <td>
                      <button className={`${styles.actionBtn} ${styles.viewBtn}`}><i className="fas fa-eye"></i></button>
                    </td>
                  </tr>
                  <tr>
                    <td>Daniel Martin</td>
                    <td>Apr 30, 2025</td>
                    <td>Dr. Smith</td>
                    <td><span className={`${styles.statusPill} ${styles.statusGreen}`}>Healthy</span></td>
                    <td>Not Required</td>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;