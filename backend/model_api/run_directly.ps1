# Direct start script for model API
Write-Host "===== STARTING MODEL API (DIRECT) =====" -ForegroundColor Cyan

# Install required dependencies
Write-Host "Installing required packages..." -ForegroundColor Yellow
pip install flask flask-cors numpy pillow tensorflow

# Start the Flask application
Write-Host "Starting Flask application..." -ForegroundColor Green
python app.py
