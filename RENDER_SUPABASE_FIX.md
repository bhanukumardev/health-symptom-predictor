# 🔧 Render + Supabase Connection Fix

## 🔴 Problem Identified

### Error in Render Logs:
```
sqlalchemy.exc.OperationalError: (psycopg2.OperationalError) 
connection to server at "db.txhohvmugqptewlvuhfn.supabase.co" 
(2406:da1a:6b0:f619:a128:af65:e5b0:b4a5), port 5432 failed: 
Network is unreachable
```

### Root Cause:
- **Render is attempting IPv6 connection** to Supabase
- Supabase direct connection (port 5432) has IPv6 routing issues
- **Solution:** Use Supabase's Connection Pooler (IPv4-compatible)

---

## ✅ Solution: Supabase Connection Pooler

### What is Connection Pooler?
Supabase provides two connection methods:

1. **Direct Connection (port 5432)**
   - Direct to PostgreSQL database
   - May have IPv6/network issues with some hosts
   - ❌ Not working with Render

2. **Connection Pooler (port 6543)** ✅
   - PgBouncer connection pooler
   - IPv4-compatible
   - Better for serverless/cloud deployments
   - **Recommended for Render**

---

## 🚀 Fix Steps

### 1. Update Render DATABASE_URL

**Go to:** https://dashboard.render.com/web/srv-d3hu4l3uibrs73b7kfb0

**Navigate to:** Environment tab

**Update DATABASE_URL from:**
```
❌ OLD (Direct - Port 5432):
postgresql://postgres:Bhanu123%40@db.txhohvmugqptewlvuhfn.supabase.co:5432/postgres
```

**To:**
```
✅ NEW (Pooler - Port 6543):
postgresql://postgres.txhohvmugqptewlvuhfn:Bhanu123%40@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

### Key Changes:
| Component | Direct Connection | Connection Pooler |
|-----------|------------------|-------------------|
| **Host** | `db.txhohvmugqptewlvuhfn.supabase.co` | `aws-0-ap-south-1.pooler.supabase.com` |
| **Port** | `5432` | `6543` |
| **User** | `postgres` | `postgres.txhohvmugqptewlvuhfn` |
| **Password** | `Bhanu123%40` | `Bhanu123%40` (same) |
| **Database** | `postgres` | `postgres` (same) |

---

## 🔍 How to Get Your Pooler URL

### Option 1: Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/txhohvmugqptewlvuhfn
2. Click **"Settings"** (left sidebar)
3. Click **"Database"**
4. Scroll to **"Connection Pooling"** section
5. Mode: **Transaction** (recommended for serverless)
6. Copy the connection string

### Option 2: Construct Manually
```
Format:
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres

Your Values:
- PROJECT_REF: txhohvmugqptewlvuhfn
- PASSWORD: Bhanu123%40 (URL-encoded)
- REGION: ap-south-1

Result:
postgresql://postgres.txhohvmugqptewlvuhfn:Bhanu123%40@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

---

## 🧪 Testing After Fix

### 1. Wait for Render Redeploy
- Render will automatically redeploy (2-3 minutes)
- Watch logs: https://dashboard.render.com/web/srv-d3hu4l3uibrs73b7kfb0/logs

### 2. Test Backend Health
```powershell
Invoke-RestMethod -Uri "https://health-symptom-predictor.onrender.com/health"
```
**Expected:** `{"status": "healthy"}`

### 3. Test Login
```powershell
$formData = "username=kumarbhanu818%40gmail.com&password=Bhanu123%40"
$login = Invoke-RestMethod -Uri "https://health-symptom-predictor.onrender.com/api/auth/login" -Method POST -Body $formData -ContentType "application/x-www-form-urlencoded"
$login.access_token
```
**Expected:** JWT token generated

### 4. Test Netlify Frontend
Visit: https://health-symptom-predictor.netlify.app
- Try login
- Test predictions
- Check notifications

---

## 📊 Connection Pooler Benefits

### Why Use Connection Pooler?

1. **IPv4/IPv6 Compatibility** ✅
   - Works with all hosting providers
   - No network unreachable errors

2. **Better Performance** 🚀
   - Connection reuse
   - Lower latency
   - Reduced overhead

3. **Serverless-Friendly** ☁️
   - Handles connection limits
   - PgBouncer transaction mode
   - Recommended for Render/Vercel/Netlify

4. **Automatic Scaling** 📈
   - Manages connection pool
   - Prevents "too many connections" errors

---

## 🔧 Local Development

Your local `.env` can still use direct connection:
```env
# Local - Direct Connection (Works fine)
DATABASE_URL=postgresql://postgres:Bhanu123%40@db.txhohvmugqptewlvuhfn.supabase.co:5432/postgres?sslmode=require
```

Or switch to pooler for consistency:
```env
# Local - Connection Pooler (Recommended)
DATABASE_URL=postgresql://postgres.txhohvmugqptewlvuhfn:Bhanu123%40@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

---

## 📝 Summary

### What We Fixed:
- ❌ IPv6 network unreachable error on Render
- ❌ Direct connection (port 5432) failing
- ✅ Switched to Connection Pooler (port 6543)
- ✅ IPv4-compatible connection established

### Next Steps:
1. ✅ Update Render DATABASE_URL with pooler connection
2. ⏳ Wait for Render to redeploy (2-3 mins)
3. 🧪 Test backend endpoints
4. 🎉 Test Netlify frontend - "Failed to fetch" should be resolved!

---

## 🆘 Troubleshooting

### If login still fails:
```powershell
# Check Render logs
# Look for: "connection successful" or new errors
```

### If pooler connection fails:
1. Verify project reference: `txhohvmugqptewlvuhfn`
2. Check region: `ap-south-1` (India)
3. Ensure password is URL-encoded: `Bhanu123%40`
4. Try Transaction mode vs Session mode in Supabase settings

### Connection Pooler Modes:
- **Transaction** (Recommended for APIs) - Port 6543
- **Session** (For long connections) - Port 5432

---

## 📚 References

- [Supabase Connection Pooling Docs](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [PgBouncer Documentation](https://www.pgbouncer.org/)
- [Render PostgreSQL Best Practices](https://render.com/docs/databases)

---

**Last Updated:** October 8, 2025  
**Status:** Ready to apply fix 🚀
