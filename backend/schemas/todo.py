from pydantic import BaseModel
from datetime import datetime
from typing import Optional
import uuid


class TodoCreate(BaseModel):
    """Schema for creating a new todo"""
    title: str
    description: Optional[str] = None


class TodoUpdate(BaseModel):
    """Schema for updating a todo"""
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None


class TodoResponse(BaseModel):
    """Schema for returning todo data"""
    id: uuid.UUID
    title: str
    description: Optional[str]
    completed: bool
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TodoToggle(BaseModel):
    """Schema for toggling todo completion status"""
    completed: bool