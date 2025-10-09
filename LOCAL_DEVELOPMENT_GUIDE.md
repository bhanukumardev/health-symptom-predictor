# Local Development Setup - Health Symptom Predictor

This guide will help you run both the frontend and backend on your local machine with all functionalities working.

## ✅ Current Status

Both servers are now running successfully:
- **Backend API**: http://localhost:8888
- **Frontend App**: http://localhost:3000
- **API Documentation**: http://localhost:8888/docs

## 📋 Prerequisites

Make sure you have the following installed:
- **Python 3.8+** (for backend)
- **Node.js 16+** and npm (for frontend)
- Internet connection (for database connection to Supabase)

## 🚀 Quick Start

### Option 1: Using PowerShell Script (Recommended)

Run the automated startup script that will:
- Check dependencies
- Install missing packages
- Start both servers in separate windows

```powershell
.\start-local-dev.ps1
```

### Option 2: Manual Start (Two Terminals)

**Terminal 1 - Backend:**
```powershell
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8888 --reload
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### Option 3: Using Batch Files

**For Backend:**
```powershell
.\backend\start-backend.bat
```

**For Frontend:**
```powershell
.\start-frontend.bat
```

## 🔧 Configuration

### Backend Configuration (`.env` file exists)
The backend is configured with:
- **Database**: Supabase PostgreSQL
- **Port**: 8888
- **CORS**: Configured for localhost:3000
- **API Keys**: Groq AI configured

### Frontend Configuration
Located in `frontend/.env`:
```env
VITE_API_URL=http://localhost:8888
```

## 🔍 Troubleshooting

### Backend Not Starting
1. Check if Python is installed: `python --version`
2. Install dependencies: `cd backend && pip install -r requirements.txt`
3. Verify `.env` file exists in backend directory
4. Check if port 8888 is already in use

### Frontend Not Starting
1. Check if Node.js is installed: `node --version`
2. Install dependencies: `cd frontend && npm install`
3. Check if port 3000 is already in use

### CORS Errors
- Make sure backend is running on port 8888
- Verify frontend `.env` has `VITE_API_URL=http://localhost:8888`
- Check browser console for specific error messages

### Database Connection Issues
- The app uses Supabase (cloud database)
- Check internet connection
- Verify `DATABASE_URL` in `backend/.env`

## 📍 Important Endpoints

### Backend API
- **Health Check**: http://localhost:8888/health
- **API Documentation**: http://localhost:8888/docs
- **Login**: http://localhost:8888/api/auth/login
- **Register**: http://localhost:8888/api/auth/register
- **Predictions**: http://localhost:8888/api/predictions/predict

### Frontend
- **Home**: http://localhost:3000/
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register
- **Dashboard**: http://localhost:3000/predict

## 🎯 Testing the Setup

1. Open http://localhost:3000 in your browser
2. You should see the Health Symptom Predictor homepage
3. Try to register a new account
4. After registration, log in
5. Navigate to the prediction page
6. Enter symptoms and get predictions

## 🛑 Stopping the Servers

- If using PowerShell script: Close the command windows that were opened
- If using manual start: Press `Ctrl+C` in each terminal
- If using batch files: Close the command windows or press `Ctrl+C`

## 📝 Features Available Locally

All features work locally:
- ✅ User Registration & Authentication
- ✅ Symptom Input & Disease Prediction
- ✅ Prediction History
- ✅ User Profile Management
- ✅ AI Chatbot (Groq API)
- ✅ Admin Panel
- ✅ Notifications
- ✅ Feedback System

## 🔒 Security Notes

- The `.env` file contains sensitive information (API keys, database credentials)
- Never commit `.env` files to version control
- Use environment-specific configurations for production

## 💡 Development Tips

- Backend has **auto-reload** enabled - changes to Python files will restart the server
- Frontend has **hot module replacement** - changes to React files will update immediately
- Check the console windows for any error messages
- Use the API documentation at http://localhost:8888/docs for testing endpoints

## 📞 Need Help?

If you encounter any issues:
1. Check the console output in both terminal windows
2. Verify all prerequisites are installed
3. Ensure ports 3000 and 8888 are not in use by other applications
4. Check that your internet connection is active (for database access)

---

**Last Updated**: Current session
**Status**: ✅ Both servers running successfully
