import psycopg2

# Connect as postgres superuser
conn = psycopg2.connect(
    host="127.0.0.1",
    port=5432,
    database="health_db",
    user="postgres",
    password="Bhanu123@"
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
