# PERMANENT DATABASE SETUP - USER DATA PERSISTENCE

## ✅ Your Database is Permanently Configured

### Database Type: PostgreSQL
- **Location**: localhost:5432
- **Database**: health_predictor
- **Status**: Permanent, persistent storage

## How It Works

### 1. **Tables Are Permanent** ✅
Once created, tables persist forever in PostgreSQL:
- ✅ `users` - All user accounts
- ✅ `symptoms` - Symptom catalog
- ✅ `diseases` - Disease information
- ✅ `predictions` - User prediction history
- ✅ `feedback` - User feedback and ratings

**You never need to recreate these tables!**

### 2. **Data Persists Automatically** ✅
All user data is automatically stored and persists:
- ✅ User registrations
- ✅ Login sessions (JWT tokens)
- ✅ Prediction history
- ✅ Feedback and ratings
- ✅ Admin accounts

**Data remains even after:**
- Application restarts
- Server reboots
- Code updates
- Development changes

### 3. **Connection is Permanent** ✅
The `.env` file configures permanent connection:
```bash
DATABASE_URL=postgresql://postgres:Bhanu123%40@localhost:5432/health_predictor
```

This connection:
- ✅ Automatically used by backend
- ✅ No manual setup needed
- ✅ Reads from .env file
- ✅ SQLAlchemy manages connection pooling

## Current Database Status

### Verified Data (as of verification):
```
✅ Users: 1 (Admin: kumarbhanu818@gmail.com)
✅ Symptoms: 15 entries
✅ Diseases: 5 entries
✅ Predictions: 1 entry
✅ Feedback: 0 entries
```

### Tables Status:
```
✅ All 5 tables exist
✅ Data is persistent
✅ No recreation needed
```

## How Data is Saved

### When a User Registers:
1. User fills registration form
2. Frontend sends POST to `/api/auth/register`
3. Backend hashes password
4. **User saved to PostgreSQL `users` table**
5. User exists permanently ✅

### When a Prediction is Made:
1. User selects symptoms
2. Frontend sends POST to `/api/predictions/predict`
3. ML model analyzes symptoms
4. **Prediction saved to PostgreSQL `predictions` table**
5. Available in history forever ✅

### When Feedback is Submitted:
1. User rates prediction
2. Frontend sends POST to `/api/predictions/feedback`
3. **Feedback saved to PostgreSQL `feedback` table**
4. Stored permanently for analysis ✅

## SQLAlchemy ORM - No Manual SQL

### The Application Uses SQLAlchemy:
```python
# Example: Create new user (automatic persistence)
new_user = User(
    email="user@example.com",
    hashed_password=hash_password("password"),
    full_name="John Doe"
)
db.add(new_user)
db.commit()  # ← Automatically saves to PostgreSQL!
db.refresh(new_user)  # ← User now has ID from database
```

### No Manual Table Recreation:
```python
# This ONLY creates tables if they don't exist
Base.metadata.create_all(bind=engine)
# If tables exist, does nothing ✅
```

## Verification Script

### Check Database Status Anytime:
```powershell
cd backend
& ".\venv\Scripts\Activate.ps1"
python verify_db.py
```

This shows:
- ✅ Connection status
- ✅ Tables present
- ✅ Record counts
- ✅ Admin user status

## Application Workflow

### First Time Setup (Already Done):
```powershell
python setup_postgres.py   # Created database
python init_db.py          # Created tables
python seed_data.py        # Added symptoms/diseases
python create_admin.py     # Created admin user
```

### Normal Usage (Every Time):
```powershell
# Just start the app!
.\start.ps1

# Or manually:
cd backend
.\start-backend.ps1  # Connects to existing database

cd frontend
npm run dev
```

**No database setup needed - everything persists!**

## Data Flow Diagram

```
User Action → Frontend → API Request → Backend
                                         ↓
                                    Validates
                                         ↓
                                    SQLAlchemy ORM
                                         ↓
                                    PostgreSQL
                                         ↓
                                    Data Saved ✅
                                         ↓
                                    Response to User
```

## Configuration Files

### `.env` (Root folder):
```bash
# Permanent PostgreSQL connection
DATABASE_URL=postgresql://postgres:Bhanu123%40@localhost:5432/health_predictor
POSTGRES_USER=postgres
POSTGRES_PASSWORD=Bhanu123@
POSTGRES_DB=health_predictor
```

### `backend/app/core/config.py`:
```python
# Reads from .env automatically
DATABASE_URL: str = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:Bhanu123%40@localhost:5432/health_predictor"
)
```

### `backend/app/core/database.py`:
```python
# Creates permanent connection pool
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
```

## User Data Examples

### User Table Structure:
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    full_name VARCHAR,
    age INTEGER,
    gender VARCHAR,
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Prediction Table Structure:
```sql
CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    symptoms JSON NOT NULL,
    predicted_disease_name VARCHAR NOT NULL,
    confidence_score FLOAT NOT NULL,
    additional_info JSON,
    timestamp TIMESTAMP DEFAULT NOW()
);
```

**All data stored with full referential integrity!**

## Benefits of Permanent Setup

### 1. No Data Loss ✅
- User accounts persist forever
- Prediction history never deleted
- No need to re-register users

### 2. No Setup Hassle ✅
- Start app immediately
- No database initialization
- Tables already exist

### 3. True Production Setup ✅
- Real database server
- ACID transactions
- Data integrity guaranteed

### 4. Multi-Session Support ✅
- Multiple users simultaneously
- Concurrent predictions
- No conflicts

## Monitoring Data

### View Users:
```bash
psql -U postgres -d health_predictor
SELECT id, email, full_name, is_admin FROM users;
```

### View Predictions:
```sql
SELECT 
    p.id,
    u.email,
    p.predicted_disease_name,
    p.timestamp
FROM predictions p
JOIN users u ON p.user_id = u.id
ORDER BY p.timestamp DESC
LIMIT 10;
```

### Count Everything:
```sql
SELECT 
    (SELECT COUNT(*) FROM users) as users,
    (SELECT COUNT(*) FROM predictions) as predictions,
    (SELECT COUNT(*) FROM feedback) as feedback;
```

## Backup Your Data

### Create Backup:
```bash
pg_dump -U postgres health_predictor > backup_$(date +%Y%m%d).sql
```

### Restore Backup:
```bash
psql -U postgres health_predictor < backup_20251005.sql
```

## Summary

### Your Setup:
✅ **Database**: PostgreSQL (permanent)
✅ **Tables**: Created once, persist forever
✅ **Connection**: Automatic from .env
✅ **Data**: Automatically saved and persisted
✅ **Users**: Registered users remain forever
✅ **Predictions**: All history saved
✅ **Feedback**: All ratings stored

### What You Do:
1. Start application: `.\start.ps1`
2. Use the app normally
3. **Everything saves automatically!**

### What You DON'T Do:
❌ Recreate tables
❌ Reinitialize database
❌ Re-register users
❌ Worry about data loss

---

**Your database is permanent, your data persists, and everything just works!** 🎉
