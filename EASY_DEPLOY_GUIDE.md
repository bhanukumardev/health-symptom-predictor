# 🚀 Easy Deployment Guide - Netlify + Railway (100% Free)

## Overview
This guide will help you deploy your Health Symptom Predictor app using:
- **Netlify** - Frontend (React) - Free Forever
- **Railway** - Backend (FastAPI) + PostgreSQL - $5 credit/month (renews monthly)

**Total Cost: $0** (Both are completely free with no credit card required)

---

## 📋 Prerequisites

✅ GitHub repository pushed (already done!)
✅ Netlify account (sign up with GitHub)
✅ Railway account (sign up with GitHub)
✅ **NEW Groq API key** (rotate the old exposed key)

---

## Part 1: Deploy Backend to Railway 🚂

### Step 1: Get a Fresh Groq API Key
1. Go to https://console.groq.com/keys
2. **Delete the old key** (it was exposed in git history)
3. **Create new key** → Copy it

### Step 2: Create Railway Project
1. Go to https://railway.app
2. Click **"Sign up with GitHub"** (no credit card needed)
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose `bhanukumardev/health-symptom-predictor`
6. Railway will detect the `railway.json` and `Procfile`

### Step 3: Add PostgreSQL Database
1. In your Railway project, click **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway will automatically create a database and provide the `DATABASE_URL`
3. The connection string is automatically available as `${{Postgres.DATABASE_URL}}`

### Step 4: Configure Environment Variables
In Railway dashboard, go to your service → **"Variables"** tab:

```bash
# Required Environment Variables
DATABASE_URL=${{Postgres.DATABASE_URL}}
GROQ_API_KEY=gsk_your_new_groq_api_key_here
SECRET_KEY=your-super-secret-jwt-key-change-this-in-production-min-32-chars
ALLOWED_ORIGINS=https://your-app-name.netlify.app
PORT=8000
```

**Important:** 
- Replace `gsk_your_new_groq_api_key_here` with your NEW Groq API key
- Generate a strong SECRET_KEY (at least 32 characters)
- You'll update `ALLOWED_ORIGINS` after deploying frontend (Step 8)

### Step 5: Deploy Backend
1. Railway will automatically deploy after you add the variables
2. Wait for deployment to complete (2-3 minutes)
3. Click on your service → **"Settings"** → Copy the **"Public Domain"**
4. Your backend URL will look like: `https://your-backend.up.railway.app`
5. **Save this URL** - you'll need it for the frontend!

### Step 6: Verify Backend Deployment
Test your backend:
```bash
# Replace with your actual Railway URL
curl https://your-backend.up.railway.app/api/chat/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "chat",
  "llm_model": "llama-3.3-70b-versatile",
  "api_key_configured": true
}
```

✅ **Backend deployed successfully!**

---

## Part 2: Deploy Frontend to Netlify 🌐

### Step 7: Create Netlify Site
1. Go to https://netlify.com
2. Click **"Sign up with GitHub"** (no credit card needed)
3. Click **"Add new site"** → **"Import an existing project"**
4. Select **"Deploy with GitHub"**
5. Choose `bhanukumardev/health-symptom-predictor`

### Step 8: Configure Build Settings
Netlify will detect `netlify.toml` automatically, but verify:

- **Base directory:** `frontend`
- **Build command:** `npm run build`
- **Publish directory:** `frontend/dist`
- **Build settings:** Detected from `netlify.toml` ✅

### Step 9: Add Environment Variable
Before deploying, add the backend URL:

1. In Netlify, go to **"Site configuration"** → **"Environment variables"**
2. Click **"Add a variable"** → **"Add a single variable"**
3. Add:
   ```
   Key: VITE_API_URL
   Value: https://your-backend.up.railway.app
   ```
   (Use the Railway backend URL from Step 5)

### Step 10: Deploy Frontend
1. Click **"Deploy site"**
2. Wait for deployment (2-3 minutes)
3. Netlify will give you a URL like: `https://amazing-app-123456.netlify.app`
4. You can customize this later in **"Site settings"** → **"Domain management"**

### Step 11: Update Backend CORS
Your frontend is now deployed, but the backend needs to allow requests from it:

