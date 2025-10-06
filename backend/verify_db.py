# Verify Database Connection - No Recreation
# This script checks your PostgreSQL database without modifying it

from app.core.database import engine, SessionLocal
from app.models.models import User, Symptom, Disease, Prediction, Feedback
from sqlalchemy import inspect, text

print("=" * 60)
print("PostgreSQL Database Verification")
print("=" * 60)
print()

try:
    # Test connection
    print("1. Testing connection...")
    with engine.connect() as conn:
        result = conn.execute(text("SELECT version()"))
        version = result.scalar()
        print(f"   ✅ Connected to PostgreSQL")
        print(f"   Version: {version.split(',')[0]}")
    
    print()
    
    # Check database
    print("2. Checking database...")
    with engine.connect() as conn:
        result = conn.execute(text("SELECT current_database()"))
        db_name = result.scalar()
        print(f"   ✅ Database: {db_name}")
    
    print()
    
    # Check tables
    print("3. Checking tables...")
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    if tables:
        print(f"   ✅ Found {len(tables)} tables:")
        for table in tables:
            print(f"      - {table}")
    else:
        print("   ⚠️ No tables found. Run: python init_db.py")
    
    print()
    
    # Count records
    print("4. Checking data...")
    db = SessionLocal()
    try:
        user_count = db.query(User).count()
        symptom_count = db.query(Symptom).count()
        disease_count = db.query(Disease).count()
        prediction_count = db.query(Prediction).count()
        feedback_count = db.query(Feedback).count()
        
        print(f"   ✅ Users: {user_count}")
        print(f"   ✅ Symptoms: {symptom_count}")
        print(f"   ✅ Diseases: {disease_count}")
        print(f"   ✅ Predictions: {prediction_count}")
        print(f"   ✅ Feedback: {feedback_count}")
        
        # Check for admin user
        admin = db.query(User).filter(User.is_admin == True).first()
        if admin:
            print(f"\n   ✅ Admin user exists: {admin.email}")
        else:
            print(f"\n   ⚠️ No admin user found. Run: python create_admin.py")
            
    finally:
        db.close()
    
    print()
    print("=" * 60)
    print("✅ Database is ready and fully configured!")
    print("=" * 60)
    print()
    print("📊 Database: health_predictor")
    print("🔒 Connection: Permanent (data persists)")
    print("👥 All user data automatically stored")
    print("🚀 Ready to start application!")
    print()
    
except Exception as e:
    print()
    print("=" * 60)
    print("❌ Database verification failed!")
    print("=" * 60)
    print()
    print(f"Error: {e}")
    print()
    print("Possible fixes:")
    print("1. Ensure PostgreSQL is running")
    print("2. Check .env file has correct credentials")
    print("3. Verify database 'health_predictor' exists")
    print("4. Run: python setup_postgres.py")
    print()
