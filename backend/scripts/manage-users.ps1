# Admin User Creation Script for scan_ai
# This script helps you create users with different roles (free, premium, doctor, admin)

Write-Host "=========================================="
Write-Host "      SCAN AI - USER MANAGEMENT TOOL     "
Write-Host "=========================================="

# Function to create a new user
function Create-User {
    param (
        [string]$username,
        [string]$email,
        [string]$password,
        [string]$role = "free",
        [int]$scansRemaining = 1
    )
    
    $body = @{
        username = $username
        email = $email
        password = $password
        role = $role
        scansRemaining = $scansRemaining
    } | ConvertTo-Json
    
    Write-Host "Creating $role user: $username ($email)..."
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/admin/create-user" -Method Post -Body $body -ContentType "application/json" -Headers @{"x-auth-token" = $token}
        Write-Host "User created successfully!" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "Error creating user: $_" -ForegroundColor Red
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        $errorDetails = $_.ErrorDetails.Message
        if ($errorDetails) {
            Write-Host "Error details: $errorDetails" -ForegroundColor Red
        }
    }
}

# Function to login as admin
function Admin-Login {
    param (
        [string]$email,
        [string]$password
    )
    
    $body = @{
        email = $email
        password = $password
    } | ConvertTo-Json
    
    Write-Host "Logging in as admin..."
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" -Method Post -Body $body -ContentType "application/json"
        Write-Host "Login successful!" -ForegroundColor Green
        return $response.token
    }
    catch {
        Write-Host "Login failed: $_" -ForegroundColor Red
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        $errorDetails = $_.ErrorDetails.Message
        if ($errorDetails) {
            Write-Host "Error details: $errorDetails" -ForegroundColor Red
        }
        return $null
    }
}

# Function to list all users
function List-Users {
    Write-Host "Retrieving all users..."
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/admin/users" -Method Get -Headers @{"x-auth-token" = $token}
        Write-Host "Users retrieved successfully!" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "USER LIST:" -ForegroundColor Cyan
        Write-Host "=========================================="
        
        foreach ($user in $response) {
            Write-Host "Username: $($user.username)" -ForegroundColor Yellow
            Write-Host "Email: $($user.email)"
            Write-Host "Role: $($user.role)"
            Write-Host "Scans Remaining: $($user.scansRemaining)"
            Write-Host "Created: $($user.createdAt)"
            Write-Host "----------------------------------------"
        }
        
        return $response
    }
    catch {
        Write-Host "Error retrieving users: $_" -ForegroundColor Red
        return $null
    }
}

# Main menu function
function Show-Menu {
    Write-Host ""
    Write-Host "MENU:" -ForegroundColor Cyan
    Write-Host "1. Create Free User"
    Write-Host "2. Create Premium User"
    Write-Host "3. Create Doctor User"
    Write-Host "4. Create Admin User"
    Write-Host "5. List All Users"
    Write-Host "6. Exit"
    Write-Host ""
    
    $selection = Read-Host "Enter your choice (1-6)"
    
    switch ($selection) {
        "1" {
            $username = Read-Host "Enter username"
            $email = Read-Host "Enter email"
            $password = Read-Host "Enter password"
            Create-User -username $username -email $email -password $password -role "free" -scansRemaining 1
            Show-Menu
        }
        "2" {
            $username = Read-Host "Enter username"
            $email = Read-Host "Enter email"
            $password = Read-Host "Enter password"
            Create-User -username $username -email $email -password $password -role "premium" -scansRemaining 5
            Show-Menu
        }
        "3" {
            $username = Read-Host "Enter username"
            $email = Read-Host "Enter email"
            $password = Read-Host "Enter password"
            Create-User -username $username -email $email -password $password -role "doctor" -scansRemaining 999
            Show-Menu
        }
        "4" {
            $username = Read-Host "Enter username"
            $email = Read-Host "Enter email"
            $password = Read-Host "Enter password"
            Create-User -username $username -email $email -password $password -role "admin" -scansRemaining 999
            Show-Menu
        }
        "5" {
            List-Users
            Show-Menu
        }
        "6" {
            Write-Host "Goodbye!" -ForegroundColor Cyan
            exit
        }
        default {
            Write-Host "Invalid selection. Please try again." -ForegroundColor Yellow
            Show-Menu
        }
    }
}

# Start the script
$adminEmail = Read-Host "Enter admin email"
$adminPassword = Read-Host "Enter admin password"

# Try to login
$token = Admin-Login -email $adminEmail -password $adminPassword

if ($token) {
    Show-Menu
}
else {
    Write-Host "Could not authenticate as admin. Cannot continue." -ForegroundColor Red
    Write-Host "Would you like to register a new admin account? (y/n)"
    $createAdmin = Read-Host
    
    if ($createAdmin -eq "y") {
        Write-Host "This will create a first admin account directly in the database."
        Write-Host "You'll need to run a separate script for this. Check admin-create-first.js"
    }
}
