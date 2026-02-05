from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, tasks
from config.database import engine
from models.user import User
from models.todo import Task


# Create the FastAPI app
app = FastAPI(
    title="Task API",
    description="A simple Task API with authentication",
    version="1.0.0"
)


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(auth.router)
app.include_router(tasks.router)


@app.on_event("startup")
def on_startup():
    """Create database tables on startup"""
    print("Creating database tables...")
    User.metadata.create_all(bind=engine)
    Task.metadata.create_all(bind=engine)
    print("Database tables created successfully!")


@app.get("/")
def read_root():
    """
    Root endpoint
    """
    return {"message": "Welcome to the Task API"}


@app.get("/health")
def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy", "service": "task-api"}