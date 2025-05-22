# Script to add doctor users by specialty
Write-Host "Creating doctor users by specialty..." -ForegroundColor Cyan

# Navigate to the backend directory
$scriptPath = $PSScriptRoot
Set-Location "$scriptPath\.."

# Run the Node.js script
Write-Host "Running doctor creation script..." -ForegroundColor Yellow
node scripts/create-doctors.js

Write-Host "Doctor users creation process completed." -ForegroundColor Green
