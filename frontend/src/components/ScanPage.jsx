import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import '../styles/ScanPage.css';

const ScanPage = () => {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [view, setView] = useState('scan');
  const [scanHistory, setScanHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchScanHistory();
  }, []);

  const fetchScanHistory = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/scans/history');
      setScanHistory(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching scan history:', err);
      setError('Failed to load scan history');
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(selectedFile);
      setFilePreview(previewUrl);
      
      // Reset previous results
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    if (user?.role !== 'doctor' && user?.role !== 'admin' && user?.scansRemaining <= 0) {
      setError('You have no scans remaining. Please upgrade to premium for more scans.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.post('/scans/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setResult(response.data);
      fetchScanHistory();
      setIsLoading(false);    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.response?.data?.msg || 'Upload failed');
      setIsLoading(false);
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
          
          {/* Display error if any */}
          {error && <div className="error-message">{error}</div>}
          
          {/* Display loading spinner */}
          {isLoading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Processing your image...</p>
            </div>
          )}
          
          {/* Display results if available */}
          {result && (
            <div className="result-container">
              <h2>Analysis Results</h2>
              <div className="result-box">
                <div className={`result-indicator ${result.prediction?.prediction === 'PNEUMONIA' ? 'pneumonia' : 'normal'}`}>
                  {result.prediction?.prediction || 'Unknown'}
                </div>
                <div className="confidence">
                  Confidence: {result.prediction?.confidence || 0}%
                </div>
                <p className="result-description">
                  {result.prediction?.prediction === 'PNEUMONIA' 
                    ? 'Potential pneumonia detected. Please consult with a healthcare professional.' 
                    : 'No signs of pneumonia detected.'}
                </p>
                <div className="ai-analysis-details">
                  <h3>AI Analysis Details</h3>
                  <ul>
                    <li><strong>ID:</strong> {result.prediction?.id}</li>
                    <li><strong>Processed:</strong> {new Date(result.prediction?.timestamp).toLocaleString()}</li>
                    <li><strong>Assessment:</strong> {result.prediction?.prediction === 'PNEUMONIA' ? 
                      'The AI model has detected patterns consistent with pneumonia in this X-ray.' :
                      'The AI model did not detect patterns consistent with pneumonia in this X-ray.'}
                    </li>
                  </ul>
                  <div className="disclaimer">
                    <strong>Note:</strong> This AI analysis is for informational purposes only and should not 
                    replace professional medical diagnosis. Always consult with a healthcare provider.
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* File upload area */}
          <div className="upload-box">
            {filePreview ? (
              <div className="image-preview">
                <img src={filePreview} alt="X-ray preview" />
                <button className="remove-btn" onClick={() => {
                  setFile(null);
                  setFilePreview(null);
                  setResult(null);
                }}>
                  Remove
                </button>
              </div>
            ) : (
              <>
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
              </>
            )}
            
            <label className="upload-btn">
              {filePreview ? 'Change Image' : 'Upload Files'}
              <input type="file" hidden onChange={handleFileChange} accept="image/jpeg,image/png,image/jpg" />
            </label>
            
            {file && !result && !isLoading && (
              <button onClick={handleUpload} className="upload-btn submit-btn">
                Analyze Scan
              </button>
            )}
          </div>
          
          <p className="upload-note">
            Accepted formats: <strong>JPG, PNG, JPEG</strong> — Please upload a clear chest X-ray image.
          </p>
          
          <div className="scans-remaining">
            <p>
              {user?.role === 'free' ? (
                <>Scans remaining: <strong>{user?.scansRemaining || 0}</strong></>
              ) : user?.role === 'premium' ? (
                <>Premium account: <strong>{user?.scansRemaining || 0} scans remaining</strong></>
              ) : user?.role === 'doctor' || user?.role === 'admin' ? (
                <><strong>Unlimited</strong> scans available</>
              ) : (
                <>Scans remaining: <strong>{user?.scansRemaining || 0}</strong></>
              )}
            </p>
          </div>
        </>
      ) : (
        <div className="history-container">
          <h2>Scan History</h2>
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading history...</p>
            </div>
          ) : scanHistory.length > 0 ? (
            <div className="history-list">
              {scanHistory.map((scan, index) => (
                <div key={index} className="history-item">
                  <div className="history-date">
                    {new Date(scan.date).toLocaleDateString()} {new Date(scan.date).toLocaleTimeString()}
                  </div>
                  <div className="history-result-indicator">
                    <span className={scan.result === 'PNEUMONIA' ? 'pneumonia' : 'normal'}>
                      {scan.result}
                    </span>
                    {scan.confidence && (
                      <span className="confidence-small">
                        {scan.confidence}% confidence
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No scan history available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ScanPage;