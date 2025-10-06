from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union
from pydantic import field_validator


class Settings(BaseSettings):
    # API Settings
    PROJECT_NAME: str = "Health Symptom Predictor"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Security
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database - PostgreSQL only
    DATABASE_URL: str = "postgresql://postgres:Bhanu123%40@localhost:5432/health_predictor"
    
    # CORS - Can be string or list
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
    ]
    
    @field_validator('ALLOWED_ORIGINS', mode='before')
    @classmethod
    def parse_allowed_origins(cls, v):
        if isinstance(v, str):
            # Handle comma-separated string format
            if ',' in v:
                return [origin.strip() for origin in v.split(',')]
            # Handle single origin string
            else:
                return [v.strip()]
        return v
    
    # ML Model
    MODEL_PATH: str = "../ml-model/models/disease_predictor.pkl"
    
    # Groq LLM API - Will be loaded from .env file
    GROQ_API_KEY: str = ""
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
