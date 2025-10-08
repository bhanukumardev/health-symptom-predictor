# CORS Configuration for Vercel Frontend

## Update these Environment Variables in Render Dashboard:

### ALLOWED_ORIGINS
Add your Vercel URL to the comma-separated list:
```
https://health-symptom-predictor.vercel.app,https://health-symptom-predictor.netlify.app,https://health-symptom-predictor.onrender.com,http://localhost:3000,http://localhost:5173
```

### ALLOWED_ORIGIN_REGEX
For dynamic Vercel preview deployments:
```
^https://health-symptom-predictor(-[a-z0-9]+)?\.vercel\.app$
```

## Steps to Update on Render:
1. Go to https://dashboard.render.com
2. Open your `health-symptom-predictor` service
3. Go to Environment tab
4. Update the ALLOWED_ORIGINS variable with the value above
5. Save changes
6. Service will automatically redeploy

## Your Current Deployment URLs:
- Frontend (Vercel): https://health-symptom-predictor.vercel.app
- Backend (Render): https://health-symptom-predictor.onrender.com