# Batch update multiple users
# This script demonstrates how to update multiple users in a batch process

# List of users to update
$users = @(
    @{
        Email = "user1@example.com"
        FirstName = "John"
        LastName = "Smith"
        Phone = "+12345678901"
        Address = "123 Main St, New York, NY 10001"
    },
    @{
        Email = "user2@example.com"
        FirstName = "Jane"
        LastName = "Doe"
        Phone = "+12345678902"
        Address = "456 Park Ave, New York, NY 10002"
    },
    @{
        Email = "user3@example.com"
        Address = "789 Broadway, New York, NY 10003"
    }
)

# Process each user
foreach ($user in $users) {
    Write-Host "Processing user: $($user.Email)" -ForegroundColor Cyan
    
    $params = @($user.Email)
    $params += if ($user.ContainsKey("FirstName")) { $user.FirstName } else { "undefined" }
    $params += if ($user.ContainsKey("LastName")) { $user.LastName } else { "undefined" }
    $params += if ($user.ContainsKey("Phone")) { $user.Phone } else { "undefined" }
    $params += if ($user.ContainsKey("Address")) { $user.Address } else { "undefined" }
    
    Write-Host "Parameters: $params" -ForegroundColor Gray
    node scripts/update-user.js $params
    
    Write-Host "Completed update for: $($user.Email)" -ForegroundColor Green
    Write-Host "--------------------------------------"
}

Write-Host "All updates completed successfully!" -ForegroundColor Green
