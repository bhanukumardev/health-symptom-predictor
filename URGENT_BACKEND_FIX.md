# 🔧 URGENT FIX: Backend URL Issue

## 🚨 Problem
Your Netlify site shows "Failed to fetch" because the backend URL is incorrect or the backend service isn't running.

---

## ✅ SOLUTION: Find Your Correct Render Backend URL

### Step 1: Get Your Backend URL from Render

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Click on your backend Web Service** (NOT the database)
3. **Copy the URL** at the top of the page
   - It looks like: `https://your-service-name.onrender.com`
   - Or: `https://health-symptom-predictor-XXXXX.onrender.com`

### Step 2: Verify Backend is Running

Once you have the URL, test it:

```powershell
# Replace YOUR-BACKEND-URL with your actual URL
Invoke-RestMethod -Uri "https://YOUR-BACKEND-URL.onrender.com/api/health"
```

**Expected Response:**
```json
{
  "status": "healthy",
  "database": "connected"
}
```

**If it times out**: Backend is sleeping (Render free tier). Wait 30 seconds and try again.

**If it gives 404**: Backend URL is wrong.

---

## 📝 Step 3: Update Configuration Files

Once you have the **correct backend URL**, update these files:

### 1. Update `frontend/.env.production`

```bash
VITE_API_URL=https://YOUR-ACTUAL-BACKEND-URL.onrender.com
```

### 2. Update `netlify.toml`

```toml
[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--prefix=/opt/buildhome/.nvm/versions/node/v18.20.4/bin/npm"
  VITE_API_URL = "https://YOUR-ACTUAL-BACKEND-URL.onrender.com"
```

### 3. Update Backend CORS Settings

Go to your backend `app/main.py` and ensure CORS allows your Netlify URL:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://health-symptom-predictor.netlify.app",  # Your Netlify URL
        "https://*.netlify.app"  # All Netlify preview URLs
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🚀 Step 4: Deploy the Fix

```powershell
cd "c:\Projects\AI Project\health-symptom-predictor"

# Add changes
git add frontend/.env.production netlify.toml

# Commit
git commit -m "Fix: Update backend URL for Render deployment"

# Push (triggers Netlify rebuild)
git push origin main
```

---

## 🔍 Step 5: Check Backend Logs

If backend still isn't responding:

1. Go to **Render Dashboard**
2. Click your **backend service**
3. Go to **Logs** tab
4. Look for errors

**Common Issues:**
- ❌ Service is suspended (free tier limit reached)
- ❌ Build failed
- ❌ Database connection error
- ❌ Environment variables missing

---

## 📋 Backend Environment Variables Checklist

Make sure your Render backend has these environment variables:

```bash
DATABASE_URL=postgresql://health_predictor_user:WtIo4HLKi9AEveEmlMFYONE3dxWJhfOd@dpg-d3hu2c1gv73c73e0l170-a.oregon-postgres.render.com/health_predictor

GROQ_API_KEY=your_groq_api_key

CORS_ORIGINS=https://health-symptom-predictor.netlify.app,https://*.netlify.app

JWT_SECRET_KEY=your_secret_key

GOOGLE_API_KEY=your_google_api_key (if using Gemini)
```

---

## 🧪 Quick Test After Fix

```powershell
# 1. Test backend health
$backendUrl = "https://YOUR-ACTUAL-URL.onrender.com"
Invoke-RestMethod -Uri "$backendUrl/api/health"

# 2. Test backend login
$body = @{
    username = "kumarbhanu818@gmail.com"
    password = "your_password"
}
Invoke-RestMethod -Uri "$backendUrl/api/auth/login" -Method POST -Body $body -ContentType "application/x-www-form-urlencoded"

# 3. If both work, your backend is good!
```

---

## 🎯 What to Tell Me

Please provide:

1. **Your Render backend URL** (from Render dashboard)
2. **Backend status** (Running, Sleeping, Failed?)
3. **Any error messages** from Render logs

Then I can update all the configuration files with the correct URL!

---

## 💡 Alternative: Deploy New Backend

If your backend service doesn't exist or is deleted:

### Quick Backend Deployment to Render

1. Go to: https://dashboard.render.com/
2. Click: **New +** → **Web Service**
3. Connect your GitHub repo: `bhanukumardev/health-symptom-predictor`
4. Configure:
   - **Name**: `health-symptom-predictor-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables (listed above)
6. Click: **Create Web Service**
7. Wait 5-10 minutes for deployment
8. Copy the URL and update frontend config

---

## 📞 Need Help?

Send me:
1. Your Render backend URL
2. Screenshot of Render dashboard showing backend service
3. Any error messages

I'll fix it immediately!

---

**Status**: ⏳ Waiting for your backend URL  
**Priority**: 🔴 HIGH - Site is down
