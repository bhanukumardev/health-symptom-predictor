# 🚨 IMMEDIATE ACTION REQUIRED - Backend Down

## Current Situation
- ❌ **Backend**: Not responding (connection closed)
- ✅ **Database**: Connected and configured
- ❌ **Frontend**: Showing "Failed to fetch"
- ✅ **Backend URL**: https://health-symptom-predictor.onrender.com

---

## 🎯 ROOT CAUSE
Backend service on Render is either:
1. Not deployed properly
2. Missing required environment variables
3. Build failed
4. Suspended (free tier limit)

---

## ⚡ IMMEDIATE ACTIONS (DO NOW!)

### Action 1: Check Backend Status (2 minutes)

1. Open: **https://dashboard.render.com/**
2. Login to your account
3. Find service: **health-symptom-predictor** (Service ID: srv-d3hu4l3uibrs73b7kfb0)
4. Check status indicator:
   - 🟢 **Live** → Go to Action 2
   - 🔴 **Failed** → Check logs (Action 3)
   - 🟡 **Building** → Wait 5 minutes, then recheck
   - ⚪ **Suspended** → Free tier limit reached

---

### Action 2: Add Required Environment Variables (5 minutes)

**CRITICAL:** Your backend CANNOT work without these!

1. In Render Dashboard → Your Service → **"Environment"** tab
2. Click **"Add Environment Variable"**
3. Add these ONE BY ONE:

```bash
# 1. Database Connection (REQUIRED)
Key: DATABASE_URL
Value: postgresql://health_predictor_user:WtIo4HLKi9AEveEmlMFYONE3dxWJhfOd@dpg-d3hu2c1gv73c73e0l170-a.oregon-postgres.render.com/health_predictor

# 2. Groq API Key (REQUIRED for AI chatbot)
Key: GROQ_API_KEY
Value: YOUR_ACTUAL_GROQ_API_KEY_HERE

# 3. CORS Origins (REQUIRED for Netlify to work)
Key: ALLOWED_ORIGINS
Value: https://health-symptom-predictor.netlify.app,http://localhost:3000,http://localhost:5173

# 4. JWT Secret (REQUIRED for authentication)
Key: SECRET_KEY
Value: YOUR_SUPER_SECRET_KEY_AT_LEAST_32_CHARACTERS_LONG

# 5. Algorithm (REQUIRED)
Key: ALGORITHM
Value: HS256

# 6. Token Expiry
Key: ACCESS_TOKEN_EXPIRE_MINUTES
Value: 30

# 7. Environment
Key: ENVIRONMENT
Value: production

# 8. Debug Mode
Key: DEBUG
Value: False
```

4. Click **"Save Changes"** after adding each variable
5. Wait for automatic redeployment (5-10 minutes)

---

### Action 3: Check Build/Deploy Logs (3 minutes)

1. In Render Dashboard → Your Service → **"Logs"** tab
2. Look for error messages
3. Common errors and fixes:

**Error:** `ModuleNotFoundError: No module named 'app'`  
**Fix:** Set Root Directory to `backend` in Settings

**Error:** `KeyError: 'GROQ_API_KEY'`  
**Fix:** Add GROQ_API_KEY environment variable

**Error:** `could not connect to server`  
**Fix:** Check DATABASE_URL is correct

**Error:** `Address already in use`  
**Fix:** Start command should use `$PORT`: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

---

### Action 4: Manual Deploy (if needed)

If backend status shows "Failed":

1. Render Dashboard → Your Service
2. Click **"Manual Deploy"** dropdown
3. Select **"Clear build cache & deploy"**
4. Wait 5-10 minutes
5. Watch logs for completion

---

### Action 5: Test Backend (1 minute)

After deployment completes:

```powershell
# Test 1: Health check
Invoke-RestMethod -Uri "https://health-symptom-predictor.onrender.com/health"

# Test 2: Root endpoint  
Invoke-RestMethod -Uri "https://health-symptom-predictor.onrender.com/"

# Test 3: Open API docs in browser
Start-Process "https://health-symptom-predictor.onrender.com/docs"
```

**Expected:** All should work without errors!

---

## 📋 Backend Settings Checklist

Verify these in Render Dashboard → Settings:

### Build & Deploy
- [x] **Root Directory**: `backend` (or leave empty if at root)
- [x] **Build Command**: `pip install -r requirements.txt`
- [x] **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Advanced
- [x] **Auto-Deploy**: Enabled
- [x] **Branch**: main
- [x] **Health Check Path**: `/health`
- [x] **Python Version**: 3.11

---

## 🔍 Where to Get Missing Information

### 1. GROQ_API_KEY
- Go to: https://console.groq.com/
- Login → API Keys
- Create new key or copy existing
- Add to Render environment variables

### 2. SECRET_KEY (JWT)
Generate a secure random key:

```powershell
# Run this in PowerShell to generate a secure key
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

Use the output as your SECRET_KEY.

---

## ✅ Success Indicators

Backend is working when:

1. ✅ Render Dashboard shows: **🟢 Live**
2. ✅ Health check returns: `{"status":"healthy"}`
3. ✅ API docs accessible: `/docs` endpoint works
4. ✅ No errors in Render logs
5. ✅ Netlify frontend can connect

---

## 🚀 After Backend is Fixed

### Frontend Will Automatically Work!

Why? Because frontend is already configured:
- ✅ `frontend/.env.production` has correct URL
- ✅ `netlify.toml` has correct URL
- ✅ All code uses `VITE_API_URL` environment variable

Once backend responds → Netlify site will work immediately! 🎉

---

## 📞 What to Tell Me

After checking Render Dashboard, send me:

1. **Status**: Is service Live, Failed, Building, or Suspended?
2. **Logs**: Last 20-30 lines from the Logs tab
3. **Environment Variables**: How many do you have configured?
4. **Error Messages**: Any red text in logs?

I'll provide specific fixes based on what you see!

---

## ⏱️ Time Estimate

- Check status: 2 minutes
- Add environment variables: 5 minutes
- Deployment: 5-10 minutes
- Testing: 1 minute

**Total: ~15-20 minutes to fix**

---

## 🎯 MOST COMMON ISSUE

**Missing GROQ_API_KEY** causes backend to fail silently.

**Quick Fix:**
1. Get key from: https://console.groq.com/
2. Add to Render: `GROQ_API_KEY=your_key_here`
3. Redeploy
4. Done! ✅

---

## 💡 Alternative: Use Render Web Shell

If you can't figure it out from logs:

1. Render Dashboard → Your Service
2. Click **"Shell"** tab
3. Run these commands to debug:

```bash
# Check if environment variables exist
printenv | grep -i groq
printenv | grep -i database

# Test database connection
python -c "import psycopg2; print('DB OK')"

# Check if app can start
python -m app.main
```

---

## 🔴 PRIORITY ACTIONS (In Order)

1. ✅ Go to Render Dashboard **NOW**
2. ✅ Check service status
3. ✅ Add ALL environment variables (especially GROQ_API_KEY)
4. ✅ Verify ALLOWED_ORIGINS includes Netlify URL
5. ✅ Wait for deployment to complete
6. ✅ Test health endpoint
7. ✅ Test Netlify site

**Do these steps in order. Don't skip any!**

---

**Status**: 🔴 URGENT - Immediate action required  
**Time**: ~15 minutes to fix  
**Difficulty**: Easy (just configuration)  

**GO TO RENDER DASHBOARD NOW!** 🚀
