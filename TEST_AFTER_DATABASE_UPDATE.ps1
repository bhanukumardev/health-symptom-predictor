# Full System Test - Run After DATABASE_URL Update
# Tests all backend endpoints and simulates frontend behavior

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "HEALTH SYMPTOM PREDICTOR - FULL SYSTEM TEST" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "https://health-symptom-predictor.onrender.com"
$frontendUrl = "https://health-symptom-predictor.netlify.app"
$testUser = @{
    email = "kumarbhanu818@gmail.com"
    password = "Bhanu123"
}

$testsPassed = 0
$testsFailed = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [scriptblock]$TestBlock
    )
    
    Write-Host "Testing: $Name..." -NoNewline
    try {
        & $TestBlock
        Write-Host " ✅ PASSED" -ForegroundColor Green
        $script:testsPassed++
        return $true
    } catch {
        Write-Host " ❌ FAILED" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Yellow
        $script:testsFailed++
        return $false
    }
}

# Test 1: Health Check
Test-Endpoint "Health Endpoint" {
    $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get -TimeoutSec 10
    if ($response.status -ne "healthy") {
        throw "Health check failed"
    }
}

# Test 2: Root Endpoint
Test-Endpoint "Root Endpoint" {
    $response = Invoke-RestMethod -Uri "$baseUrl/" -Method Get -TimeoutSec 10
    if (-not $response.message) {
        throw "Root endpoint failed"
    }
}

# Test 3: Login (Critical - requires database)
Write-Host ""
Write-Host "🔐 CRITICAL DATABASE TEST:" -ForegroundColor Yellow
$loginSuccess = Test-Endpoint "Login Endpoint (Database Connection)" {
    $body = @{
        username = $testUser.email
        password = $testUser.password
    }
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $body -ContentType 'application/x-www-form-urlencoded' -TimeoutSec 10
    if (-not $response.access_token) {
        throw "No access token received"
    }
    $script:token = $response.access_token
}

if (-not $loginSuccess) {
    Write-Host ""
    Write-Host "❌ CRITICAL: Login failed - DATABASE_URL not updated yet!" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 ACTION REQUIRED:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://dashboard.render.com/" -ForegroundColor White
    Write-Host "2. Select: health-symptom-predictor service" -ForegroundColor White
    Write-Host "3. Go to: Environment tab" -ForegroundColor White
    Write-Host "4. Update DATABASE_URL to:" -ForegroundColor White
    Write-Host "   postgresql://postgres:Bhanu123%40@db.txhohvmugqptewlvuhfn.supabase.co:5432/postgres?sslmode=require" -ForegroundColor Cyan
    Write-Host "5. Save and wait for redeploy (~2 minutes)" -ForegroundColor White
    Write-Host "6. Run this script again" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "🎉 Database connection working!" -ForegroundColor Green
Write-Host ""

# Test 4: Get User Profile
Test-Endpoint "Get User Profile (Authenticated)" {
    $headers = @{
        Authorization = "Bearer $token"
    }
    $response = Invoke-RestMethod -Uri "$baseUrl/api/users/me" -Headers $headers -Method Get -TimeoutSec 10
    if ($response.email -ne $testUser.email) {
        throw "Profile email mismatch"
    }
    $script:userId = $response.id
    $script:isAdmin = $response.is_admin
    Write-Host "  → User: $($response.full_name)" -ForegroundColor Cyan
    Write-Host "  → Admin: $($response.is_admin)" -ForegroundColor Cyan
}

# Test 5: Get Diseases
Test-Endpoint "Get Diseases List" {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/diseases" -Method Get -TimeoutSec 10
    if ($response.Count -eq 0) {
        throw "No diseases found"
    }
    Write-Host "  → Diseases available: $($response.Count)" -ForegroundColor Cyan
}

# Test 6: Get Notifications
Test-Endpoint "Get Notifications (Authenticated)" {
    $headers = @{
        Authorization = "Bearer $token"
    }
    $response = Invoke-RestMethod -Uri "$baseUrl/api/notifications" -Headers $headers -Method Get -TimeoutSec 10
    Write-Host "  → Notifications: $($response.Count)" -ForegroundColor Cyan
}

# Test 7: Get Prediction History
Test-Endpoint "Get Prediction History (Authenticated)" {
    $headers = @{
        Authorization = "Bearer $token"
    }
    $response = Invoke-RestMethod -Uri "$baseUrl/api/predictions/history" -Headers $headers -Method Get -TimeoutSec 10
    Write-Host "  → Predictions: $($response.Count)" -ForegroundColor Cyan
}

# Test 8: Admin Stats (if admin)
if ($isAdmin) {
    Test-Endpoint "Admin Statistics (Admin Only)" {
        $headers = @{
            Authorization = "Bearer $token"
        }
        $response = Invoke-RestMethod -Uri "$baseUrl/api/admin/stats" -Headers $headers -Method Get -TimeoutSec 10
        Write-Host "  → Total Users: $($response.total_users)" -ForegroundColor Cyan
        Write-Host "  → Total Predictions: $($response.total_predictions)" -ForegroundColor Cyan
    }
}

# Test 9: Frontend Accessibility
Write-Host ""
Write-Host "🌐 FRONTEND TEST:" -ForegroundColor Yellow
Test-Endpoint "Frontend Loads" {
    $response = Invoke-WebRequest -Uri $frontendUrl -Method Get -TimeoutSec 10
    if ($response.StatusCode -ne 200) {
        throw "Frontend not accessible"
    }
}

# Summary
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "✅ Passed: $testsPassed" -ForegroundColor Green
Write-Host "❌ Failed: $testsFailed" -ForegroundColor Red
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "🎉 ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "✅ Backend is fully operational" -ForegroundColor Green
    Write-Host "✅ Database connection established" -ForegroundColor Green
    Write-Host "✅ All API endpoints working" -ForegroundColor Green
    Write-Host "✅ Frontend is accessible" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Your application is READY TO USE!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📱 Access your app at:" -ForegroundColor Yellow
    Write-Host "   $frontendUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📚 API Documentation:" -ForegroundColor Yellow
    Write-Host "   $baseUrl/docs" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "⚠️ Some tests failed. Please review the errors above." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "1. DATABASE_URL not updated on Render" -ForegroundColor White
    Write-Host "2. Render service not fully deployed" -ForegroundColor White
    Write-Host "3. Network connectivity issues" -ForegroundColor White
    Write-Host ""
}

Write-Host "============================================================" -ForegroundColor Cyan
