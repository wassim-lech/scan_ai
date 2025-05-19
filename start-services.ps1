# Script to start all services for ScanAI application

Write-Host "===== STARTING ALL SCAN_AI SERVICES =====" -ForegroundColor Cyan

# Function to check if a port is in use
function Test-PortInUse {
    param (
        [int]$Port
    )
    
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -ErrorAction SilentlyContinue -WarningAction SilentlyContinue
    return $connection.TcpTestSucceeded
}

# Check and kill processes if needed
if (Test-PortInUse -Port 5005) {
    Write-Host "Port 5005 is in use. Attempting to free it..." -ForegroundColor Yellow
    $modelApiProcesses = Get-Process -Name python -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*app.py*" }
    if ($modelApiProcesses) {
        Write-Host "Stopping existing model API processes..." -ForegroundColor Yellow
        $modelApiProcesses | Stop-Process -Force
        Start-Sleep -Seconds 2
    }
}

# 1. Start Model API Server
Write-Host "`n[1/3] Starting Model API Server..." -ForegroundColor Green
$modelApiDir = Join-Path -Path $PSScriptRoot -ChildPath "backend\model_api"
Start-Process powershell -ArgumentList "-NoExit -Command cd '$modelApiDir'; .\start_api_direct.ps1" -WindowStyle Normal

Write-Host "Waiting for Model API to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# 2. Start Backend Server
Write-Host "`n[2/3] Starting Backend Server..." -ForegroundColor Green
$backendDir = Join-Path -Path $PSScriptRoot -ChildPath "backend"
Start-Process powershell -ArgumentList "-NoExit -Command cd '$backendDir'; .\start-server.ps1" -WindowStyle Normal

Write-Host "Waiting for Backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# 3. Start Frontend Server
Write-Host "`n[3/3] Starting Frontend Server..." -ForegroundColor Green
$frontendDir = Join-Path -Path $PSScriptRoot -ChildPath "frontend"
Start-Process powershell -ArgumentList "-NoExit -Command cd '$frontendDir'; npm run dev" -WindowStyle Normal

# Final instructions
Write-Host "`n===== ALL SERVICES STARTED =====" -ForegroundColor Cyan
Write-Host "You can now access the application at: http://localhost:5173" -ForegroundColor Green
Write-Host "API Endpoints:" -ForegroundColor Cyan
Write-Host "- Model API: http://localhost:5005/api/health" -ForegroundColor White
Write-Host "- Backend Server: http://localhost:5001/api/health" -ForegroundColor White
