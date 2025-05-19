# Simple script to fix dependencies for model API

Write-Host "===== MODEL API QUICK FIXER =====" -ForegroundColor Cyan

# First, create virtual environment if not exists
if (-not (Test-Path -Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Cyan
try {
    .\venv\Scripts\Activate.ps1
} catch {
    Write-Host "Error activating virtual environment. Please run manually: .\venv\Scripts\Activate.ps1" -ForegroundColor Red
    exit 1
}

# Install key dependencies
Write-Host "Installing required packages..." -ForegroundColor Yellow
$packages = @(
    "werkzeug==2.0.1",
    "flask==2.0.1",
    "flask-cors==3.0.10",
    "numpy==1.23.5",
    "tensorflow==2.12.0"
)

foreach ($package in $packages) {
    Write-Host "Installing $package..." -ForegroundColor Cyan
    pip install $package
}

# Verify model file exists
$modelPath = "../../peumoniaModel.keras"
$absolutePath = (Get-Item -Path "../../peumoniaModel.keras" -ErrorAction SilentlyContinue).FullName
if (Test-Path -Path $absolutePath) {
    Write-Host "Model file exists at: $absolutePath" -ForegroundColor Green
} else {
    Write-Host "Model file NOT found! Make sure peumoniaModel.keras exists in the scan_ai root folder" -ForegroundColor Red
}

Write-Host "`nSetup complete! Now run: .\start-model-api.ps1" -ForegroundColor Green
