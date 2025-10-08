# 🔧 COMPLETE FIX GUIDE - Backend Not Responding

## 📊 Current Status
- ✅ Backend URL: `https://health-symptom-predictor.onrender.com`
- ✅ Service ID: `srv-d3hu4l3uibrs73b7kfb0`
- ✅ Database: Connected (Oregon region)
- ❌ Backend: Not responding (connection closed)
- ❌ Frontend: "Failed to fetch" error

---

## 🎯 ROOT CAUSE

Your backend service exists but is either:
1. **Not properly deployed** (build failed)
2. **Missing environment variables**
3. **Suspended** (free tier limits)
4. **Build configuration incorrect**

---

## ✅ SOLUTION: Fix Backend Deployment on Render

### Step 1: Check Backend Status in Render Dashboard

1. Go to: https://dashboard.render.com/
2. Click on: **health-symptom-predictor** (your backend service)
3. Check the status at the top:
   - 🟢 **Live** = Good (but why not responding?)
   - 🟡 **Building** = Wait for build to complete
   - 🔴 **Failed** = Need to fix build errors
   - ⚪ **Suspended** = Upgrade plan or wait for monthly reset

4. Click on **"Logs"** tab to see what's happening

---

### Step 2: Update Environment Variables in Render

**CRITICAL**: Your backend needs these environment variables:

1. In Render Dashboard → Your Service → **Environment** tab
2. Add/Update these variables:

```bash
# Database Connection
DATABASE_URL=postgresql://health_predictor_user:WtIo4HLKi9AEveEmlMFYONE3dxWJhfOd@dpg-d3hu2c1gv73c73e0l170-a.oregon-postgres.render.com/health_predictor

# Groq AI API Key (REQUIRED!)
GROQ_API_KEY=your_actual_groq_api_key_here

# CORS - MUST include your Netlify URL
ALLOWED_ORIGINS=https://health-symptom-predictor.netlify.app,http://localhost:3000,http://localhost:5173,https://*.netlify.app

# Environment
ENVIRONMENT=production

# Debug
DEBUG=False

# JWT Secret (generate a secure random string)
JWT_SECRET_KEY=your_super_secret_jwt_key_here_use_at_least_32_characters

# Algorithm
ALGORITHM=HS256

# Token expiry (in minutes)
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

3. Click **"Save Changes"**
4. This will trigger an automatic redeployment

---

### Step 3: Verify Build Configuration

In Render Dashboard → Your Service → **Settings**:

**Build & Deploy Section:**
- **Root Directory**: `backend` (or leave empty if backend is at root)
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

**Advanced Settings:**
- **Python Version**: `3.11`
- **Auto-Deploy**: `Yes` (from main branch)

---

### Step 4: Manual Redeploy

If build failed or suspended:

1. Go to your service in Render Dashboard
2. Click **"Manual Deploy"** → **"Clear build cache & deploy"**
3. Wait 5-10 minutes for deployment
4. Watch the logs for errors

---

## 🔍 Common Build Errors & Fixes

### Error: "ModuleNotFoundError"
**Fix**: Check `backend/requirements.txt` has all dependencies

### Error: "Database connection failed"
**Fix**: Verify `DATABASE_URL` environment variable is correct

### Error: "GROQ_API_KEY not found"
**Fix**: Add `GROQ_API_KEY` to environment variables in Render

### Error: "Port already in use"
**Fix**: Use `$PORT` environment variable (Render provides this)

### Error: "Build timeout"
**Fix**: Optimize requirements.txt or upgrade Render plan

---

## 🧪 Test Backend After Fixes

### Test 1: Health Check
```powershell
# Wait 30 seconds after deployment completes
Start-Sleep -Seconds 30

# Test health endpoint
Invoke-RestMethod -Uri "https://health-symptom-predictor.onrender.com/health" -Method GET
```

**Expected Response:**
```json
{
  "status": "healthy"
}
```

### Test 2: Root Endpoint
```powershell
Invoke-RestMethod -Uri "https://health-symptom-predictor.onrender.com/" -Method GET
```

**Expected Response:**
```json
{
  "message": "Health Symptom Predictor API",
  "version": "1.0.0",
  "docs": "/docs"
}
```

### Test 3: API Documentation
Open in browser: `https://health-symptom-predictor.onrender.com/docs`

You should see the FastAPI Swagger UI.

---

## 🔧 Update Frontend Configuration (After Backend is Working)

Once backend responds successfully, ensure frontend has correct config:

### 1. Update `frontend/.env.production`
```bash
VITE_API_URL=https://health-symptom-predictor.onrender.com
```

### 2. Update `netlify.toml`
```toml
[build.environment]
  NODE_VERSION = "18"
  VITE_API_URL = "https://health-symptom-predictor.onrender.com"
```

