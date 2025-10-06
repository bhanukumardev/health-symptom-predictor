"""
Database Migration: Add weight column to users table
Run this script to add the weight field for personalized dosage recommendations
"""
import sys
import os
from sqlalchemy import text

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.core.database import engine, SessionLocal
from app.core.config import settings

def add_weight_column():
    """Add weight column to users table"""
    db = SessionLocal()
    try:
        # Check if column exists
        result = db.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='users' AND column_name='weight'
        """))
        
        if result.fetchone():
            print("✅ Column 'weight' already exists in 'users' table")
            return
        
        # Add weight column
        print("Adding 'weight' column to 'users' table...")
        db.execute(text("ALTER TABLE users ADD COLUMN weight FLOAT"))
        db.commit()
        print("✅ Successfully added 'weight' column to 'users' table")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("=" * 60)
    print("DATABASE MIGRATION: Add weight column")
    print("=" * 60)
    print()
    
    try:
        add_weight_column()
        print()
        print("=" * 60)
        print("✅ Migration completed successfully!")
        print("=" * 60)
        print()
        print("Users can now provide their weight for personalized")
        print("medicine dosage recommendations! 💊")
        
    except Exception as e:
        print()
        print("=" * 60)
        print("❌ Migration failed!")
        print("=" * 60)
        print(f"Error: {e}")
        sys.exit(1)
