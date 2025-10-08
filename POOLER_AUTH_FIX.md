# 🔍 Session Pooler Authentication Issue

## Status
- ✅ Backend deployed successfully (no startup errors)
- ✅ No IPv6 errors (pooler is being used)
- ✅ "Application startup complete"
- ❌ Login endpoint returns 500 (database query failing)

## Analysis

The logs show the backend started without errors, which means:
1. ✅ IPv6 issue is resolved (using pooler)
2. ✅ Connection string syntax is correct
3. ❌ But authentication to pooler is failing when querying

## Likely Cause

Session Pooler authentication requires **project-specific username** format:
- ❌ Current: `postgres:password@pooler.supabase.com`
- ✅ Required: `postgres.PROJECT_ID:password@pooler.supabase.com`

## Solution: Try Project-Specific Username

Update DATABASE_URL on Render to:

```
postgresql://postgres.txhohvmugqptewlvuhfn:Bhanu123%40@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require
```

**Key difference**: Username is `postgres.txhohvmugqptewlvuhfn` instead of just `postgres`

## Steps

1. Go to: https://dashboard.render.com/web/srv-d3hu4l3uibrs73b7kfb0
2. Environment → Edit DATABASE_URL
3. Paste the URL above
4. Save
5. Wait for auto-redeploy (2-3 min)
6. Test login again

## Alternative: Try Transaction Pooler (Port 6543)

If Session Pooler still fails, try Transaction Pooler:

```
postgresql://postgres.txhohvmugqptewlvuhfn:Bhanu123%40@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
```

## Test Command

After update:
```powershell
$body = @{username='kumarbhanu818@gmail.com'; password='Bhanu123'}
Invoke-RestMethod -Uri 'https://health-symptom-predictor.onrender.com/api/auth/login' -Method Post -Body $body -ContentType 'application/x-www-form-urlencoded'
```

Expected: Returns access_token ✅
