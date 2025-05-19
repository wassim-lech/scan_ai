# Script to clean up unnecessary files from the scan_ai repository

Write-Host "===== SCAN_AI REPOSITORY CLEANUP =====" -ForegroundColor Cyan

# Function to safely remove a file if it exists
function Remove-FileIfExists {
    param (
        [string]$FilePath,
        [switch]$Quiet
    )
    
    if (Test-Path -Path $FilePath) {
        Remove-Item -Path $FilePath -Force
        if (-not $Quiet) {
            Write-Host "  ✓ Removed: $FilePath" -ForegroundColor Green
        }
        return $true
    }
    return $false
}

# Function to add .gitkeep files to empty directories
function Add-GitKeep {
    param (
        [string]$Directory
    )
    
    if (Test-Path -Path $Directory -PathType Container) {
        $gitKeepPath = Join-Path -Path $Directory -ChildPath ".gitkeep"
        if (-not (Test-Path -Path $gitKeepPath)) {
            "# This file exists to keep this empty directory in git" | Out-File -FilePath $gitKeepPath
            Write-Host "  ✓ Added .gitkeep to: $Directory" -ForegroundColor Green
        }
    } else {
        Write-Host "  ! Directory does not exist: $Directory" -ForegroundColor Yellow
        New-Item -Path $Directory -ItemType Directory -Force | Out-Null
        $gitKeepPath = Join-Path -Path $Directory -ChildPath ".gitkeep"
        "# This file exists to keep this empty directory in git" | Out-File -FilePath $gitKeepPath
        Write-Host "  ✓ Created directory and added .gitkeep to: $Directory" -ForegroundColor Green
    }
}

# Set the starting directory
$rootDir = $PSScriptRoot

# List of files to remove from the root directory
$rootFilesToRemove = @(
    "ADMIN_LOGIN_FIX_SUMMARY.md",
    "ADMIN_LOGIN_GUIDE.md",
    "AUTH_FIXES.md",
    "AUTH_FIXES_FINAL.md",
    "CLOUD_DEPLOYMENT.md",
    "DEPENDENCY_FIXES.md",
    "IMPLEMENTATION_SUMMARY.md",
    "PNEUMONIA_MODEL_DEPLOYMENT.md",
    "SETUP.md",
    "SETUP_GUIDE.md",
    "start-all-services.ps1",
    "start-all-services.sh",
    "start-app.ps1",
    "SYSTEM_UPDATE_NOTIFICATION.eml",
    "TESTING_GUIDE.md",
    "USER_ROLES_DEPLOYMENT.md",
    "install-dependencies.ps1"
)

# Update README.md with the content from README-UPDATED.md
if (Test-Path -Path "$rootDir\README-UPDATED.md") {
    Write-Host "Updating README.md with content from README-UPDATED.md..." -ForegroundColor Yellow
    if (Test-Path -Path "$rootDir\README.md") {
        # Create a backup of the original README
        Copy-Item -Path "$rootDir\README.md" -Destination "$rootDir\README.md.backup"
        Write-Host "  ✓ Created backup of original README.md" -ForegroundColor Green
    }
    
    Copy-Item -Path "$rootDir\README-UPDATED.md" -Destination "$rootDir\README.md" -Force
    Write-Host "  ✓ Updated README.md with new content" -ForegroundColor Green
    
    # Add README-UPDATED.md to the removal list after copying its content
    $rootFilesToRemove += "README-UPDATED.md"
}

# List of files to remove from the model_api directory
$modelApiFilesToRemove = @(
    "check_compatibility.py",
    "enhanced_api_test.ps1",
    "fix_environment.ps1",
    "install_dependencies.ps1",
    "run_api_server.ps1",
    "start-model-api.ps1",
    "test_api_health.ps1",
    "test_model_loading.py",
    "API_SETUP_GUIDE.md",
    "DEPENDENCY_RESOLUTION.md"
)

# List of files to remove from the scripts directory
$scriptsFilesToRemove = @(
    "create-admin.js",
    "fix-admin-login.ps1",
    "manage-users.ps1",
    "README.md",
    "reset-admin-password.js",
    "reset-admin-password.ps1",
    "reset-multiple-passwords.js"
)

# Remove files from the root directory
Write-Host "`nCleaning up root directory..." -ForegroundColor Yellow
$removedRootCount = 0
foreach ($file in $rootFilesToRemove) {
    $removed = Remove-FileIfExists -FilePath "$rootDir\$file"
    if ($removed) { $removedRootCount++ }
}
Write-Host "Removed $removedRootCount files from root directory" -ForegroundColor Cyan

# Remove files from the model_api directory
Write-Host "`nCleaning up model_api directory..." -ForegroundColor Yellow
$removedModelApiCount = 0
foreach ($file in $modelApiFilesToRemove) {
    $removed = Remove-FileIfExists -FilePath "$rootDir\backend\model_api\$file"
    if ($removed) { $removedModelApiCount++ }
}
Write-Host "Removed $removedModelApiCount files from model_api directory" -ForegroundColor Cyan

# Remove files from the scripts directory
Write-Host "`nCleaning up scripts directory..." -ForegroundColor Yellow
$removedScriptsCount = 0
foreach ($file in $scriptsFilesToRemove) {
    $removed = Remove-FileIfExists -FilePath "$rootDir\backend\scripts\$file"
    if ($removed) { $removedScriptsCount++ }
}
Write-Host "Removed $removedScriptsCount files from scripts directory" -ForegroundColor Cyan

# Ensure directories have .gitkeep files
Write-Host "`nEnsuring directory structure is preserved in git..." -ForegroundColor Yellow
Add-GitKeep -Directory "$rootDir\backend\model_api\uploads"
Add-GitKeep -Directory "$rootDir\backend\model_api\results"
Add-GitKeep -Directory "$rootDir\backend\uploads"

# Final stats and instructions
$totalRemoved = $removedRootCount + $removedModelApiCount + $removedScriptsCount
Write-Host "`n===== CLEANUP COMPLETE =====" -ForegroundColor Green
Write-Host "Total files removed: $totalRemoved" -ForegroundColor Cyan
Write-Host "`nTo commit these changes with git:"
Write-Host "git add ."
Write-Host "git status # Review changes"
Write-Host "git commit -m 'Cleanup: Remove redundant files and update .gitignore'"
Write-Host "git push" -ForegroundColor Yellow

Write-Host "`nTo revert README.md to original if needed:"
Write-Host "Copy-Item -Path '$rootDir\README.md.backup' -Destination '$rootDir\README.md' -Force" -ForegroundColor Yellow
