from fastapi import HTTPException, status, Depends
from sqlmodel import Session
from typing import Optional
from models.user import User
from config.database import get_session
from uuid import UUID
from utils.jwt import get_user_id_as_uuid, verify_and_decode_token
from utils.security import verify_password


def authenticate_user(session: Session, email: str, password: str) -> Optional[User]:
    """
    Authenticate a user by email and password
    """
    # Validate password length (bcrypt limitation is 72 bytes)
    if len(password) > 72:
        return None

    user = session.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.hashed_password):
        return None

    return user


def get_current_user_from_token(credentials_dependency = Depends(get_user_id_as_uuid)) -> str:
    """
    Extract and return the user ID from the JWT token
    """
    # This function now uses the centralized JWT utility
    user_id = credentials_dependency
    return str(user_id)


def get_current_user(session: Session = Depends(get_session), credentials_dependency = Depends(get_user_id_as_uuid)):
    """
    Get the current user by verifying the token and retrieving user info from DB
    """
    user_id = credentials_dependency

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired authentication token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Find user by ID in the database
    user = session.query(User).filter(User.id == user_id).first()

    if user is None:
        # User exists in token but not in database - possibly deleted account
        raise credentials_exception

    return user