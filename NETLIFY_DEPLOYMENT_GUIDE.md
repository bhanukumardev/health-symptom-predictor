# 🚀 Deploy Frontend to Netlify

## ✅ Prerequisites Complete
- ✅ Backend deployed to Render: https://health-symptom-predictor.onrender.com
- ✅ Database initialized with admin user
- ✅ Admin credentials working: kumarbhanu818@gmail.com / Bhanu123@
- ✅ Admin dashboard tested and working locally
- ✅ All features tested: predictions, chat, history, profile, admin panel

## 🎯 Deployment Steps

### Step 1: Commit and Push All Changes

First, make sure all your latest changes are committed:

```powershell
cd "C:\Projects\AI Project\health-symptom-predictor"
git add .
git commit -m "feat: Complete admin dashboard with deployed backend integration"
git push
```

### Step 2: Deploy to Netlify

#### Option A: Using Netlify Dashboard (Recommended)

1. **Go to Netlify:**
   - Visit: https://app.netlify.com
   - Sign in with your GitHub account

2. **Import Project:**
   - Click **"Add new site"** → **"Import an existing project"**
   - Choose **"Deploy with GitHub"**
   - Authorize Netlify to access your GitHub
   - Select repository: **`bhanukumardev/health-symptom-predictor`**

3. **Configure Build Settings:**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

4. **Add Environment Variable:**
   - Click **"Add environment variables"**
   - Add:
     ```
     Key: VITE_API_URL
     Value: https://health-symptom-predictor.onrender.com
     ```

5. **Deploy:**
   - Click **"Deploy site"**
   - Wait 2-3 minutes for build to complete
   - You'll get a URL like: `https://random-name-12345.netlify.app`

6. **Optional: Custom Domain:**
   - Click **"Domain settings"**
   - Click **"Options"** → **"Edit site name"**
   - Change to: `health-symptom-predictor` (if available)
   - Final URL: `https://health-symptom-predictor.netlify.app`

#### Option B: Using Netlify CLI

```powershell
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Navigate to frontend
cd "C:\Projects\AI Project\health-symptom-predictor\frontend"

# Build the project
npm run build

# Deploy
netlify deploy --prod
```

### Step 3: Update CORS Settings on Render

After deployment, you'll have a Netlify URL. Update your backend CORS settings:

1. **Go to Render Dashboard:**
   - Visit: https://dashboard.render.com
   - Select: **health-symptom-predictor** service

2. **Update Environment Variables:**
   - Click **"Environment"** tab
   - Find **`ALLOWED_ORIGINS`**
   - Update to include your Netlify URL:
     ```
     http://localhost:3000,http://localhost:5173,https://health-symptom-predictor.onrender.com,https://YOUR-NETLIFY-URL.netlify.app
     ```
   - Click **"Save Changes"**
   - Wait 2-3 minutes for auto-redeploy

### Step 4: Test Your Deployed Application

1. **Visit your Netlify URL**
2. **Test all features:**
   - ✅ User registration
   - ✅ User login
   - ✅ Symptom prediction with AI recommendations
   - ✅ Chat assistant
   - ✅ History viewing
   - ✅ Profile editing
   - ✅ Language switching (English/Hindi)

3. **Test Admin Access:**
   - Login with: `kumarbhanu818@gmail.com` / `Bhanu123@`
   - Verify Admin button appears
   - Test admin dashboard features
   - Check user management
   - View predictions and feedback

## 📝 Deployment Configuration Files

Your project already has these files configured:

### frontend/vite.config.ts
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  }
})
```

### frontend/.env
```
VITE_API_URL=https://health-symptom-predictor.onrender.com
```

## 🎯 Expected Results

After deployment, your application will be:
- ✅ **Accessible globally** via Netlify URL
- ✅ **Fast and reliable** with Netlify CDN
- ✅ **Secure** with HTTPS enabled
- ✅ **Auto-deployed** on every git push to main branch
- ✅ **Free hosting** on Netlify's generous free tier

## 🔍 Troubleshooting

### If Frontend Can't Connect to Backend
- Check CORS settings include Netlify URL
- Verify `VITE_API_URL` in Netlify environment variables
- Check browser console for CORS errors

### If Build Fails
- Check Node.js version (should be 18+)
- Verify all dependencies in package.json
- Check build logs in Netlify dashboard

### If Pages Show 404
- Verify publish directory is `frontend/dist`
- Check if `_redirects` file exists in public folder
- Ensure base directory is set to `frontend`

## 🎊 Post-Deployment Checklist

- [ ] Frontend deployed successfully
- [ ] Backend CORS updated with Netlify URL
- [ ] Admin login works on production
- [ ] All features tested on live site
- [ ] Mobile responsiveness checked
- [ ] Both languages (English/Hindi) working
- [ ] AI features (predictions, chat) functional
- [ ] Admin dashboard accessible

## 🚀 Next Steps After Deployment

1. **Share your app!** Your health symptom predictor is live
2. **Monitor usage** via admin dashboard
3. **Collect feedback** from users
4. **Add more diseases** to the database via admin panel
5. **Consider custom domain** for professional look

---

**Ready to deploy? Follow the steps above!** 🎉

Your application stack:
- **Frontend**: Netlify (React + Vite)
- **Backend**: Render (FastAPI + Python)
- **Database**: PostgreSQL (Render)
- **AI**: Groq LLM (llama-3.3-70b-versatile)
- **ML**: scikit-learn disease prediction model

All services are on free tiers! 🎊
