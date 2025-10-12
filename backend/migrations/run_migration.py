"""
Migration script to create notifications table in PostgreSQL database
Run this script to add the notifications table to your database
"""
import psycopg2
from psycopg2 import sql
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://user:password@host:port/database?sslmode=require",
)

def run_migration():
    """Run the migration to create notifications table"""
    print("🚀 Starting migration: Create notifications table")
    
    try:
        # Connect to database
        print(f"📡 Connecting to database...")
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        # Read SQL migration file
        migration_file = os.path.join(os.path.dirname(__file__), "001_create_notifications_table.sql")
        with open(migration_file, 'r') as f:
            migration_sql = f.read()
        
        # Execute migration
        print("📝 Executing migration SQL...")
        cursor.execute(migration_sql)
        conn.commit()
        
        # Verify table was created
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'notifications'
        """)
        
        if cursor.fetchone():
            print("✅ Migration successful! Notifications table created.")
            
            # Show table structure
            cursor.execute("""
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns
                WHERE table_name = 'notifications'
                ORDER BY ordinal_position
            """)
            
            print("\n📋 Table structure:")
            for row in cursor.fetchall():
                print(f"   - {row[0]}: {row[1]} (nullable: {row[2]}, default: {row[3]})")
        else:
            print("❌ Migration failed: Table was not created")
        
        cursor.close()
        conn.close()
        print("\n🎉 Migration completed!")
        
    except Exception as e:
        print(f"❌ Error during migration: {e}")
        raise

if __name__ == "__main__":
    run_migration()
