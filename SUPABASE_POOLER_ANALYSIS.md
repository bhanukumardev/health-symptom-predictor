# 🔧 Supabase Connection Troubleshooting

## Test Results (Local)

### ❌ Transaction Pooler (Port 6543) - FAILED
```
URL: postgresql://postgres:Bhanu123%40@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
Error: FATAL: Tenant or user not found
```

### ❌ Session Pooler with Project Username - FAILED
```
URL: postgresql://postgres.txhohvmugqptewlvuhfn:Bhanu123%40@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require
Error: FATAL: Tenant or user not found
```

### ✅ Direct Connection - WORKS LOCALLY
```
URL: postgresql://postgres:Bhanu123%40@db.txhohvmugqptewlvuhfn.supabase.co:5432/postgres?sslmode=require
Status: SUCCESS ✅
Users: 7
Predictions: 20
```

## Problem Analysis

The **pooler connections are failing** with "Tenant or user not found". This suggests:

1. **Pooling might not be enabled** on your Supabase project
2. **Username format might be wrong** for pooler connections
3. **Authentication method** might need to be different for poolers

## Solution Options

### Option 1: Use Direct Connection (Recommended for now)
**Pros:**
- ✅ Works locally with all data
- ✅ Simple authentication
- ✅ SSL enforced with sslmode=require

**Cons:**
- ⚠️ Might have IPv6 issues on Render
- ⚠️ Not optimized for connection pooling

**DATABASE_URL for Render:**
```
postgresql://postgres:Bhanu123%40@db.txhohvmugqptewlvuhfn.supabase.co:5432/postgres?sslmode=require
```

### Option 2: Enable Supavisor (Connection Pooler)
**If poolers are not working, you may need to:**

1. Go to Supabase Dashboard
2. Navigate to Project Settings → Database
3. Check if "Connection Pooling" is enabled
4. If not, enable **Supavisor** (Supabase's connection pooler)
5. Get the correct pooler connection string from dashboard

### Option 3: Use PgBouncer Mode Parameter
Some poolers require a specific mode parameter:

**Transaction Mode:**
```
postgresql://postgres.txhohvmugqptewlvuhfn:Bhanu123%40@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
```

**Session Mode:**
```
postgresql://postgres.txhohvmugqptewlvuhfn:Bhanu123%40@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require&pool_mode=session
```

## Immediate Action

### Step 1: Try Direct Connection on Render First
Since the direct connection works locally, let's try it on Render:

1. Go to: https://dashboard.render.com/
2. Service: `health-symptom-predictor`
3. Environment tab
4. DATABASE_URL = `postgresql://postgres:Bhanu123%40@db.txhohvmugqptewlvuhfn.supabase.co:5432/postgres?sslmode=require`
5. Save and redeploy

### Step 2: Test After Deployment
```powershell
# Test login
$body = @{username='kumarbhanu818@gmail.com'; password='Bhanu123'}
Invoke-RestMethod -Uri 'https://health-symptom-predictor.onrender.com/api/auth/login' -Method Post -Body $body -ContentType 'application/x-www-form-urlencoded'
```

### Step 3: If Direct Connection Fails on Render
Try these alternatives in order:

**A. Add IPv4 preference:**
```
postgresql://postgres:Bhanu123%40@db.txhohvmugqptewlvuhfn.supabase.co:5432/postgres?sslmode=require&target_session_attrs=read-write
```

**B. Use IPv4-only DNS:**
```
postgresql://postgres:Bhanu123%40@54.239.105.85:5432/postgres?sslmode=require
```
(Note: Replace IP with actual Supabase IPv4 if available)

**C. Contact Supabase support** to enable/configure pooler for your project

## Why Poolers Are Failing

The "Tenant or user not found" error typically means:

1. **Pooling not enabled**: Your Supabase project might be on a plan that doesn't include connection pooling, or it needs to be manually enabled
2. **Wrong credentials**: Poolers might use different authentication
3. **Project not configured**: Supavisor (the pooler) might need project-specific setup

## Verification Steps

After updating DATABASE_URL on Render:

```powershell
# 1. Check health
curl https://health-symptom-predictor.onrender.com/health

# 2. Test login (requires database)
$body = @{username='kumarbhanu818@gmail.com'; password='Bhanu123'}
Invoke-RestMethod -Uri 'https://health-symptom-predictor.onrender.com/api/auth/login' -Method Post -Body $body -ContentType 'application/x-www-form-urlencoded'
```

## Current Recommendation

**Use the direct connection** with SSL:
```
postgresql://postgres:Bhanu123%40@db.txhohvmugqptewlvuhfn.supabase.co:5432/postgres?sslmode=require
```

This is the most reliable option based on our testing. If it doesn't work on Render due to IPv6, we can troubleshoot further with alternative approaches.

---

**Next Steps:**
1. Update DATABASE_URL on Render with direct connection
2. Test deployment
3. If fails, try alternative connection strings
4. If still failing, investigate Supabase pooler configuration
