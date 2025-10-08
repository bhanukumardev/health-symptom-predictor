from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
from urllib.parse import urlparse
from app.core.config import settings

# Create engine with SSL support for production databases
database_url = settings.DATABASE_URL_WITH_SSL
engine_kwargs = {
    "echo": settings.DEBUG,
}

parsed_url = urlparse(database_url)
hostname = parsed_url.hostname or ""

if "pooler.supabase.com" in hostname:
    # Supabase transaction/session pooler (Supavisor) requires NullPool
    # to avoid keeping connections open beyond request lifecycle
    engine_kwargs["poolclass"] = NullPool
    engine_kwargs["pool_pre_ping"] = False  # NullPool creates fresh connections
else:
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_recycle"] = 300  # Recycle long-lived connections

engine = create_engine(database_url, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency to get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
