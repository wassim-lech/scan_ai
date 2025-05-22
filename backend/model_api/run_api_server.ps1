# PowerShell script to start the model API

# Ensure Python environment is properly set
Write-Host "Checking Python installation..." -ForegroundColor Cyan
$pythonVersion = python --version
Write-Host "$pythonVersion found" -ForegroundColor Green

# Ensure required packages are installed
Write-Host "Installing required packages..." -ForegroundColor Cyan
pip install -r requirements.txt

# Start the Flask server
Write-Host "Starting Flask server..." -ForegroundColor Green
python app.py