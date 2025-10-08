# 🔄 DATABASE MIGRATION GUIDE: Render → Supabase

## 📋 Migration Overview

**Date**: October 8, 2025  
**From**: Render PostgreSQL (Oregon)  
**To**: Supabase PostgreSQL  
**Status**: Ready to Execute

---

## 🎯 Why Migrate to Supabase?

✅ **Better Performance** - Faster response times  
✅ **More Reliable** - 99.9% uptime SLA  
✅ **Free Tier** - More generous limits  
✅ **Built-in Features** - Auth, Storage, Realtime  
✅ **Better Dashboard** - Easier database management  
✅ **No Sleep** - Database stays awake 24/7

---

## 📊 Migration Plan

### Phase 1: Preparation (5 minutes)
1. Get Supabase database password
2. Update migration script
3. Backup current data (optional)

### Phase 2: Data Migration (5-10 minutes)
1. Run migration script
2. Verify data integrity
3. Check all tables

### Phase 3: Configuration Update (5 minutes)
1. Update backend .env files
2. Update Render environment variables
3. Update documentation

### Phase 4: Deployment & Testing (10 minutes)
1. Push changes to GitHub
2. Netlify auto-deploys frontend
3. Test all functionality
4. Verify production site

**Total Time**: ~30 minutes

---

## 🚀 STEP 1: Get Supabase Database Password

### Method 1: From Supabase Dashboard

1. Go to: **https://supabase.com/dashboard/project/txhohvmugqptewlvuhfn**
2. Click: **Project Settings** (gear icon)
3. Click: **Database**
4. Find: **Connection string** or **Database Password**
5. Click: **Show password** or **Copy**
6. Save it somewhere safe!

### Method 2: From Connection String

Your connection string looks like:
```
postgresql://postgres:[YOUR-PASSWORD]@db.txhohvmugqptewlvuhfn.supabase.co:5432/postgres
```

The password is the part between `postgres:` and `@db.`

---

## 🔧 STEP 2: Update Migration Script

1. Open: `backend/migrate_to_supabase.py`
2. Find line 32: `'password': 'YOUR_SUPABASE_PASSWORD_HERE'`
3. Replace with your actual Supabase password
4. Save the file

```python
SUPABASE_CONFIG = {
    'host': 'db.txhohvmugqptewlvuhfn.supabase.co',
    'port': 6543,
    'database': 'postgres',
    'user': 'postgres',
    'password': 'YOUR_ACTUAL_PASSWORD_HERE',  # ← Update this!
    'sslmode': 'require'
}
```

---

## 💾 STEP 3: Run Migration Script

### Option 1: Using VS Code Terminal (Recommended)

```powershell
# Navigate to backend directory
cd "c:\Projects\AI Project\health-symptom-predictor\backend"

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Run migration script
python migrate_to_supabase.py
```

### Option 2: Using Command Prompt

```cmd
cd "c:\Projects\AI Project\health-symptom-predictor\backend"
venv\Scripts\activate
python migrate_to_supabase.py
```

### What the Script Does:

1. ✅ Connects to Render PostgreSQL
2. ✅ Connects to Supabase PostgreSQL
3. ✅ Creates all tables in Supabase
4. ✅ Migrates all data (users, predictions, notifications, etc.)
5. ✅ Verifies row counts match
6. ✅ Generates migration log

### Expected Output:

```
╔══════════════════════════════════════════════════════════════╗
║     DATABASE MIGRATION: Render → Supabase                   ║
╚══════════════════════════════════════════════════════════════╝

[2025-10-08 10:00:00] [INFO] Connecting to Render PostgreSQL...
[2025-10-08 10:00:01] [SUCCESS] ✅ Connected to Render PostgreSQL
[2025-10-08 10:00:01] [INFO] Connecting to Supabase PostgreSQL...
[2025-10-08 10:00:02] [SUCCESS] ✅ Connected to Supabase PostgreSQL

--- Processing table: users ---
[2025-10-08 10:00:02] [SUCCESS] ✅ Created table 'users' in Supabase
[2025-10-08 10:00:03] [INFO] Migrating 7 rows from 'users'...
[2025-10-08 10:00:03] [SUCCESS] ✅ Migrated 7 rows to 'users'
[2025-10-08 10:00:03] [SUCCESS] ✅ Verification passed for 'users': 7 rows

... (continues for all tables)

════════════════════════════════════════════════════════════
MIGRATION SUMMARY
════════════════════════════════════════════════════════════
✅ Successfully migrated: 6/6 tables
🎉 All tables migrated successfully!
📝 Migration log saved to: migration_log_20251008_100005.txt
```

