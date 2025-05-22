# Create doctors by specialty script
Write-Host "Creating doctors by specialty..." -ForegroundColor Green

# Navigate to the backend directory
Set-Location "$PSScriptRoot/backend"

# Make sure we have dotenv installed for the script
Write-Host "Checking for required packages..." -ForegroundColor Yellow
npm install dotenv --save

# Run the doctor creation script
Write-Host "Running script to create doctor users..." -ForegroundColor Yellow
node scripts/create-doctors.js

Write-Host "Doctor users creation completed!" -ForegroundColor Green
Write-Host "You can now log in as any of these doctors using their emails (doctor1@gmail.com through doctor6@gmail.com) with password 'doctor'" -ForegroundColor Cyan
