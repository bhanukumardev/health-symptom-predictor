import psycopg2
import os

# Connect as postgres superuser - use environment variables
conn = psycopg2.connect(
    host=os.getenv("DB_HOST", "127.0.0.1"),
    port=int(os.getenv("DB_PORT", "5432")),
    database=os.getenv("DB_NAME", "health_db"),
    user=os.getenv("DB_USER", "postgres"),
    password=os.getenv("DB_PASSWORD", "password")
)
conn.autocommit = True
cursor = conn.cursor()

print("Granting permissions to health_user...")

# Grant permissions
cursor.execute("GRANT ALL PRIVILEGES ON SCHEMA public TO health_user;")
cursor.execute("GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO health_user;")
cursor.execute("GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO health_user;")
cursor.execute("ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO health_user;")
cursor.execute("ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO health_user;")

print("✅ Permissions granted successfully!")

cursor.close()
conn.close()