---

## 📝 STEP 4: Update Backend Configuration

### 4.1 Update `.env.supabase` file

Open `backend/.env.supabase` and replace `YOUR_SUPABASE_PASSWORD`:

```bash
# Replace this line:
DATABASE_URL=postgresql://postgres.txhohvmugqptewlvuhfn:YOUR_SUPABASE_PASSWORD@aws-0-us-west-1.pooler.supabase.com:6543/postgres

# With your actual password:
DATABASE_URL=postgresql://postgres.txhohvmugqptewlvuhfn:your_actual_password@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

### 4.2 Copy to `.env` for local testing

```powershell
cd backend
Copy-Item .env.supabase .env -Force
```

---

## ☁️ STEP 5: Update Render Environment Variables

1. Go to: **https://dashboard.render.com/web/srv-d3hu4l3uibrs73b7kfb0**
2. Click: **Environment** (left sidebar)
3. Find: **DATABASE_URL**
4. Click: **Edit** (pencil icon)
5. Replace with Supabase connection string:

```
postgresql://postgres.txhohvmugqptewlvuhfn:YOUR_PASSWORD@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

6. Add new environment variable: **SUPABASE_URL**
   ```
   https://txhohvmugqptewlvuhfn.supabase.co
   ```

7. Add new environment variable: **SUPABASE_ANON_KEY**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4aG9odm11Z3FwdGV3bHZ1aGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NDY5NjgsImV4cCI6MjA3NTQyMjk2OH0.k8Lq7XUYCaZRLUi5qHLsnJ7CGCvQjjMXc-FDPRVsHDs
   ```

8. Click: **Save Changes**
9. Render will automatically redeploy your backend

---

## 🧪 STEP 6: Test Locally

```powershell
# Start backend with new database
cd "c:\Projects\AI Project\health-symptom-predictor\backend"
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 0.0.0.0 --port 8888
```

### Test Health Endpoint

```powershell
Invoke-RestMethod -Uri "http://localhost:8888/health"
```

Expected: `{"status":"healthy"}`

### Test Login

```powershell
$body = @{
    username = "kumarbhanu818@gmail.com"
    password = "your_password"
}
Invoke-RestMethod -Uri "http://localhost:8888/api/auth/login" -Method POST -Body $body -ContentType "application/x-www-form-urlencoded"
```

Expected: JWT token response

---

## 🌐 STEP 7: Deploy to Production

### 7.1 Commit Changes

```powershell
cd "c:\Projects\AI Project\health-symptom-predictor"

# Add migration files
git add backend/migrate_to_supabase.py
git add backend/.env.supabase
git add SUPABASE_MIGRATION_GUIDE.md

# Commit
git commit -m "🔄 Migrate database from Render PostgreSQL to Supabase

- Add automated migration script
- Update backend configuration for Supabase
- Add comprehensive migration documentation
- Ready for production deployment with Supabase"

# Push (triggers Netlify rebuild)
git push origin main
```

### 7.2 Wait for Render Deployment

1. Go to: **https://dashboard.render.com/web/srv-d3hu4l3uibrs73b7kfb0**
2. Click: **Events** tab
3. Wait for deployment to complete (~2-3 minutes)
4. Check logs for any errors

### 7.3 Netlify Auto-Deploys

Netlify will automatically rebuild and deploy the frontend.

---

## ✅ STEP 8: Verify Production

### 8.1 Test Backend (Render)

```powershell
# Health check
Invoke-RestMethod -Uri "https://health-symptom-predictor.onrender.com/api/health"

# Test login
$body = @{
    username = "kumarbhanu818@gmail.com"
    password = "your_password"
}
$response = Invoke-RestMethod -Uri "https://health-symptom-predictor.onrender.com/api/auth/login" -Method POST -Body $body -ContentType "application/x-www-form-urlencoded"

