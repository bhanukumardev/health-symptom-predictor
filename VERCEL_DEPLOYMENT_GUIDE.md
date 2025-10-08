# 🚀 Vercel Deployment Guide - Health Symptom Predictor

## 📋 Overview

This guide will walk you through deploying both the **Frontend** and **Backend** of the Health Symptom Predictor application on Vercel.

---

## 🎯 Deployment Strategy

- **Frontend**: Deploy as a Vite/React application
- **Backend**: Deploy as a Python FastAPI serverless function
- **Database**: Use existing Supabase PostgreSQL (already configured)

---

## 📦 Prerequisites

Before you begin, ensure you have:

1. ✅ **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. ✅ **GitHub Account** - Your code should be in a GitHub repository
3. ✅ **Supabase Database** - Already configured (postgres.txhohvmugqptewlvuhfn...)
4. ✅ **Groq API Key** - For AI chatbot functionality
5. ✅ **Git CLI** - Installed on your machine

---

## 🔐 Required Environment Variables

### Frontend Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | Your Backend Vercel URL | API endpoint (e.g., https://your-backend.vercel.app) |

### Backend Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | `postgresql://postgres.txhohvmugqptewlvuhfn:Bhanu123%40@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require` | Supabase PostgreSQL connection string |
| `SECRET_KEY` | Generate strong random key | JWT secret (use: `openssl rand -hex 32`) |
| `GROQ_API_KEY` | Your Groq API key | AI chatbot API key |
| `ALGORITHM` | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | Token expiration time |
| `ENVIRONMENT` | `production` | Environment mode |
| `DEBUG` | `False` | Debug mode (False for production) |

---

## 📝 Step-by-Step Deployment

### Part 1: Deploy Backend to Vercel

#### Step 1: Install Vercel CLI (Optional but Recommended)

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Navigate to Backend Directory

```bash
cd backend
```

#### Step 4: Deploy Backend

```bash
vercel --prod
```

**Follow the prompts:**
- Link to existing project? → **No**
- Project name? → **health-symptom-predictor-backend**
- Directory? → **./backend** (or just press Enter if already in backend)
- Want to modify settings? → **No**

#### Step 5: Add Environment Variables to Backend

Go to your Vercel dashboard:
1. Open your backend project
2. Go to **Settings** → **Environment Variables**
3. Add ALL the backend environment variables listed above

**IMPORTANT**: Add these variables:
```
DATABASE_URL=postgresql://postgres.txhohvmugqptewlvuhfn:Bhanu123%40@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
SECRET_KEY=<generate-strong-random-key>
GROQ_API_KEY=<your-groq-api-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=production
DEBUG=False
```

#### Step 6: Redeploy Backend

After adding environment variables:
```bash
vercel --prod
```

**Save your backend URL**: Something like `https://health-symptom-predictor-backend.vercel.app`

---

### Part 2: Deploy Frontend to Vercel

#### Step 1: Navigate to Frontend Directory

```bash
cd ../frontend
```

#### Step 2: Update Environment Variable

Create `.env.production` file:
```env
VITE_API_URL=https://your-backend-url.vercel.app
```

#### Step 3: Deploy Frontend

```bash
vercel --prod
```

**Follow the prompts:**
- Link to existing project? → **No**
- Project name? → **health-symptom-predictor-frontend**
- Directory? → **./frontend** (or just press Enter if already in frontend)
- Want to modify settings? → **No**

#### Step 4: Add Environment Variables to Frontend

Go to your Vercel dashboard:
1. Open your frontend project
2. Go to **Settings** → **Environment Variables**
3. Add the frontend environment variable:

```
VITE_API_URL=https://your-backend-url.vercel.app
```

#### Step 5: Redeploy Frontend

```bash
vercel --prod
```

---

## 🌐 Alternative: Deploy via Vercel Dashboard

### Method 2: Deploy from GitHub (Recommended for CI/CD)

#### Step 1: Push Code to GitHub

```bash
cd "c:\Projects\AI Project\health-symptom-predictor"
git add -A
git commit -m "Add Vercel deployment configuration"
git push origin main
```

