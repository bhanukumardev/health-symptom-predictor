# Health App Startup Script - PostgreSQL Only# Health App Startup Script

Write-Host "========================================" -ForegroundColor Cyan# Run this to start both backend and frontend

Write-Host "   Health Symptom Predictor Startup" -ForegroundColor Cyan

Write-Host "   PostgreSQL Database Only" -ForegroundColor CyanWrite-Host "========================================" -ForegroundColor Cyan

Write-Host "========================================" -ForegroundColor CyanWrite-Host "   Health Symptom Predictor Startup" -ForegroundColor Cyan

Write-Host ""Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""

$projectRoot = "c:\Projects\AI Project\health-symptom-predictor"

$projectRoot = "c:\Projects\AI Project\health-symptom-predictor"

# Check if backend dependencies are installed

if (!(Test-Path "$projectRoot\backend\venv\Scripts\python.exe")) {# Check if backend dependencies are installed

    Write-Host "⚠️  Backend virtual environment not found!" -ForegroundColor Yellowif (!(Test-Path "$projectRoot\backend\venv\Scripts\python.exe")) {

    Write-Host "   Run: cd backend; python -m venv venv; .\venv\Scripts\Activate.ps1; pip install -r requirements.txt" -ForegroundColor Yellow    Write-Host "⚠️  Backend virtual environment not found!" -ForegroundColor Yellow

    exit    Write-Host "   Run: cd backend; python -m venv venv; .\venv\Scripts\Activate.ps1; pip install -r requirements.txt" -ForegroundColor Yellow

}    exit

}

# Check if frontend dependencies are installed

if (!(Test-Path "$projectRoot\frontend\node_modules")) {# Check if frontend dependencies are installed

    Write-Host "⚠️  Frontend dependencies not found!" -ForegroundColor Yellowif (!(Test-Path "$projectRoot\frontend\node_modules")) {

    Write-Host "   Run: cd frontend; npm install" -ForegroundColor Yellow    Write-Host "⚠️  Frontend dependencies not found!" -ForegroundColor Yellow

    exit    Write-Host "   Run: cd frontend; npm install" -ForegroundColor Yellow

}    exit

}

Write-Host "✅ All dependencies found!" -ForegroundColor Green

Write-Host ""Write-Host "✅ All dependencies found!" -ForegroundColor Green

Write-Host ""

Write-Host "🗄️  Database: PostgreSQL" -ForegroundColor Green

Write-Host "   Connection: localhost:5432/health_predictor" -ForegroundColor WhiteWrite-Host "🔧 Choose your database:" -ForegroundColor Cyan

Write-Host "   User: postgres" -ForegroundColor WhiteWrite-Host "  1. SQLite (Quick testing - no setup needed)" -ForegroundColor White

Write-Host ""Write-Host "  2. PostgreSQL (Production - requires PostgreSQL installed)" -ForegroundColor White

Write-Host ""

Write-Host "🚀 Starting Health App..." -ForegroundColor Cyan

Write-Host ""$dbChoice = Read-Host "Enter choice (1 or 2)"

Write-Host "📍 Backend will start at:  http://localhost:8888" -ForegroundColor Green

Write-Host "📍 API Docs will be at:    http://localhost:8888/docs" -ForegroundColor Greenif ($dbChoice -eq "1") {

Write-Host "📍 Frontend will start at: http://localhost:3000" -ForegroundColor Green    Write-Host "✅ Using SQLite database" -ForegroundColor Green

Write-Host ""    $env:DATABASE_URL = "sqlite:///./health_app.db"

Write-Host "Press Ctrl+C to stop the servers" -ForegroundColor Yellow} else {

Write-Host ""    Write-Host "✅ Using PostgreSQL (make sure it's configured in .env)" -ForegroundColor Green

Start-Sleep -Seconds 2}



# Start backendWrite-Host ""

Write-Host "🔄 Starting backend..." -ForegroundColor CyanWrite-Host "🚀 Starting Health App..." -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\backend'; .\start-backend.ps1"Write-Host ""

Write-Host "📍 Backend will start at:  http://localhost:8888" -ForegroundColor Green

Start-Sleep -Seconds 3Write-Host "📍 API Docs will be at:    http://localhost:8888/docs" -ForegroundColor Green

Write-Host "📍 Frontend will start at: http://localhost:5173" -ForegroundColor Green

# Start frontendWrite-Host ""

Write-Host "🔄 Starting frontend..." -ForegroundColor CyanWrite-Host "Press Ctrl+C to stop the servers" -ForegroundColor Yellow

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\frontend'; npm run dev"Write-Host ""

Start-Sleep -Seconds 2

Start-Sleep -Seconds 3

# Start backend in background

Write-Host ""Write-Host "🔄 Starting backend..." -ForegroundColor Cyan

Write-Host "========================================" -ForegroundColor Green$backendJob = Start-Job -ScriptBlock {

Write-Host "✅ Health App is starting!" -ForegroundColor Green    param($root, $dbUrl)

Write-Host "========================================" -ForegroundColor Green    Set-Location "$root\backend"

Write-Host ""    & ".\venv\Scripts\Activate.ps1"

Write-Host "📱 Open: http://localhost:3000" -ForegroundColor Cyan    $env:DATABASE_URL = $dbUrl

Write-Host ""    & uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

Write-Host "Admin Login:" -ForegroundColor Yellow} -ArgumentList $projectRoot, $env:DATABASE_URL

Write-Host "  Check backend logs for admin credentials" -ForegroundColor White

Write-Host "  or create account through registration" -ForegroundColor WhiteStart-Sleep -Seconds 3

Write-Host ""

Write-Host "Database: PostgreSQL" -ForegroundColor Yellow# Start frontend in background

Write-Host "  Host: localhost:5432" -ForegroundColor WhiteWrite-Host "🔄 Starting frontend..." -ForegroundColor Cyan

Write-Host "  Database: health_predictor" -ForegroundColor White$frontendJob = Start-Job -ScriptBlock {

Write-Host ""    param($root)

    Set-Location "$root\frontend"
    & npm run dev
} -ArgumentList $projectRoot

Start-Sleep -Seconds 5

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ Health App is running!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Open your browser to: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Quick Guide:" -ForegroundColor Yellow
Write-Host "  1. Register a new account" -ForegroundColor White
Write-Host "  2. Login with your credentials" -ForegroundColor White
Write-Host "  3. Select symptoms and get predictions" -ForegroundColor White
Write-Host "  4. View your prediction history" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow

# Keep script running and show logs
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host "`n🛑 Stopping servers..." -ForegroundColor Yellow
    Stop-Job -Job $backendJob, $frontendJob
    Remove-Job -Job $backendJob, $frontendJob
    Write-Host "✅ All servers stopped" -ForegroundColor Green
}
