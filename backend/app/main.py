from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, symptoms, predictions, admin, chat, profile
from app.routers import notifications
from app.core.config import settings

app = FastAPI(
    title="Health Symptom Predictor API",
    description="AI-powered disease prediction system based on symptoms",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware - CRITICAL: Must be before routers
# Explicitly evaluate ALLOWED_ORIGINS property
allowed_origins = settings.ALLOWED_ORIGINS
print(f"CORS: Allowing origins: {allowed_origins}")  # Debug log

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(profile.router, prefix="/api/user", tags=["User Profile"])
app.include_router(symptoms.router, prefix="/api/symptoms", tags=["Symptoms"])
app.include_router(predictions.router, prefix="/api/predictions", tags=["Predictions"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(notifications.router, tags=["Notifications"])

@app.get("/")
async def root():
    return {
        "message": "Health Symptom Predictor API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
