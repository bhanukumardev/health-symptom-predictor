# Fix and Start Both Servers Script

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Starting Health Symptom Predictor" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# Set environment variables
$env:GROQ_API_KEY = "your_groq_api_key_here"  # Replace with your actual API key

# Get base directory
$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "`n1. Starting Backend Server..." -ForegroundColor Yellow
Set-Location "$baseDir\backend"

# Start backend in a new window
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "`$env:GROQ_API_KEY='your_groq_api_key_here'; python -m uvicorn app.main:app --reload --port 8000"
)

Write-Host "   Backend will start on http://localhost:8000" -ForegroundColor Green

Write-Host "`n2. Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "`n3. Starting Frontend Server..." -ForegroundColor Yellow
Set-Location "$baseDir\frontend"

# Start frontend in a new window
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "npm run dev"
)

Write-Host "   Frontend will start on http://localhost:3002" -ForegroundColor Green

Write-Host "`n===============================================" -ForegroundColor Cyan
Write-Host "  Servers Starting!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "`nBackend:  http://localhost:8000" -ForegroundColor White
Write-Host "Frontend: http://localhost:3002" -ForegroundColor White
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host "`nWait 10-15 seconds for frontend to compile..." -ForegroundColor Yellow
Write-Host "`nTo test the History feature:" -ForegroundColor Cyan
Write-Host "1. Login to the app" -ForegroundColor White
Write-Host "2. Click the History icon in navbar" -ForegroundColor White
Write-Host "3. Click View Full Details on any prediction" -ForegroundColor White
Write-Host "`nPress any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
