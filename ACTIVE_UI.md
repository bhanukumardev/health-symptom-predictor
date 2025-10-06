# Active UI Configuration

## 🎨 Current Frontend: Vite React (Cyan/Blue Theme)

The active user interface is located in the `/frontend` folder and uses:
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with cyan/blue color scheme
- **Routing**: React Router DOM
- **State Management**: Zustand
- **API Client**: Axios

## 🚀 How to Start

### Backend (FastAPI)
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (Vite React)
```powershell
cd frontend
npm install
npm run dev
```

## 🌐 URLs

- **Frontend**: http://localhost:3000 (or http://localhost:3001 if port 3000 is in use)
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📁 Project Structure

```
health-symptom-predictor/
├── frontend/          # Active Vite React UI (Cyan theme)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── main.tsx
│   └── package.json
├── backend/           # FastAPI Backend
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   └── main.py
│   └── requirements.txt
├── database/          # Database scripts
└── ml-model/          # ML model files
```

## 🗑️ Removed Files

The following Next.js UI files have been removed to avoid confusion:
- `/app` folder
- `/components` folder (root level)
- `/hooks`, `/lib`, `/styles`, `/public` folders
- `next.config.mjs`, `next-env.d.ts`
- Root `package.json`, `tsconfig.json`, etc.

## ✅ Database

Using SQLite database (`backend/health_app.db`) with:
- 15 pre-configured symptoms
- 5 disease types with predictions
- User authentication system
- Prediction history tracking
