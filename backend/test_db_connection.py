"""Test database connection with different database URLs."""
import psycopg2
import sys
import os

# Get database credentials from environment variables
db_user = os.getenv('DB_USER', 'postgres')
db_password = os.getenv('DB_PASSWORD', 'password')
db_host = os.getenv('DB_HOST', 'localhost')
db_port = os.getenv('DB_PORT', '5432')
db_name = os.getenv('DB_NAME', 'health_predictor')

# Test different connection URLs
urls = [
    # Direct connection
    f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}",
    
    # With SSL
    f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}?sslmode=require",
    
    # Use DATABASE_URL environment variable if set
    os.getenv('DATABASE_URL', ''),
]

# Filter out empty URLs
urls = [url for url in urls if url]

print("Testing database connection URLs...\n")

for i, url in enumerate(urls, 1):
    # Mask password in output
    display_url = url.replace(db_password, '***') if db_password in url else url[:60]
    print(f"Test {i}: {display_url}...")
    try:
        conn = psycopg2.connect(url)
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM users;")
        count = cursor.fetchone()[0]
        print(f"✅ SUCCESS! Users count: {count}")
        cursor.close()
        conn.close()
        print(f"✅ This URL works!\n")
        sys.exit(0)
    except Exception as e:
        print(f"❌ FAILED: {str(e)}\n")

print("❌ All connection attempts failed!")
print("\nTip: Set DATABASE_URL environment variable or DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME")
sys.exit(1)
