from app.core.database import engine, Base
from app.models.models import User, Symptom, Disease, Prediction, Feedback
from sqlalchemy import inspect

print("Checking database tables...")

# Check existing tables
inspector = inspect(engine)
existing_tables = inspector.get_table_names()

print(f"\nExisting tables: {existing_tables if existing_tables else 'None'}")

# Create tables only if they don't exist (SQLAlchemy handles this automatically)
print("\nCreating/verifying database tables...")
Base.metadata.create_all(bind=engine)
print("✅ Database tables ready!")

# Get updated table list
inspector = inspect(engine)
final_tables = inspector.get_table_names()

print("\nTables in database:")
for table in final_tables:
    print(f"  ✓ {table}")

print("\n💾 Database: PostgreSQL (Permanent)")
print("   All data persists across application restarts")
print("   No need to recreate tables or users")
