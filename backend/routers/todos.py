from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from uuid import UUID

from models.todo import Todo, TodoCreate, TodoUpdate, TodoResponse
from models.user import User
from config.database import get_session
from dependencies import get_current_user
from utils.auth import oauth2_scheme

router = APIRouter(prefix="/api/todos", tags=["todos"])


@router.get("/", response_model=List[TodoResponse])
def get_todos(
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Get all todos for the current user
    """
    statement = select(Todo).where(Todo.user_id == current_user.id).offset(skip).limit(limit)
    todos = session.exec(statement).all()
    return todos


@router.post("/", response_model=TodoResponse)
def create_todo(
    todo: TodoCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new todo for the current user
    """
    # Create the todo with the current user's ID
    db_todo = Todo(
        title=todo.title,
        description=todo.description,
        user_id=current_user.id
    )

    session.add(db_todo)
    session.commit()
    session.refresh(db_todo)
    return db_todo


@router.get("/{todo_id}", response_model=TodoResponse)
def get_todo(
    todo_id: UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific todo by ID
    """
    statement = select(Todo).where(Todo.id == todo_id, Todo.user_id == current_user.id)
    todo = session.exec(statement).first()

    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    return todo


@router.put("/{todo_id}", response_model=TodoResponse)
def update_todo(
    todo_id: UUID,
    todo_update: TodoUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Update a specific todo by ID
    """
    statement = select(Todo).where(Todo.id == todo_id, Todo.user_id == current_user.id)
    db_todo = session.exec(statement).first()

    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    # Update only the fields that were provided
    for field, value in todo_update.dict(exclude_unset=True).items():
        setattr(db_todo, field, value)

    session.add(db_todo)
    session.commit()
    session.refresh(db_todo)
    return db_todo


@router.delete("/{todo_id}")
def delete_todo(
    todo_id: UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a specific todo by ID
    """
    statement = select(Todo).where(Todo.id == todo_id, Todo.user_id == current_user.id)
    db_todo = session.exec(statement).first()

    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    session.delete(db_todo)
    session.commit()
    return {"message": "Todo deleted successfully"}


@router.patch("/{todo_id}/toggle", response_model=TodoResponse)
def toggle_todo_status(
    todo_id: UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Toggle the completion status of a specific todo
    """
    statement = select(Todo).where(Todo.id == todo_id, Todo.user_id == current_user.id)
    db_todo = session.exec(statement).first()

    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    # Toggle the completed status
    db_todo.completed = not db_todo.completed
    session.add(db_todo)
    session.commit()
    session.refresh(db_todo)
    return db_todo