#!/usr/bin/env python3
"""
Setup script for the Supabase PostgreSQL database (used by Render deployment).
This script creates the necessary tables for the health symptom predictor application
over the IPv4-compatible transaction pooler.
"""

import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.core.database import Base
from app.models.models import User, Symptom, Disease, Prediction, Feedback
from app.models.notification import Notification

# Supabase transaction pooler connection string (IPv4 compatible for Render)
RENDER_DATABASE_URL = "postgresql://postgres.txhohvmugqptewlvuhfn:Bhanu123%40@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require"

def setup_render_database():
    """Setup the Supabase PostgreSQL database with all required tables."""
    print("🚀 Setting up Supabase PostgreSQL database via Render deployment...")
    
    try:
        # Create engine
        engine = create_engine(RENDER_DATABASE_URL, 
                             connect_args={"sslmode": "require"})
        
        # Test connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"✅ Connected to database: {version}")
        
        # Create all tables
        print("📋 Creating tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ All tables created successfully!")
        
        # Create session to check tables
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        try:
            # Check if tables exist and get counts
            tables_info = []

            # Check each model
            models = [User, Symptom, Disease, Prediction, Feedback, Notification]
            for model in models:
                try:
                    count = db.query(model).count()
                    tables_info.append(f"  - {model.__tablename__}: {count} records")
                except Exception as e:
                    tables_info.append(f"  - {model.__tablename__}: Error - {e}")

            print("\n📊 Database Status:")
            for info in tables_info:
                print(info)

        finally:
            db.close()

        print("\n🎉 Supabase database setup completed successfully!")
        print(f"🔗 Database URL: {RENDER_DATABASE_URL}")

        return True

    except Exception as e:
        print(f"❌ Error setting up database: {e}")
        print("\n🔧 Possible fixes:")
        print("1. Check if the database URL is correct")
        print("2. Verify database credentials")
        print("3. Ensure the database server is accessible")
        print("4. Check firewall settings")
        return False

if __name__ == "__main__":
    setup_render_database()