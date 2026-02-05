# Todo Application Specification

## Overview
A full-stack Todo application with authentication, task management, and responsive UI. The application allows users to manage their tasks efficiently with features like creation, updating, deletion, and status tracking.

## Features

### 1. Authentication System
- User registration with email/password via Better Auth
- User login with JWT token authentication from Better Auth
- Backend only verifies JWT tokens using BETTER_AUTH_SECRET
- Session management with Better Auth integration
- Protected routes requiring valid JWT authentication

### 2. Todo Management
- Create new todo items with title and description
- Update todo items (title, description, status)
- Mark todos as complete/incomplete
- Delete todo items
- Filter todos by status (all, active, completed)
- Sort todos by creation date or priority

### 3. User Interface
- Responsive design for desktop and mobile
- Clean, intuitive user interface
- Real-time updates of todo list
- Form validation and error handling

## Technical Requirements

### Backend (FastAPI)
- Python 3.9+ with FastAPI framework
- SQLModel for database modeling and ORM
- Neon PostgreSQL database
- JWT token authentication
- Better Auth integration for authentication management
- RESTful API endpoints
- Proper error handling and validation

### Database Schema
- Users table with authentication fields
- Todos table linked to users
- Proper indexing for performance
- Foreign key relationships

### Frontend (Next.js)
- Next.js 14+ with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Client-side state management
- API integration with backend

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user via Better Auth (deprecated - use frontend integration)
- `POST /api/auth/login` - Login user via Better Auth (deprecated - use frontend integration)
- `POST /api/auth/logout` - Logout user (deprecated - use frontend integration)
- `GET /api/auth/me` - Get current user info from JWT (protected)
- `GET /api/auth/user-id` - Get current user ID from JWT (protected)

### Todo Operations
- `GET /api/tasks` - Get all tasks for authenticated user (protected)
- `POST /api/tasks` - Create new task (protected)
- `GET /api/tasks/{id}` - Get specific task (protected)
- `PUT /api/tasks/{id}` - Update specific task (protected)
- `DELETE /api/tasks/{id}` - Delete specific task (protected)
- `PATCH /api/tasks/{id}/complete` - Toggle task completion status (protected)

## Database Models

### User Model
- id (UUID, primary key)
- email (string, unique, indexed)
- password_hash (string)
- created_at (timestamp)
- updated_at (timestamp)

### Task Model (Todo)
- id (UUID, primary key)
- title (string, not null, max 200 chars)
- description (text, optional, max 1000 chars)
- completed (boolean, default false)
- user_id (UUID, foreign key to users)
- created_at (timestamp)
- updated_at (timestamp)

## Authentication Flow
1. User registers via POST /api/auth/register
2. User logs in via POST /api/auth/login to get JWT
3. JWT is stored in browser storage
4. JWT is sent in Authorization header for protected endpoints
5. Token is validated on each protected request

## Security Considerations
- Password hashing using secure algorithm
- JWT token expiration and refresh
- Input validation and sanitization
- SQL injection prevention through ORM
- CORS configuration for security

## Performance Requirements
- API response time under 500ms
- Support for concurrent users
- Efficient database queries with proper indexing
- Optimized frontend bundle size

## Error Handling
- Consistent error response format
- Proper HTTP status codes
- User-friendly error messages
- Logging for debugging purposes

## Testing Requirements
- Unit tests for backend endpoints
- Integration tests for API flows
- Database transaction tests
- Authentication flow tests

## Deployment
- Backend deployed on cloud platform (Vercel, Render, etc.)
- PostgreSQL database hosted on Neon
- Environment variables for configuration
- SSL certificates for secure connections