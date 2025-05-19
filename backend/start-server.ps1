# Start script for scan_ai backend server
Write-Host "----- Starting scan_ai Backend Server -----" -ForegroundColor Green
Write-Host "Using server.js as the main entry point"

# Ensure we're in the correct directory
Set-Location $PSScriptRoot

# Check if the model API is running
Write-Host "Checking if model API is running..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5005/api/health" -Method GET -ErrorAction Stop
    if ($response.model -eq "loaded") {
        Write-Host "Model API is running and model is loaded." -ForegroundColor Green
    } else {
        Write-Host "WARNING: Model API is running but model is NOT loaded!" -ForegroundColor Red
        Write-Host "The AI prediction functionality will not work correctly." -ForegroundColor Red
        Write-Host "Please make sure the 'peumoniaModel.keras' file is in the correct location." -ForegroundColor Yellow
    }
} catch {
    Write-Host "WARNING: Could not connect to model API!" -ForegroundColor Red
    Write-Host "The AI prediction functionality will not work." -ForegroundColor Red
    Write-Host "Please start the Model API first using:" -ForegroundColor Yellow
    Write-Host "  cd ../model_api; ./start-model-api.ps1" -ForegroundColor Cyan
    
    $choice = Read-Host "Do you still want to continue starting the backend? (y/n)"
    if ($choice -ne "y") {
        Write-Host "Server startup cancelled." -ForegroundColor Red
        exit
    }
}

# Start the server
Write-Host "Starting Node.js server..." -ForegroundColor Green
node server.js
