# Complete Test and Verification Script
# Run this to verify the entire setup

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Health Symptom Predictor - Complete Verification" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Check 1: Groq API Key
Write-Host "1. Checking Groq API Key..." -ForegroundColor Yellow
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$envFile = Get-Content "$scriptPath\backend\.env" -Raw
if ($envFile -match "GROQ_API_KEY=gsk_") {
    Write-Host "   ✅ Groq API Key found in .env" -ForegroundColor Green
} else {
    Write-Host "   ❌ Groq API Key NOT found in .env" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Check 2: Test Groq API
Write-Host "2. Testing Groq API Connection..." -ForegroundColor Yellow
python backend/test_groq.py | Out-String | Write-Host
Write-Host ""

# Check 3: Backend Status
Write-Host "3. Checking Backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Backend is running on http://localhost:8000" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Backend is NOT running" -ForegroundColor Red
    Write-Host "   Run: cd backend; python -m uvicorn app.main:app --reload" -ForegroundColor Yellow
}
Write-Host ""

# Check 4: Frontend Status
Write-Host "4. Checking Frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Frontend is running on http://localhost:3002" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Frontend is NOT running" -ForegroundColor Red
    Write-Host "   Run: cd frontend; npm run dev" -ForegroundColor Yellow
}
Write-Host ""

# Check 5: Translation Files
Write-Host "5. Checking Translation Files..." -ForegroundColor Yellow
$enFile = "frontend/public/locales/en/translation.json"
$hiFile = "frontend/public/locales/hi/translation.json"

if (Test-Path $enFile) {
    $enContent = Get-Content $enFile -Raw | ConvertFrom-Json
    if ($enContent.diseases) {
        Write-Host "   ✅ English translations with diseases section" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  English translations missing diseases section" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ❌ English translation file missing" -ForegroundColor Red
}

if (Test-Path $hiFile) {
    $hiContent = Get-Content $hiFile -Raw | ConvertFrom-Json
    if ($hiContent.diseases) {
        Write-Host "   ✅ Hindi translations with diseases section" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Hindi translations missing diseases section" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ❌ Hindi translation file missing" -ForegroundColor Red
}
Write-Host ""

# Summary
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Verification Complete!" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Open: http://localhost:3002" -ForegroundColor White
Write-Host "2. Login to the app" -ForegroundColor White
Write-Host "3. Go to Predict page" -ForegroundColor White
Write-Host "4. Select symptoms and submit" -ForegroundColor White
Write-Host "5. Check for medicine recommendations (AI-powered section)" -ForegroundColor White
Write-Host ""
Write-Host "Expected Result:" -ForegroundColor Yellow
Write-Host "- Disease name translated (if Hindi mode)" -ForegroundColor White
Write-Host "- Medicine recommendations section visible" -ForegroundColor White
Write-Host "- All content in selected language" -ForegroundColor White
Write-Host ""