### 3. Commit and Push
```powershell
cd "c:\Projects\AI Project\health-symptom-predictor"
git add frontend/.env.production netlify.toml
git commit -m "Fix: Verify backend URL configuration"
git push origin main
```

This will trigger Netlify to rebuild with the correct backend URL.

---

## 🔐 Update Backend CORS for Netlify

Your backend needs to allow requests from Netlify!

### Option 1: Update via Environment Variable (Recommended)

In Render Dashboard → Environment Variables:
```bash
ALLOWED_ORIGINS=https://health-symptom-predictor.netlify.app,http://localhost:3000,http://localhost:5173,https://*.netlify.app
```

### Option 2: Update Code (If env var not working)

Edit `backend/app/core/config.py`:

```python
class Settings(BaseSettings):
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://health-symptom-predictor.netlify.app",
        "https://*.netlify.app"
    ]
```

Then commit and push to trigger redeploy.

---

## 📋 Complete Environment Variables Checklist

In Render Dashboard, verify you have ALL of these:

- [x] `DATABASE_URL` - PostgreSQL connection string
- [x] `GROQ_API_KEY` - Your Groq API key
- [x] `ALLOWED_ORIGINS` - Netlify URL included
- [x] `JWT_SECRET_KEY` - Secure random string
- [x] `ALGORITHM` - HS256
- [x] `ACCESS_TOKEN_EXPIRE_MINUTES` - 30
- [x] `ENVIRONMENT` - production
- [x] `DEBUG` - False

---

## 🚨 If Backend Still Not Working

### Check Render Service Logs

1. Render Dashboard → Your Service → **Logs**
2. Look for these error patterns:

**Database Connection Error:**
```
sqlalchemy.exc.OperationalError: could not connect to server
```
**Fix**: Check DATABASE_URL is correct

**Missing API Key:**
```
KeyError: 'GROQ_API_KEY'
```
**Fix**: Add GROQ_API_KEY to environment variables

**Port Binding Error:**
```
OSError: [Errno 98] Address already in use
```
**Fix**: Ensure start command uses `$PORT` variable

### Check Build Logs

1. Render Dashboard → Your Service → **Events** tab
2. Click on latest deployment
3. Read build logs for errors

---

## 🎯 Quick Action Plan

### Immediate Steps (Do Now):

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Open your backend service**: `health-symptom-predictor`
3. **Check Status**: Is it Live, Failed, or Building?
4. **Add Environment Variables** (list above)
5. **Click "Manual Deploy"** → "Deploy"
6. **Wait 5-10 minutes**
7. **Test**: `https://health-symptom-predictor.onrender.com/health`

### If Successful:

8. **Verify CORS** includes Netlify URL
9. **Test from Netlify** frontend
10. **All features should work!** 🎉

---

## 💡 Pro Tips

### Tip 1: Free Tier Limits
- Render free tier: 750 hours/month
- Backend sleeps after 15 min inactivity
- First request after sleep takes ~30 seconds

### Tip 2: Keep Backend Alive
Use a cron job or monitoring service to ping your backend every 10 minutes:
```
curl https://health-symptom-predictor.onrender.com/health
```

### Tip 3: View Real-Time Logs
In Render Dashboard → Logs tab, enable "Live tail" to see real-time logs.

### Tip 4: Database Connection
Use **Internal Database URL** in environment variable (faster):
```
postgresql://health_predictor_user:WtIo4HLKi9AEveEmlMFYONE3dxWJhfOd@dpg-d3hu2c1gv73c73e0l170-a/health_predictor
```

---

## 🔄 After Backend is Fixed

### Test Complete Flow:

1. **Open Netlify Site**: `https://health-symptom-predictor.netlify.app`
2. **Register New User**
3. **Login**
4. **Try Symptom Prediction**
5. **Test AI Chatbot**
6. **Check Notifications**
7. **View History**

If all work → **SUCCESS!** 🎉

---

## 📞 What to Send Me After Checking

Please share:

1. **Backend Status**: (Live/Failed/Building/Suspended)
2. **Latest Log Lines**: Last 20 lines from Render logs
3. **Environment Variables**: Screenshot (hide sensitive values)
4. **Health Check Result**: Does `/health` endpoint work?

Then I can provide specific fixes!

---

**Priority**: 🔴 URGENT - Site is down  
**Next Step**: Check Render Dashboard NOW  
**Time to Fix**: ~10-15 minutes

---

## 🎯 TLDR - Quick Fix

```
1. Go to Render Dashboard
2. Open backend service
3. Check status (should be "Live")
4. Add all environment variables (especially GROQ_API_KEY)
5. Add ALLOWED_ORIGINS with Netlify URL
6. Click "Manual Deploy"
7. Wait 10 minutes
8. Test: https://health-symptom-predictor.onrender.com/health
9. If works → Netlify will automatically work!
```

Good luck! Let me know the backend status and I'll help fix any specific errors! 🚀
