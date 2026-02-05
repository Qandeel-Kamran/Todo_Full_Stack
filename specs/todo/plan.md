# Todo Application Backend Implementation Plan

## Overview
This plan outlines the implementation of the backend for the Todo application using FastAPI, SQLModel, and Neon PostgreSQL with Better Auth integration.

## Architecture

### Tech Stack
- **Framework**: FastAPI (Python 3.9+)
- **ORM**: SQLModel (SQLAlchemy + Pydantic)
- **Database**: Neon PostgreSQL (hosted)
- **Authentication**: Better Auth with JWT
- **Environment Management**: python-dotenv

### Project Structure
```
backend/
├── main.py                 # FastAPI application entry point
├── config/
│   ├── __init__.py
│   └── database.py         # Database configuration and connection
├── models/
│   ├── __init__.py
│   ├── user.py            # User model and schema
│   └── todo.py            # Todo model and schema
├── schemas/
│   ├── __init__.py
│   ├── user.py            # User Pydantic schemas
│   ├── todo.py            # Todo Pydantic schemas
│   └── auth.py            # Authentication schemas
├── routers/
│   ├── __init__.py
│   ├── auth.py            # Authentication endpoints
│   └── todos.py           # Todo management endpoints
├── utils/
│   ├── __init__.py
│   ├── auth.py            # Authentication utilities
│   └── security.py        # Security utilities (password hashing, etc.)
├── dependencies.py        # Dependency injection functions
└── requirements.txt       # Python dependencies
```

## Implementation Steps

### Step 1: Setup Project Structure and Dependencies
- Create the project directory structure
- Install required packages: fastapi, sqlmodel, psycopg2-binary, uvicorn, python-jose[cryptography], passlib[bcrypt], better-auth, python-dotenv

### Step 2: Database Configuration
- Configure database connection to Neon PostgreSQL
- Set up connection pooling and session management
- Define base model for SQLModel

### Step 3: Database Models
- Create User model with fields: id, email, hashed_password, timestamps
- Create Todo model with fields: id, title, description, completed, user_id, timestamps
- Define relationships between models

### Step 4: Pydantic Schemas
- Create request/response schemas for users and todos
- Define authentication-related schemas
- Include validation rules for input data

### Step 5: Authentication Utilities
- Implement JWT token verification functions only (no creation)
- Verify JWTs using BETTER_AUTH_SECRET
- Extract user ID from JWT for authorization
- Integrate with Better Auth for token validation

### Step 6: Dependencies
- Create dependency functions for database session
- Create authentication dependency for protected routes
- Implement current user dependency

### Step 7: Authentication Router
- Implement register endpoint
- Implement login endpoint
- Implement logout endpoint
- Implement get current user endpoint

### Step 8: Todo Router
- Implement get all todos endpoint
- Implement create todo endpoint
- Implement get single todo endpoint
- Implement update todo endpoint
- Implement delete todo endpoint
- Implement toggle todo status endpoint

### Step 9: Main Application
- Initialize FastAPI app
- Include routers
- Configure CORS
- Add exception handlers
- Set up event handlers for startup/shutdown

### Step 10: Testing
- Write unit tests for each endpoint
- Test authentication flow
- Test CRUD operations for todos
- Test authorization for protected endpoints

## Security Measures
- Passwords hashed with bcrypt
- JWT tokens with proper expiration
- Input validation through Pydantic schemas
- SQL injection prevention via ORM
- Rate limiting (if needed)

## Error Handling
- Custom HTTP exceptions for different error types
- Consistent error response format
- Logging for debugging and monitoring

## Performance Considerations
- Connection pooling for database
- Proper indexing on database tables
- Pagination for large datasets (future consideration)
- Caching for frequently accessed data (future consideration)

## Environment Variables
- DATABASE_URL: Connection string for Neon PostgreSQL
- SECRET_KEY: Secret key for JWT signing
- ALGORITHM: Algorithm for JWT encoding
- ACCESS_TOKEN_EXPIRE_MINUTES: Token expiration time
- BETTER_AUTH_SECRET: Secret for Better Auth integration