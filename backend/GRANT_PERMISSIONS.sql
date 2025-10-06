# Run this SQL in your PostgreSQL database to grant permissions:
# Connect to PostgreSQL as superuser (postgres) and run:

GRANT ALL PRIVILEGES ON SCHEMA public TO health_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO health_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO health_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO health_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO health_user;

# Or create tables as postgres user, then grant:
# DATABASE_URL=postgresql://postgres:your_postgres_password@localhost:5432/health_db
