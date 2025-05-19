# Direct script to run the API server
Write-Host "===== STARTING MODEL API (DIRECT) =====" -ForegroundColor Cyan

# Navigate to the correct directory if not already there
$modelApiDir = "c:\Users\user\scan_ai\backend\model_api"
if ($pwd.Path -ne $modelApiDir) {
    Set-Location $modelApiDir
}

# Activate the virtual environment directly
Write-Host "Activating virtual environment and starting Flask app..." -ForegroundColor Green
.\venv\Scripts\python.exe app.py
