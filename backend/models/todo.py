from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional
import uuid
from models.user import User


class TaskBase(SQLModel):
    """Base model for task with shared attributes"""
    title: str = Field(min_length=1, max_length=200)  # Updated max length to 200 per requirements
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)


class Task(TaskBase, table=True):
    """Task model for the database"""
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    # Foreign key to user
    user_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)

    # Timestamps
    created_at: datetime = Field(default=datetime.utcnow(), nullable=False)
    updated_at: datetime = Field(default=datetime.utcnow(), nullable=False)

    # Relationship to user
    user: User = Relationship(back_populates="tasks")


class TaskCreate(TaskBase):
    """Schema for creating a new task"""
    title: str
    description: Optional[str] = None


class TaskUpdate(SQLModel):
    """Schema for updating a task"""
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None


class TaskResponse(TaskBase):
    """Schema for returning task data"""
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True