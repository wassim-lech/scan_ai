import React, { useState } from 'react';

import '../styles/ScanPage.css'; // Import your CSS file for styling
const ScanPage = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Here you can add logic to process the file (e.g., send to an API)
      console.log('File selected:', selectedFile.name);
    }
  };

  return (
    <>
      <div className="upload-container">
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
          {file && <p className="upload-note selected-file">Selected file: {file.name}</p>}
        </div>
        <p className="upload-note">
          Accepted formats: <strong>JPG, PNG, JPEG</strong> — Please upload a clear chest X-ray image.
        </p>
      </div>
    </>
  );
};

export default ScanPage;