# Should return JWT token
$response
```

### 8.2 Test Frontend (Netlify)

Open: **https://health-symptom-predictor.netlify.app**

Test these features:
- [ ] Login works
- [ ] User registration works
- [ ] Symptom prediction works
- [ ] AI chatbot responds
- [ ] Notifications load
- [ ] History shows predictions
- [ ] Profile page loads
- [ ] Admin panel works (if admin)

---

## 📊 Verification Checklist

After migration, verify:

### Database
- [ ] All 6 tables exist in Supabase
- [ ] Row counts match between Render and Supabase
- [ ] Users table has 7 users
- [ ] Predictions data is intact
- [ ] Notifications are preserved

### Backend
- [ ] Health endpoint responds
- [ ] Login works
- [ ] JWT tokens generated
- [ ] Predictions API works
- [ ] Chat API responds
- [ ] Admin endpoints functional

### Frontend
- [ ] Site loads without errors
- [ ] No "Failed to fetch" errors
- [ ] All pages render correctly
- [ ] API calls succeed
- [ ] No CORS errors

---

## 🐛 Troubleshooting

### Issue: Migration script can't connect to Render

**Solution**:
- Render database might be sleeping (free tier)
- Wait 30 seconds and retry
- Check if database is paused in Render dashboard

### Issue: Migration script can't connect to Supabase

**Solution**:
- Verify Supabase password is correct
- Check connection string format
- Ensure port is 6543 (pooler) or 5432 (direct)
- Try direct connection if pooler fails

### Issue: Backend shows database connection error

**Solution**:
- Verify DATABASE_URL in Render environment variables
- Check Supabase password is correct
- Restart Render service manually

### Issue: Frontend shows "Failed to fetch"

**Solution**:
- Wait for Render backend to wake up (30 seconds)
- Check backend health: `https://health-symptom-predictor.onrender.com/api/health`
- Verify CORS settings in backend

---

## 📈 Expected Results

### Before Migration (Render)
- Database: Render PostgreSQL (Oregon)
- Connection issues: Frequent timeouts
- Performance: Slower queries
- Reliability: Sleep mode issues

### After Migration (Supabase)
- Database: Supabase PostgreSQL
- Connection: Fast and reliable
- Performance: Optimized queries
- Reliability: 24/7 uptime
- Features: Built-in auth, storage, realtime

---

## 🎉 Success Criteria

Migration is successful when:

1. ✅ All 6 tables migrated
2. ✅ All data preserved (row counts match)
3. ✅ Backend connects to Supabase
4. ✅ Frontend works without errors
5. ✅ Users can login
6. ✅ Predictions work
7. ✅ AI chatbot responds
8. ✅ No database connection errors

---

## 📚 Additional Resources

### Supabase Dashboard
- **URL**: https://supabase.com/dashboard/project/txhohvmugqptewlvuhfn
- **Database**: Click "Database" → "Tables" to view data
- **SQL Editor**: Run custom queries
- **Logs**: Monitor database activity

### Connection Strings

**Connection Pooler** (Recommended for production):
```
postgresql://postgres.txhohvmugqptewlvuhfn:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

**Direct Connection** (For migrations/admin):
```
postgresql://postgres:[PASSWORD]@db.txhohvmugqptewlvuhfn.supabase.co:5432/postgres
```

---

## 🔄 Rollback Plan (If Needed)

If something goes wrong, you can rollback:

1. **Revert Render DATABASE_URL** to Render PostgreSQL:
   ```
   postgresql://health_predictor_user:WtIo4HLKi9AEveEmlMFYONE3dxWJhfOd@dpg-d3hu2c1gv73c73e0l170-a.oregon-postgres.render.com/health_predictor
   ```

2. **Revert local .env** file:
   ```powershell
   cd backend
   Copy-Item .env.example .env
   # Update with Render database URL
   ```

3. **Redeploy** Render service

---

## 📝 Migration Log

The migration script generates a detailed log file:
- **Filename**: `migration_log_YYYYMMDD_HHMMSS.txt`
- **Location**: `backend/` directory
- **Contents**: Complete migration timeline, errors, warnings

Keep this log for your records!

---

## 💡 Pro Tips

1. **Test locally first** before deploying to production
2. **Keep Render database** for a few days as backup
3. **Monitor Supabase logs** after migration
4. **Check performance** improvements
5. **Document** any custom configurations

---

## 🆘 Need Help?

If you encounter issues:

1. Check migration log for errors
2. Verify Supabase password
3. Check Render logs
4. Test backend health endpoint
5. Review CORS settings

---

**Status**: Ready to Execute  
**Estimated Time**: 30 minutes  
**Risk Level**: Low (with proper backup)  
**Benefit**: High (better performance & reliability)

**LET'S MIGRATE! 🚀**
