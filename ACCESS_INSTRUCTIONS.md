# SCAN_AI SYSTEM ACCESS INSTRUCTIONS

## System Status
All components of the ScanAI system are now running successfully:

1. **Model API**: Running on port 5005
   - Status: ONLINE
   - Health Check: http://localhost:5005/api/health

2. **Backend Server**: Running on port 5001
   - Status: ONLINE
   - API Base: http://localhost:5001/api

3. **Frontend**: Running on port 5176
   - Status: ONLINE
   - Access URL: http://localhost:5176

## User Credentials
The following user credentials have been reset and are ready to use:

| User Type | Email | Password | Access Level |
|-----------|-------|----------|--------------|
| Admin | admin@gmail.com | Admin123! | Full system access |
| Doctor | doctor@gmail.com | Doctor123! | Medical review access |
| Test User | test@example.com | Test123! | Basic user access |

## Access Instructions

1. Open a web browser and navigate to: http://localhost:5176

2. Log in using one of the credentials from the table above
   - For admin access: admin@gmail.com / Admin123!
   - For doctor access: doctor@gmail.com / Doctor123!
   - For user access: test@example.com / Test123!

3. Once logged in, you can:
   - Upload chest X-ray images for pneumonia detection
   - View analysis results
   - Schedule appointments
   - Submit help requests
   - Access admin features (if using admin credentials)

## Testing the Pneumonia Detection

1. Log in to the system
2. Navigate to the Scan section
3. Upload a chest X-ray image
4. Submit for analysis
5. View the pneumonia detection results

## System Management

If you need to restart any component:

- **Model API**: Run `cd c:\Users\user\scan_ai\backend\model_api; .\start_api_direct.ps1`
- **Backend Server**: Run `cd c:\Users\user\scan_ai\backend; .\start-server.ps1`
- **Frontend**: Run `cd c:\Users\user\scan_ai\frontend; npm run dev`

To reset user passwords again:
```powershell
cd c:\Users\user\scan_ai\backend\scripts
.\reset-all-passwords.ps1
```

## Troubleshooting

If you encounter any issues:

1. Use the verification script to check system status:
   ```powershell
   cd c:\Users\user\scan_ai
   .\verify-system.ps1
   ```

2. Check detailed logs in each terminal window

3. Restart all services with:
   ```powershell
   cd c:\Users\user\scan_ai
   .\start-services.ps1
   ```