1. Go back to **Railway** dashboard
2. Open your backend service → **"Variables"**
3. Update `ALLOWED_ORIGINS`:
   ```
   ALLOWED_ORIGINS=https://your-app-name.netlify.app,http://localhost:3000
   ```
   (Replace with your actual Netlify URL, keep localhost for local development)
4. Railway will automatically redeploy

✅ **Frontend deployed successfully!**

---

## Part 3: Initialize Database 🗄️

### Step 12: Run Database Migrations
You need to create tables in your Railway PostgreSQL database:

**Option A: Using Railway CLI (Recommended)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run database initialization
railway run python backend/init_db.py
railway run python backend/seed_data.py
```

**Option B: Manual via Railway Dashboard**
1. Go to Railway → Your PostgreSQL database
2. Click **"Connect"** → Copy the connection string
3. Run locally with Railway DB:
   ```bash
   cd backend
   export DATABASE_URL="postgresql://postgres:..."  # Paste Railway DB URL
   python init_db.py
   python seed_data.py
   ```

### Step 13: Create Admin User
Create an admin account:
```bash
railway run python backend/create_admin.py
```

Or run locally pointing to Railway DB:
```bash
cd backend
export DATABASE_URL="postgresql://postgres:..."
python create_admin.py
```

---

## 🎉 Deployment Complete!

### Your Live URLs:
- **Frontend:** https://your-app-name.netlify.app
- **Backend API:** https://your-backend.up.railway.app
- **API Docs:** https://your-backend.up.railway.app/docs

### Test Your Deployed App:
1. Visit your Netlify URL
2. Register a new account
3. Try the symptom prediction
4. Test the AI chatbot
5. Check your medical history

---

## 📊 Deployment Summary

| Service | Platform | Cost | URL |
|---------|----------|------|-----|
| Frontend | Netlify | Free Forever | https://your-app.netlify.app |
| Backend | Railway | $5 credit/month (renews) | https://your-app.railway.app |
| Database | Railway PostgreSQL | Included in Railway | Internal connection |
| Total Monthly Cost | | **$0.00** | |

---

## 🔧 Configuration Files Explained

### `netlify.toml`
Tells Netlify how to build the React frontend:
- Build in `frontend/` directory
- Run `npm run build`
- Publish the `dist` folder
- Configure SPA redirects for React Router

### `railway.json`
Tells Railway how to deploy the FastAPI backend:
- Install dependencies from `backend/requirements.txt`
- Start with `uvicorn` on Railway's assigned `$PORT`
- Auto-restart on failure

### `Procfile`
Alternative Railway configuration (simpler format):
- Web process starts FastAPI server
- Binds to Railway's `$PORT`

### `nixpacks.toml`
Railway's build system configuration:
- Specifies Python 3.10 and PostgreSQL
- Defines build phases and start command

---

## 🔒 Security Checklist

✅ **API Keys:**
- ✅ Groq API key only in Railway environment variables (never in code)
- ✅ JWT SECRET_KEY set in Railway
- ✅ No secrets in git repository

✅ **CORS:**
- ✅ Backend only accepts requests from your Netlify domain
- ✅ Localhost allowed for development

✅ **Database:**
- ✅ PostgreSQL hosted on Railway (secure, encrypted)
- ✅ Connection string never exposed in frontend

✅ **HTTPS:**
- ✅ Both Netlify and Railway provide free SSL certificates
- ✅ All connections encrypted

---

## 🐛 Troubleshooting

### Frontend can't connect to backend
**Problem:** CORS error or connection refused

**Solutions:**
1. Check `VITE_API_URL` in Netlify environment variables
2. Verify Railway backend is running (check deployment logs)
3. Confirm `ALLOWED_ORIGINS` in Railway includes your Netlify URL
4. Make sure URLs don't have trailing slashes

### Backend deployment fails
**Problem:** Railway can't start the app

**Solutions:**
1. Check Railway deployment logs for errors
2. Verify `requirements.txt` is in `backend/` folder
3. Confirm all environment variables are set
4. Check that Python version is compatible (we use Python 3.10+)

### Database connection errors
**Problem:** "Could not connect to database"

**Solutions:**
1. Verify PostgreSQL database is running in Railway
2. Check `DATABASE_URL` is set correctly
3. Make sure database tables are initialized (run `init_db.py`)
4. Confirm database hasn't been stopped (Railway free tier limitation)

### API key not working
**Problem:** "GROQ_API_KEY is not configured"

**Solutions:**
1. Get a NEW Groq API key (old one was exposed)
2. Set `GROQ_API_KEY` in Railway environment variables
3. Redeploy backend after adding the key
4. Test with: `curl https://your-backend.railway.app/api/chat/health`

