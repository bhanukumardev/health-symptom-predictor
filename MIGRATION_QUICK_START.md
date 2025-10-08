# 🚀 QUICK START: Database Migration to Supabase

## ⚡ 5-Minute Setup Guide

This guide will help you migrate from Render PostgreSQL to Supabase in just a few steps.

---

## 📋 Prerequisites

- [ ] Supabase account (free tier is fine)
- [ ] Supabase database password
- [ ] Backend virtual environment activated

---

## 🎯 3 Simple Steps

### STEP 1: Get Supabase Password (1 minute)

1. Go to: https://supabase.com/dashboard/project/txhohvmugqptewlvuhfn/settings/database
2. Click: "Connection string"
3. Copy the password from the connection string
4. Save it somewhere safe!

---

### STEP 2: Run Migration Script (5 minutes)

```powershell
# Navigate to backend
cd "c:\Projects\AI Project\health-symptom-predictor\backend"

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Edit migration script - update line 32 with your Supabase password
code migrate_to_supabase.py

# Run migration
python migrate_to_supabase.py
```

**What it does:**
- ✅ Connects to both databases
- ✅ Creates all tables in Supabase
- ✅ Migrates all data
- ✅ Verifies everything worked

---

### STEP 3: Update Configuration (2 minutes)

#### A. Update Render Environment Variables

1. Go to: https://dashboard.render.com/web/srv-d3hu4l3uibrs73b7kfb0
2. Click: "Environment"
3. Update **DATABASE_URL** to:
   ```
   postgresql://postgres.txhohvmugqptewlvuhfn:YOUR_PASSWORD@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```
   (Replace YOUR_PASSWORD with your Supabase password)
4. Click: "Save Changes"

#### B. Commit and Push

```powershell
cd "c:\Projects\AI Project\health-symptom-predictor"

git add backend/migrate_to_supabase.py backend/.env.supabase SUPABASE_MIGRATION_GUIDE.md
git commit -m "🔄 Migrate database to Supabase"
git push origin main
```

---

## ✅ Test Everything (2 minutes)

```powershell
# Run automated tests
.\test_migration.ps1

# Or manually test backend
Invoke-RestMethod -Uri "https://health-symptom-predictor.onrender.com/health"

# Test frontend
# Open: https://health-symptom-predictor.netlify.app
# Try: Login, Predictions, Chat, History
```

---

## 🎉 Done!

Your app is now running on Supabase!

**Benefits:**
- ✅ Faster database queries
- ✅ No more connection timeouts
- ✅ 24/7 uptime (no sleep mode)
- ✅ Better dashboard and tools
- ✅ Free tier with more features

---

## 🐛 Quick Troubleshooting

### Issue: Migration script can't connect

**Fix:** Wait 30 seconds (Render DB might be sleeping), then retry

### Issue: Supabase connection fails

**Fix:** Double-check your Supabase password is correct

### Issue: Backend shows errors after migration

**Fix:** Restart Render service manually in dashboard

---

## 📚 Need More Details?

Read the full guide: `SUPABASE_MIGRATION_GUIDE.md`

---

**Estimated Time:** 10-15 minutes total  
**Difficulty:** Easy  
**Risk:** Low (Render DB remains as backup)

**LET'S GO! 🚀**
