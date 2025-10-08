# 🚀 Quick Start Guide

## Start Backend (Port 8888)

```powershell
cd backend
.\venv\Scripts\Activate.ps1
$env:DATABASE_URL = "postgresql://postgres:Bhanu123%40@localhost:5432/health_predictor"
$env:GROQ_API_KEY = "your_groq_api_key_here"
$env:ALLOWED_ORIGINS = "http://localhost:3000,http://localhost:3001,http://localhost:3002"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8888
```

**Or use the script:**
```powershell
cd backend
.\start-backend.ps1
```

## Start Frontend (Port 3000)

```powershell
cd frontend
npm run dev
```

## 🌐 Access Your App

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8888
- **API Docs:** http://localhost:8888/docs
- **Health Check:** http://localhost:8888/health

## ⚠️ Important Notes

- **Backend port changed from 8000 to 8888** (port 8000 was corrupted)
- All 19 files updated to use new port 8888
- Both servers must be running for the app to work

## ✅ Verify Servers

Backend health check:
```powershell
Invoke-RestMethod -Uri 'http://localhost:8888/health'
```

Expected response: `status: healthy`

---

**Last Updated:** October 7, 2025
