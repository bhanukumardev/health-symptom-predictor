# Start Backend Server with GROQ API Key
Write-Host "🚀 Starting Health Predictor Backend..." -ForegroundColor Cyan

# Navigate to backend directory
Set-Location "c:\Projects\AI Project\health-symptom-predictor\backend"

# Confirm location
Write-Host "📍 Working Directory: $(Get-Location)" -ForegroundColor Green

# Start server
Write-Host "🔧 Starting FastAPI server on port 8888..." -ForegroundColor Yellow
& "C:/Program Files/Python313/python.exe" -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8888
