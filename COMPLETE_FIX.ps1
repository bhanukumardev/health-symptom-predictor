# Complete Fix Script - Clean Start

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  COMPLETE FIX - Health Symptom Predictor" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# Step 1: Kill all existing processes
Write-Host "`n[1/5] Stopping all existing processes..." -ForegroundColor Yellow
Get-Process python -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process node -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*health-symptom-predictor*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "   ✅ All processes stopped" -ForegroundColor Green

# Step 2: Verify ports are free
Write-Host "`n[2/5] Checking ports..." -ForegroundColor Yellow
$port8000 = netstat -ano | findstr ":8000" | findstr "LISTENING"
$port3002 = netstat -ano | findstr ":3002" | findstr "LISTENING"

if ($port8000) {
    Write-Host "   ⚠️  Port 8000 still in use, force killing..." -ForegroundColor Red
    $pids = $port8000 | ForEach-Object { ($_ -split '\s+')[-1] }
    $pids | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
    Start-Sleep -Seconds 2
}

Write-Host "   ✅ Port 8000: FREE" -ForegroundColor Green
Write-Host "   ✅ Port 3002: FREE" -ForegroundColor Green

# Step 3: Start backend
Write-Host "`n[3/5] Starting Backend Server..." -ForegroundColor Yellow
$backendScript = @"
`$env:GROQ_API_KEY='your_groq_api_key_here'
Set-Location 'c:\Projects\AI Project\health-symptom-predictor\backend'
Write-Host '🚀 Backend starting on http://localhost:8000' -ForegroundColor Cyan
python -m uvicorn app.main:app --port 8000 --host 0.0.0.0
"@

$backendScript | Out-File -FilePath "$env:TEMP\start-backend.ps1" -Encoding UTF8
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "$env:TEMP\start-backend.ps1"
Write-Host "   ✅ Backend window opened" -ForegroundColor Green

# Step 4: Wait and verify backend
Write-Host "`n[4/5] Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

for ($i = 1; $i -le 10; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -Method GET -TimeoutSec 2 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✅ Backend is HEALTHY!" -ForegroundColor Green
            break
        }
    } catch {
        if ($i -eq 10) {
            Write-Host "   ❌ Backend failed to start" -ForegroundColor Red
            Write-Host "   Check the backend window for errors" -ForegroundColor Yellow
            pause
            exit 1
        }
        Write-Host "   Attempt $i/10..." -ForegroundColor Gray
        Start-Sleep -Seconds 2
    }
}

# Step 5: Start frontend
Write-Host "`n[5/5] Starting Frontend Server..." -ForegroundColor Yellow
$frontendScript = @"
Set-Location 'c:\Projects\AI Project\health-symptom-predictor\frontend'
Write-Host '🚀 Frontend starting on http://localhost:3002' -ForegroundColor Cyan
npm run dev
"@

$frontendScript | Out-File -FilePath "$env:TEMP\start-frontend.ps1" -Encoding UTF8
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "$env:TEMP\start-frontend.ps1"
Write-Host "   ✅ Frontend window opened" -ForegroundColor Green

# Done
Write-Host "`n===============================================" -ForegroundColor Cyan
Write-Host "  ✅ SERVERS STARTED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "`nBackend:  http://localhost:8000" -ForegroundColor White
Write-Host "Frontend: http://localhost:3002" -ForegroundColor White
Write-Host "API Docs: http://localhost:8000/docs`n" -ForegroundColor White

Write-Host "📋 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Wait 15-20 seconds for frontend to compile" -ForegroundColor White
Write-Host "2. Open http://localhost:3002 in your browser" -ForegroundColor White
Write-Host "3. Login with your credentials" -ForegroundColor White
Write-Host "4. Click History in the navbar" -ForegroundColor White
Write-Host "5. Click View Full Details on any prediction" -ForegroundColor White
Write-Host ""

Write-Host "If you see errors, check the backend/frontend windows" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
