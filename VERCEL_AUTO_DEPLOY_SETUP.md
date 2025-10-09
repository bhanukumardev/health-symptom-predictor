# Vercel Auto-Deploy Setup (Production)

## ✅ Steps to Ensure Every GitHub Commit is Live

1. **Vercel Project Settings**
   - Go to your Vercel dashboard: https://vercel.com/dashboard
   - Select your project: `health-symptom-predictor`
   - In "General" settings:
     - **Root Directory**: Set to `frontend`
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

2. **Environment Variables**
   - In "Environment Variables" (Production):
     - Add: `VITE_API_URL=https://health-symptom-predictor.onrender.com`

3. **GitHub Integration**
   - Confirm your Vercel project is linked to your GitHub repo: `bhanukumardev/health-symptom-predictor`
   - In "Git Integration" settings:
     - **Production Branch**: `main`
     - **Auto Deploy**: Enabled

4. **How It Works**
   - Every push to `main` triggers a new Vercel deployment
   - No manual steps required—just `git push origin main`
   - Vercel will build and deploy the latest frontend code
   - The frontend will connect to your backend API on Render

5. **Testing**
   - After pushing to GitHub, check your Vercel production URL:
     - `https://health-symptom-predictor.vercel.app` (or your custom domain)
   - Confirm new changes are live

6. **Troubleshooting**
   - If deployment fails, check Vercel build logs
   - If API connection fails, verify `VITE_API_URL` is set correctly
   - If CORS errors, ensure backend allows Vercel domain in CORS config

---

**You are now fully configured for instant live deployment after every commit!**
