from pydantic import BaseModel
from datetime import datetime
from typing import Optional
import uuid


class UserCreate(BaseModel):
    """Schema for creating a new user"""
    email: str
    password: str


class UserRegister(BaseModel):
    """Schema for user registration"""
    email: str
    password: str


class UserLogin(BaseModel):
    """Schema for user login"""
    email: str
    password: str


class UserResponse(BaseModel):
    """Schema for returning user data (without sensitive info)"""
    id: uuid.UUID
    email: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    """Schema for authentication token"""
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Schema for token data"""
    email: Optional[str] = None