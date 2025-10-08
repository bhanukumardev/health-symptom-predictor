# Backend Health Diagnostic Script
# Run this AFTER you've configured environment variables in Render

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Backend Health Diagnostic Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$backendUrl = "https://health-symptom-predictor.onrender.com"
$allPassed = $true

# Test 1: Health Check
Write-Host "[Test 1/5] Testing Health Endpoint..." -ForegroundColor Yellow
Write-Host "URL: $backendUrl/health" -ForegroundColor Gray
try {
    $health = Invoke-RestMethod -Uri "$backendUrl/health" -Method GET -TimeoutSec 45
    if ($health.status -eq "healthy") {
        Write-Host "✅ PASS: Backend is healthy!" -ForegroundColor Green
        $health | ConvertTo-Json
    } else {
        Write-Host "⚠️  WARNING: Unexpected response" -ForegroundColor Yellow
        $health | ConvertTo-Json
    }
} catch {
    Write-Host "❌ FAIL: Health check failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    $allPassed = $false
}
Write-Host ""

# Test 2: Root Endpoint
Write-Host "[Test 2/5] Testing Root Endpoint..." -ForegroundColor Yellow
Write-Host "URL: $backendUrl/" -ForegroundColor Gray
try {
    $root = Invoke-RestMethod -Uri "$backendUrl/" -Method GET -TimeoutSec 30
    Write-Host "✅ PASS: Root endpoint responding!" -ForegroundColor Green
    $root | ConvertTo-Json
} catch {
    Write-Host "❌ FAIL: Root endpoint failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    $allPassed = $false
}
Write-Host ""

# Test 3: API Documentation
Write-Host "[Test 3/5] Testing API Documentation..." -ForegroundColor Yellow
Write-Host "URL: $backendUrl/docs" -ForegroundColor Gray
try {
    $docs = Invoke-WebRequest -Uri "$backendUrl/docs" -Method GET -TimeoutSec 30
    if ($docs.StatusCode -eq 200) {
        Write-Host "✅ PASS: API docs accessible!" -ForegroundColor Green
        Write-Host "   You can view it at: $backendUrl/docs" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ FAIL: API docs not accessible" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    $allPassed = $false
}
Write-Host ""

# Test 4: CORS Headers
Write-Host "[Test 4/5] Testing CORS Configuration..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$backendUrl/health" -Method OPTIONS -TimeoutSec 30
    $corsHeader = $response.Headers["Access-Control-Allow-Origin"]
    if ($corsHeader) {
        Write-Host "✅ PASS: CORS headers present!" -ForegroundColor Green
        Write-Host "   Allowed Origins: $corsHeader" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️  WARNING: CORS headers not found" -ForegroundColor Yellow
        Write-Host "   This might cause issues with Netlify" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  WARNING: Could not check CORS" -ForegroundColor Yellow
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host ""

# Test 5: Netlify Frontend Connection
Write-Host "[Test 5/5] Testing Netlify Frontend..." -ForegroundColor Yellow
$netlifyUrl = "https://health-symptom-predictor.netlify.app"
Write-Host "URL: $netlifyUrl" -ForegroundColor Gray
try {
    $frontend = Invoke-WebRequest -Uri $netlifyUrl -Method GET -TimeoutSec 30
    if ($frontend.StatusCode -eq 200) {
        Write-Host "✅ PASS: Netlify site is accessible!" -ForegroundColor Green
        Write-Host "   Try logging in at: $netlifyUrl" -ForegroundColor Cyan
    }
} catch {
    Write-Host "⚠️  WARNING: Netlify site not accessible yet" -ForegroundColor Yellow
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "   This is normal if you haven't deployed to Netlify yet" -ForegroundColor Gray
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DIAGNOSTIC SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
if ($allPassed) {
    Write-Host "🎉 ALL CRITICAL TESTS PASSED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your backend is working correctly!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Open your Netlify site: $netlifyUrl" -ForegroundColor White
    Write-Host "2. Try to register/login" -ForegroundColor White
    Write-Host "3. Test symptom prediction" -ForegroundColor White
    Write-Host "4. Test AI chatbot" -ForegroundColor White
    Write-Host ""
    Write-Host "If Netlify site shows 'Failed to fetch':" -ForegroundColor Yellow
    Write-Host "- Check Render Dashboard → Environment Variables" -ForegroundColor White
    Write-Host "- Verify ALLOWED_ORIGINS includes: $netlifyUrl" -ForegroundColor White
    Write-Host "- Redeploy backend if needed" -ForegroundColor White
} else {
    Write-Host "❌ SOME TESTS FAILED" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting steps:" -ForegroundColor Yellow
    Write-Host "1. Go to Render Dashboard: https://dashboard.render.com/" -ForegroundColor White
    Write-Host "2. Check service status (should be Live)" -ForegroundColor White
    Write-Host "3. Check Logs tab for errors" -ForegroundColor White
    Write-Host "4. Verify all environment variables are set:" -ForegroundColor White
    Write-Host "   - DATABASE_URL" -ForegroundColor Gray
    Write-Host "   - GROQ_API_KEY" -ForegroundColor Gray
    Write-Host "   - ALLOWED_ORIGINS" -ForegroundColor Gray
    Write-Host "   - SECRET_KEY" -ForegroundColor Gray
    Write-Host "5. Try Manual Deploy → Clear build cache & deploy" -ForegroundColor White
    Write-Host "6. Wait 5-10 minutes and run this script again" -ForegroundColor White
}
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Additional Info
Write-Host "📚 Documentation Files:" -ForegroundColor Cyan
Write-Host "   - URGENT_ACTION_REQUIRED.md - Quick start guide" -ForegroundColor Gray
Write-Host "   - BACKEND_FIX_COMPLETE_GUIDE.md - Detailed troubleshooting" -ForegroundColor Gray
Write-Host "   - URGENT_BACKEND_FIX.md - Environment variables list" -ForegroundColor Gray
Write-Host ""

Write-Host "💡 Tip: Backend might sleep after 15 minutes of inactivity (free tier)" -ForegroundColor Yellow
Write-Host "   First request after sleep takes ~30 seconds to respond" -ForegroundColor Yellow
Write-Host ""
