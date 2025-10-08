# 🎯 GET EXACT POOLER CONNECTION STRING FROM SUPABASE

## The Issue
Even though pooling is enabled in your Supabase dashboard, the connection strings we've tried show "Tenant or user not found" errors. This means we need the **EXACT** connection string from Supabase.

## ✅ SOLUTION: Copy Connection String from Supabase Dashboard

### Step 1: Go to Supabase Database Settings
1. Open: https://supabase.com/dashboard/project/txhohvmugqptewlvuhfn/settings/database
2. You should already be on this page (as shown in your screenshot)

### Step 2: Find Connection Pooling Section
1. Look for "Connection pooling configuration" section
2. You should see "Shared Pooler" label
3. Click on "Docs" link next to "Connection pooling configuration" if available

### Step 3: Get the Exact Connection String
Look for a section that shows connection strings. There should be different options like:
- **Transaction mode** (port 6543) - for short-lived connections
- **Session mode** (port 5432) - for long-lived connections

**Copy the TRANSACTION MODE connection string** (port 6543)

It should look something like:
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
```

### Step 4: Modify the Connection String
1. Take the connection string you copied
2. Replace `[YOUR-PASSWORD]` with your password **URL-encoded**. For `Bhanu123@` this becomes `Bhanu123%40`.
3. Add at the end: `?sslmode=require`

❗ **Never use the raw `@` character in the password** or duplicate `@` signs in the URI. Always URL-encode special characters.

**Final format should be:**
```
postgresql://postgres.[PROJECT-REF]:Bhanu123%40@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
```

### Step 5: Test Locally First
```powershell
cd "c:\Projects\AI Project\health-symptom-predictor\backend"
python -c "import psycopg2; conn = psycopg2.connect('YOUR_CONNECTION_STRING_HERE'); print('✅ Works!')"
```

### Step 6: Update Render
1. Go to: https://dashboard.render.com/web/srv-d3hu4l3uibrs73b7kfb0
2. Environment → Edit DATABASE_URL
3. Paste the tested connection string
4. Save → Wait for redeploy

---

## 🔍 Alternative: Check Project Settings

If you can't find the exact connection string:

### Option 1: Click "Connect" Button
1. In your Supabase project dashboard
2. Look for a "Connect" button (usually top right)
3. Select "Connection Pooling"
4. Choose "Transaction" mode
5. Copy the connection string shown

### Option 2: Check API Settings
1. Go to: Project Settings → API
2. Look for "Connection Pooling" or "Database" section
3. There should be example connection strings

---

## 📋 What to Look For

The correct connection string from Supabase will have:
- ✅ Username format: `postgres.[something]` (not just `postgres`)
- ✅ Port: `6543` (for transaction mode)
- ✅ Host: `aws-1-ap-south-1.pooler.supabase.com`
- ✅ Database: `postgres`

---

## 🆘 If You Can't Find It

Take a screenshot of:
1. Your Supabase Dashboard → Project Settings → Database
2. Any "Connection String" or "Connection Pooling" section
3. Share it so I can help you identify the exact format

---

## ⚡ Quick Test Commands

Once you have the connection string from Supabase:

```powershell
# Test connection
cd "c:\Projects\AI Project\health-symptom-predictor\backend"
python -c "import psycopg2; conn = psycopg2.connect('YOUR_STRING_HERE'); print('✅ Connected!')"

# Test query
python -c "import psycopg2; conn = psycopg2.connect('YOUR_STRING_HERE'); cur = conn.cursor(); cur.execute('SELECT COUNT(*) FROM users'); print('Users:', cur.fetchone()[0])"
```

---

## 📝 Expected Success

When you use the correct connection string:
```
✅ Connected!
Users: 7
```

Then update Render and your app will work! 🎉
