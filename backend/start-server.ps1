# Start script for scan_ai backend server
Write-Host "----- Starting scan_ai Backend Server -----"
Write-Host "Using server.js as the main entry point"

# Ensure we're in the correct directory
Set-Location $PSScriptRoot

# Kill any existing Node processes if needed
# Uncomment the line below if you need to kill existing Node processes
# Get-Process | Where-Object { $_.ProcessName -eq "node" } | Stop-Process -Force

# Start the server
Write-Host "Starting Node.js server..."
node server.js
