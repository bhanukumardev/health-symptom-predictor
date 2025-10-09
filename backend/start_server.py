#!/usr/bin/env python3
"""
Simple backend starter script for development
"""
import uvicorn
import os
import sys
from pathlib import Path

# Add the backend directory to Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

# Load environment variables from .env file
env_file = Path(backend_dir) / '.env'
if env_file.exists():
    print(f"✅ Loading environment from {env_file}")
    from dotenv import load_dotenv
    load_dotenv(env_file)
else:
    print("⚠️ No .env file found, using defaults")
    # Set local development environment variables as fallback
    os.environ.setdefault("DATABASE_URL", "postgresql://postgres:password@localhost:5432/health_predictor")
    os.environ.setdefault("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001,http://localhost:5173")

if __name__ == "__main__":
    try:
        print("✅ Starting server on http://0.0.0.0:8888")
        print(f"✅ Database URL: {os.environ.get('DATABASE_URL', 'Not set')[:50]}...")
        print(f"✅ Allowed Origins: {os.environ.get('ALLOWED_ORIGINS', 'Not set')}")
        
        # Start the server on port 8888 to match frontend expectations
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8888,
            log_level="info",
            reload=False  # Disable reload for now to debug
        )
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)