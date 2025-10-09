# Full System Test - Run After DATABASE_URL Update
# Tests all backend endpoints and simulates frontend behavior

$ErrorActionPreference = "Stop"

$baseUrl = "https://health-symptom-predictor.onrender.com"
$frontendUrl = "https://health-symptom-predictor.netlify.app"
# Test credentials - use environment variables in production
$testEmail = $env:ADMIN_EMAIL ?? "admin@example.com"
$testPassword = $env:ADMIN_PASSWORD ?? "defaultpassword"

$testsPassed = 0
$testsFailed = 0
$token = $null
$isAdmin = $false

function Write-Header($text) {
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host $text -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan
}

function Invoke-Step {
    param(
        [string]$Name,
        [ScriptBlock]$Action
    )

    Write-Host "Testing: $Name..." -NoNewline
    try {
        & $Action
    Write-Host " PASSED" -ForegroundColor Green
        $script:testsPassed++
        return $true
    }
    catch {
    Write-Host " FAILED" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Yellow
        $script:testsFailed++
        return $false
    }
}

Write-Header "HEALTH SYMPTOM PREDICTOR - FULL SYSTEM TEST"

Invoke-Step "Health Endpoint" {
    $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get -TimeoutSec 15
    if ($response.status -ne "healthy") { throw "Health check failed" }
}

Invoke-Step "Root Endpoint" {
    $response = Invoke-RestMethod -Uri "$baseUrl/" -Method Get -TimeoutSec 15
    if (-not $response.message) { throw "Root endpoint failed" }
}

Write-Host ""
Write-Host "CRITICAL DATABASE TEST:" -ForegroundColor Yellow
$loginSuccess = Invoke-Step "Login Endpoint (Database Connection)" {
    $body = @{ username = $testEmail; password = $testPassword }
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $body -ContentType 'application/x-www-form-urlencoded' -TimeoutSec 20
    if (-not $response.access_token) { throw "No access token received" }
    $script:token = $response.access_token
}

if (-not $loginSuccess) {
    Write-Host ""
    Write-Host "CRITICAL: Login failed - DATABASE_URL not updated yet!" -ForegroundColor Red
    Write-Host ""
    Write-Host "ACTION REQUIRED:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://dashboard.render.com/" -ForegroundColor White
    Write-Host "2. Select: health-symptom-predictor service" -ForegroundColor White
    Write-Host "3. Go to: Environment tab" -ForegroundColor White
    Write-Host "4. Update DATABASE_URL to:" -ForegroundColor White
    Write-Host "   postgresql://postgres.YOUR_DB_ID:YOUR_PASSWORD@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require" -ForegroundColor Cyan
    Write-Host "5. Save and wait for redeploy (~2 minutes)" -ForegroundColor White
    Write-Host "6. Run this script again" -ForegroundColor White
    Write-Host ""
    return
}

Write-Host ""
Write-Host "Database connection working!" -ForegroundColor Green
Write-Host ""

$authHeaders = @{ Authorization = "Bearer $token" }

Invoke-Step "Get User Profile (Authenticated)" {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/users/me" -Headers $authHeaders -Method Get -TimeoutSec 20
    if ($response.email -ne $testEmail) { throw "Profile email mismatch" }
    $script:isAdmin = [bool]$response.is_admin
    Write-Host "  - User: $($response.full_name)" -ForegroundColor Cyan
    Write-Host "  - Admin: $($response.is_admin)" -ForegroundColor Cyan
}

Invoke-Step "Get Diseases List" {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/diseases" -Method Get -TimeoutSec 20
    if (-not $response -or $response.Count -le 0) { throw "No diseases found" }
    Write-Host "  - Diseases available: $($response.Count)" -ForegroundColor Cyan
}

Invoke-Step "Get Notifications (Authenticated)" {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/notifications" -Headers $authHeaders -Method Get -TimeoutSec 20
    Write-Host "  - Notifications: $($response.Count)" -ForegroundColor Cyan
}

Invoke-Step "Get Prediction History (Authenticated)" {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/predictions/history" -Headers $authHeaders -Method Get -TimeoutSec 20
    Write-Host "  - Predictions: $($response.Count)" -ForegroundColor Cyan
}

if ($isAdmin) {
    Invoke-Step "Admin Statistics (Admin Only)" {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/admin/stats" -Headers $authHeaders -Method Get -TimeoutSec 20
    Write-Host "  - Total Users: $($response.total_users)" -ForegroundColor Cyan
    Write-Host "  - Total Predictions: $($response.total_predictions)" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "FRONTEND TEST:" -ForegroundColor Yellow
Invoke-Step "Frontend Loads" {
    $response = Invoke-WebRequest -Uri $frontendUrl -Method Get -TimeoutSec 20
    if ($response.StatusCode -ne 200) { throw "Frontend not accessible" }
}

Write-Host ""
Write-Header "TEST SUMMARY"
Write-Host "Passed: $testsPassed" -ForegroundColor Green
Write-Host "Failed: $testsFailed" -ForegroundColor Red
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Backend is fully operational" -ForegroundColor Green
    Write-Host "Database connection established" -ForegroundColor Green
    Write-Host "All API endpoints working" -ForegroundColor Green
    Write-Host "Frontend is accessible" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your application is READY TO USE!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Access your app at:" -ForegroundColor Yellow
    Write-Host "   $frontendUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "API Documentation:" -ForegroundColor Yellow
    Write-Host "   $baseUrl/docs" -ForegroundColor Cyan
    Write-Host ""
}
else {
    Write-Host "Some tests failed. Please review the errors above." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "1. DATABASE_URL not updated on Render" -ForegroundColor White
    Write-Host "2. Render service not fully deployed" -ForegroundColor White
    Write-Host "3. Network connectivity issues" -ForegroundColor White
    Write-Host ""
}

Write-Host "============================================================" -ForegroundColor Cyan
