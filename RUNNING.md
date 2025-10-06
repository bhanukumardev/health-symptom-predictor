# 🚀 Running Your Health App

## Current Setup Status

✅ **Backend**: Dependencies installed  
✅ **Frontend**: Dependencies installed  
✅ **ML Model**: Trained and ready  
⚠️ **Database**: Choose PostgreSQL or SQLite (see DATABASE_OPTIONS.md)

---

## Quick Start with SQLite (Easiest)

### 1. Start Backend (Terminal 1)

```powershell
cd "c:\Projects\AI Project\health-symptom-predictor\backend"
.\venv\Scripts\Activate.ps1

# Set SQLite database (for quick testing)
$env:DATABASE_URL = "sqlite:///./health_app.db"

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will be available at**: http://localhost:8000  
**API Docs**: http://localhost:8000/docs

### 2. Start Frontend (Terminal 2 - Open new terminal)

```powershell
cd "c:\Projects\AI Project\health-symptom-predictor\frontend"
npm run dev
```

**Frontend will be available at**: http://localhost:5173

---

## Using PostgreSQL (Production Setup)

If you installed PostgreSQL:

### 1. Update .env file

```powershell
cd "c:\Projects\AI Project\health-symptom-predictor\backend"
notepad .env
```

Change the DATABASE_URL line:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/health_db
```

### 2. Create Database and Tables

```powershell
# Open PowerShell as Administrator
cd "C:\Program Files\PostgreSQL\16\bin"  # Adjust version

# Create database
.\createdb -U postgres health_db

# Run migrations
cd "c:\Projects\AI Project\health-symptom-predictor"
psql -U postgres -d health_db -f database\init.sql
psql -U postgres -d health_db -f database\seeds\symptoms.sql
psql -U postgres -d health_db -f database\seeds\diseases.sql
```

### 3. Start Backend

```powershell
cd "c:\Projects\AI Project\health-symptom-predictor\backend"
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

### 4. Start Frontend (separate terminal)

```powershell
cd "c:\Projects\AI Project\health-symptom-predictor\frontend"
npm run dev
```

---

## 📱 Using the Application

1. **Open browser**: http://localhost:5173

2. **Register an account**:
   - Click "Register"
   - Fill in your details
   - Create a password (min 8 characters)

3. **Login** with your credentials

4. **Make a prediction**:
   - Click "New Prediction"
   - Select symptoms (e.g., Fever, Cough, Fatigue)
   - Add optional info (age, gender)
   - Click "Get Prediction"

5. **View results**:
   - See predicted disease
   - Check confidence score
   - Read precautions and recommendations

6. **View history**:
   - Click "History" to see all past predictions

---

## 🛠️ Troubleshooting

### Backend won't start

**Error: "could not connect to database"**
- Check if PostgreSQL is running
- Verify DATABASE_URL in .env
- Try SQLite instead: `$env:DATABASE_URL = "sqlite:///./health_app.db"`

**Error: "module not found"**
- Activate virtual environment: `.\venv\Scripts\Activate.ps1`
- Reinstall dependencies: `pip install -r requirements.txt`

**Port 8000 already in use**
- Use different port: `uvicorn app.main:app --reload --port 8001`

### Frontend won't start

**Error: "Cannot find module"**
- Delete node_modules: `Remove-Item -Recurse -Force node_modules`
- Reinstall: `npm install`

**Port 5173 already in use**
- Frontend will automatically try port 5174

**API connection error**
- Check backend is running at http://localhost:8000
- Check browser console for CORS errors

### Database Issues

**SQLite: "no such table"**
- Tables will be created automatically on first backend start
- Restart backend if needed

**PostgreSQL: "database does not exist"**
- Run: `createdb -U postgres health_db`

---

## 📊 Testing the System

### Sample Symptoms to Try

1. **Common Cold**:
   - Fever, Cough, Runny Nose, Sore Throat

2. **Flu**:
   - Fever, Cough, Fatigue, Body Ache, Chills

3. **COVID-19**:
   - Fever, Cough, Loss of Taste, Loss of Smell, Difficulty Breathing

4. **Gastroenteritis**:
   - Nausea, Vomiting, Diarrhea, Fatigue

5. **Migraine**:
   - Headache, Nausea (optional)

---

## 🔧 Development Commands

### Backend
```powershell
cd backend
.\venv\Scripts\Activate.ps1

# Run with auto-reload
uvicorn app.main:app --reload

# Run tests
pytest

# Check API docs
# Open: http://localhost:8000/docs
```

### Frontend
```powershell
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### ML Model
```powershell
cd ml-model
.\venv\Scripts\Activate.ps1

# Retrain model
python src/train.py

# Test predictions
python -c "from src.train import *; print('Model ready!')"
```

---

## 🎯 What to Try Next

1. **Test different symptom combinations**
2. **View your prediction history**
3. **Check the API documentation** at http://localhost:8000/docs
4. **Modify symptoms** in `database/seeds/symptoms.sql`
5. **Add new diseases** in `database/seeds/diseases.sql`
6. **Improve the ML model** with real medical data
7. **Customize the UI** in `frontend/src/pages/`

---

## ⚠️ Important Notes

- This is for **educational purposes only**
- Not a substitute for professional medical advice
- Sample ML model has limited accuracy (66.67% on demo data)
- Replace with real medical datasets for production use

---

## 📧 Need Help?

1. Check `README.md` for detailed documentation
2. Check `SETUP_GUIDE.md` for installation issues
3. Check `DATABASE_OPTIONS.md` for database setup
4. Review API docs at `/docs` endpoint

**Happy coding! 🎉**
