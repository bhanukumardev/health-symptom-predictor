# 🏥 Health Symptom Predictor

<div align="center">

![Health Predictor](https://img.shields.io/badge/Health-Predictor-blue)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-316192?logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?logo=typescript)

**An AI-powered health application that predicts potential diseases based on user-reported symptoms**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Deployment](#-deployment)

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

### 🏥 Health Features
- Symptom-based disease prediction
- Detailed disease information
- Medicine recommendations with dosage
- Home remedies and precautions
- Emergency warning signs

### 🔐 Admin Dashboard
- User management
- System statistics
- Prediction monitoring
- Admin-only access control

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
- **Database**: PostgreSQL 12+
- **ORM**: SQLAlchemy 2.0+
- **Authentication**: JWT (python-jose)
- **Password Hashing**: bcrypt
- **ASGI Server**: Uvicorn 0.24.0
- **AI Integration**: Groq LLM API

### Database
- **PostgreSQL 12+**
- Persistent data storage
- User authentication
- Prediction history
- Admin management

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.9 or higher**
- **Node.js 16+ and npm**
- **PostgreSQL 12+**
- **Git**
- **Groq API Key** (Get one free at [console.groq.com](https://console.groq.com/))

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/health-symptom-predictor.git
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
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from example
copy .env.example .env  # Windows
cp .env.example .env    # macOS/Linux

# Edit .env and add your configuration
# IMPORTANT: Add your GROQ_API_KEY and DATABASE_URL
```

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb health_predictor

# Or using psql:
psql -U postgres
CREATE DATABASE health_predictor;
\q

# Update DATABASE_URL in backend/.env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/health_predictor
```

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env  # Windows
cp .env.example .env    # macOS/Linux

# Edit .env if needed (default points to localhost:8000)
```

---

## 🎯 Usage

### Running Locally

#### Start Backend Server

```bash
cd backend
.\venv\Scripts\activate  # Windows
source venv/bin/activate # macOS/Linux

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs

#### Start Frontend Server

```bash
cd frontend
npm run dev
```

Frontend will be available at: http://localhost:3000

---

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env` with the following:

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/health_predictor

# Security
SECRET_KEY=your-secret-key-generate-strong-random-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Groq AI (Required for chatbot)
GROQ_API_KEY=your-groq-api-key-here

# Application
ENVIRONMENT=development
DEBUG=True
```

### Frontend Environment Variables

Create `frontend/.env` with:

```env
VITE_API_URL=http://localhost:8000
```

---

## 📦 Project Structure

```
health-symptom-predictor/
├── backend/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── core/         # Core configuration
│   │   ├── models/       # Database models
│   │   ├── schemas/      # Pydantic schemas
│   │   └── services/     # Business logic
│   ├── requirements.txt
│   ├── .env.example
│   └── start.ps1
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── store/        # Zustand stores
│   ├── package.json
│   └── .env.example
├── ml-model/             # Machine learning models
├── database/             # Database migrations
├── .gitignore
└── README.md
```

---

## 🌐 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/predictions/predict` - Disease prediction
- `POST /api/chat` - AI health assistant
- `GET /api/user/profile` - Get user profile
- `GET /api/predictions/history` - Prediction history

---

- **Pydantic** for data validation

### 1. Prerequisites- **JWT** for authentication

- PostgreSQL 12+ (installed and running)- **Uvicorn** as ASGI server

- Python 3.9+

- Node.js 16+### Database

- **PostgreSQL** for relational data storage

### 2. Setup Database- **Alembic** for database migrations

```powershell

cd backend### AI/ML

& ".\venv\Scripts\Activate.ps1"- **scikit-learn** for machine learning models

python setup_postgres.py    # Creates database- **pandas** for data processing

python init_db.py           # Creates tables- **joblib** for model serialization

python seed_data.py         # Adds initial data- **TensorFlow** (optional for advanced models)

python create_admin.py      # Creates admin user

```### DevOps

- **Docker** & **Docker Compose** for containerization

### 3. Start Application- **pytest** for backend testing

```powershell- **Jest** for frontend testing

.\start.ps1

```## 📁 Project Structure



### 4. Access```

- **Frontend**: http://localhost:3000health-symptom-predictor/

- **Backend**: http://localhost:8000├── frontend/                 # React TypeScript frontend

- **API Docs**: http://localhost:8000/docs│   ├── src/

│   │   ├── components/      # Reusable UI components

### 5. Login│   │   ├── pages/          # Page components

- **Email**: kumarbhanu818@gmail.com│   │   ├── services/       # API service layer

- **Password**: Bhanu123@│   │   ├── types/          # TypeScript type definitions

│   │   ├── utils/          # Utility functions

## 📁 Project Structure│   │   └── App.tsx         # Main app component

│   ├── package.json

```│   └── vite.config.ts

health-symptom-predictor/│

├── backend/                    # FastAPI + PostgreSQL├── backend/                 # FastAPI backend

│   ├── app/│   ├── app/

│   │   ├── api/               # REST endpoints│   │   ├── api/            # API routes

│   │   ├── core/              # Config (PostgreSQL only)│   │   ├── core/           # Core configuration

│   │   ├── models/            # SQLAlchemy models│   │   ├── models/         # SQLAlchemy models

│   │   ├── schemas/           # Pydantic schemas│   │   ├── schemas/        # Pydantic schemas

│   │   └── services/          # ML service│   │   ├── services/       # Business logic

│   ├── setup_postgres.py      # Database creator│   │   └── main.py         # FastAPI app entry

│   ├── init_db.py             # Table initializer│   ├── requirements.txt

│   ├── seed_data.py           # Data seeder│   └── alembic/            # Database migrations

│   ├── create_admin.py        # Admin creator│

│   └── start-backend.ps1      # Backend starter├── ml-model/               # AI/ML model

││   ├── data/               # Training datasets

├── frontend/                   # React + Vite│   ├── notebooks/          # Jupyter notebooks for exploration

│   ├── src/│   ├── src/

│   │   ├── pages/             # UI pages│   │   ├── train.py        # Model training script

│   │   ├── services/          # API client│   │   ├── predict.py      # Prediction service

│   │   └── lib/               # Utilities│   │   └── preprocessing.py # Data preprocessing

│   └── package.json│   ├── models/             # Saved models

││   └── requirements.txt

├── start.ps1                   # Main startup script│

└── README.md                   # This file├── database/

```│   ├── init.sql            # Initial schema

│   └── seeds/              # Seed data

## 🎯 Features│

├── docker-compose.yml      # Docker orchestration

1. **User Authentication** - JWT-based, stored in PostgreSQL└── .env.example           # Environment variables template

2. **Disease Prediction** - ML-powered symptom analysis```

3. **History Tracking** - All predictions saved to PostgreSQL

4. **Feedback System** - User ratings and comments## 🚀 Getting Started

5. **Admin Dashboard** - User and prediction management

### Prerequisites

## 🔌 API Endpoints- Node.js 18+ and npm

- Python 3.9+

### Auth- PostgreSQL 14+

- `POST /api/auth/register` - Create account- Docker & Docker Compose (optional)

- `POST /api/auth/login` - Get JWT token

- `GET /api/auth/me` - Current user info### Installation



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
