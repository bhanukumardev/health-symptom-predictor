from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, symptoms, predictions, admin, chat, profile
from app.routers import notifications
from app.core.config import settings
import re

app = FastAPI(
    title="Health Symptom Predictor API",
    description="AI-powered disease prediction system based on symptoms",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

"""
CORS configuration
We support both:
- Explicit allowlist via ALLOWED_ORIGINS (comma-separated)
- Optional regex via ALLOWED_ORIGIN_REGEX to match dynamic domains (e.g., *.vercel.app)
"""
allowed_origins = settings.ALLOWED_ORIGINS + ["http://localhost:3000", "http://localhost:3001"]
origin_regex_pattern = settings.ALLOWED_ORIGIN_REGEX
compiled_origin_regex = re.compile(origin_regex_pattern) if origin_regex_pattern else None

print(
    "CORS: Allowing origins:", allowed_origins,
)
if origin_regex_pattern:
    print(f"CORS: Also allowing origins matching regex: {origin_regex_pattern}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=origin_regex_pattern,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
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
