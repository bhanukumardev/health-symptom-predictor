#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Start Health Symptom Predictor - Local Development Environment
.DESCRIPTION
    This script starts both the backend (Python/FastAPI) and frontend (Vite/React) servers
    for local development with proper configuration and environment variables.
#>

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Health Symptom Predictor - Local Dev Starter" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendDir = Join-Path $ScriptDir "backend"
$FrontendDir = Join-Path $ScriptDir "frontend"

# Check if backend .env exists
$BackendEnv = Join-Path $BackendDir ".env"
if (-not (Test-Path $BackendEnv)) {
    Write-Host "[ERROR] Backend .env file not found at: $BackendEnv" -ForegroundColor Red
    Write-Host "        Please create a .env file with necessary configuration." -ForegroundColor Red
    exit 1
}

# Check if frontend .env exists
$FrontendEnv = Join-Path $FrontendDir ".env"
if (-not (Test-Path $FrontendEnv)) {
    Write-Host "[*] Frontend .env file not found. Creating default..." -ForegroundColor Yellow
    @"
# For LOCAL DEVELOPMENT - use localhost
VITE_API_URL=http://localhost:8888

# For PRODUCTION - use Render backend
# VITE_API_URL=https://health-symptom-predictor.onrender.com
"@ | Out-File -FilePath $FrontendEnv -Encoding UTF8
    Write-Host "[OK] Created frontend .env file" -ForegroundColor Green
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Starting Backend Server..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Check if Python is available
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Python is not installed or not in PATH!" -ForegroundColor Red
    exit 1
}

# Check if backend dependencies are installed
Write-Host "[*] Checking Python dependencies..." -ForegroundColor Yellow
Push-Location $BackendDir
try {
    $checkImport = python -c "import fastapi; import uvicorn; print('OK')" 2>$null
    if ($LASTEXITCODE -ne 0 -or $checkImport -ne "OK") {
        Write-Host "[*] Installing backend dependencies..." -ForegroundColor Yellow
        python -m pip install -r requirements.txt
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[ERROR] Failed to install backend dependencies!" -ForegroundColor Red
            exit 1
        }
    }
    Write-Host "[OK] Backend dependencies are ready" -ForegroundColor Green
}
finally {
    Pop-Location
}

# Start backend using batch file
Write-Host "[*] Starting backend on http://localhost:8888..." -ForegroundColor Green
$BackendBat = Join-Path $BackendDir "start-backend.bat"
Start-Process cmd -ArgumentList "/k", $BackendBat -WorkingDirectory $BackendDir

# Wait for backend to start
Write-Host "[*] Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Test backend health
$backendHealthy = $false
for ($i = 1; $i -le 3; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8888/health" -TimeoutSec 3 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "[OK] Backend is running and healthy!" -ForegroundColor Green
            $backendHealthy = $true
            break
        }
    }
    catch {
        Write-Host "[*] Attempt $i/3 - Backend not ready yet..." -ForegroundColor Yellow
        if ($i -lt 3) {
            Start-Sleep -Seconds 3
        }
    }
}

if (-not $backendHealthy) {
    Write-Host "[WARNING] Could not verify backend health, but continuing..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Starting Frontend Server..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Check if Node.js is available
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not installed or not in PATH!" -ForegroundColor Red
    exit 1
}

# Check if npm is available
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] npm is not installed or not in PATH!" -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
$NodeModules = Join-Path $FrontendDir "node_modules"
if (-not (Test-Path $NodeModules)) {
    Write-Host "[*] Installing frontend dependencies..." -ForegroundColor Yellow
    Push-Location $FrontendDir
    try {
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[ERROR] Failed to install frontend dependencies!" -ForegroundColor Red
            exit 1
        }
    }
    finally {
        Pop-Location
    }
}
Write-Host "[OK] Frontend dependencies are ready" -ForegroundColor Green

# Start frontend using batch file
Write-Host "[*] Starting frontend on http://localhost:3000..." -ForegroundColor Green
$FrontendBat = Join-Path $ScriptDir "start-frontend.bat"
Start-Process cmd -ArgumentList "/k", $FrontendBat -WorkingDirectory $ScriptDir

Write-Host ""
Write-Host "=================================" -ForegroundColor Green
Write-Host "Development Environment Started!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""
Write-Host "[*] Backend API:  http://localhost:8888" -ForegroundColor Cyan
Write-Host "[*] Frontend App: http://localhost:3000" -ForegroundColor Cyan
Write-Host "[*] API Docs:     http://localhost:8888/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Tips:" -ForegroundColor Yellow
Write-Host "  - Both servers are running in separate command windows" -ForegroundColor White
Write-Host "  - Close those windows or press Ctrl+C to stop them" -ForegroundColor White
Write-Host "  - Backend auto-reloads on code changes" -ForegroundColor White
Write-Host "  - Frontend hot-reloads on code changes" -ForegroundColor White
Write-Host "  - Check the console windows for any errors" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to close this window (servers will keep running)..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
