import os
from typing import List
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings:
    # API Settings
    PROJECT_NAME: str = "Health Symptom Predictor"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database - PostgreSQL with SSL support for Render PostgreSQL v17
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/health_predictor")
    
    @property
    def DATABASE_URL_WITH_SSL(self) -> str:
        """Returns database URL with proper SSL configuration for production"""
        db_url = self.DATABASE_URL
        if "render.com" in db_url or "amazonaws.com" in db_url:
            # Add SSL parameters for cloud databases
            if "?" not in db_url:
                db_url += "?sslmode=require"
            else:
                db_url += "&sslmode=require"
        return db_url
    
    # CORS - Simple approach
    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
        if isinstance(origins, str):
            if ',' in origins:
                return [origin.strip() for origin in origins.split(',')]
            else:
                return [origins.strip()]
        return origins
    
    # ML Model
    MODEL_PATH: str = "../ml-model/models/disease_predictor.pkl"
    
    # Groq LLM API
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True


settings = Settings()


settings = Settings()
