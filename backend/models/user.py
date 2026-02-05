from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, TYPE_CHECKING
import uuid

if TYPE_CHECKING:
    from models.todo import Task  # Note: the file is still named todo.py but contains Task model


class UserBase(SQLModel):
    """Base model for user with shared attributes"""
    email: str = Field(unique=True, nullable=False, max_length=255, index=True)


class User(UserBase, table=True):
    """User model for the database"""
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(unique=True, nullable=False, max_length=255, index=True)
    hashed_password: str = Field(nullable=False)

    # Timestamps
    created_at: datetime = Field(default=datetime.utcnow(), nullable=False)
    updated_at: datetime = Field(default=datetime.utcnow(), nullable=False)

    # Relationship to tasks
    tasks: list["Task"] = Relationship(back_populates="user")


class UserCreate(UserBase):
    """Schema for creating a new user"""
    email: str
    password: str


class UserRegister(UserBase):
    """Schema for user registration"""
    email: str
    password: str


class UserLogin(SQLModel):
    """Schema for user login"""
    email: str
    password: str


class UserResponse(UserBase):
    """Schema for returning user data (without sensitive info)"""
    id: uuid.UUID
    email: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True