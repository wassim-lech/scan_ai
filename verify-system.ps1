# System verification script for ScanAI

# Configure the console window
$host.UI.RawUI.WindowTitle = "ScanAI System Verification"
Clear-Host

function Write-ColorText {
    param (
        [string]$Text,
        [string]$ForegroundColor = 'White',
        [int]$Indent = 0
    )
    Write-Host (" " * $Indent) -NoNewline
    Write-Host $Text -ForegroundColor $ForegroundColor
}

function Show-Banner {
    $banner = @"
    ┌─────────────────────────────────────────────────┐
    │                                                 │
    │               SCAN AI SYSTEM                    │
    │           VERIFICATION TOOL v1.0                │
    │                                                 │
    └─────────────────────────────────────────────────┘
"@
    Write-Host $banner -ForegroundColor Cyan
    Write-Host
}

function Test-PortInUse {
    param (
        [int]$Port
    )
    
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -ErrorAction SilentlyContinue -WarningAction SilentlyContinue
    return $connection.TcpTestSucceeded
}

function Test-ApiEndpoint {
    param (
        [string]$Url,
        [string]$ExpectedProperty,
        [string]$ExpectedValue
    )
    
    try {
        $response = Invoke-RestMethod -Uri $Url -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($ExpectedProperty -and $ExpectedValue) {
            if ($response.$ExpectedProperty -eq $ExpectedValue) {
                return @{Success=$true; Data=$response}
            }
        } else {
            return @{Success=$true; Data=$response}
        }
    }
    catch {
        return @{Success=$false; Error=$_.Exception.Message}
    }
    
    return @{Success=$false}
}

# Display the banner
Show-Banner

# Check if Python is installed
Write-ColorText "▶ Checking Python installation..." "Yellow"
try {
    $pythonVersion = python -V 2>&1
    if ($pythonVersion -like "Python*") {
        Write-ColorText "  ✓ Python installed: $pythonVersion" "Green" 2
    } else {
        Write-ColorText "  ✗ Python not detected" "Red" 2
    }
}
catch {
    Write-ColorText "  ✗ Python not detected" "Red" 2
}

# Check if Node.js is installed
Write-ColorText "`n▶ Checking Node.js installation..." "Yellow"
try {
    $nodeVersion = node -v
    Write-ColorText "  ✓ Node.js installed: $nodeVersion" "Green" 2
}
catch {
    Write-ColorText "  ✗ Node.js not detected" "Red" 2
}

# Check if MongoDB is running
Write-ColorText "`n▶ Checking MongoDB connection..." "Yellow"
$mongoPort = Test-PortInUse -Port 27017
if ($mongoPort) {
    Write-ColorText "  ✓ MongoDB appears to be running on port 27017" "Green" 2
} else {
    Write-ColorText "  ✗ MongoDB does not appear to be running on port 27017" "Red" 2
}

# Check if Model API is running
Write-ColorText "`n▶ Checking Model API status..." "Yellow"
$modelApiPort = Test-PortInUse -Port 5005
if ($modelApiPort) {
    Write-ColorText "  ✓ Model API server is running on port 5005" "Green" 2
    
    # Try to access the health endpoint
    $modelApiHealth = Test-ApiEndpoint -Url "http://localhost:5005/api/health" -ExpectedProperty "status" -ExpectedValue "online"
    if ($modelApiHealth.Success) {
        $modelStatus = $modelApiHealth.Data.model
        Write-ColorText "  ✓ Model API health check successful" "Green" 2
        Write-ColorText "  • Status: $($modelApiHealth.Data.status)" "Cyan" 4
        
        if ($modelStatus -eq "loaded") {
            Write-ColorText "  • Model loaded: Yes" "Green" 4
        } else {
            Write-ColorText "  • Model loaded: No (missing or not loaded)" "Red" 4
            Write-ColorText "    → Check if peumoniaModel.keras exists in the root directory" "Yellow" 6
        }
    }
    } else {
        Write-ColorText "  ✗ Could not connect to Model API health endpoint" "Red" 2
    }
} else {
    Write-ColorText "  ✗ Model API server is not running on port 5005" "Red" 2
    Write-ColorText "    → Start it with: cd backend\model_api; .\start_api_direct.ps1" "Yellow" 4
}

# Check if Backend Server is running
Write-ColorText "`n▶ Checking Backend Server status..." "Yellow"
$backendPort = Test-PortInUse -Port 5001
if ($backendPort) {
    Write-ColorText "  ✓ Backend server is running on port 5001" "Green" 2
    
    # Try to access the test endpoint
    $backendHealth = Test-ApiEndpoint -Url "http://localhost:5001/api/test"
    if ($backendHealth.Success) {
        Write-ColorText "  ✓ Backend API test endpoint accessible" "Green" 2
    } else {
        Write-ColorText "  ✗ Could not connect to Backend API test endpoint" "Red" 2
    }
} else {
    Write-ColorText "  ✗ Backend server is not running on port 5001" "Red" 2
    Write-ColorText "    → Start it with: cd backend; .\start-server.ps1" "Yellow" 4
}

# Check if Frontend Server is running
Write-ColorText "`n▶ Checking Frontend Server status..." "Yellow"
$frontendPort = Test-PortInUse -Port 5173
if ($frontendPort) {
    Write-ColorText "  ✓ Frontend server is running on port 5173" "Green" 2
    Write-ColorText "  • Access the application at: http://localhost:5173" "Cyan" 4
} else {
    Write-ColorText "  ✗ Frontend server is not running on port 5173" "Red" 2
    Write-ColorText "    → Start it with: cd frontend; npm run dev" "Yellow" 4
}

# System readiness check
Write-Host "`n" -NoNewline
Write-ColorText "▶ Overall System Readiness:" "Yellow"
$components = @{
    "MongoDB" = $mongoPort
    "Model API" = $modelApiPort
    "Backend" = $backendPort
    "Frontend" = $frontendPort
}

$allReady = $true
foreach ($component in $components.GetEnumerator()) {
    if (-not $component.Value) {
        $allReady = $false
    }
}

if ($allReady) {
    Write-ColorText "  ✓ All system components are running!" "Green" 2
    Write-ColorText "    → You can access the application at: http://localhost:5173" "Cyan" 4
} else {
    Write-ColorText "  ✗ Some system components are not running" "Red" 2
    Write-ColorText "    → Start all components with: .\start-services.ps1" "Yellow" 4
}

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
