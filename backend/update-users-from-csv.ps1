# Import users from CSV and update them
# Usage: .\update-users-from-csv.ps1 -CsvFile "users.csv"

param(
    [Parameter(Mandatory=$true)]
    [string]$CsvFile
)

# Check if the CSV file exists
if (-not (Test-Path $CsvFile)) {
    Write-Host "Error: CSV file not found: $CsvFile" -ForegroundColor Red
    exit 1
}

# Import the CSV file
try {
    $users = Import-Csv -Path $CsvFile
    Write-Host "Successfully imported $($users.Count) users from $CsvFile" -ForegroundColor Green
} catch {
    Write-Host "Error importing CSV file: $_" -ForegroundColor Red
    exit 1
}

# Expected columns: Email/Username, FirstName, LastName, Phone, Address
$requiredColumn = "Email" # Or Username
if (-not ($users[0].PSObject.Properties.Name -contains $requiredColumn)) {
    $requiredColumn = "Username"
    if (-not ($users[0].PSObject.Properties.Name -contains $requiredColumn)) {
        Write-Host "Error: CSV must contain either 'Email' or 'Username' column" -ForegroundColor Red
        exit 1
    }
}

# Process each user
$count = 0
foreach ($user in $users) {
    $identifier = $user.$requiredColumn
    if (-not $identifier) {
        Write-Host "Skipping row with empty $requiredColumn" -ForegroundColor Yellow
        continue
    }
    
    Write-Host "Processing user: $identifier" -ForegroundColor Cyan
    
    $params = @($identifier)
    $params += if ($user.PSObject.Properties.Name -contains "FirstName" -and $user.FirstName) { $user.FirstName } else { "undefined" }
    $params += if ($user.PSObject.Properties.Name -contains "LastName" -and $user.LastName) { $user.LastName } else { "undefined" }
    $params += if ($user.PSObject.Properties.Name -contains "Phone" -and $user.Phone) { $user.Phone } else { "undefined" }
    $params += if ($user.PSObject.Properties.Name -contains "Address" -and $user.Address) { $user.Address } else { "undefined" }
    
    Write-Host "Parameters: $params" -ForegroundColor Gray
    node scripts/update-user.js $params
    
    Write-Host "Completed update for: $identifier" -ForegroundColor Green
    Write-Host "--------------------------------------"
    $count++
}

Write-Host "All updates completed! Processed $count users." -ForegroundColor Green
