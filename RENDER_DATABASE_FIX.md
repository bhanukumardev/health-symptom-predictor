# Render Database Connection Fix

## Problem
Render backend returns 500 on `/api/auth/login` even though `/health` works.

## Root Cause
The DATABASE_URL on Render needs to be configured correctly for Supabase.

## Working Solution

### Direct Connection (Works Locally)
```
postgresql://postgres:Bhanu123%40@db.txhohvmugqptewlvuhfn.supabase.co:5432/postgres
```

### For Render (Try these in order)

#### Option 1: Direct Connection with Pooling
```
postgresql://postgres:Bhanu123%40@db.txhohvmugqptewlvuhfn.supabase.co:5432/postgres?sslmode=require
```

#### Option 2: Use Supavisor Session Pooler
```
postgresql://postgres.txhohvmugqptewlvuhfn:Bhanu123%40@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require
```

#### Option 3: PgBouncer Transaction Mode
```
postgresql://postgres.txhohvmugqptewlvuhfn:Bhanu123%40@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
```

## Steps to Fix on Render

1. Go to Render Dashboard: https://dashboard.render.com/
2. Select service: `health-symptom-predictor`
3. Go to Environment tab
4. Update `DATABASE_URL` to Option 1
5. Save changes (auto-redeploys)
6. Test: `https://health-symptom-predictor.onrender.com/api/auth/login`

## Testing Commands

### Test Health (should work)
```powershell
curl https://health-symptom-predictor.onrender.com/health
```

### Test Login (should return token)
```powershell
$body = @{username='kumarbhanu818@gmail.com'; password='Bhanu123'}
Invoke-RestMethod -Uri 'https://health-symptom-predictor.onrender.com/api/auth/login' -Method Post -Body $body -ContentType 'application/x-www-form-urlencoded'
```

## Current Status
- ✅ FastAPI 0.104.1 + Pydantic 2.5.0 deployed successfully
- ✅ Health endpoint working (200 OK)
- ❌ Login endpoint failing (500 error) - database connection issue
- 🔄 Need to update DATABASE_URL on Render

## Next Steps
1. Update DATABASE_URL on Render (manual step required)
2. Test login endpoint
3. Test all other endpoints
4. Verify Netlify frontend connects successfully
