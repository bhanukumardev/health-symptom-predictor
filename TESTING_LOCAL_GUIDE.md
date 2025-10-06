# 🧪 Testing Locally with Deployed Backend

## ✅ What's Running:

- **Frontend**: http://localhost:3000/ (Local - using Vite)
- **Backend**: https://health-symptom-predictor.onrender.com (Deployed on Render)
- **Database**: PostgreSQL on Render (Initialized with admin + sample data)

## ⚠️ IMPORTANT: Update CORS Settings on Render

Your frontend is now pointing to the deployed backend, but you need to allow localhost origins in CORS settings.

### Steps to Update CORS:

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click** on your `health-symptom-predictor` service
3. **Go to** "Environment" tab (left sidebar)
4. **Find** the `ALLOWED_ORIGINS` variable
5. **Update** it to include localhost:
   ```
   http://localhost:3000,http://localhost:5173,https://health-symptom-predictor.onrender.com
   ```
6. **Click** "Save Changes" (service will auto-redeploy - takes ~2 minutes)

## 🧪 Testing Checklist:

Once CORS is updated, test these features:

### 1. Registration & Login
- [ ] Register a new user
- [ ] Login with new user
- [ ] Login with admin (`admin@healthpredictor.com` / `admin123`)

### 2. Symptom Prediction
- [ ] Select symptoms from the list
- [ ] Enter additional details
- [ ] Get disease prediction with confidence score
- [ ] View AI-powered medicine recommendations
- [ ] Check personalized dosage based on profile

### 3. Bilingual Support
- [ ] Switch language to Hindi
- [ ] Check if UI translates
- [ ] Make prediction in Hindi
- [ ] Check medicine recommendations in Hindi

### 4. AI Chat Assistant
- [ ] Open chat panel
- [ ] Ask health-related questions
- [ ] Verify Groq AI responses
- [ ] Test in both English and Hindi

### 5. User Profile
- [ ] View profile
- [ ] Edit profile (age, weight, gender)
- [ ] Save changes
- [ ] Verify updated info affects dosage recommendations

### 6. Prediction History
- [ ] View past predictions
- [ ] Check history shows all details
- [ ] Verify timestamps

### 7. Admin Panel (login as admin)
- [ ] View dashboard statistics
- [ ] View all users
- [ ] View all predictions
- [ ] View all feedback
- [ ] Manage diseases

## 🐛 Troubleshooting:

### If you see CORS errors in browser console:

**Error**: `Access to fetch at 'https://health-symptom-predictor.onrender.com/...' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution**: 
1. Make sure you updated `ALLOWED_ORIGINS` on Render
2. Wait 2-3 minutes for Render to redeploy
3. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)

### If backend is slow (first request):

**Issue**: Render free tier services sleep after 15 minutes of inactivity

**Solution**: 
- First request may take 30-60 seconds to wake up the service
- Subsequent requests will be fast
- This is normal for free tier

### If predictions fail:

1. Check browser console for errors
2. Verify `GROQ_API_KEY` is set in Render environment variables
3. Check Render logs for API errors

### If translations don't work:

- Make sure translation files are loaded
- Check browser console for loading errors
- Try hard refresh

## 📊 What to Look For:

### Good Signs:
✅ No CORS errors in console
✅ Login works smoothly
✅ Predictions return results in 2-5 seconds
✅ Medicine recommendations appear with dosages
✅ Language switching works
✅ Chat responses from Groq AI
✅ Profile updates save successfully

### Issues to Report:
❌ CORS errors persisting after 5 minutes
❌ Predictions timing out
❌ Medicine recommendations not appearing
❌ Translation not switching
❌ Chat not responding

## 🚀 After Testing:

If everything works locally:
1. We can deploy to Netlify
2. Add Netlify URL to CORS settings
3. Your app will be live!

## 📝 Notes:

- Frontend `.env` now points to: `https://health-symptom-predictor.onrender.com`
- To switch back to local backend: Change `.env` to `http://localhost:8000`
- Remember to commit `.env` changes before deploying

---

**Open http://localhost:3000 in your browser and start testing!** 🧪
