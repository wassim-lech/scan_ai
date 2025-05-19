# Reset passwords for admin, doctor, and test user
param (
    [switch]$CustomPasswords = $false
)

# Change to the scripts directory
$currentDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $currentDir

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "    SCAN AI - PASSWORD RESET UTILITY v1.0" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host

if ($CustomPasswords) {
    Write-Host "You've chosen to set custom passwords" -ForegroundColor Yellow
    Write-Host

    # Create a temporary JS file with custom passwords
    $adminPassword = Read-Host "Enter new ADMIN password (or press Enter for 'Admin123!')"
    if ([string]::IsNullOrEmpty($adminPassword)) { $adminPassword = "Admin123!" }
    
    $doctorPassword = Read-Host "Enter new DOCTOR password (or press Enter for 'Doctor123!')"
    if ([string]::IsNullOrEmpty($doctorPassword)) { $doctorPassword = "Doctor123!" }
    
    $testPassword = Read-Host "Enter new TEST USER password (or press Enter for 'Test123!')"
    if ([string]::IsNullOrEmpty($testPassword)) { $testPassword = "Test123!" }

    $customJsContent = @"
// Auto-generated temporary file for custom passwords
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/scanAi', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

const User = require('../models/user');

const usersToReset = [  { email: 'admin@gmail.com', role: 'admin', newPassword: '$adminPassword', displayName: 'Admin' },
  { email: 'doctor@gmail.com', role: 'doctor', newPassword: '$doctorPassword', displayName: 'Doctor' },
  { email: 'test@example.com', role: 'free', newPassword: '$testPassword', displayName: 'Test User' }
];

async function resetUserPassword(email, role, newPassword, displayName) {
  try {
    const user = await User.findOne({ 
      email: email,
      ...(role ? { role: role } : {})
    });

    if (!user) {
      console.log(`❌ \${displayName} user with email \${email} not found`);
      return false;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    console.log(`✅ \${displayName} password reset successfully`);
    console.log(`   Email: \${email}`);
    console.log(`   New password: \${newPassword}`);
    console.log(`   Role: \${user.role}`);
    console.log('-----------------------------------');
    
    return true;
  } catch (err) {
    console.error(`❌ Error resetting \${displayName} password:`, err);
    return false;
  }
}

async function resetAllPasswords() {
  let successCount = 0;
  
  for (const user of usersToReset) {
    const success = await resetUserPassword(
      user.email, 
      user.role, 
      user.newPassword, 
      user.displayName
    );
    
    if (success) successCount++;
  }
  
  console.log('=============================================');
  console.log(`Reset \${successCount}/\${usersToReset.length} passwords successfully`);

  mongoose.connection.close();
}

resetAllPasswords();
"@

    # Save temporary file
    $tempFile = "./temp-password-reset.js"
    $customJsContent | Out-File -FilePath $tempFile -Encoding utf8
    
    Write-Host "`nResetting passwords with custom values..." -ForegroundColor Cyan
    node $tempFile
    
    # Clean up
    if (Test-Path $tempFile) {
        Remove-Item $tempFile -Force
    }
}
else {
    # Use predefined passwords    Write-Host "Resetting passwords to default values:" -ForegroundColor Green
    Write-Host "  Admin:     admin@gmail.com / Admin123!" -ForegroundColor Yellow
    Write-Host "  Doctor:    doctor@gmail.com / Doctor123!" -ForegroundColor Yellow
    Write-Host "  Test User: test@example.com / Test123!" -ForegroundColor Yellow
    Write-Host
    
    $confirmation = Read-Host "Continue with these passwords? (Y/N)"
    if ($confirmation -eq "Y" -or $confirmation -eq "y") {
        Write-Host "`nResetting passwords..." -ForegroundColor Cyan
        node reset-multiple-passwords.js
    }
    else {
        Write-Host "`nPassword reset cancelled." -ForegroundColor Red
        Write-Host "To use custom passwords, run: .\reset-all-passwords.ps1 -CustomPasswords" -ForegroundColor Yellow
    }
}

Write-Host "`nDone!" -ForegroundColor Green
