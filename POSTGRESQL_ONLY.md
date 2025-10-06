# POSTGRESQL PERMANENT CONFIGURATION

## ✅ Database: PostgreSQL ONLY

This application is **permanently configured** to use PostgreSQL exclusively.

## Configuration Files Updated

### 1. Backend Core Configuration
**File**: `backend/app/core/config.py`
```python
# Database - PostgreSQL only
DATABASE_URL: str = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:Bhanu123%40@localhost:5432/health_predictor"
)
```
**Status**: ✅ Hardcoded PostgreSQL as default

### 2. Backend Startup Script
**File**: `backend/start-backend.ps1`
```powershell
$env:DATABASE_URL = "postgresql://postgres:Bhanu123%40@localhost:5432/health_predictor"
```
**Status**: ✅ PostgreSQL connection string set

### 3. Requirements
**File**: `backend/requirements.txt`
```
psycopg2-binary==2.9.9  # PostgreSQL driver
sqlalchemy>=2.0.0
```
**Status**: ✅ PostgreSQL driver included

### 4. Startup Scripts
**Files**: `start.ps1`, `start-app.ps1`
- Removed all SQLite options
- Only PostgreSQL mentioned
**Status**: ✅ SQLite references removed

### 5. Documentation
**Files**: `README.md`, `POSTGRESQL_MIGRATION.md`
- All docs updated to PostgreSQL only
- SQLite references removed
**Status**: ✅ Docs updated

## What Was Removed

### ❌ SQLite Database File
- Deleted: `backend/health_app.db`
- Status: File removed from project

### ❌ SQLite Configuration
- Removed all `sqlite:///` connection strings
- Removed database choice prompts
- Status: No SQLite support

### ❌ Other Database References
- No MongoDB
- No MySQL
- No Oracle
- Status: Only PostgreSQL supported

## Database Connection Details

### Hardcoded Connection Information
```
Host: localhost
Port: 5432
Database: health_predictor
Username: postgres
Password: Bhanu123@
Connection String: postgresql://postgres:Bhanu123%40@localhost:5432/health_predictor
```

### Connection String Locations
1. `backend/app/core/config.py` - Default value
2. `backend/start-backend.ps1` - Environment variable
3. `backend/setup_postgres.py` - Setup script

## Database Tables (PostgreSQL)

All tables are created using SQLAlchemy with PostgreSQL:

1. **users**
   - id (SERIAL PRIMARY KEY)
   - email (VARCHAR UNIQUE)
   - hashed_password (VARCHAR)
   - full_name (VARCHAR)
   - age (INTEGER)
   - gender (VARCHAR)
   - is_active (BOOLEAN)
   - is_admin (BOOLEAN)
   - created_at (TIMESTAMP)

2. **symptoms**
   - id (SERIAL PRIMARY KEY)
   - name (VARCHAR UNIQUE)
   - description (TEXT)
   - severity_level (INTEGER)
   - category (VARCHAR)
   - created_at (TIMESTAMP)

3. **diseases**
   - id (SERIAL PRIMARY KEY)
   - name (VARCHAR UNIQUE)
   - description (TEXT)
   - severity (VARCHAR)
   - precautions (JSON)
   - common_symptoms (JSON)
   - created_at (TIMESTAMP)

4. **predictions**
   - id (SERIAL PRIMARY KEY)
   - user_id (INTEGER FOREIGN KEY → users.id)
   - symptoms (JSON)
   - predicted_disease_name (VARCHAR)
   - confidence_score (FLOAT)
   - additional_info (JSON)
   - timestamp (TIMESTAMP)

5. **feedback**
   - id (SERIAL PRIMARY KEY)
   - prediction_id (INTEGER FOREIGN KEY → predictions.id)
   - is_accurate (BOOLEAN)
   - actual_diagnosis (VARCHAR)
   - rating (INTEGER)
   - comments (TEXT)
   - created_at (TIMESTAMP)

## Startup Process

### Automatic Startup
```powershell
.\start.ps1
```

### Manual Startup
```powershell
# Backend (Terminal 1)
cd backend
.\start-backend.ps1

# Frontend (Terminal 2)
cd frontend
npm run dev
```

Both methods use PostgreSQL automatically.

## Environment Variables

The application sets these automatically:

```powershell
$env:DATABASE_URL="postgresql://postgres:Bhanu123%40@localhost:5432/health_predictor"
```

No need to manually configure - it's hardcoded!

## Admin Access

Default admin user (created automatically):
- **Email**: kumarbhanu818@gmail.com
- **Password**: Bhanu123@

## Verification

### Check Database Connection
```powershell
cd backend
& ".\venv\Scripts\Activate.ps1"
python -c "from app.core.database import engine; from sqlalchemy import text; print(engine.execute(text('SELECT version()')).scalar())"
```

### Check Tables
```bash
psql -U postgres -d health_predictor
\dt
```

### Check Data
```sql
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM symptoms;
SELECT COUNT(*) FROM diseases;
```

## Benefits of PostgreSQL-Only Setup

1. ✅ **No Configuration Needed** - Everything hardcoded
2. ✅ **No Database Choice Confusion** - Only one option
3. ✅ **Production Ready** - PostgreSQL from day one
4. ✅ **Consistent Environment** - Same DB everywhere
5. ✅ **Better Performance** - Optimized for PostgreSQL
6. ✅ **Advanced Features** - JSON, full-text search, etc.
7. ✅ **Concurrent Users** - Multiple users simultaneously
8. ✅ **Data Integrity** - ACID transactions guaranteed

## Support

Only PostgreSQL is supported. For issues:

1. Check PostgreSQL is running: `Get-Service postgresql*`
2. Verify database exists: `psql -U postgres -l`
3. Test connection: `psql -U postgres -d health_predictor`
4. Check password: `Bhanu123@`

## No Other Databases

**This application does NOT support:**
- ❌ SQLite
- ❌ MongoDB
- ❌ MySQL
- ❌ MariaDB
- ❌ Oracle
- ❌ Microsoft SQL Server
- ❌ Any other database

**Only PostgreSQL is supported and configured.**

## Status: PERMANENT ✅

PostgreSQL is now the permanent, exclusive database for this application. All configuration files have been updated and SQLite references removed. The application will always use PostgreSQL by default.

---

**Configuration Date**: October 5, 2025
**Database**: PostgreSQL 🐘
**Status**: Production Ready ✅
