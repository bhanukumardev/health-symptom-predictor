# 🔍 DATABASE_URL Still Failing - Troubleshooting Guide

## Current Status
- ✅ Health endpoint: Working (200 OK)
- ❌ Login endpoint: Failing (500 error)
- 🔄 DATABASE_URL updated to Direct Connection
- ⏳ Waited 3+ minutes for deployment

## Tested DATABASE_URL
```
postgresql://postgres:Bhanu123%40@db.txhohvmugqptewlvuhfn.supabase.co:5432/postgres?sslmode=require
```

## Possible Issues

### 1. Environment Variable Not Applied
**Symptom**: Updated DATABASE_URL but Render still using old value  
**Solution**: 
- Go to Render dashboard
- Check if "Deploy live" status shows recent deployment
- If not, click "Manual Deploy" → "Deploy latest commit"
- Or click "Clear build cache & deploy"

### 2. Password Encoding Issue
**Problem**: The @ symbol might need different encoding  
**Try these alternatives**:

#### Option A: Double-encoded password
```
postgresql://postgres:Bhanu123%2540@db.txhohvmugqptewlvuhfn.supabase.co:5432/postgres?sslmode=require
```

#### Option B: Without SSL mode parameter
```
postgresql://postgres:Bhanu123%40@db.txhohvmugqptewlvuhfn.supabase.co:5432/postgres
```

#### Option C: With different SSL options
```
postgresql://postgres:Bhanu123%40@db.txhohvmugqptewlvuhfn.supabase.co:5432/postgres?sslmode=prefer
```

### 3. IPv6 Issue on Render
**Problem**: Render might be trying IPv6 which doesn't work  
**Solution**: Add connection parameters

```
postgresql://postgres:Bhanu123%40@db.txhohvmugqptewlvuhfn.supabase.co:5432/postgres?sslmode=require&connect_timeout=10
```

### 4. Application Code Issue
**Check**: Backend might have hardcoded database URL or other issue  
**Verify**: 
- Render logs for actual error message
- Look for "psycopg2" or "asyncpg" connection errors
- Check if there's a database initialization error

## Next Steps

### Step 1: Check Render Deployment Status
1. Go to Render dashboard: https://dashboard.render.com/web/srv-d3hu4l3uibrs73b7kfb0
2. Look at **Events** tab
3. Check if latest deployment succeeded
4. If not, look for error messages

### Step 2: Check Render Logs
1. Click on **Logs** tab in Render
2. Look for errors related to:
   - Database connection
   - psycopg2 errors
   - "could not connect"
   - Any Python tracebacks

### Step 3: Force Redeploy
If environment variable didn't trigger redeploy:
1. Click **Manual Deploy**
2. Select **Deploy latest commit**
3. Wait for deployment to complete
4. Test again

### Step 4: Try Alternative DATABASE_URL
If still failing, try the alternatives above in this order:
1. Without `?sslmode=require` parameter
2. With double-encoded password (%2540)
3. With `connect_timeout` parameter

## Quick Test After Each Change

Run this in PowerShell:
```powershell
$body = @{username='kumarbhanu818@gmail.com'; password='Bhanu123'}
Invoke-RestMethod -Uri 'https://health-symptom-predictor.onrender.com/api/auth/login' -Method Post -Body $body -ContentType 'application/x-www-form-urlencoded'
```

Success looks like:
```json
{
  "access_token": "eyJ0eXAi...",
  "token_type": "bearer"
}
```

## Database Connection Test from Render

If Render has a shell, you can test the connection directly:
```bash
python -c "import psycopg2; conn = psycopg2.connect('postgresql://postgres:Bhanu123%40@db.txhohvmugqptewlvuhfn.supabase.co:5432/postgres?sslmode=require'); print('SUCCESS')"
```

## What We Know Works

✅ Local backend with this DATABASE_URL:
```
postgresql://postgres:Bhanu123@db.txhohvmugqptewlvuhfn.supabase.co:5432/postgres
```

⚠️ Render might need:
- Different encoding
- SSL parameters
- Connection timeout
- Manual deployment trigger

## Emergency Fallback

If nothing works, we can:
1. Deploy backend locally using ngrok (temporary public URL)
2. Use a different deployment platform (Railway, Fly.io)
3. Contact Render support about PostgreSQL SSL connections
4. Check if Supabase has IP allowlist blocking Render

---

**Next Action**: Please check Render Logs and Events tabs to see if there's a specific error message we can debug.
