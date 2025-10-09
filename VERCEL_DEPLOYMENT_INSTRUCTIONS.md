# Vercel Deployment Guide - Health Symptom Predictor

## 📋 Overview

This guide will help you deploy the Health Symptom Predictor to Vercel with the latest version from GitHub.

## 🏗️ Architecture

- **Frontend**: Deployed on Vercel (React + Vite)
- **Backend**: Already deployed on Render (FastAPI + Python)
- **Database**: Supabase PostgreSQL (Cloud)

## 🚀 Quick Deployment Steps

### Option 1: Vercel CLI (Automated)

1. **Install Vercel CLI** (if not already installed):
   ```powershell
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```powershell
   vercel login
   ```

3. **Deploy from Frontend Directory**:
   ```powershell
   cd frontend
   vercel --prod
   ```

### Option 2: Vercel Dashboard (Recommended for First Time)

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard

2. **Import Git Repository**:
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Choose: `bhanukumardev/health-symptom-predictor`
   - Click "Import"

3. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables**:
   Add the following environment variable:
   ```
   VITE_API_URL=https://health-symptom-predictor.onrender.com
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete (2-3 minutes)

## 🔧 Current Configuration

### Frontend (vercel.json)
```json
{
  "buildCommand": "npm install && npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "env": {
    "VITE_API_URL": "https://health-symptom-predictor.onrender.com"
  }
}
```

### Backend API
- URL: `https://health-symptom-predictor.onrender.com`
- Platform: Render
- Status: Active ✅

### Database
- Provider: Supabase
- Type: PostgreSQL
- Status: Active ✅

## 📍 Expected URLs After Deployment

- **Production Frontend**: `https://health-symptom-predictor-[random].vercel.app`
- **Backend API**: `https://health-symptom-predictor.onrender.com`
- **Custom Domain**: (Optional) Configure in Vercel settings

## ✅ Post-Deployment Checklist

After deployment, verify:

1. **Frontend Loads**: Visit your Vercel URL
2. **API Connection**: Open browser console, check for no CORS errors
3. **Registration**: Create a new account
4. **Login**: Sign in successfully
5. **Predictions**: Make a health prediction
6. **Chat**: Test AI chatbot
7. **History**: View prediction history
8. **Profile**: Check user profile

## 🔐 Environment Variables

### Required Variables (Already Configured)

**Frontend (Vercel)**:
- `VITE_API_URL`: Backend API URL

**Backend (Render)**:
- `DATABASE_URL`: Supabase PostgreSQL connection
- `SECRET_KEY`: JWT secret
- `GROQ_API_KEY`: AI chatbot API key
- `ALLOWED_ORIGINS`: CORS configuration
- `ENVIRONMENT`: production
- `DEBUG`: False

## 🔄 Auto-Deployment

Vercel is configured for automatic deployments:
- **Main Branch**: Auto-deploys to production
- **Other Branches**: Auto-deploys to preview URLs
- **Pull Requests**: Creates preview deployments

Every push to `main` branch will trigger a new deployment automatically.

## 🛠️ Troubleshooting

### Issue: Build Fails

**Solution**:
1. Check build logs in Vercel dashboard
2. Verify all dependencies in `package.json`
3. Ensure Node.js version compatibility

### Issue: API Connection Errors

**Solution**:
1. Verify `VITE_API_URL` environment variable
2. Check backend is running on Render
3. Verify CORS settings on backend include Vercel URL

### Issue: Environment Variables Not Working

**Solution**:
1. Re-deploy after adding environment variables
2. Check variable names match exactly (case-sensitive)
3. Verify variables are set in correct environment (Production)

## 📝 Manual Deployment Commands

### Deploy to Production
```powershell
cd frontend
vercel --prod
```

### Deploy to Preview
```powershell
cd frontend
vercel
```

### Check Deployment Status
```powershell
vercel ls
```

### View Logs
```powershell
vercel logs [deployment-url]
```

## 🌐 Custom Domain Setup (Optional)

1. Go to Vercel Dashboard → Your Project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Configure DNS records as shown
5. Wait for DNS propagation (5-60 minutes)

## 📊 Performance Optimization

Vercel automatically provides:
- ✅ CDN caching
- ✅ Edge network delivery
- ✅ Automatic SSL/HTTPS
- ✅ Gzip compression
- ✅ HTTP/2 support
- ✅ Image optimization

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repository**: https://github.com/bhanukumardev/health-symptom-predictor
- **Backend (Render)**: https://dashboard.render.com
- **Database (Supabase)**: https://app.supabase.com

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test backend API directly
4. Review browser console for errors

---

**Last Updated**: October 9, 2025
**Commit**: Latest push to main branch
**Status**: Ready for deployment ✅
