# 🚀 Health Symptom Predictor - Server Management

## ✅ Current Status (October 6, 2025)

Both servers are now running as PowerShell background jobs!

### Running Services:
- ✅ **Backend**: http://localhost:8000 (PostgreSQL)
- ✅ **Frontend**: http://localhost:3000 (React + Vite)

## 📋 Useful Commands

### Check Server Status:
```powershell
Get-Job | Format-Table
```

### Check Job Output:
```powershell
# Backend logs
Receive-Job -Name "Backend" -Keep

# Frontend logs
Receive-Job -Name "Frontend" -Keep
```

### Test Servers:
```powershell
# Test backend
curl http://localhost:8000/health

# Test frontend (should return HTML)
curl http://localhost:3000
```

### Stop Servers:
```powershell
# Stop both jobs
Get-Job | Stop-Job
Get-Job | Remove-Job

# Or stop individually
Stop-Job -Name "Backend"
Stop-Job -Name "Frontend"
```

### Restart Servers:
```powershell
# Stop existing
Get-Job | Stop-Job; Get-Job | Remove-Job

# Start backend
cd "c:\Projects\AI Project\health-symptom-predictor\backend"
Start-Job -ScriptBlock { 
    Set-Location "c:\Projects\AI Project\health-symptom-predictor\backend"
    python -m uvicorn app.main:app --reload --port 8000 
} -Name "Backend"

# Start frontend
cd "c:\Projects\AI Project\health-symptom-predictor\frontend"
Start-Job -ScriptBlock { 
    Set-Location "c:\Projects\AI Project\health-symptom-predictor\frontend"
    npm run dev 
} -Name "Frontend"
```

## 🔐 Admin Credentials

**Email**: `kumarbhanu818@gmail.com`  
**Password**: `Bhanu123@`

## 📱 Access URLs

- **Home**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register
- **Predict**: http://localhost:3000/predict
- **History**: http://localhost:3000/history
- **Admin Dashboard**: http://localhost:3000/admin
- **Admin Users**: http://localhost:3000/admin/users
- **Admin Predictions**: http://localhost:3000/admin/predictions
- **Admin Feedback**: http://localhost:3000/admin/feedback

## 🔧 Backend API

- **API Base**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 📊 Database

- **Type**: PostgreSQL
- **Host**: localhost:5432
- **Database**: health_predictor
- **User**: postgres
- **Password**: Bhanu123@

## 🎯 How to Use

1. **Open browser**: Navigate to http://localhost:3000
2. **Login**: Use admin credentials above
3. **Admin Dashboard**: Click "Admin" in navigation
4. **View Data**:
   - All users and their prediction counts
   - All predictions with feedback status
   - All feedback with ratings and comments
   - System statistics and accuracy metrics

## 🐛 Troubleshooting

### If frontend doesn't load:
```powershell
# Check if frontend job is running
Get-Job -Name "Frontend" | Format-List

# Check frontend logs
Receive-Job -Name "Frontend" -Keep

# Restart frontend
Stop-Job -Name "Frontend"; Remove-Job -Name "Frontend"
Start-Job -ScriptBlock { 
    Set-Location "c:\Projects\AI Project\health-symptom-predictor\frontend"
    npm run dev 
} -Name "Frontend"
```

### If backend errors:
```powershell
# Check backend logs
Receive-Job -Name "Backend" -Keep

# Verify PostgreSQL is running
Test-NetConnection localhost -Port 5432

# Restart backend
Stop-Job -Name "Backend"; Remove-Job -Name "Backend"
Start-Job -ScriptBlock { 
    Set-Location "c:\Projects\AI Project\health-symptom-predictor\backend"
    python -m uvicorn app.main:app --reload --port 8000 
} -Name "Backend"
```

### If login fails:
```powershell
# Test login directly
$body = "username=kumarbhanu818@gmail.com&password=Bhanu123@"
Invoke-RestMethod -Uri 'http://localhost:8000/api/auth/login' -Method Post -Body $body -ContentType 'application/x-www-form-urlencoded'
```

## ✅ All Working Features

- ✅ User registration and login
- ✅ JWT authentication
- ✅ Health symptom prediction with ML
- ✅ Prediction history
- ✅ Feedback submission
- ✅ Admin dashboard with statistics
- ✅ User management (view, toggle admin, toggle active)
- ✅ Prediction overview with confidence scores
- ✅ Feedback review with ratings
- ✅ PostgreSQL data persistence

---

**Status**: ✅ Both servers running as background jobs  
**Last Updated**: October 6, 2025  
**Ready to use**: Yes! 🎉
