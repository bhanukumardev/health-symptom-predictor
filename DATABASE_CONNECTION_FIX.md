# Database Connection Fix Guide

## 🚨 CRITICAL: Supabase Database Connection Failed

Your render logs show the database connection is failing:
```
connection to server at "aws-1-ap-south-1.pooler.supabase.com" failed: Connection refused
```

## Immediate Action Required:

### 1. Check Supabase Project Status
- Visit: https://supabase.com/dashboard
- Check if your project shows "PAUSED" 
- If paused: Click "Resume Project"

### 2. Get Fresh Connection String
Go to your Supabase dashboard:
- Settings → Database → Connection String
- Copy the **Connection pooling** URL (for production)

Format should be:
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require
```

### 3. Update Render Environment Variable
In Render Dashboard:
- Go to your service → Environment
- Update `DATABASE_URL` with the fresh connection string
- Save changes (auto-redeploys)

### 4. Alternative: Create New Database
If issues persist, consider:
- Creating a new Supabase project
- Using Render's managed PostgreSQL
- Using Railway Database

## Current Failing Connection:
```
aws-1-ap-south-1.pooler.supabase.com:6543
```

## Next Steps After Fix:
1. Update DATABASE_URL in Render
2. Test connection: https://health-symptom-predictor.onrender.com/health
3. Verify login works on Vercel frontend

## Prevention:
- Supabase free tier pauses after 1 week inactivity
- Consider upgrading to Pro plan ($25/month) for always-on database
- Or set up automated health checks to keep it active