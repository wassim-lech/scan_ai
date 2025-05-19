# SCAN_AI CLEANUP PLAN

This document outlines the files that can be safely removed from the repository to reduce clutter and avoid tracking unnecessary files in git.

## Root Directory

Files to keep:
- `.gitignore` - Updated comprehensive gitignore file
- `README.md` - Main documentation (renamed from README-UPDATED.md)
- `peumoniaModel.keras` - Core AI model file
- `start-services.ps1` - Main script to start all services
- `WORKFLOW_GUIDE.md` - Main workflow documentation
- `ACCESS_INSTRUCTIONS.md` - User access instructions
- `verify-system.ps1` - System verification tool

Files to remove:
- `ADMIN_LOGIN_FIX_SUMMARY.md` - Now consolidated in main README
- `ADMIN_LOGIN_GUIDE.md` - Now consolidated in main README
- `AUTH_FIXES.md` - Outdated, solutions implemented
- `AUTH_FIXES_FINAL.md` - Outdated, solutions implemented
- `CLOUD_DEPLOYMENT.md` - Move to docs directory if needed
- `DEPENDENCY_FIXES.md` - Now consolidated in main documentation
- `IMPLEMENTATION_SUMMARY.md` - Now consolidated in main README
- `PNEUMONIA_MODEL_DEPLOYMENT.md` - Now consolidated in main docs
- `README-UPDATED.md` - Rename to replace the original README.md
- `SETUP.md` - Replace with comprehensive WORKFLOW_GUIDE.md
- `SETUP_GUIDE.md` - Replace with comprehensive WORKFLOW_GUIDE.md
- `start-all-services.ps1` - Replaced by improved start-services.ps1
- `start-all-services.sh` - Windows version preferred for this project
- `start-app.ps1` - Replaced by improved start-services.ps1
- `SYSTEM_UPDATE_NOTIFICATION.eml` - One-time notification, not needed
- `TESTING_GUIDE.md` - Consolidated in WORKFLOW_GUIDE.md
- `USER_ROLES_DEPLOYMENT.md` - Now consolidated in main docs
- `install-dependencies.ps1` - Replaced by component-specific scripts

## Model API Directory

Files to keep:
- `app.py` - Main application code
- `requirements.txt` - Python dependencies
- `quick_fix.ps1` - Quick dependency fixer
- `start_api_direct.ps1` - Simplified API starter
- `uploads/` and `results/` directories - For file storage, with .gitkeep

Files to remove:
- `check_compatibility.py` - Used for one-time testing
- `enhanced_api_test.ps1` - Superseded by verify-system.ps1
- `fix_environment.ps1` - Functionality in quick_fix.ps1
- `install_dependencies.ps1` - Replaced by quick_fix.ps1
- `run_api_server.ps1` - Replaced by start_api_direct.ps1
- `start-model-api.ps1` - Replaced by start_api_direct.ps1
- `test_api_health.ps1` - Functionality in verify-system.ps1
- `test_model_loading.py` - Used for one-time testing
- `API_SETUP_GUIDE.md` - Consolidated in main docs
- `DEPENDENCY_RESOLUTION.md` - Consolidated in main docs

## Scripts Directory

Files to keep:
- `create-user.js` - User creation utility
- `list-users.js` - User listing utility
- `reset-all-passwords.ps1` - Main password reset tool
- `CREDENTIALS.md` - Credential documentation

Files to remove:
- `create-admin.js` - Functionality in create-user.js
- `fix-admin-login.ps1` - Issue fixed, no longer needed
- `manage-users.ps1` - Complex and functionality covered by other scripts
- `README.md` - Replace with CREDENTIALS.md
- `reset-admin-password.js` - Functionality in reset-multiple-passwords.js
- `reset-admin-password.ps1` - Functionality in reset-all-passwords.ps1
- `reset-multiple-passwords.js` - Implementation detail of reset-all-passwords.ps1

## Post-cleanup Actions

1. Ensure main README.md is comprehensive and points to the remaining documentation
2. Update any cross-references in remaining documentation
3. Test that all scripts still work after cleaning up
4. Commit the changes with a clear message about the cleanup
