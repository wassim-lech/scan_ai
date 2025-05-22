import React, { useState, useEffect, useContext, useRef } from 'react';
import AuthContext from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import api from '../utils/api';
import CompactSubscription from './CompactSubscription';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../styles/ScanPage.css';

const ScanPage = () => {
  const { user } = useContext(AuthContext);
  const { subscriptionStatus, scansRemaining, decrementScan } = useSubscription();
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [view, setView] = useState('scan');
  const [scanHistory, setScanHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [selectedHistoryScan, setSelectedHistoryScan] = useState(null);

  // Add a ref for scrolling to results
  const resultRef = useRef(null);

  // Add a ref for the history detail container
  const historyDetailRef = useRef(null);

  useEffect(() => {
    fetchScanHistory();
  }, []);

  // Scroll to results when they become available
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [result]);

  // Handle clicks outside the history detail modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectedHistoryScan && historyDetailRef.current && !historyDetailRef.current.contains(event.target)) {
        closeHistoryDetail();
      }
    };

    if (selectedHistoryScan) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedHistoryScan]);

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
  };  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    if ((subscriptionStatus === 'free' || user?.role === 'free') && scansRemaining <= 0) {
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
      
      // Decrement scan count for non-admin/doctor users
      if (user?.role !== 'doctor' && user?.role !== 'admin') {
        decrementScan();
      }
      
      setResult(response.data);
      fetchScanHistory();
      setIsLoading(false);    
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.response?.data?.msg || 'Upload failed');
      setIsLoading(false);
    }
  };
  const generatePDF = async () => {
    if (!result) return;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Add Smart Care logo
    pdf.setTextColor(94, 33, 199); // Purple color
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Smart-Care', 20, 20);
    
    // Add horizontal line
    pdf.setDrawColor(94, 33, 199);
    pdf.setLineWidth(0.5);
    pdf.line(20, 25, 190, 25);
    
    // Add user information
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Patient: ${user?.name || user?.username || 'Unknown'}`, 20, 40);
    pdf.text(`Email: ${user?.email || 'Unknown'}`, 20, 48);
    pdf.text(`Phone: ${user?.phone || 'Not provided'}`, 20, 56);
    pdf.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 64);
    
    // Add scan image if available
    if (filePreview) {
      try {
        const canvas = await html2canvas(document.querySelector(".scan-preview-image"), {
          useCORS: true,
          scale: 2
        });
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        
        // Calculate aspect ratio and adjust size to fit
        const imgWidth = 170;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'JPEG', 20, 80, imgWidth, imgHeight);
        
        // Add result information below the image
        const yPos = 90 + imgHeight;
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Scan Analysis Results', 20, yPos);
        
        // Add diagnosis result
        pdf.setFontSize(14);
        if (result.prediction?.prediction === 'PNEUMONIA') {
          pdf.setTextColor(198, 40, 40); // Red color
        } else {
          pdf.setTextColor(46, 125, 50); // Green color
        }
        pdf.text(`Diagnosis: ${result.prediction?.prediction || 'Unknown'}`, 20, yPos + 10);
        
        // Add confidence score
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Confidence Score: ${result.prediction?.confidence || 0}%`, 20, yPos + 20);
        
        // Add description
        pdf.text(
          result.prediction?.prediction === 'PNEUMONIA' 
            ? 'Potential pneumonia detected. Please consult with a healthcare professional.' 
            : 'No signs of pneumonia detected.',
          20, 
          yPos + 30
        );
        
        // Add disclaimer
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(
          'This AI analysis is for informational purposes only and should not replace professional medical diagnosis.',
          20,
          yPos + 45
        );
        pdf.text(
          'Always consult with a healthcare provider.',
          20,
          yPos + 52
        );
      } catch (err) {
        console.error('Error generating PDF:', err);
      }
    } else {
      // If no image, just add the results
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Scan Analysis Results', 20, 90);
      
      pdf.setFontSize(14);
      if (result.prediction?.prediction === 'PNEUMONIA') {
        pdf.setTextColor(198, 40, 40);
      } else {
        pdf.setTextColor(46, 125, 50);
      }
      pdf.text(`Diagnosis: ${result.prediction?.prediction || 'Unknown'}`, 20, 100);
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Confidence Score: ${result.prediction?.confidence || 0}%`, 20, 110);
    }
    
    // Save the PDF
    const filename = `smartcare-scan-report-${new Date().getTime()}.pdf`;
    pdf.save(filename);
  };

  const handleSelectHistoryScan = (scan) => {
    setSelectedHistoryScan(scan);
  };

  const closeHistoryDetail = () => {
    setSelectedHistoryScan(null);
  };

  // Generate PDF from history scan
  const generateHistoryPDF = async (scan) => {
    if (!scan) return;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Add Smart Care logo
    pdf.setTextColor(94, 33, 199); // Purple color
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Smart-Care', 20, 20);
    
    // Add horizontal line
    pdf.setDrawColor(94, 33, 199);
    pdf.setLineWidth(0.5);
    pdf.line(20, 25, 190, 25);
    
    // Add user information
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Patient: ${user?.name || user?.username || 'Unknown'}`, 20, 40);
    pdf.text(`Email: ${user?.email || 'Unknown'}`, 20, 48);
    pdf.text(`Phone: ${user?.phone || 'Not provided'}`, 20, 56);
    pdf.text(`Scan Date: ${new Date(scan.date).toLocaleDateString()}`, 20, 64);
    pdf.text(`Report Generated: ${new Date().toLocaleDateString()}`, 20, 72);    // Add scan information
    if (scan.imageUrl) {
      try {
        // Create a temporary container for the image
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '-9999px';
        document.body.appendChild(tempContainer);
        
        // Add the image to the DOM
        const imgElement = document.createElement('img');
        imgElement.crossOrigin = "Anonymous";
        imgElement.src = `http://localhost:5001/api/scans/image/${scan.imageUrl}`;
        imgElement.style.width = '500px'; // Set a fixed width for the canvas
        tempContainer.appendChild(imgElement);
        
        // Wait for the image to load
        await new Promise((resolve, reject) => {
          imgElement.onload = resolve;
          imgElement.onerror = () => {
            console.error('Failed to load image for PDF');
            reject(new Error('Failed to load image'));
          };
          
          // Set a timeout in case the image never loads
          setTimeout(() => reject(new Error('Image load timeout')), 5000);
        });
        
        // Use html2canvas to convert the image to a canvas
        const canvas = await html2canvas(imgElement, {
          useCORS: true,
          scale: 2
        });
        
        // Clean up the temporary elements
        document.body.removeChild(tempContainer);
        
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        
        // Calculate aspect ratio and adjust size to fit
        const imgWidth = 170;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'JPEG', 20, 80, imgWidth, imgHeight);
        
        // Add result information
        const yPos = 90 + imgHeight;
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Scan Analysis Results', 20, yPos);
        
        // Add diagnosis result
        pdf.setFontSize(14);
        if (scan.result === 'PNEUMONIA') {
          pdf.setTextColor(198, 40, 40); // Red color
        } else {
          pdf.setTextColor(46, 125, 50); // Green color
        }
        pdf.text(`Diagnosis: ${scan.result || 'Unknown'}`, 20, yPos + 10);
        
        // Add confidence score
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Confidence Score: ${scan.confidence || 0}%`, 20, yPos + 20);
        
        // Add description
        pdf.text(
          scan.result === 'PNEUMONIA' 
            ? 'Potential pneumonia detected. Please consult with a healthcare professional.' 
            : 'No signs of pneumonia detected.',
          20, 
          yPos + 30
        );
        
        // Add disclaimer
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(
          'This AI analysis is for informational purposes only and should not replace professional medical diagnosis.',
          20,
          yPos + 45
        );
        pdf.text(
          'Always consult with a healthcare provider.',
          20,
          yPos + 52
        );      } catch (err) {
        console.error('Error generating PDF from history:', err);
        // Show an error notification to the user
        alert(`Error generating PDF: ${err.message || 'Unknown error'}`);
        
        // Proceed without the image
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(198, 40, 40);
        pdf.text('Error: Could not load scan image', 20, 90);
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text('The scan result is still available below:', 20, 100);
        
        // Continue with the rest of the PDF
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');        pdf.text('Scan Analysis Results', 20, 120);
      }
    } else {
      // If no image, just add the results
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Scan Analysis Results', 20, 90);
      
      pdf.setFontSize(14);
      if (scan.result === 'PNEUMONIA') {
        pdf.setTextColor(198, 40, 40);
      } else {
        pdf.setTextColor(46, 125, 50);
      }
      pdf.text(`Diagnosis: ${scan.result || 'Unknown'}`, 20, 100);
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Confidence Score: ${scan.confidence || 0}%`, 20, 110);
    }
    
    // Save the PDF
    const filename = `smartcare-history-report-${new Date().getTime()}.pdf`;
    pdf.save(filename);
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
          
          {/* Display subscription component */}
          {!result && !isLoading && (user?.role !== 'doctor' && user?.role !== 'admin') && (
            <CompactSubscription />
          )}
          
          {/* Display error if any */}
          {error && <div className="error-message">{error}</div>}
            {/* Processing status (without spinner) */}
          {isLoading && (
            <div className="processing-status">
              <p>Processing your scan, please wait...</p>
            </div>
          )}
            {/* Display results if available */}
          {result && (
            <div className="result-container" ref={resultRef}>
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
                  
                  <button className="pdf-button" onClick={generatePDF}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Save as PDF Report
                  </button>
                </div>
              </div>
            </div>
          )}
            {/* File upload area */}
          <div className="upload-box">
            {filePreview ? (
              <div className="image-preview">
                <img src={filePreview} alt="X-ray preview" className="scan-preview-image" />
                {!isLoading && (
                  <button className="remove-btn" onClick={() => {
                    setFile(null);
                    setFilePreview(null);
                    setResult(null);
                  }}>
                    Remove
                  </button>
                )}
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
            
            {!isLoading && (
              <label className="upload-btn">
                {filePreview ? 'Change Image' : 'Upload Files'}
                <input type="file" hidden onChange={handleFileChange} accept="image/jpeg,image/png,image/jpg" />
              </label>
            )}
            
            {file && !result && !isLoading && (
              <button onClick={handleUpload} className="upload-btn submit-btn">
                Analyze Scan
              </button>
            )}
          </div>
          
          <p className="upload-note">
            Accepted formats: <strong>JPG, PNG, JPEG</strong> — Please upload a clear chest X-ray image.
          </p>          <div className="scans-remaining">
            <p>
              {user?.role === 'doctor' || user?.role === 'admin' ? (
                <><strong>Unlimited</strong> scans available</>
              ) : (user?.role === 'premium' || subscriptionStatus === 'premium') ? (
                <>Premium account: <strong>{user?.scansRemaining || scansRemaining} scans remaining</strong></>
              ) : (
                <>Scans remaining: <strong>{user?.scansRemaining || scansRemaining}</strong></>
              )}
            </p>
          </div>
        </>      ) : (
        // Enhanced History view
        <div className="history-container">
          <h2>Scan History</h2>
          {isLoading ? (
            <div className="processing-status">
              <p>Loading history...</p>
            </div>
          ) : scanHistory.length > 0 ? (
            <div className="history-list">
              {scanHistory.map((scan, index) => (
                <div 
                  key={index} 
                  className="history-item" 
                  onClick={() => handleSelectHistoryScan(scan)}
                >
                  <div className="history-date">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(scan.date).toLocaleDateString()} - {new Date(scan.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <div className="history-result-indicator">
                    <span className={scan.result === 'PNEUMONIA' ? 'pneumonia' : 'normal'}>
                      {scan.result}
                    </span>
                    <span className="confidence-small">
                      {scan.confidence}% confidence
                    </span>
                  </div>                  {scan.imageUrl && (
                    <img 
                      src={`http://localhost:5001/api/scans/image/${scan.imageUrl}`} 
                      alt="Scan" 
                      className="history-image"                      onError={(e) => {
                        console.error(`Failed to load image: ${scan.imageUrl}`);
                        e.target.src = '/default-scan.png';
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No scan history available.</p>
          )}

          {/* History detail modal */}
          {selectedHistoryScan && (
            <div className="history-detail-overlay">
              <div className="history-detail-content" ref={historyDetailRef}>
                <button className="history-detail-close" onClick={closeHistoryDetail}>×</button>
                <h3>Scan Details</h3>
                <p className="history-date">
                  <strong>Date:</strong> {new Date(selectedHistoryScan.date).toLocaleString()}
                </p>
                
                <div className="history-detail-result">
                  <div className={`result-indicator ${selectedHistoryScan.result === 'PNEUMONIA' ? 'pneumonia' : 'normal'}`}>
                    {selectedHistoryScan.result}
                  </div>
                  <div className="history-detail-confidence">
                    Confidence: {selectedHistoryScan.confidence}%
                  </div>
                </div>                  {selectedHistoryScan.imageUrl && (
                  <img 
                    src={`http://localhost:5001/api/scans/image/${selectedHistoryScan.imageUrl}`} 
                    alt="Scan" 
                    className="history-detail-image"
                    onError={(e) => {
                      console.error(`Failed to load detail image: ${selectedHistoryScan.imageUrl}`);
                      e.target.src = '/default-scan.png';
                    }}
                  />
                )}
                
                <p className="result-description">
                  {selectedHistoryScan.result === 'PNEUMONIA' 
                    ? 'Potential pneumonia detected. Please consult with a healthcare professional.' 
                    : 'No signs of pneumonia detected.'}
                </p>
                
                <div className="disclaimer">
                  <strong>Note:</strong> This AI analysis is for informational purposes only and should not 
                  replace professional medical diagnosis. Always consult with a healthcare provider.
                </div>
                
                <button 
                  className="pdf-button" 
                  onClick={() => generateHistoryPDF(selectedHistoryScan)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Save as PDF Report
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScanPage;