# 🚀 Deploy to Render (100% Free - No Credit Card Required)
#### Step 5: Wait for Deployment
- First deployment takes ~5-10 minutes
- Watch the logs for progress
- Look for: "Application startup complete" ✅
- Once live, you'll get a URL like: `https://health-symptom-predictor-backend.onrender.com`

#### Step 6: Initialize Databasehy Render?
- ✅ **Completely FREE** - No credit card, no billing, no trials
- ✅ **Free PostgreSQL** database (90 days, auto-renews)
- ✅ **750 hours/month** runtime (enough for most apps)
- ✅ **Auto-deploy** from GitHub on every push
- ✅ **Free SSL** certificates
- ⚠️ Apps sleep after 15 mins inactivity (30-second cold start)

---

## 📋 Quick Deploy Steps

### Part 1: Deploy Backend (FastAPI + PostgreSQL)

#### Step 1: Sign Up for Render
1. Go to https://render.com
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (easiest)
4. **No credit card required!** ✅

#### Step 2: Deploy Backend
1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `bhanukumardev/health-symptom-predictor`
3. Configure the service:
   - **Name:** `health-symptom-predictor-backend`
   - **Region:** Oregon (US West)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Docker
   - **Instance Type:** Free

Render will auto-detect the Dockerfile in the `backend/` directory ✅

#### Step 3: Add PostgreSQL Database
1. In Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name:** `health-symptom-predictor-db`
   - **Database:** `health_predictor`
   - **Region:** Oregon (same as backend)
   - **Plan:** Free
3. Click **"Create Database"**
4. Once created, copy the **Internal Database URL**

#### Step 4: Link Database to Backend
1. Go to your backend service → **"Environment"**
2. Add environment variable:
   - Key: `DATABASE_URL`
   - Value: Paste the Internal Database URL from step 3