---

## 🚀 Next Steps

### Custom Domain (Optional, Free)
**Netlify:**
1. Go to **"Domain settings"**
2. Add your custom domain
3. Configure DNS records
4. Get free SSL certificate automatically

**Railway:**
1. Go to service **"Settings"** → **"Domains"**
2. Add custom domain
3. Configure DNS CNAME record
4. Free SSL included

### Monitoring & Analytics
**Railway:**
- Built-in metrics (CPU, memory, network)
- Deployment logs
- Database metrics

**Netlify:**
- Build logs
- Deploy previews
- Analytics (free tier: 1,000 views/month)

### CI/CD (Already Set Up!)
✅ **Automatic Deployments:**
- Push to GitHub `main` branch → Railway auto-deploys backend
- Push to GitHub `main` branch → Netlify auto-deploys frontend
- No manual deployment needed!

### Scaling (When You Need It)
**Railway:**
- Start with hobby plan ($5 credit = ~500 hours/month)
- Upgrade to pro plan if you need more resources
- Vertical scaling available (more CPU/RAM)

**Netlify:**
- Free tier: Unlimited bandwidth & builds
- Pro plan: $19/month for advanced features
- Handles 99.9% of traffic automatically

---

## 📈 Usage Limits (Free Tier)

### Netlify Free Tier
- ✅ 100 GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Unlimited sites
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Instant rollbacks

### Railway Free Tier ($5 credit/month)
- ✅ ~500 execution hours/month
- ✅ 100 GB bandwidth/month
- ✅ 512 MB RAM per service
- ✅ 1 GB disk per service
- ✅ Free PostgreSQL database (500 MB)
- ⚠️ Apps sleep after 1 hour inactivity (cold start ~5 seconds)

**Your app is well within these limits!** 🎉

---

## 💡 Pro Tips

### 1. Environment-Specific Config
Create `.env.production` in frontend for production settings:
```env
VITE_API_URL=https://your-backend.up.railway.app
```

### 2. Enable Deploy Previews
Both Netlify and Railway support deploy previews:
- Create a PR on GitHub
- Automatic preview deployment
- Test before merging to main

### 3. Monitor Your App
Set up uptime monitoring:
- [UptimeRobot](https://uptimerobot.com) (free)
- [Pingdom](https://pingdom.com) (free tier)
- Checks your site every 5 minutes

### 4. Database Backups
Railway PostgreSQL has daily backups:
- Go to database → "Backups"
- Download backup anytime
- Restore to previous state

---

## 📞 Support & Help

### Railway Support
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

### Netlify Support
- Docs: https://docs.netlify.com
- Community: https://answers.netlify.com
- Status: https://www.netlifystatus.com

### Your Project
- GitHub Issues: https://github.com/bhanukumardev/health-symptom-predictor/issues
- API Docs: https://your-backend.railway.app/docs

---

## ✅ Final Checklist

Before you consider deployment complete:

- [ ] Backend deployed on Railway
- [ ] PostgreSQL database connected
- [ ] Environment variables set (GROQ_API_KEY, SECRET_KEY, DATABASE_URL)
- [ ] Database tables initialized (ran `init_db.py`)
- [ ] Admin user created
- [ ] Frontend deployed on Netlify
- [ ] VITE_API_URL set in Netlify
- [ ] ALLOWED_ORIGINS updated in Railway backend
- [ ] Frontend can connect to backend
- [ ] Chatbot works (Groq API key configured)
- [ ] User registration works
- [ ] Symptom prediction works
- [ ] Medical history saves correctly
- [ ] Admin dashboard accessible

---

**Congratulations! Your Health Symptom Predictor is now live! 🎉**

Share your app URL with friends and start helping people with AI-powered health predictions! 🏥✨

---

**Made with ❤️ by Bhanu Kumar Dev**  
*Last Updated: January 6, 2025*
