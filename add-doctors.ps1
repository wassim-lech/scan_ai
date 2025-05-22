# Add doctors script
Write-Host "Adding doctor users to the database..." -ForegroundColor Cyan
node "$(Get-Location)\backend\scripts\add-doctors.js"
