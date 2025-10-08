# 🏥 Health Symptom Predictor# 🏥 Health Symptom Predictor



<div align="center"><div align="center">



![Health Predictor](https://img.shields.io/badge/Health-Predictor-blue)![Health Predictor](https://img.shields.io/badge/Health-Predictor-blue)

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)

![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688?logo=fastapi)![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688?logo=fastapi)

![Python](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python)![Python](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python)

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-316192?logo=postgresql)![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-316192?logo=postgresql)

![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?logo=typescript)![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?logo=typescript)

![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel)

**An AI-powered health application that predicts potential diseases based on user-reported symptoms**

**An AI-powered health application that predicts potential diseases based on user-reported symptoms**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Deployment](#-deployment)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Deployment](#-deployment) • [API Docs](#-api-documentation)

</div>

</div>

---

---

## ✨ Features

## ✨ Features

### 🤖 AI-Powered Health Assistant

### 🤖 AI-Powered Health Assistant- **Intelligent Symptom Analysis**: Machine learning-based disease prediction

- **Intelligent Symptom Analysis**: Machine learning-based disease prediction- **AI Chatbot**: Groq LLM-powered health assistant supporting English, Hindi, and Hinglish

- **AI Chatbot**: Groq LLM-powered health assistant supporting English, Hindi, and Hinglish- **Personalized Recommendations**: Age, gender, and weight-based medicine suggestions

- **Personalized Recommendations**: Age, gender, and weight-based medicine suggestions- **Multilingual Support**: Full bilingual interface (English & Hindi)

- **Multilingual Support**: Full bilingual interface (English & Hindi)

### 👤 User Management

### 👤 User Management- Secure authentication with JWT tokens

- Secure authentication with JWT tokens- User profile management with health metrics

- User profile management with health metrics- Prediction history tracking

- Prediction history tracking- Password hashing with bcrypt

- Password hashing with bcrypt

### 🏥 Health Features

### 📱 Responsive Design- Symptom-based disease prediction

- **Mobile-First**: Optimized for all screen sizes- Detailed disease information

- **Adaptive Layouts**: Portrait and landscape support- Medicine recommendations with dosage

- **Touch-Friendly**: Mobile-optimized interactions- Home remedies and precautions

- **PWA-Ready**: Progressive Web App capabilities- Emergency warning signs



### 🔔 Smart Notifications### 🔐 Admin Dashboard

- **Real-time Updates**: Health tips and reminders- User management

- **Personalized AI Tips**: Groq-powered health insights- System statistics

- **Bilingual**: Notifications in English & Hindi- Prediction monitoring

- **Mobile Optimized**: Full-screen modal on mobile devices- Admin-only access control



### 🏥 Health Features---

- Symptom-based disease prediction with confidence scores

- Detailed disease information and descriptions## 🏗️ Tech Stack

- Medicine recommendations with proper dosage

- Home remedies and precautions### Frontend

- Emergency warning signs- **Framework**: React 18.3.1 with TypeScript

- Comprehensive prediction history- **Build Tool**: Vite 5.4.10

- **Styling**: Tailwind CSS 3.4.13

### 🔐 Admin Dashboard- **State Management**: Zustand 4.5.4

- User management and monitoring- **Routing**: React Router DOM 6.26.2

- System statistics and analytics- **HTTP Client**: Axios 1.7.7

- Prediction tracking and oversight- **UI Components**: Lucide React, React Icons

- Admin-only access control with role-based permissions- **Internationalization**: i18next, react-i18next



---### Backend

- **Framework**: FastAPI 0.104.1

## 🏗️ Tech Stack- **Language**: Python 3.9+

- **Database**: PostgreSQL 12+

### Frontend- **ORM**: SQLAlchemy 2.0+

- **Framework**: React 18.3.1 with TypeScript- **Authentication**: JWT (python-jose)

- **Build Tool**: Vite 5.4.10- **Password Hashing**: bcrypt

- **Styling**: Tailwind CSS 3.4.13- **ASGI Server**: Uvicorn 0.24.0

- **State Management**: Zustand 4.5.4- **AI Integration**: Groq LLM API

- **Routing**: React Router DOM 6.26.2

- **HTTP Client**: Axios 1.7.7### Database

- **UI Components**: Lucide React, React Icons- **PostgreSQL 12+**

- **Internationalization**: i18next, react-i18next- Persistent data storage

- **Date Handling**: date-fns 4.1.0- User authentication

- Prediction history

### Backend- Admin management

- **Framework**: FastAPI 0.104.1

- **Language**: Python 3.9+---

- **Database**: Supabase PostgreSQL

- **ORM**: SQLAlchemy 2.0+## 📋 Prerequisites

- **Authentication**: JWT (python-jose)

- **Password Hashing**: bcryptBefore you begin, ensure you have the following installed:

- **ASGI Server**: Uvicorn 0.24.0

- **AI Integration**: Groq LLM API- **Python 3.9 or higher**

- **Database Adapter**: psycopg2-binary- **Node.js 16+ and npm**

- **PostgreSQL 12+**

### Database & Cloud- **Git**

- **Database**: Supabase PostgreSQL (Cloud-hosted)- **Groq API Key** (Get one free at [console.groq.com](https://console.groq.com/))

- **Hosting**: Vercel (Frontend & Backend)

- **AI**: Groq API (LLaMA 3 models)---

- **Version Control**: Git & GitHub

## 🚀 Installation

---

### 1. Clone the Repository

## 📋 Prerequisites

```bash

Before you begin, ensure you have:git clone https://github.com/YOUR_USERNAME/health-symptom-predictor.git

cd health-symptom-predictor

- **Python 3.9 or higher**```

- **Node.js 16+ and npm**

- **Git**### 2. Backend Setup

- **Groq API Key** ([Get one free](https://console.groq.com/))

- **Vercel Account** (for deployment, [Sign up free](https://vercel.com))```bash

# Navigate to backend directory

---cd backend



## 🚀 Quick Start# Create virtual environment

python -m venv venv

### 1. Clone the Repository

# Activate virtual environment

```bash# On Windows:

git clone https://github.com/bhanukumardev/health-symptom-predictor.git.\venv\Scripts\activate

cd health-symptom-predictor# On macOS/Linux:

```source venv/bin/activate



### 2. Backend Setup# Install dependencies

pip install -r requirements.txt

```bash

# Navigate to backend directory# Create .env file from example

cd backendcopy .env.example .env  # Windows

cp .env.example .env    # macOS/Linux

# Create virtual environment

python -m venv venv# Edit .env and add your configuration

# IMPORTANT: Add your GROQ_API_KEY and DATABASE_URL

# Activate virtual environment```

# On Windows:

venv\Scripts\activate### 3. Database Setup

# On macOS/Linux:

source venv/bin/activate```bash

# Create PostgreSQL database

# Install dependenciescreatedb health_predictor

pip install -r requirements.txt

```# Or using psql:

psql -U postgres

Create `backend/.env`:CREATE DATABASE health_predictor;

```env\q

DATABASE_URL=postgresql://postgres.txhohvmugqptewlvuhfn:Bhanu123%40@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require

SECRET_KEY=your-secret-key-generate-strong-random-key# Update DATABASE_URL in backend/.env

ALGORITHM=HS256DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/health_predictor

ACCESS_TOKEN_EXPIRE_MINUTES=30```

GROQ_API_KEY=your-groq-api-key-here

ENVIRONMENT=development### 4. Frontend Setup

DEBUG=True

``````bash

# Navigate to frontend directory

### 3. Frontend Setupcd ../frontend



```bash# Install dependencies

# Navigate to frontend directorynpm install

cd ../frontend

# Create .env file from example

# Install dependenciescopy .env.example .env  # Windows

npm installcp .env.example .env    # macOS/Linux

```

# Edit .env if needed (default points to localhost:8000)

Create `frontend/.env`:```

```env

VITE_API_URL=http://localhost:8000---

```

## 🎯 Usage

### 4. Run Locally

### Running Locally

#### Start Backend

#### Start Backend Server

```bash

cd backend```bash

venv\Scripts\activate  # Windowscd backend

source venv/bin/activate  # macOS/Linux.\venv\Scripts\activate  # Windows

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000source venv/bin/activate # macOS/Linux

```

uvicorn app.main:app --reload --host 0.0.0.0 --port 8888

✅ Backend available at:```

- **API**: http://localhost:8000

- **API Docs**: http://localhost:8000/docsBackend will be available at:

- **Health Check**: http://localhost:8000/health- API: http://localhost:8888

- Docs: http://localhost:8888/docs

#### Start Frontend

#### Start Frontend Server

```bash

cd frontend```bash

npm run devcd frontend

```npm run dev

```

✅ Frontend available at: **http://localhost:3000**

Frontend will be available at: http://localhost:3000

---

---

## 🌐 Deployment to Vercel

## 🔧 Configuration

### 📖 Complete Deployment Guide

### Backend Environment Variables

**For detailed step-by-step instructions, see:**

👉 **[VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)**Create `backend/.env` with the following:



### Quick Deploy Commands```env

# Database

**Frontend:**DATABASE_URL=postgresql://postgres:password@localhost:5432/health_predictor

```bash

cd frontend# Security

vercel --prodSECRET_KEY=your-secret-key-generate-strong-random-key

```ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=30

**Backend:**

```bash# Groq AI (Required for chatbot)

cd backendGROQ_API_KEY=your-groq-api-key-here

vercel --prod

```# Application

ENVIRONMENT=development

### Required Environment Variables for ProductionDEBUG=True

```

**Backend (Vercel Dashboard):**

```env### Frontend Environment Variables

DATABASE_URL=postgresql://postgres.txhohvmugqptewlvuhfn:Bhanu123%40@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require

SECRET_KEY=<generate-strong-random-key>Create `frontend/.env` with:

GROQ_API_KEY=<your-groq-api-key>

ALGORITHM=HS256```env

ACCESS_TOKEN_EXPIRE_MINUTES=30VITE_API_URL=http://localhost:8888

ENVIRONMENT=production```

DEBUG=False

```---



**Frontend (Vercel Dashboard):**## 📦 Project Structure

```env

VITE_API_URL=https://your-backend.vercel.app```

```health-symptom-predictor/

├── backend/

### Current Live Production URLs│   ├── app/

│   │   ├── api/          # API routes

- **Frontend**: https://health-symptom-predictor.netlify.app│   │   ├── core/         # Core configuration

- **Backend**: https://health-symptom-predictor.onrender.com│   │   ├── models/       # Database models

- **API Docs**: https://health-symptom-predictor.onrender.com/docs│   │   ├── schemas/      # Pydantic schemas

│   │   └── services/     # Business logic

---│   ├── requirements.txt

│   ├── .env.example

## 📁 Project Structure│   └── start.ps1

├── frontend/

```│   ├── src/

health-symptom-predictor/│   │   ├── components/   # React components

├── frontend/                      # React TypeScript frontend│   │   ├── pages/        # Page components

│   ├── public/│   │   ├── services/     # API services

│   │   └── locales/              # Translations (en, hi)│   │   └── store/        # Zustand stores

│   ├── src/│   ├── package.json

│   │   ├── components/           # UI components│   └── .env.example

│   │   │   ├── NotificationDropdown.tsx├── ml-model/             # Machine learning models

│   │   │   ├── LanguageSwitcher.tsx├── database/             # Database migrations

│   │   │   └── ...├── .gitignore

│   │   ├── pages/                # Page components└── README.md

│   │   ├── services/             # API services```

│   │   ├── store/                # State management

│   │   └── App.tsx---

│   ├── vercel.json               # Vercel config

│   ├── package.json## 🌐 API Documentation

│   └── vite.config.ts

│Once the backend is running, visit:

├── backend/                       # FastAPI backend- **Swagger UI**: http://localhost:8888/docs

│   ├── app/- **ReDoc**: http://localhost:8888/redoc

│   │   ├── api/                  # API routes

│   │   ├── core/                 # Configuration### Key Endpoints

│   │   ├── models/               # Database models

│   │   ├── schemas/              # Pydantic schemas- `POST /api/auth/register` - User registration

│   │   ├── services/             # Business logic- `POST /api/auth/login` - User login

│   │   └── main.py- `POST /api/predictions/predict` - Disease prediction

│   ├── vercel.json               # Vercel config- `POST /api/chat` - AI health assistant

│   └── requirements.txt- `GET /api/user/profile` - Get user profile

│- `GET /api/predictions/history` - Prediction history

├── vercel.json                    # Root Vercel config

├── VERCEL_DEPLOYMENT_GUIDE.md    # Deployment guide---

└── README.md                      # This file

```- **Pydantic** for data validation



---### 1. Prerequisites- **JWT** for authentication



## 🔌 API Documentation- PostgreSQL 12+ (installed and running)- **Uvicorn** as ASGI server



### Live API Documentation- Python 3.9+



Once backend is running:- Node.js 16+### Database

- **Swagger UI**: http://localhost:8000/docs

- **ReDoc**: http://localhost:8000/redoc- **PostgreSQL** for relational data storage



### Key API Endpoints### 2. Setup Database- **Alembic** for database migrations



#### Authentication```powershell

- `POST /api/auth/register` - Register new user

- `POST /api/auth/login` - User login (JWT)cd backend### AI/ML

- `GET /api/auth/me` - Current user info

& ".\venv\Scripts\Activate.ps1"- **scikit-learn** for machine learning models

#### Predictions

- `POST /api/predictions/predict` - Predict diseasepython setup_postgres.py    # Creates database- **pandas** for data processing

- `GET /api/predictions/history` - Prediction history

- `DELETE /api/predictions/history/{id}` - Delete predictionpython init_db.py           # Creates tables- **joblib** for model serialization



#### Notificationspython seed_data.py         # Adds initial data- **TensorFlow** (optional for advanced models)

- `GET /api/notifications` - Get notifications

- `POST /api/notifications/generate` - Generate AI tippython create_admin.py      # Creates admin user

- `PUT /api/notifications/{id}/read` - Mark as read

- `PUT /api/notifications/mark-all-read` - Mark all read```### DevOps

- `DELETE /api/notifications/{id}` - Delete notification

- **Docker** & **Docker Compose** for containerization

#### User Profile

- `GET /api/user/profile` - Get profile### 3. Start Application- **pytest** for backend testing

- `PUT /api/user/profile` - Update profile

```powershell- **Jest** for frontend testing

#### Admin

- `GET /api/admin/users` - All users.\start.ps1

- `GET /api/admin/stats` - Statistics

```## 📁 Project Structure

#### Chat

- `POST /api/chat` - AI health assistant



---### 4. Access```



## 🔒 Security Features- **Frontend**: http://localhost:3000health-symptom-predictor/



- ✅ **Password Hashing**: bcrypt- **Backend**: http://localhost:8000├── frontend/                 # React TypeScript frontend

- ✅ **JWT Authentication**: Secure tokens

- ✅ **CORS Protection**: Configured origins- **API Docs**: http://localhost:8000/docs│   ├── src/

- ✅ **SQL Injection Prevention**: SQLAlchemy ORM

- ✅ **Input Validation**: Pydantic│   │   ├── components/      # Reusable UI components

- ✅ **HTTPS**: Enforced (Vercel)

- ✅ **Environment Variables**: Protected### 5. Login│   │   ├── pages/          # Page components

- ✅ **Rate Limiting**: API protection

- **Email**: kumarbhanu818@gmail.com│   │   ├── services/       # API service layer

---

- **Password**: Bhanu123@│   │   ├── types/          # TypeScript type definitions

## 🧪 Testing

│   │   ├── utils/          # Utility functions

```bash

# Backend tests## 📁 Project Structure│   │   └── App.tsx         # Main app component

cd backend

pytest│   ├── package.json



# Frontend tests```│   └── vite.config.ts

cd frontend

npm testhealth-symptom-predictor/│

```

├── backend/                    # FastAPI + PostgreSQL├── backend/                 # FastAPI backend

---

│   ├── app/│   ├── app/

## 🐛 Troubleshooting

│   │   ├── api/               # REST endpoints│   │   ├── api/            # API routes

### Common Issues

│   │   ├── core/              # Config (PostgreSQL only)│   │   ├── core/           # Core configuration

**Backend won't start:**

- Check Python version (3.9+)│   │   ├── models/            # SQLAlchemy models│   │   ├── models/         # SQLAlchemy models

- Verify dependencies: `pip install -r requirements.txt`

- Check DATABASE_URL│   │   ├── schemas/           # Pydantic schemas│   │   ├── schemas/        # Pydantic schemas



**Frontend won't connect:**│   │   └── services/          # ML service│   │   ├── services/       # Business logic

- Verify VITE_API_URL in `.env`

- Check backend is running│   ├── setup_postgres.py      # Database creator│   │   └── main.py         # FastAPI app entry

- Check CORS settings

│   ├── init_db.py             # Table initializer│   ├── requirements.txt

**Database connection error:**

- Verify DATABASE_URL format│   ├── seed_data.py           # Data seeder│   └── alembic/            # Database migrations

- Check Supabase is accessible

│   ├── create_admin.py        # Admin creator│

---

│   └── start-backend.ps1      # Backend starter├── ml-model/               # AI/ML model

## 📊 Database Schema

││   ├── data/               # Training datasets

### Tables

├── frontend/                   # React + Vite│   ├── notebooks/          # Jupyter notebooks for exploration

**users**: User accounts and profiles

**predictions**: Disease predictions history│   ├── src/│   ├── src/

**notifications**: User notifications

**admin_actions**: Admin activity log│   │   ├── pages/             # UI pages│   │   ├── train.py        # Model training script



---│   │   ├── services/          # API client│   │   ├── predict.py      # Prediction service



## ⚠️ Disclaimer│   │   └── lib/               # Utilities│   │   └── preprocessing.py # Data preprocessing



**IMPORTANT MEDICAL DISCLAIMER**│   └── package.json│   ├── models/             # Saved models



This application is for **educational purposes only** and should **NOT** replace professional medical advice.││   └── requirements.txt



- Always consult healthcare providers├── start.ps1                   # Main startup script│

- Never ignore professional medical advice

- In emergencies, call local emergency services└── README.md                   # This file├── database/

- AI predictions are not 100% accurate

```│   ├── init.sql            # Initial schema

---

│   └── seeds/              # Seed data

## 👥 Author

## 🎯 Features│

**Bhanu Kumar Dev**

- GitHub: [@bhanukumardev](https://github.com/bhanukumardev)├── docker-compose.yml      # Docker orchestration

- Email: kumarbhanu818@gmail.com

1. **User Authentication** - JWT-based, stored in PostgreSQL└── .env.example           # Environment variables template

---

2. **Disease Prediction** - ML-powered symptom analysis```

## 🙏 Acknowledgments

3. **History Tracking** - All predictions saved to PostgreSQL

- Groq AI for LLM inference

- Supabase for database4. **Feedback System** - User ratings and comments## 🚀 Getting Started

- Vercel for deployment

- FastAPI & React communities5. **Admin Dashboard** - User and prediction management



---### Prerequisites



## 📞 Support## 🔌 API Endpoints- Node.js 18+ and npm



- 📧 Email: kumarbhanu818@gmail.com- Python 3.9+

- 🐛 Issues: [GitHub Issues](https://github.com/bhanukumardev/health-symptom-predictor/issues)

### Auth- PostgreSQL 14+

---

- `POST /api/auth/register` - Create account- Docker & Docker Compose (optional)

<div align="center">

- `POST /api/auth/login` - Get JWT token

**⭐ Star this repo if you find it helpful!**

- `GET /api/auth/me` - Current user info### Installation

Made with ❤️ by Bhanu Kumar Dev



</div>

### Predictions#### 1. Clone the repository

- `POST /api/predictions/predict` - Analyze symptoms```bash

- `GET /api/predictions/history` - User historycd health-symptom-predictor

- `POST /api/predictions/feedback` - Submit rating```



### Admin#### 2. Setup Backend

- `GET /api/admin/users` - All users```bash

- `GET /api/admin/predictions` - All predictionscd backend

- `GET /api/admin/feedback` - All feedbackpython -m venv venv

# On Windows

## 💾 Database Schemavenv\Scripts\activate

# On Unix/MacOS

### Tables (PostgreSQL)source venv/bin/activate

1. **users** - Accounts, profiles, auth tokens

2. **symptoms** - Symptom catalogpip install -r requirements.txt

3. **diseases** - Disease information```

4. **predictions** - User prediction history

5. **feedback** - Prediction ratingsCreate `.env` file in backend directory:

```env

## 🛠️ MaintenanceDATABASE_URL=postgresql://user:password@localhost:5432/health_db

SECRET_KEY=your-secret-key-here

### BackupALGORITHM=HS256

```bashACCESS_TOKEN_EXPIRE_MINUTES=30

pg_dump -U postgres health_predictor > backup.sql```

```

Run migrations:

### Restore```bash

```bashalembic upgrade head

psql -U postgres health_predictor < backup.sql```

```

Start backend:

### Reset Database```bash

```powershelluvicorn app.main:app --reload

cd backend```

& ".\venv\Scripts\Activate.ps1"

python -c "from app.core.database import Base, engine; Base.metadata.drop_all(engine)"Backend API: http://localhost:8000

python init_db.pyAPI Docs: http://localhost:8000/docs

python seed_data.py

python create_admin.py#### 3. Setup Frontend

``````bash

cd frontend

### View Datanpm install

```bashnpm run dev

psql -U postgres -d health_predictor```



\dt                                    # List tablesFrontend: http://localhost:5173

SELECT * FROM users;                   # View users

SELECT * FROM predictions LIMIT 10;    # View predictions#### 4. Train ML Model

``````bash

cd ml-model

## ⚙️ Configuration Filespip install -r requirements.txt

python src/train.py

### PostgreSQL Hardcoded In:```

1. `backend/app/core/config.py` - Default DATABASE_URL

2. `backend/start-backend.ps1` - Environment variable### Using Docker (Recommended)

3. `backend/setup_postgres.py` - Database credentials```bash

docker-compose up -d

**No other database options available.**```



## 🐛 TroubleshootingThis will start:

- Frontend on http://localhost:5173

### PostgreSQL not running- Backend on http://localhost:8000

```powershell- PostgreSQL on localhost:5432

Get-Service postgresql*

Start-Service postgresql-x64-XX## 📊 Database Schema

```

### Users Table

### Can't connect to database- `id` (Primary Key)

```bash- `email` (Unique)

# Test connection- `hashed_password`

psql -U postgres -d health_predictor- `full_name`

- `age`

# Check port- `created_at`

netstat -ano | findstr :5432

```### Symptoms Table

- `id` (Primary Key)

### Port conflicts- `name` (Unique)

```powershell- `description`

# Kill backend (port 8000)- `severity_level`

Get-Process | Where-Object {$_.ProcessName -like "*python*"} | Stop-Process -Force

### Diseases Table

# Kill frontend (port 3000)- `id` (Primary Key)

Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force- `name` (Unique)

```- `description`

- `precautions`

## 🏭 Production- `severity`



For production deployment:### Predictions Table

1. Change `SECRET_KEY` (use secure random string)- `id` (Primary Key)

2. Use environment variables for credentials- `user_id` (Foreign Key)

3. Enable PostgreSQL SSL- `symptoms` (JSON)

4. Use connection pooling (pgBouncer)- `predicted_disease`

5. Set up automated backups- `confidence_score`

6. Configure proper CORS origins- `timestamp`



## ✅ Why PostgreSQL Only?### Feedback Table

- `id` (Primary Key)

- ✅ Production-ready reliability- `prediction_id` (Foreign Key)

- ✅ ACID transactions- `is_accurate`

- ✅ Concurrent user support- `actual_diagnosis`

- ✅ Advanced JSON support- `comments`

- ✅ Full-text search

- ✅ Industry standard## 🔌 API Endpoints

- ✅ Excellent performance

### Authentication

**SQLite, MongoDB, MySQL, Oracle not supported.**- `POST /api/auth/register` - Register new user

- `POST /api/auth/login` - User login

## 📝 License- `GET /api/auth/me` - Get current user



MIT License - See LICENSE file### Symptoms

- `GET /api/symptoms` - List all symptoms

## 👤 Author- `POST /api/symptoms` - Add user symptoms



Health Symptom Predictor Team### Predictions

- `POST /api/predict` - Get disease prediction

---- `GET /api/predictions/history` - User's prediction history

- `POST /api/predictions/feedback` - Submit feedback

**Database**: PostgreSQL 🐘 | **Backend**: FastAPI ⚡ | **Frontend**: React ⚛️

### Admin
- `GET /api/admin/diseases` - Manage diseases
- `GET /api/admin/stats` - System statistics

## 🤖 ML Model Details

### Algorithm
- **Random Forest Classifier** for multi-class classification
- **Feature Engineering**: Symptom combinations and severity
- **Training Data**: Public health datasets + synthetic data

### Model Performance Metrics
- Accuracy
- Precision, Recall, F1-Score
- Confusion Matrix
- ROC-AUC Score

### Model Retraining
Models are retrained periodically using user feedback to improve accuracy.

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📈 Features

- ✅ User authentication (JWT)
- ✅ Multi-symptom input
- ✅ AI-powered disease prediction
- ✅ Confidence score display
- ✅ Prediction history
- ✅ User feedback mechanism
- ✅ Explainable AI (feature importance)
- ✅ Admin dashboard
- ✅ Responsive design

## 🔒 Security Considerations

- Password hashing with bcrypt
- JWT token authentication
- CORS configuration
- SQL injection prevention (SQLAlchemy)
- Input validation (Pydantic)
- Rate limiting on API endpoints

## ⚠️ Disclaimer

This application is for educational purposes only and should NOT be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider.

## 📝 License

MIT License

## 👥 Contributing

Contributions are welcome! Please read CONTRIBUTING.md for details.

## 📧 Contact

For questions or support, please open an issue on GitHub.
