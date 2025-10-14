"""SQLAlchemy engine configuration."""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from ...config.settings import settings

# Create engine
engine = create_engine(
    settings.database_url,
    echo=settings.debug,  # Log SQL queries in debug mode
    pool_pre_ping=True,  # Verify connections before use
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """Dependency to get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


get_db_session = get_db





