# ============================================
# Post-Migration Testing Script
# Tests all functionality after Supabase migration
# ============================================

Write-Host "`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                              ║" -ForegroundColor Cyan
Write-Host "║     POST-MIGRATION TESTING: Supabase Database               ║" -ForegroundColor Cyan
Write-Host "║                                                              ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

$BACKEND_URL = "https://health-symptom-predictor.onrender.com"
$FRONTEND_URL = "https://health-symptom-predictor.netlify.app"

# Test Results
$testResults = @()

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Body = $null,
        [hashtable]$Headers = $null
    )
    
    Write-Host "`nTesting: $Name..." -ForegroundColor Yellow
    Write-Host "URL: $Url" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            TimeoutSec = 15
        }
        
        if ($Body) {
            $params.Add('Body', $Body)
            $params.Add('ContentType', 'application/x-www-form-urlencoded')
        }
        
        if ($Headers) {
            $params.Add('Headers', $Headers)
        }
        
        $response = Invoke-RestMethod @params
        Write-Host "✅ PASSED: $Name" -ForegroundColor Green
        $testResults += @{ Name = $Name; Status = "PASSED"; Response = $response }
        return $response
    }
    catch {
        Write-Host "❌ FAILED: $Name" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        $testResults += @{ Name = $Name; Status = "FAILED"; Error = $_.Exception.Message }
        return $null
    }
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "PHASE 1: Backend Health Check" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# Test 1: Health Endpoint
Test-Endpoint -Name "Backend Health Check" -Url "$BACKEND_URL/health"

# Test 2: Root Endpoint
Test-Endpoint -Name "API Root" -Url "$BACKEND_URL/"

# Test 3: API Docs
Write-Host "`nAPI Documentation available at:" -ForegroundColor Cyan
Write-Host "$BACKEND_URL/docs" -ForegroundColor White

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "PHASE 2: Authentication Tests" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# Test 4: Login (you'll need to provide actual credentials)
Write-Host "`nℹ️  To test login, update this script with your credentials" -ForegroundColor Yellow

$loginBody = @{
    username = os.getenv('ADMIN_EMAIL', 'admin@example.com')
    password = "YOUR_PASSWORD_HERE"  # Update this!
}

if ($loginBody.password -ne "YOUR_PASSWORD_HERE") {
    $loginResponse = Test-Endpoint -Name "User Login" -Url "$BACKEND_URL/api/auth/login" -Method "POST" -Body $loginBody
    
    if ($loginResponse -and $loginResponse.access_token) {
        $token = $loginResponse.access_token
        $headers = @{
            "Authorization" = "Bearer $token"
        }
        
        Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
        Write-Host "PHASE 3: Authenticated Endpoints" -ForegroundColor Cyan
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
        
        # Test 5: Get User Profile
        Test-Endpoint -Name "User Profile" -Url "$BACKEND_URL/api/user/profile" -Headers $headers
        
        # Test 6: Get Notifications
        Test-Endpoint -Name "User Notifications" -Url "$BACKEND_URL/api/notifications" -Headers $headers
        
        # Test 7: Get Prediction History
        Test-Endpoint -Name "Prediction History" -Url "$BACKEND_URL/api/predictions/history" -Headers $headers
    }
}
else {
    Write-Host "⚠️  Skipping authenticated tests - please provide login credentials" -ForegroundColor Yellow
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "PHASE 4: Frontend Connectivity" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# Test 8: Frontend Availability
try {
    $frontendTest = Invoke-WebRequest -Uri $FRONTEND_URL -Method GET -TimeoutSec 10
    Write-Host "`n✅ Frontend is accessible!" -ForegroundColor Green
    Write-Host "Status Code: $($frontendTest.StatusCode)" -ForegroundColor Gray
    $testResults += @{ Name = "Frontend Accessibility"; Status = "PASSED" }
}
catch {
    Write-Host "`n❌ Frontend is not accessible" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{ Name = "Frontend Accessibility"; Status = "FAILED"; Error = $_.Exception.Message }
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "PHASE 5: Database Verification (Supabase)" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

Write-Host "`nℹ️  Supabase Dashboard:" -ForegroundColor Cyan
Write-Host "https://supabase.com/dashboard/project/txhohvmugqptewlvuhfn" -ForegroundColor White

Write-Host "`nVerify these tables exist in Supabase:" -ForegroundColor Yellow
$tables = @("users", "symptoms", "diseases", "predictions", "feedback", "notifications")
foreach ($table in $tables) {
    Write-Host "  - $table" -ForegroundColor Gray
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

$passedTests = ($testResults | Where-Object { $_.Status -eq "PASSED" }).Count
$failedTests = ($testResults | Where-Object { $_.Status -eq "FAILED" }).Count
$totalTests = $testResults.Count

Write-Host "`nTotal Tests: $totalTests" -ForegroundColor White
Write-Host "✅ Passed: $passedTests" -ForegroundColor Green
Write-Host "❌ Failed: $failedTests" -ForegroundColor Red

if ($failedTests -eq 0) {
    Write-Host "`n🎉 ALL TESTS PASSED! Migration successful!" -ForegroundColor Green
}
else {
    Write-Host "`n⚠️  Some tests failed. Check the errors above." -ForegroundColor Yellow
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "MANUAL TESTING CHECKLIST" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

Write-Host "`nPlease manually verify these features on:" -ForegroundColor Yellow
Write-Host "$FRONTEND_URL" -ForegroundColor White

$checklist = @(
    "[ ] User registration works",
    "[ ] User login works",
    "[ ] Symptom prediction generates results",
    "[ ] AI chatbot responds",
    "[ ] Notifications appear",
    "[ ] History shows past predictions",
    "[ ] Profile page loads",
    "[ ] Admin panel accessible (if admin user)",
    "[ ] Language switching works (EN/HI)",
    "[ ] Mobile responsive design works"
)

foreach ($item in $checklist) {
    Write-Host "  $item" -ForegroundColor Gray
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "NEXT STEPS" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

Write-Host "`n1. Review test results above" -ForegroundColor White
Write-Host "2. Open frontend: $FRONTEND_URL" -ForegroundColor White
Write-Host "3. Test all features manually" -ForegroundColor White
Write-Host "4. Check Supabase dashboard for data" -ForegroundColor White
Write-Host "5. Monitor backend logs on Render" -ForegroundColor White

Write-Host "`n✅ Migration testing complete!" -ForegroundColor Green
Write-Host "`n" 
