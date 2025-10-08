# 🔧 Supabase Pooler Connection Fix

## ❌ Problem Found
**Error:** `FATAL: Tenant or user not found`

**Root Cause:** Incorrect username format in pooler connection string

---

## ✅ SOLUTION

### **Update Render DATABASE_URL**

Go to: https://dashboard.render.com/web/srv-d3hu4l3uibrs73b7kfb0

Click **"Environment"** → Edit `DATABASE_URL`

### **❌ WRONG (Current - DO NOT USE):**
```
postgresql://postgres:Bhanu123%40@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
```

### **✅ CORRECT (Use This):**
```
postgresql://postgres.txhohvmugqptewlvuhfn:Bhanu123%40@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
```

---

## 🎯 Key Difference

| Component | Wrong | Correct |
|-----------|-------|---------|
| Username | `postgres` | `postgres.txhohvmugqptewlvuhfn` |
| Format | `postgres` | `postgres.{PROJECT_ID}` |

**Explanation:**
- Supabase Connection Pooler requires username in format: `postgres.{PROJECT_ID}`
- Your Project ID: `txhohvmugqptewlvuhfn`
- Therefore username: `postgres.txhohvmugqptewlvuhfn`

---

## 📋 Quick Steps

1. **Go to Render Dashboard:**
   ```
   https://dashboard.render.com/web/srv-d3hu4l3uibrs73b7kfb0
   ```

2. **Click "Environment" tab**

3. **Edit DATABASE_URL:**
   - Change username from `postgres` to `postgres.txhohvmugqptewlvuhfn`
   - Full URL:
   ```
   postgresql://postgres.txhohvmugqptewlvuhfn:Bhanu123%40@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
   ```

4. **Click "Save Changes"**
   - Render will auto-redeploy (2-3 minutes)

5. **Wait for deployment** then test:
   ```powershell
   Invoke-RestMethod -Uri "https://health-symptom-predictor.onrender.com/health"
   ```

---

## 🔍 Why This Happened

1. **Supabase has two connection modes:**
   - **Direct:** Uses `postgres` as username (port 5432)
   - **Pooler:** Uses `postgres.{PROJECT_ID}` as username (port 6543)

2. **Render IPv6 Issue:**
   - Render's infrastructure tries IPv6 first
   - Supabase direct connection failed due to IPv6 routing
   - Solution: Use Connection Pooler (supports both IPv4/IPv6)

3. **Pooler Benefits:**
   - Better connection management
   - Prevents connection exhaustion
   - More reliable for production
   - Handles connection limits automatically

4. **Backend Configuration Update:**
   - `app/core/database.py` now detects `pooler.supabase.com` hosts
   - Uses SQLAlchemy's `NullPool` so every request opens a fresh connection (Supabase recommendation)
   - Avoids "connection refused" errors caused by reusing stale pooled sockets

---

## ✅ After Update

Once Render redeploys with the correct DATABASE_URL:

1. Backend will connect successfully
2. All database operations will work
3. Netlify frontend will work perfectly
4. "Failed to fetch" error will be resolved

### Still seeing `connection refused`?

If Render logs show `connection to server on socket "aws-1-ap-south-1.pooler.supabase.com:6543" failed: Connection refused`, work through these Supabase-specific checks:

1. **Confirm credentials straight from Supabase dashboard.** Copy the transaction pooler URI again to rule out typos. Password must remain URL encoded (`Bhanu123@` → `Bhanu123%40`).
2. **Unban the Render egress IP.** In Supabase → Project Settings → Database → Advanced, clear any Fail2Ban blocks or wait 30 minutes after too many failures.
3. **Verify pooler role exists.** Supabase recently regenerated the pooler role; resetting the database password in the dashboard will re-sync the MD5 hash.
4. **Restart Render after password changes.** Once the environment variable is updated, trigger a manual deploy so the new config loads.
5. **Local sanity check.** Run `python -c "import psycopg2; ..."` with the pooler string on your laptop; if that succeeds while Render fails, it's almost always an IP ban or stale password hash.

---

## 🎉 Final Test Commands

```powershell
# Test health
Invoke-RestMethod -Uri "https://health-symptom-predictor.onrender.com/health"

# Test login
$formData = "username=kumarbhanu818%40gmail.com&password=Bhanu123%40"
$loginResponse = Invoke-RestMethod -Uri "https://health-symptom-predictor.onrender.com/api/auth/login" -Method POST -Body $formData -ContentType "application/x-www-form-urlencoded"
$token = $loginResponse.access_token

# Test profile
$headers = @{ "Authorization" = "Bearer $token" }
Invoke-RestMethod -Uri "https://health-symptom-predictor.onrender.com/api/user/profile" -Headers $headers
```

---

## 📞 Next Steps After Fix

1. ✅ Update Render DATABASE_URL (above)
2. ⏳ Wait for Render redeploy (2-3 min)
3. ✅ Test live backend endpoints
4. ✅ Test Netlify frontend: https://health-symptom-predictor.netlify.app
5. ✅ Verify all features work
6. ✅ Commit changes to GitHub

---

**THIS IS THE FINAL FIX!** Once you update the username format, everything will work! 🚀
