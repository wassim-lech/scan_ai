# Setup and Start script for scan_ai
Write-Host "=========================================="
Write-Host "      SCAN AI - SETUP AND START TOOL     "
Write-Host "=========================================="
Write-Host ""

# Function to check if MongoDB is running
function Test-MongoDB {
    Write-Host "Testing MongoDB connection..." -ForegroundColor Cyan
    
    try {
        cd "$PSScriptRoot\backend"
        node ./utils/checkMongo.js
        if ($LASTEXITCODE -eq 0) {
            return $true
        } else {
            return $false
        }
    } catch {
        Write-Host "Error checking MongoDB: $_" -ForegroundColor Red
        return $false
    }
}

# Function to create first admin user
function Create-AdminUser {
    Write-Host "Creating first admin user..." -ForegroundColor Cyan
    
    $username = Read-Host "Enter admin username"
    $email = Read-Host "Enter admin email"
    $password = Read-Host "Enter admin password"
    
    try {
        cd "$PSScriptRoot\backend"
        node ./scripts/create-admin.js $username $email $password
        return $true
    } catch {
        Write-Host "Error creating admin user: $_" -ForegroundColor Red
        return $false
    }
}

# Function to start backend
function Start-Backend {
    Write-Host "Starting backend server..." -ForegroundColor Cyan
    
    Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm start"
}

# Function to start frontend
function Start-Frontend {
    Write-Host "Starting frontend development server..." -ForegroundColor Cyan
    
    Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"
}

# Main menu
function Show-Menu {
    Write-Host ""
    Write-Host "MENU:" -ForegroundColor Yellow
    Write-Host "1. Test MongoDB Connection"
    Write-Host "2. Create First Admin User"
    Write-Host "3. Start Backend Server"
    Write-Host "4. Start Frontend Development Server"
    Write-Host "5. Start Both Backend and Frontend"
    Write-Host "6. Exit"
    Write-Host ""
    
    $selection = Read-Host "Enter your choice (1-6)"
    
    switch ($selection) {
        "1" {
            Test-MongoDB
            Show-Menu
        }
        "2" {
            Create-AdminUser
            Show-Menu
        }
        "3" {
            Start-Backend
            Show-Menu
        }
        "4" {
            Start-Frontend
            Show-Menu
        }
        "5" {
            Start-Backend
            Start-Frontend
            Show-Menu
        }
        "6" {
            Write-Host "Goodbye!" -ForegroundColor Green
            exit
        }
        default {
            Write-Host "Invalid selection. Please try again." -ForegroundColor Yellow
            Show-Menu
        }
    }
}

# Start the script
Show-Menu