3. Add **GROQ_API_KEY**:
   - Key: `GROQ_API_KEY`
   - Value: `your_new_groq_api_key_here` (get fresh key from https://console.groq.com/keys)
4. Add **SECRET_KEY**:
   - Key: `SECRET_KEY`
   - Value: Generate a random 32+ character string
5. Add **ALLOWED_ORIGINS**:
   - Key: `ALLOWED_ORIGINS`
   - Value: `http://localhost:3000` (update later with Netlify URL)
6. Save - Render will auto-redeploy

#### Step 5: Wait for Deployment
- First deployment takes ~5-10 minutes
- Watch the logs for progress
- Once live, you'll get a URL like: `https://health-symptom-predictor-backend.onrender.com`

#### Step 5: Initialize Database
After backend is live, you need to create tables:

**Option A: Using Render Shell (Recommended)**
1. In Render dashboard → Your service → **"Shell"**
2. Run these commands:
   ```bash
   cd backend
   python init_db.py
   python seed_data.py
   python create_admin.py
   ```

**Option B: Locally with Render DB**
1. Get database URL from Render:
   - Go to database → **"Info"** → Copy **"External Database URL"**
2. Run locally:
   ```bash
   cd backend
   set DATABASE_URL=postgresql://postgres:...  # Paste Render DB URL
   python init_db.py
   python seed_data.py
   python create_admin.py
   ```

---

### Part 2: Deploy Frontend (Netlify - Already Configured!)

You already have `netlify.toml`, so frontend deployment is easy:

#### Step 1: Deploy to Netlify
1. Go to https://netlify.com
2. Sign up with GitHub (free, no card needed)
3. Click **"Add new site"** → **"Import from GitHub"**
4. Select `bhanukumardev/health-symptom-predictor`
5. Netlify auto-detects `netlify.toml` ✅
6. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: `https://health-symptom-predictor-backend.onrender.com` (your Render backend URL)
7. Click **"Deploy"**

#### Step 2: Update Backend CORS
After frontend deploys, you'll get a URL like: `https://health-symptom-predictor.netlify.app`

Update your backend on Render:
1. Go to backend service → **"Environment"**
2. Update `ALLOWED_ORIGINS`:
   ```
   https://health-symptom-predictor.netlify.app,http://localhost:3000
   ```
3. Save (auto-redeploys)

---

## 🎉 You're Live!

After deployment:
- **Frontend:** `https://your-app.netlify.app`
- **Backend:** `https://your-backend.onrender.com`
- **API Docs:** `https://your-backend.onrender.com/docs`

---

## ⚠️ Important Notes

### Free Tier Limitations (Render)
- ✅ **750 hours/month** (enough for 24/7 if you're the only project)
- ⚠️ **Sleeps after 15 minutes** of inactivity
  - First request after sleep takes ~30 seconds (cold start)
  - Subsequent requests are instant
  - **Tip:** Use a free uptime monitor (like UptimeRobot) to ping your app every 14 minutes to keep it awake
- ✅ **PostgreSQL free for 90 days**, then you need to:
  - Create a new database (takes 2 minutes)
  - Export and import your data
  - Or upgrade to paid ($7/month for persistent DB)

### Free Tier Limitations (Netlify)
- ✅ **100 GB bandwidth/month**
- ✅ **300 build minutes/month**
- ✅ **Unlimited** sites and deployments

---

## 🔧 Configuration Files Explained

### `render.yaml` (Backend)
Tells Render how to deploy your FastAPI backend:
- Installs dependencies from `backend/requirements.txt`
- Starts with `uvicorn` on Render's assigned port
- Auto-connects to PostgreSQL database
- Health check on `/api/chat/health`

### `netlify.toml` (Frontend - Already exists!)
Tells Netlify how to build your React frontend:
- Builds in `frontend/` directory
- Runs `npm run build`
- Publishes `dist` folder
- Configures SPA redirects

---

## 🐛 Troubleshooting

### Backend won't start
**Check logs in Render dashboard:**
- Go to service → **"Logs"** tab
- Look for errors in red

**Common issues:**
- Missing `GROQ_API_KEY` - Add it in Environment variables
- Database not connected - Check `DATABASE_URL` is auto-filled
- Port binding error - Use `$PORT` environment variable (already configured)

### Frontend can't connect to backend
1. Check `VITE_API_URL` in Netlify environment variables
2. Verify backend URL is correct (no trailing slash)
3. Check `ALLOWED_ORIGINS` in Render includes your Netlify URL
4. Make sure both services are deployed and running

### Database connection errors
1. Verify PostgreSQL database is created in Render
2. Check database status in Render dashboard
3. Ensure `DATABASE_URL` is properly linked to your service
4. Run database initialization scripts (init_db.py, seed_data.py)

### "Service Unavailable" or 503 errors
- Your app is probably sleeping (cold start)
- Wait 30 seconds and try again
- Consider using UptimeRobot to keep it awake

---

## 💡 Keep Your App Awake (Optional)

To avoid cold starts, use a free uptime monitor:

### UptimeRobot (Free Plan)
1. Sign up at https://uptimerobot.com (free forever)
2. Create a new monitor:
   - Monitor Type: **HTTP(s)**
   - URL: `https://your-backend.onrender.com/api/chat/health`
   - Monitoring Interval: **Every 5 minutes**
3. Your backend will stay awake 24/7! ✅

---

## 📊 Comparison: Railway vs Render

| Feature | Railway (Trial Expired) | Render (Free) |
|---------|------------------------|---------------|
| **Cost** | $5/month after trial | FREE forever |
| **Credit Card** | Required after trial | NOT required |
| **PostgreSQL** | Free 500MB | Free 90 days |
| **Runtime** | 500 hours/month | 750 hours/month |
| **Cold Starts** | 5 seconds | 30 seconds |
| **Auto-deploy** | ✅ Yes | ✅ Yes |
| **SSL** | ✅ Free | ✅ Free |

**Winner:** Render for truly free hosting! 🏆

---

## 🚀 Alternative: Fly.io (Also Free)

If you want another option:
- **Fly.io** offers $5 free credit/month (no card required)
- Similar to Railway but simpler
- Good PostgreSQL support
- Fast cold starts (~5 seconds)

Let me know if you want Fly.io configuration instead!

---

## ✅ Next Steps

1. **Sign up for Render** (2 minutes)
2. **Deploy using Blueprint** (5 minutes)
3. **Add GROQ_API_KEY** (1 minute)
4. **Initialize database** (2 minutes)
5. **Deploy frontend to Netlify** (3 minutes)
6. **Update CORS settings** (1 minute)

**Total time: ~15 minutes to go live!** 🎉

---

**Need help with any step? Let me know!** 🚀

---

**Made with ❤️ by Bhanu Kumar Dev**  
*Last Updated: January 6, 2025*
