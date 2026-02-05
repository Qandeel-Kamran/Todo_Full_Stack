# Task Backend API

This is the backend API for the Task application built with FastAPI, SQLModel, and Neon PostgreSQL.

## Features

- User authentication with JWT tokens
- Task CRUD operations
- Secure password hashing
- PostgreSQL database with Neon
- RESTful API endpoints

## Tech Stack

- Python 3.9+
- FastAPI
- SQLModel (SQLAlchemy + Pydantic)
- Neon PostgreSQL
- JWT Authentication
- Better Auth (optional)

## Setup

1. Clone the repository
2. Navigate to the backend directory: `cd backend`
3. Create a virtual environment: `python -m venv venv`
4. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`
5. Install dependencies: `pip install -r requirements.txt`
6. Copy `.env.example` to `.env` and update with your database credentials
7. Run the application: `uvicorn main:app --reload`

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/todo_app
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
NEON_DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/todo_db
BETTER_AUTH_SECRET=your-better-auth-secret
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Task Operations

- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{id}` - Get a specific task
- `PUT /api/tasks/{id}` - Update a specific task
- `DELETE /api/tasks/{id}` - Delete a specific task
- `PATCH /api/tasks/{id}/complete` - Toggle task completion status

## Running Tests

To run the tests:

```bash
pytest test_main.py
```

## Development

To run the development server with auto-reload:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API documentation will be available at `http://localhost:8000/docs` when running in development mode.

## Deployment

For production deployment:

1. Use a production WSGI/ASGI server like Gunicorn
2. Set up proper environment variables
3. Ensure SSL is configured
4. Set up proper logging