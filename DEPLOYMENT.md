# Deployment Guide

This guide explains how to deploy the Todo Full Stack application to Vercel (frontend) and Render (backend).

## Architecture

The application consists of:
- **Frontend**: Next.js application deployed on Vercel
- **Backend**: FastAPI application deployed on Render
- **Authentication**: Better Auth handles authentication, backend only verifies JWTs

## Deployment Steps

### 1. Deploy Backend to Render

1. Go to [Render](https://render.com/) and sign in
2. Click "New +" and select "Web Service"
3. Connect to your GitHub repository (`Qandeel-Kamran/Todo_Full_Stack`)
4. Set Root Directory to `backend`
5. Runtime: Python
6. Build Command:
   ```bash
   cd backend && pip install -r requirements.txt
   ```
7. Start Command:
   ```bash
   cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
8. Environment Variables:
   ```
   BETTER_AUTH_SECRET=7N5A1A25KkzUZVUSfZn8eFhR8ZccSDbK
   DATABASE_URL=your_postgres_database_url
   ALGORITHM=HS256
   ```

### 2. Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com/) and sign in
2. Click "New Project" and connect to your GitHub repository (`Qandeel-Kamran/Todo_Full_Stack`)
3. Set Root Directory to `frontend`
4. Framework: Next.js
5. Build Command: `npm run build`
6. Output Directory: `frontend/.next`
7. Install Command: `cd frontend && npm install`
8. Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   NEXT_PUBLIC_BETTER_AUTH_URL=https://your-backend-url.onrender.com
   NEXT_PUBLIC_BETTER_AUTH_CLIENT_KEY=8ynz1eQ4KYV7qaInTW0kZURMi60458Ce
   ```

## Environment Configuration

### Backend (Render)
- `BETTER_AUTH_SECRET`: Secret key for JWT verification (shared with Better Auth)
- `DATABASE_URL`: PostgreSQL database URL
- `ALGORITHM`: JWT algorithm (default: HS256)

### Frontend (Vercel)
- `NEXT_PUBLIC_API_URL`: Backend API URL (e.g., https://your-app.onrender.com)
- `NEXT_PUBLIC_BETTER_AUTH_URL`: Backend URL for Better Auth endpoints
- `NEXT_PUBLIC_BETTER_AUTH_CLIENT_KEY`: Client key for Better Auth integration

## Authentication Flow

1. Users register/login via Better Auth frontend components
2. Better Auth issues JWT tokens to the frontend
3. Frontend stores tokens in localStorage
4. Frontend sends tokens in Authorization header to backend
5. Backend verifies JWTs using BETTER_AUTH_SECRET
6. Backend enforces user ownership for all task operations

## Post-Deployment Steps

1. Update the frontend environment variables with the deployed backend URL
2. Ensure CORS settings allow requests from the frontend domain
3. Test the complete authentication flow
4. Verify that task operations work with proper user ownership

## Troubleshooting

### Common Issues
- **CORS errors**: Ensure the backend allows requests from the frontend domain
- **JWT verification failures**: Verify that BETTER_AUTH_SECRET matches between frontend and backend
- **Database connection issues**: Check that DATABASE_URL is properly configured
- **Authentication flow broken**: Ensure all environment variables are set correctly

### Verification Commands
- Backend health check: `GET /health`
- Frontend connectivity: Check if API calls to backend succeed
- Authentication: Test register/login/logout flows
- Task operations: Verify user ownership enforcement