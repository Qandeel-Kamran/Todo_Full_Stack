from fastapi import Depends, HTTPException, status
from sqlmodel import Session
from config.database import get_session
from utils.auth import get_current_user, get_current_user_from_token
from utils.jwt import get_user_id_as_uuid
from models.user import User


def get_db_session():
    """
    Get database session dependency
    """
    yield from get_session()


def get_current_active_user(current_user: User = Depends(get_current_user)):
    """
    Get current active user dependency
    """
    # The get_current_user function already handles all error cases and raises 401
    # This function is kept for compatibility with existing route dependencies
    return current_user


def get_current_user_id(user_id: str = Depends(get_current_user_from_token)) -> str:
    """
    Get current user ID from token dependency
    """
    return user_id


def get_current_user_uuid(user_uuid: str = Depends(get_user_id_as_uuid)) -> str:
    """
    Get current user UUID from token dependency
    """
    return user_uuid