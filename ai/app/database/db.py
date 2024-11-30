from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from .schema import Base

# SQLite database file
DATABASE_URL = "sqlite:///focal_first_ai.db"

# Create the database engine
engine = create_engine(
    DATABASE_URL,
    echo=True,
    pool_size=10,
    max_overflow=20,
    pool_timeout=30
)

# Create the session factory
Session = sessionmaker(autocommit=False, autoflush=False,bind=engine)

# Create tables in the database (if not already created)
Base.metadata.create_all(engine)


# Dependency to get the database session
def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()
