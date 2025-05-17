import React, { useState, useEffect, useContext } from 'react';
import  AuthContext  from '../context/AuthContext';
import '../styles/ScanPage.css';

const ScanPage = () => {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [view, setView] = useState('scan');
  const [scanHistory, setScanHistory] = useState([]);

  useEffect(() => {
    fetchScanHistory();
  }, []);

  const fetchScanHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/scan-history', {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      const data = await response.json();
      setScanHistory(data);
    } catch (err) {
      console.error('Error fetching scan history:', err);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || user.scansRemaining <= 0) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/scan/upload', {
        method: 'POST',
        headers: { 'x-auth-token': localStorage.getItem('token') },
        body: formData,
      });
      if (response.ok) {
        alert('Scan uploaded successfully');
        fetchScanHistory();
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      alert('Error uploading scan');
    }
  };

  return (
    <div className="upload-container">
      <div className="tab-switch">
        <button onClick={() => setView('scan')} className={view === 'scan' ? 'active' : ''}>Scan</button>
        <button onClick={() => setView('history')} className={view === 'history' ? 'active' : ''}>Scan History</button>
      </div>
      {view === 'scan' ? (
        <>
          <h1>Detect Pneumonia Instantly with Trusted AI</h1>
          <p className="subtitle">
            Our advanced system reviews your lung scan to identify pneumonia with over 99% accuracy — fast, secure, and reliable.
          </p>
          <div className="upload-box">
            <div className="upload-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1"
                stroke="currentColor"
                className="upload-svg-icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                />
              </svg>
            </div>
            <p>Upload Your Chest X-ray to Check for Pneumonia</p>
            <label className="upload-btn">
              Upload Files
              <input type="file" hidden onChange={handleFileChange} accept="image/jpeg,image/png,image/jpg" />
            </label>
            {file && <button onClick={handleUpload} className="upload-btn">Submit Scan</button>}
          </div>
          <p className="upload-note">
            Accepted formats: <strong>JPG, PNG, JPEG</strong> — Please upload a clear chest X-ray image.
          </p>
          <p>Scans remaining: {user?.scansRemaining || 0}</p>
        </>
      ) : (
        <div className="history-container">
          <h2>Scan History</h2>
          {scanHistory.length > 0 ? (
            <ul>
              {scanHistory.map((scan, index) => (
                <li key={index}>
                  Date: {new Date(scan.date).toLocaleDateString()}, Result: {scan.result}, Image: {scan.imageUrl}
                </li>
              ))}
            </ul>
          ) : (
            <p>No scan history available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ScanPage;