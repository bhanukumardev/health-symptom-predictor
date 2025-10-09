# Simple Backend Starter - PostgreSQL Permanent Connection
# Run this in one terminal to start just the backend

Write-Host "🚀 Starting Backend Server..." -ForegroundColor Cyan
Write-Host ""

Set-Location "c:\Projects\AI Project\health-symptom-predictor\backend"

# Activate virtual environment
& ".\venv\Scripts\Activate.ps1"

# Use PostgreSQL database (permanent - reads from .env)
$env:DATABASE_URL = "postgresql://postgres:YOUR_LOCAL_PASSWORD@localhost:5432/health_predictor"

Write-Host "✅ Configuration:" -ForegroundColor Green
Write-Host "   Database: PostgreSQL (health_predictor)" -ForegroundColor White
Write-Host "   Connection: Permanent (data persists)" -ForegroundColor White
Write-Host "   Port: 8888" -ForegroundColor White
Write-Host ""
Write-Host "💾 Data Storage:" -ForegroundColor Cyan
Write-Host "   ✓ Tables persist across restarts" -ForegroundColor White
Write-Host "   ✓ User data automatically saved" -ForegroundColor White
Write-Host "   ✓ No need to recreate tables" -ForegroundColor White
Write-Host ""
Write-Host "📍 Backend:  http://localhost:8888" -ForegroundColor Green
Write-Host "📍 API Docs: http://localhost:8888/docs" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

# Verify database before starting
Write-Host "Verifying database..." -ForegroundColor Cyan
python verify_db.py

Write-Host ""
Write-Host "Starting server..." -ForegroundColor Cyan
Write-Host ""

# Start FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8888
