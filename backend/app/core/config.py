from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union
from pydantic import field_validator
import os


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
    
    # CORS - Handle as Union to be more flexible
    ALLOWED_ORIGINS: Union[str, List[str]] = "http://localhost:3000"
    
    @field_validator('ALLOWED_ORIGINS', mode='before')
    @classmethod
    def parse_allowed_origins(cls, v):
        # If it's already a list, return it
        if isinstance(v, list):
            return v
        # If it's a string, convert to list
        if isinstance(v, str):
            # Handle comma-separated string format
            if ',' in v:
                return [origin.strip() for origin in v.split(',')]
            # Handle single origin string
            else:
                return [v.strip()]
        # Default fallback
        return ["http://localhost:3000"]
    
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
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Ensure ALLOWED_ORIGINS is always a list after initialization
        if isinstance(self.ALLOWED_ORIGINS, str):
            if ',' in self.ALLOWED_ORIGINS:
                self.ALLOWED_ORIGINS = [origin.strip() for origin in self.ALLOWED_ORIGINS.split(',')]
            else:
                self.ALLOWED_ORIGINS = [self.ALLOWED_ORIGINS.strip()]


settings = Settings()
