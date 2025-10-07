#!/usr/bin/env python3
"""
Simple backend starter script for development
"""
import uvicorn
import os
import sys

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set local development environment variables
os.environ["DATABASE_URL"] = "postgresql://postgres:password@localhost:5432/health_predictor"
os.environ["ALLOWED_ORIGINS"] = "http://localhost:3000,http://localhost:3001"

if __name__ == "__main__":
    try:
        from app.main import app
        print("✅ App imported successfully")
        print("✅ Starting server on http://0.0.0.0:8001")
        
        # Start the server
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=8001,
            log_level="info",
            reload=False
        )
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)