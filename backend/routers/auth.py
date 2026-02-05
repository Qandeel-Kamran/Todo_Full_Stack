from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from datetime import timedelta
from pydantic import BaseModel

from models.user import User, UserCreate
from config.database import get_session
from dependencies import get_current_user
from utils.auth import get_current_user_from_token
from utils.auth import authenticate_user
from utils.security import create_access_token, get_password_hash

router = APIRouter(prefix="/api/auth", tags=["authentication"])

# Define request/response models for auth endpoints
class UserLogin(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(user: UserCreate, session: Session = Depends(get_session)):
    """
    Register a new user
    """
    # Check if user already exists
    existing_user = session.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Validate password length (bcrypt limitation is 72 bytes)
    if len(user.password) > 72:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must not exceed 72 characters"
        )

    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        hashed_password=hashed_password
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    # Create access token for the new user
    access_token_expires = timedelta(minutes=30)  # 30 minutes expiry
    access_token = create_access_token(
        data={"sub": str(db_user.id)}, expires_delta=access_token_expires
    )

    return {
        "user": {
            "id": str(db_user.id),
            "email": db_user.email,
        },
        "session": {
            "accessToken": access_token,
            "expiresAt": access_token_expires.total_seconds()
        }
    }


@router.post("/login")
def login(user_credentials: UserLogin, session: Session = Depends(get_session)):
    """
    Login user and return access token
    """
    # Validate password length (bcrypt limitation is 72 bytes)
    if len(user_credentials.password) > 72:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must not exceed 72 characters"
        )

    user = authenticate_user(session, user_credentials.email, user_credentials.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token_expires = timedelta(minutes=30)  # 30 minutes expiry
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )

    return {
        "user": {
            "id": str(user.id),
            "email": user.email,
        },
        "session": {
            "accessToken": access_token,
            "expiresAt": access_token_expires.total_seconds()
        }
    }


@router.post("/logout")
def logout():
    """
    Logout user (client-side token removal)
    """
    return {"message": "Logged out successfully"}


@router.get("/me")
def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Get current user info
    """
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "emailVerified": True,
        "name": current_user.email.split('@')[0] if current_user.email else "User",
        "createdAt": current_user.created_at.isoformat() if current_user.created_at else None,
        "updatedAt": current_user.updated_at.isoformat() if current_user.updated_at else None,
    }


@router.get("/user-id")
def get_user_id(user_id: str = Depends(get_current_user_from_token)):
    """
    Get current user ID from token
    """
    return {"user_id": user_id}