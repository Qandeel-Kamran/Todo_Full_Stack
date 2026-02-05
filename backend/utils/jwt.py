"""
JWT Utilities for Better Auth token verification
"""

from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from typing import Optional
from jose import JWTError
from uuid import UUID

from .security import verify_token

# Define HTTP Bearer scheme for token verification
security_scheme = HTTPBearer()


def get_bearer_token(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)) -> str:
    """
    Extract bearer token from Authorization header
    """
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return credentials.credentials


def verify_and_decode_token(token: str) -> dict:
    """
    Verify and decode JWT token, returning the payload
    """
    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return payload


def get_user_id_from_token(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)) -> str:
    """
    Extract and return the user ID from the JWT token
    """
    token = get_bearer_token(credentials)
    payload = verify_and_decode_token(token)

    user_id: str = payload.get("sub")

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing user identifier",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_id


def get_user_id_as_uuid(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)) -> UUID:
    """
    Extract user ID from token and convert to UUID
    """
    user_id_str = get_user_id_from_token(credentials)

    try:
        return UUID(user_id_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user identifier format in token",
            headers={"WWW-Authenticate": "Bearer"},
        )