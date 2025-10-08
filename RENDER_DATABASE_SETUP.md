# Render PostgreSQL Database Setup (Recommended)

## Why Switch to Render Database?
- ✅ **Always-on** (no pausing like Supabase free tier)
- ✅ **Integrated** with your Render backend service
- ✅ **Free 90 days**, then $7/month
- ✅ **Better performance** (same region as backend)

## Setup Steps:

### 1. Create Render PostgreSQL Database
1. Go to [render.com/dashboard](https://render.com/dashboard)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `health-symptom-predictor-db`
   - **Database**: `health_predictor`
   - **User**: `health_user`
   - **Region**: Same as your backend (Oregon)
   - **Plan**: Free for 90 days

### 2. Get Connection String
After creation, Render provides:
- **Internal Database URL** (for same region - faster)
- **External Database URL** (for external connections)

Use the **Internal Database URL** format:
```
postgresql://health_user:[password]@[hostname]/health_predictor
```

### 3. Update Backend Environment
In your Render backend service:
- Environment → `DATABASE_URL` → Paste new connection string
- Save (auto-redeploys)

### 4. Initialize Database
Run database initialization:
```bash
# These scripts will create tables and seed data
python backend/init_db.py
python backend/seed_data.py
python backend/create_admin.py
```

## Migration from Supabase (Optional)
If you have important data in Supabase:
1. Export data from Supabase dashboard
2. Import to new Render database
3. Update connection string

## Result:
- ✅ Always-on database
- ✅ Better performance
- ✅ No more connection refused errors
- ✅ Integrated billing with Render