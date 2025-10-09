import psycopg2
from psycopg2 import sql
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os

# Database credentials - use environment variables
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")
DB_NAME = os.getenv("DB_NAME", "health_predictor")

def create_database():
    """Create the database if it doesn't exist."""
    try:
        # Connect to PostgreSQL server (default database)
        print("Connecting to PostgreSQL server...")
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database="postgres"
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (DB_NAME,))
        exists = cursor.fetchone()
        
        if not exists:
            print(f"Creating database '{DB_NAME}'...")
            cursor.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(DB_NAME)))
            print(f"✅ Database '{DB_NAME}' created successfully!")
        else:
            print(f"✅ Database '{DB_NAME}' already exists!")
        
        cursor.close()
        conn.close()
        
        # Test connection to the new database
        print(f"\nTesting connection to '{DB_NAME}'...")
        test_conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        print("✅ Successfully connected to database!")
        test_conn.close()
        
        return True
        
    except psycopg2.Error as e:
        print(f"❌ Error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("PostgreSQL Database Setup")
    print("=" * 60)
    print()
    
    if create_database():
        print()
        print("=" * 60)
        print("✅ Setup completed successfully!")
        print("=" * 60)
        print()
        print("Database connection string:")
        print(f"postgresql://{DB_USER}:****@{DB_HOST}:{DB_PORT}/{DB_NAME}")
        print()
    else:
        print()
        print("=" * 60)
        print("❌ Setup failed!")
        print("=" * 60)
        print()
        print("Please check:")
        print("1. PostgreSQL is running")
        print("2. Password is correct")
        print("3. User has permission to create databases")
