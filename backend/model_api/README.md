# Pneumonia Detection AI Model API

This document provides instructions for setting up and running the pneumonia detection AI model API.

## Prerequisites

- Python 3.11 or compatible version
- PowerShell (for Windows)
- pip package manager

## Dependencies

The AI model requires the following Python packages with specific versions for compatibility:

- Flask==2.0.1
- Werkzeug==2.0.1 (Flask dependency)
- numpy==1.23.5
- pandas==1.5.3
- tensorflow==2.12.0
- pillow==9.5.0
- flask-cors==3.0.10
- h5py==3.13.0

## Setup Instructions

### Option 1: Automated Setup (Recommended)

1. Open PowerShell and navigate to the model API directory:
   ```
   cd path\to\scan_ai\backend\model_api
   ```

2. Run the installation script:
   ```
   .\install_dependencies.ps1
   ```

3. Start the API:
   ```
   .\start-model-api.ps1
   ```

### Option 2: Manual Setup

1. Create a virtual environment (recommended):
   ```
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Start the API server:
   ```
   python app.py
   ```

## Verifying the Setup

1. Run the compatibility checker:
   ```
   python check_compatibility.py
   ```

2. Test loading the model:
   ```
   python test_model_loading.py
   ```

3. Check API health (with API running):
   ```
   .\test_api_health.ps1
   ```

## API Endpoints

- **Health Check**: `GET /api/health`
  - Returns the current status of the API and model
  
- **Prediction**: `POST /api/predict`
  - Upload an X-ray image for pneumonia detection
  - Requires a file upload with field name 'file'
  - Returns prediction results

- **Cleanup**: `POST /api/cleanup`
  - Triggers cleanup of old files (older than 24 hours)

## Troubleshooting

If you encounter issues:

1. Ensure the Python version is compatible (3.11 recommended)
2. Verify that TensorFlow is properly installed
3. Check that the AI model file `peumoniaModel.keras` is present in the correct location
4. Review any error messages in the terminal
5. Check that all dependencies are installed with the correct versions

## Port Information

By default, the API runs on port 5005. If you need to change this, modify the line in `app.py`:
```python
app.run(host='0.0.0.0', port=5005, debug=True)
```
