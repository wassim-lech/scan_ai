# Comprehensive database management script
# This script provides an easy way to update users, appointments, and other data

param(
    [Parameter(Position=0)]
    [string]$Command,
    
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$Arguments
)

function Show-Usage {
    Write-Host "Database Management Script - Usage:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "USER COMMANDS:" -ForegroundColor Yellow
    Write-Host "  ./manage-database.ps1 user-get <email|username>"
    Write-Host "  ./manage-database.ps1 user-update <email|username> -FirstName 'John' -LastName 'Doe' -Phone '+1234567890' -Address '123 Main St'"
    Write-Host ""
    Write-Host "APPOINTMENT COMMANDS:" -ForegroundColor Yellow
    Write-Host "  ./manage-database.ps1 appointment-list <email|username>"
    Write-Host "  ./manage-database.ps1 appointment-update <appointmentId> -Field <field> -Value <value>"
    Write-Host "  ./manage-database.ps1 appointment-create <email|username> -Doctor 'Dr. Smith' -Date '2025-06-15' -Time '14:30' [-Status 'confirmed']"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Green
    Write-Host "  ./manage-database.ps1 user-get user@example.com"
    Write-Host "  ./manage-database.ps1 user-update john.doe -FirstName 'John' -LastName 'Doe'"
    Write-Host "  ./manage-database.ps1 appointment-list user@example.com"
    Write-Host "  ./manage-database.ps1 appointment-update 60a1e2c3a4b5c6d7e8f9a0b1 -Field status -Value confirmed"
    Write-Host "  ./manage-database.ps1 appointment-create user@example.com -Doctor 'Dr. Smith' -Date '2025-06-15' -Time '14:30'"
}

# Check if a command is provided
if (-not $Command) {
    Show-Usage
    exit 1
}

# Process the command
switch ($Command) {
    "user-get" {
        if ($Arguments.Count -lt 1) {
            Write-Host "Error: Email or username is required" -ForegroundColor Red
            exit 1
        }
        node scripts/manage-database.js user:get $Arguments[0]
    }
    
    "user-update" {
        if ($Arguments.Count -lt 1) {
            Write-Host "Error: Email or username is required" -ForegroundColor Red
            exit 1
        }
        
        $identifier = $Arguments[0]
        $nodeArgs = @("scripts/manage-database.js", "user:update", $identifier)
        
        # Process remaining arguments
        for ($i = 1; $i -lt $Arguments.Count; $i += 2) {
            $param = $Arguments[$i]
            $value = $Arguments[$i + 1]
            
            # Remove the leading dash if present
            $param = $param -replace '^-', ''
            
            $nodeArgs += $param
            $nodeArgs += $value
        }
        
        & node $nodeArgs
    }
    
    "appointment-list" {
        if ($Arguments.Count -lt 1) {
            Write-Host "Error: Email or username is required" -ForegroundColor Red
            exit 1
        }
        node scripts/manage-database.js appointment:list $Arguments[0]
    }
    
    "appointment-update" {
        if ($Arguments.Count -lt 5) {
            Write-Host "Error: AppointmentId, -Field, and -Value parameters are required" -ForegroundColor Red
            exit 1
        }
        
        $appointmentId = $Arguments[0]
        $field = $null
        $value = $null
        
        for ($i = 1; $i -lt $Arguments.Count; $i += 2) {
            $param = $Arguments[$i]
            
            if ($param -eq "-Field" -or $param -eq "-field") {
                $field = $Arguments[$i + 1]
            }
            elseif ($param -eq "-Value" -or $param -eq "-value") {
                $value = $Arguments[$i + 1]
            }
        }
        
        if (-not $field -or -not $value) {
            Write-Host "Error: Both -Field and -Value must be specified" -ForegroundColor Red
            exit 1
        }
        
        node scripts/manage-database.js appointment:update $appointmentId $field $value
    }
    
    "appointment-create" {
        if ($Arguments.Count -lt 7) {
            Write-Host "Error: Email/username, -Doctor, -Date, and -Time parameters are required" -ForegroundColor Red
            exit 1
        }
        
        $userIdentifier = $Arguments[0]
        $doctor = $null
        $date = $null
        $time = $null
        $status = "pending"
        
        for ($i = 1; $i -lt $Arguments.Count; $i += 2) {
            $param = $Arguments[$i]
            
            if ($param -eq "-Doctor" -or $param -eq "-doctor") {
                $doctor = $Arguments[$i + 1]
            }
            elseif ($param -eq "-Date" -or $param -eq "-date") {
                $date = $Arguments[$i + 1]
            }
            elseif ($param -eq "-Time" -or $param -eq "-time") {
                $time = $Arguments[$i + 1]
            }
            elseif ($param -eq "-Status" -or $param -eq "-status") {
                $status = $Arguments[$i + 1]
            }
        }
        
        if (-not $doctor -or -not $date -or -not $time) {
            Write-Host "Error: -Doctor, -Date, and -Time must all be specified" -ForegroundColor Red
            exit 1
        }
        
        node scripts/manage-database.js appointment:create $userIdentifier $doctor $date $time $status
    }
    
    default {
        Write-Host "Error: Unknown command '$Command'" -ForegroundColor Red
        Show-Usage
        exit 1
    }
}
