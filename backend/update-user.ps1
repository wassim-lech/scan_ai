# Update user data in the database
# Usage: ./update-user.ps1 <email_or_username> [first_name] [last_name] [phone] [address]

param(
    [Parameter(Mandatory=$true)]
    [string]$EmailOrUsername,
    
    [Parameter(Mandatory=$false)]
    [string]$FirstName,
    
    [Parameter(Mandatory=$false)]
    [string]$LastName,
    
    [Parameter(Mandatory=$false)]
    [string]$Phone,
    
    [Parameter(Mandatory=$false)]
    [string]$Address
)

Write-Host "Updating user: $EmailOrUsername" -ForegroundColor Cyan

$arguments = @($EmailOrUsername)

if ($FirstName) { $arguments += $FirstName } else { $arguments += "undefined" }
if ($LastName) { $arguments += $LastName } else { $arguments += "undefined" }
if ($Phone) { $arguments += $Phone } else { $arguments += "undefined" }
if ($Address) { $arguments += $Address } else { $arguments += "undefined" }

Write-Host "Running with arguments: $arguments"

# Run the Node.js script with the provided arguments
node scripts/update-user.js $arguments
