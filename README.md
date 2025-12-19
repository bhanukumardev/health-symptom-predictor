# 🏥 Health Symptom Predictor

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-316192?logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?logo=typescript)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel)

**An AI-powered health application that predicts potential diseases based on user-reported symptoms**

---

## 🚀 Try Now - Live Demo

<div align="center">

### 👉 **[Launch Health Symptom Predictor](https://health-symptom-predictor.vercel.app)** 👈

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Try_Now-brightgreen?style=for-the-badge)](https://health-symptom-predictor.vercel.app)

*Experience the power of AI-driven health predictions in real-time!*

</div>

---

## ✨ Features

### 🤖 AI-Powered Health Assistant
- **Intelligent Symptom Analysis**: Machine learning-based disease prediction
- **AI Chatbot**: Groq LLM-powered health assistant supporting English, Hindi, and Hinglish
- **Personalized Recommendations**: Age, gender, and weight-based medicine suggestions
- **Multilingual Support**: Full bilingual interface (English & Hindi)

### 👤 User Management
- Secure authentication with JWT tokens
- User profile management with health metrics
- Prediction history tracking
- Password hashing with bcrypt

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Adaptive Layouts**: Portrait and landscape support
- **Touch-Friendly**: Mobile-optimized interactions
- **PWA-Ready**: Progressive Web App capabilities

### 🔔 Smart Notifications
- **Real-time Updates**: Health tips and reminders
- **Personalized AI Tips**: Groq-powered health insights
- **Bilingual**: Notifications in English & Hindi
- **Mobile Optimized**: Full-screen modal on mobile devices

### 🏥 Health Features
- Symptom-based disease prediction with confidence scores
- Detailed disease information and descriptions
- Medicine recommendations with proper dosage
- Home remedies and precautions
- Emergency warning signs
- Comprehensive prediction history

### 🔐 Admin Dashboard
- User management and monitoring
- System statistics and analytics
- Prediction tracking and oversight
- Admin-only access control with role-based permissions

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.10
- **Styling**: Tailwind CSS 3.4.13
- **State Management**: Zustand 4.5.4
- **Routing**: React Router DOM 6.26.2
- **HTTP Client**: Axios 1.7.7
- **UI Components**: Lucide React, React Icons
- **Internationalization**: i18next, react-i18next

### Backend
- **Framework**: FastAPI 0.104.1
- **Language**: Python 3.9+
- **Database**: PostgreSQL 12+ (Supabase)
- **ORM**: SQLAlchemy 2.0+
- **Authentication**: JWT (python-jose)
- **Password Hashing**: bcrypt
- **ASGI Server**: Uvicorn 0.24.0
- **AI Integration**: Groq LLM API

### Database & Cloud
- **Database**: Supabase PostgreSQL (Cloud-hosted)
- **Hosting**: Vercel (Frontend & Backend)
- **AI**: Groq API (LLaMA 3 models)
- **Version Control**: Git & GitHub

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Python 3.9 or higher**
- **Node.js 16+ and npm**
- **Git**
- **Groq API Key** ([Get one free](https://console.groq.com/))
- **Vercel Account** (for deployment, [Sign up free](https://vercel.com/))

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/bhanukumardev/health-symptom-predictor.git
cd health-symptom-predictor
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create `backend/.env`:

```env
DATABASE_URL=postgresql://postgres.txhohvmugqptewlvuhfn:Bhanu123%40@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
SECRET_KEY=your-secret-key-generate-strong-random-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GROQ_API_KEY=your-groq-api-key-here
ENVIRONMENT=development
DEBUG=True
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8888
```

### 4. Run Locally

#### Start Backend Server

```bash
cd backend
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
uvicorn app.main:app --reload --host 0.0.0.0 --port 8888
```

✅ Backend available at:
- API: http://localhost:8888
- Docs: http://localhost:8888/docs

#### Start Frontend Server

```bash
cd frontend
npm run dev
```

✅ Frontend available at: **http://localhost:3000**

---

## 🌐 Deployment to Vercel

### 📖 Complete Deployment Guide

**For detailed step-by-step instructions, see:**

👉 **[VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md)**

### Quick Deploy Commands

**Frontend:**
```bash
cd frontend
vercel --prod
```

**Backend:**
```bash
cd backend
vercel --prod
```

### Required Environment Variables for Production

**Backend (Vercel Dashboard):**
```env
DATABASE_URL=postgresql://postgres.txhohvmugqptewlvuhfn:Bhanu123%40@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
SECRET_KEY=<your-secret-key>
GROQ_API_KEY=<your-groq-api-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=production
DEBUG=False
```

**Frontend (Vercel Dashboard):**
```env
VITE_API_URL=https://your-backend.vercel.app
```

---

## 📁 Project Structure

```
health-symptom-predictor/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── store/           # State management
│   ├── vercel.json          # Vercel config
│   └── package.json
│
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Configuration
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── main.py
│   ├── vercel.json         # Vercel config
│   └── requirements.txt
│
├── vercel.json              # Root Vercel config
├── VERCEL_DEPLOYMENT_GUIDE.md
└── README.md                # This file
```

---

## 🔌 API Documentation

### Live API Documentation

Once backend is running:
- **Swagger UI**: http://localhost:8888/docs
- **ReDoc**: http://localhost:8888/redoc

### Key API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login (JWT)
- `GET /api/auth/me` - Current user info

#### Predictions
- `POST /api/predictions/predict` - Predict disease
- `GET /api/predictions/history` - Prediction history
- `DELETE /api/predictions/history/{id}` - Delete prediction

#### Notifications
- `GET /api/notifications` - Get notifications
- `POST /api/notifications/generate` - Generate AI tip
- `PUT /api/notifications/{id}/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all read
- `DELETE /api/notifications/{id}` - Delete notification

#### User Profile
- `GET /api/user/profile` - Get profile
- `PUT /api/user/profile` - Update profile

#### Admin
- `GET /api/admin/users` - All users
- `GET /api/admin/stats` - Statistics

#### Chat
- `POST /api/chat` - AI health assistant

---

## 🔒 Security Features

- ✅ **Password Hashing**: bcrypt
- ✅ **JWT Authentication**: Secure tokens
- ✅ **CORS Protection**: Configured origins
- ✅ **SQL Injection Prevention**: SQLAlchemy ORM
- ✅ **Input Validation**: Pydantic
- ✅ **HTTPS**: Enforced (Vercel)
- ✅ **Environment Variables**: Protected
- ✅ **Rate Limiting**: API protection

---

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

---

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Check Python version (3.9+)
- Verify dependencies: `pip install -r requirements.txt`
- Check DATABASE_URL

**Frontend won't connect:**
- Verify VITE_API_URL in `.env`
- Check backend is running
- Check CORS settings

**Database connection error:**
- Verify DATABASE_URL format
- Check Supabase is accessible

---

## ⚠️ Disclaimer

**IMPORTANT MEDICAL DISCLAIMER**

This application is for **educational purposes only** and should **NOT** replace professional medical advice.

- Always consult healthcare providers
- Never ignore professional medical advice
- In emergencies, call local emergency services
- AI predictions are not 100% accurate

---

## 👥 Author

**Bhanu Kumar Dev**
- GitHub: [@bhanukumardev](https://github.com/bhanukumardev)

---

## 🙏 Acknowledgments

- Groq AI for LLM inference
- Supabase for database
- Vercel for deployment
- FastAPI & React communities

---

## 📞 Support

- 📧 Email: kumarbhanu818@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/bhanukumardev/health-symptom-predictor/issues)

---

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by Bhanu Kumar Dev
