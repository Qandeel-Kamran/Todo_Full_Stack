from sqlmodel import create_engine, Session
from typing import Generator
import os

# Get database URL from environment - force SQLite for local development to avoid psycopg2 issues
DATABASE_URL = "sqlite:///./local_dev.db"

# Create the database engine with SQLite
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Set to True to see SQL queries in logs
    connect_args={"check_same_thread": False}  # Required for SQLite
)


def get_session() -> Generator[Session, None, None]:
    """
    Dependency to get a database session
    """
    with Session(engine) as session:
        yield session