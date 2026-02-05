# Frontend Authentication Implementation - Phase II Better Auth Integration

## Overview
This frontend implements Phase II authentication using a custom Better Auth client that integrates with a backend that verifies JWTs using BETTER_AUTH_SECRET.

## Implementation Details

### BetterAuthClient Class
Located in `src/lib/betterAuth.ts`, this class provides methods for:
- `signIn(email, password)` - Authenticates a user and returns session data
- `signUp(email, password)` - Registers a new user and returns session data
- `signOut(token)` - Logs out the current user
- `getSession(token)` - Retrieves the current user session
- Token storage in localStorage for subsequent API requests

### Authentication Context
Located in `src/app/providers.tsx`, this provides:
- `AuthContext` for the application
- Single instance of `BetterAuthClient` available to all components
- `useAuth()` hook to access the client from any component
- Maintains existing `AppProvider` context wrapping

### Authentication Flows
Located in `src/lib/auth.ts`, this handles:
- signIn, signUp, signOut, and getCurrentSession methods
- Integration with the BetterAuthClient
- Proper token management

### API Integration
Located in `src/lib/api.ts`, this ensures:
- Automatic attachment of tokens to API requests via Authorization header
- Proper error handling for unauthorized requests
- Integration with existing task API operations

### Environment Variables
Configure in `.env.local`:
- `NEXT_PUBLIC_BETTER_AUTH_URL` - Base URL for Better Auth endpoints
- `NEXT_PUBLIC_BETTER_AUTH_CLIENT_KEY` - Client key for authentication

## Integration with Backend
- Frontend obtains JWTs from Better Auth
- JWTs are sent to backend in Authorization header for task operations
- Backend verifies tokens using BETTER_AUTH_SECRET
- Task ownership is enforced based on authenticated user ID from JWT