#### Step 2: Deploy Backend

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Select **Import Git Repository**
4. Choose your GitHub repository: `health-symptom-predictor`
5. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: Leave empty (Python projects don't need build)
   - **Output Directory**: Leave empty
6. Add **ALL Backend Environment Variables** (see list above)
7. Click **Deploy**

#### Step 3: Deploy Frontend

1. Click **"Add New Project"** again
2. Select **Import Git Repository**
3. Choose your GitHub repository: `health-symptom-predictor`
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Add **Frontend Environment Variable**:
   ```
   VITE_API_URL=<your-backend-vercel-url>
   ```
6. Click **Deploy**

---

## 🔧 Post-Deployment Configuration

### 1. Update CORS in Backend

After deployment, update `backend/app/main.py` to include your Vercel frontend URL:

```python
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://health-symptom-predictor-frontend.vercel.app",  # Add your Vercel URL
    "https://your-custom-domain.com",  # If you have a custom domain
]
```

### 2. Test Your Deployment

Visit your URLs:
- **Frontend**: https://your-frontend-url.vercel.app
- **Backend API**: https://your-backend-url.vercel.app/docs
- **Health Check**: https://your-backend-url.vercel.app/health

### 3. Configure Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project
2. Go to **Settings** → **Domains**
3. Add your custom domain
4. Update DNS records as instructed by Vercel

---

## 📊 Build Logs & Debugging

### View Build Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click on **Deployments**
4. Click on any deployment to see logs

### Common Issues & Solutions

#### Issue 1: Build Failed - Missing Dependencies

**Solution**: Check `requirements.txt` (backend) or `package.json` (frontend)

```bash
# Backend
cd backend
pip freeze > requirements.txt

# Frontend
cd frontend
npm install
```

#### Issue 2: Environment Variables Not Working

**Solution**: 
- Make sure variables are added in Vercel Dashboard
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

#### Issue 3: CORS Error

**Solution**: Update `backend/app/main.py` CORS origins to include your Vercel frontend URL

#### Issue 4: Database Connection Error

**Solution**: Verify `DATABASE_URL` is correct:
```
postgresql://postgres.txhohvmugqptewlvuhfn:Bhanu123%40@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
```

#### Issue 5: API Routes 404

**Solution**: Check `vercel.json` routing configuration is correct

---

## 🔄 Continuous Deployment

Once deployed via GitHub:
- **Auto-deploy on push**: Every push to `main` branch auto-deploys
- **Preview deployments**: Pull requests create preview deployments
- **Rollback**: Easy rollback to previous deployments in Vercel Dashboard

---

## 📱 Monitoring & Analytics

### Enable Vercel Analytics

1. Go to your project in Vercel Dashboard
2. Navigate to **Analytics** tab
3. Enable **Web Analytics**
4. Add analytics script to your frontend (optional)

### Monitor Performance

- **Real User Monitoring**: Track actual user performance
- **Build Times**: Monitor build duration
- **Function Logs**: View serverless function logs
- **Error Tracking**: Track production errors

---

## 🎯 Production Checklist

Before going live, ensure:

- [ ] All environment variables are set correctly
- [ ] CORS is configured with production URLs
- [ ] Database connection is working
- [ ] API endpoints are accessible
- [ ] Frontend can connect to backend
- [ ] Authentication (JWT) is working
- [ ] AI chatbot (Groq) is functional
- [ ] SSL/HTTPS is enabled (automatic on Vercel)
- [ ] Error handling is in place
- [ ] Logging is configured
- [ ] Backup strategy for database
- [ ] Custom domain configured (if applicable)

---

## 🆘 Support & Resources

### Vercel Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Deploy Python](https://vercel.com/docs/functions/serverless-functions/runtimes/python)
- [Deploy Vite](https://vercel.com/docs/frameworks/vite)

### Troubleshooting
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/vercel)

---

## 📧 Need Help?

If you encounter issues:
1. Check build logs in Vercel Dashboard
2. Verify all environment variables
3. Test API endpoints individually
4. Check browser console for frontend errors
5. Open an issue on GitHub repository

---

## 🎉 Success!

Once deployed, your application will be live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-api.vercel.app`

**Enjoy your deployed Health Symptom Predictor!** 🏥✨
