#!/usr/bin/env python3
"""
Render Backend Setup Script
Initializes the Render PostgreSQL database with all tables and admin user
"""
import os
import sys
import asyncio
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
import requests
import json

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set production environment variables
os.environ["DATABASE_URL"] = "postgresql://health_predictor_user:WtIo4HLKi9AEveEmlMFYONE3dxWJhfOd@dpg-d3hu2c1gv73c73e0l170-a.oregon-postgres.render.com/health_predictor"
os.environ["ENVIRONMENT"] = "production"
os.environ["DEBUG"] = "False"
os.environ["ALLOWED_ORIGINS"] = "https://health-symptom-predictor.netlify.app,https://health-symptom-predictor.onrender.com,http://localhost:3000,http://localhost:3001"

def test_database_connection():
    """Test connection to Render PostgreSQL database."""
    print("🔍 Testing database connection...")
    try:
        from app.core.config import settings
        from app.core.database import engine
        
        # Test basic connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version();"))
            version = result.fetchone()[0]
            print(f"✅ Database connected successfully!")
            print(f"📊 PostgreSQL Version: {version}")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def create_all_tables():
    """Create all database tables."""
    print("🏗️ Creating database tables...")
    try:
        from app.core.database import engine, Base
        from app.models import models, notification
        
        # Import all models to ensure they're registered
        print("📝 Importing all models...")
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✅ All tables created successfully!")
        
        # List created tables
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT table_name FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name;
            """))
            tables = [row[0] for row in result.fetchall()]
            print(f"📋 Created tables: {', '.join(tables)}")
            
        return True
    except Exception as e:
        print(f"❌ Table creation failed: {e}")
        return False

def create_admin_user():
    """Create admin user if not exists."""
    print("👤 Creating admin user...")
    try:
        from app.core.database import SessionLocal
        from app.models.models import User
        from app.core.security import get_password_hash
        
        db = SessionLocal()
        
        # Check if admin user exists
        admin_user = db.query(User).filter(User.email == "kumarbhanu818@gmail.com").first()
        
        if admin_user:
            print("✅ Admin user already exists!")
            # Update admin status if needed
            if not admin_user.is_admin:
                admin_user.is_admin = True
                db.commit()
                print("🔧 Updated user to admin status!")
        else:
            # Create new admin user
            hashed_password = get_password_hash("Bhanu123@")
            new_admin = User(
                email="kumarbhanu818@gmail.com",
                name="Bhanu Kumar",
                hashed_password=hashed_password,
                is_admin=True,
                is_active=True
            )
            db.add(new_admin)
            db.commit()
            print("✅ Admin user created successfully!")
            print("📧 Email: kumarbhanu818@gmail.com")
            print("🔐 Password: Bhanu123@")
        
        db.close()
        return True
    except Exception as e:
        print(f"❌ Admin user creation failed: {e}")
        return False

def test_backend_endpoints():
    """Test backend API endpoints."""
    print("🧪 Testing backend endpoints...")
    base_url = "https://health-symptom-predictor.onrender.com"
    
    endpoints = [
        "/health",
        "/api/chat/health",
        "/docs"
    ]
    
    for endpoint in endpoints:
        try:
            url = f"{base_url}{endpoint}"
            print(f"🔍 Testing: {url}")
            response = requests.get(url, timeout=30)
            if response.status_code == 200:
                print(f"✅ {endpoint} - OK ({response.status_code})")
            else:
                print(f"⚠️ {endpoint} - Status: {response.status_code}")
        except requests.exceptions.Timeout:
            print(f"⏰ {endpoint} - Timeout (backend may be sleeping)")
        except Exception as e:
            print(f"❌ {endpoint} - Error: {e}")

def test_ai_functionality():
    """Test AI chat functionality."""
    print("🤖 Testing AI functionality...")
    try:
        url = "https://health-symptom-predictor.onrender.com/api/chat"
        payload = {"message": "I have a headache and fever, what could it be?"}
        
        print("🔍 Sending test message to AI...")
        response = requests.post(url, json=payload, timeout=60)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ AI functionality working!")
            print(f"🤖 Response preview: {data.get('response', '')[:100]}...")
            return True
        else:
            print(f"❌ AI test failed - Status: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ AI test failed: {e}")
        return False

def main():
    """Main setup function."""
    print("🚀 Starting Render Backend Setup...")
    print("=" * 50)
    
    print(f"🎯 Service ID: srv-d3hu4l3uibrs73b7kfb0")
    print(f"🌐 Backend URL: https://health-symptom-predictor.onrender.com")
    print(f"🗄️ Database: PostgreSQL v17 on Render")
    print("=" * 50)
    
    # Step 1: Test database connection
    if not test_database_connection():
        print("❌ Setup failed - Database connection issue")
        return False
    
    # Step 2: Create tables
    if not create_all_tables():
        print("❌ Setup failed - Table creation issue")
        return False
    
    # Step 3: Create admin user
    if not create_admin_user():
        print("❌ Setup failed - Admin user creation issue")
        return False
    
    print("=" * 50)
    print("✅ Database setup completed successfully!")
    print("=" * 50)
    
    # Step 4: Test backend endpoints
    test_backend_endpoints()
    
    # Step 5: Test AI functionality
    test_ai_functionality()
    
    print("=" * 50)
    print("🎉 Render Backend Setup Complete!")
    print("=" * 50)
    print("📝 Next Steps:")
    print("1. Set GROQ_API_KEY in Render environment variables")
    print("2. Deploy your backend to Render")
    print("3. Test frontend connection to backend")
    print("4. Verify all features work in production")
    
    return True

if __name__ == "__main__":
    main()