# ⚠️ UPDATE CORS SETTINGS NOW

## Why You're Getting "Incorrect email or password" Error

The login is failing because of **CORS (Cross-Origin Resource Sharing)** restrictions. Your frontend at `localhost:3000` is not allowed to make requests to your backend at `health-symptom-predictor.onrender.com`.

## ✅ Quick Fix - Update CORS on Render

### Step 1: Go to Render Dashboard
1. Open: https://dashboard.render.com
2. Find your service: **health-symptom-predictor**
3. Click on it

### Step 2: Update Environment Variables
1. Click on **"Environment"** tab (left sidebar)
2. Find the variable: **`ALLOWED_ORIGINS`**
3. Click **"Edit"** button

### Step 3: Update the Value
Change the current value to include localhost:

```
http://localhost:3000,http://localhost:5173,https://health-symptom-predictor.onrender.com
```

**IMPORTANT:** No spaces after commas!

### Step 4: Save and Deploy
1. Click **"Save Changes"**
2. Render will automatically redeploy (takes 2-3 minutes)
3. Wait for the deployment to complete

## 🧪 Test After Update

Once deployment completes:

1. **Refresh your browser** (http://localhost:3000)
2. **Enter credentials:**
   - Email: `kumarbhanu818@gmail.com`
   - Password: `Bhanu123@`
3. **Click Sign In**

You should now successfully log in! ✅

## What This Does

CORS tells the backend which origins (websites) are allowed to make requests to it:
- `http://localhost:3000` - Your local frontend (Vite dev server)
- `http://localhost:5173` - Alternative Vite port
- `https://health-symptom-predictor.onrender.com` - Your backend can call itself

## Alternative: Test Without CORS Fix

If you can't update CORS right now, you can test using a browser extension:
1. Install "CORS Unblock" or similar extension
2. Enable it temporarily
3. Try logging in again

But **updating CORS on Render is the proper solution!**

---

**After updating CORS, your login will work perfectly!** 🚀
