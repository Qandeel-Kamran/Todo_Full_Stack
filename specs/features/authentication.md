# Authentication Feature Specification - Phase II

## Overview
This specification defines the authentication system for the Todo application in Phase II, where authentication is handled by Better Auth in the frontend while the backend only verifies JWT tokens.

## Requirements

### Functional Requirements

#### AUTH-001: Frontend Authentication Management
- The frontend shall integrate with Better Auth for user authentication
- Better Auth shall handle user registration, login, and session management
- The frontend shall not implement custom authentication logic

#### AUTH-002: Backend JWT Verification
- The backend shall NOT issue JWT tokens
- The backend shall only verify JWT tokens provided by Better Auth
- The backend shall use BETTER_AUTH_SECRET to verify JWT signatures
- Invalid or expired tokens shall result in 401 Unauthorized responses

#### AUTH-003: User Identification
- JWT tokens shall contain a user ID claim for identifying the authenticated user
- The user ID shall be used by the backend to enforce task ownership
- Only the user who created a task shall be able to modify or delete it

#### AUTH-004: API Protection
- All API endpoints shall require Authorization header with Bearer token
- Endpoints without valid Authorization header shall return 401 Unauthorized
- Protected endpoints shall validate the JWT token before processing requests

### Non-Functional Requirements

#### AUTH-NF-001: Security
- JWT tokens shall be verified using HS256 or RS256 algorithm
- Secrets shall not be hardcoded in the source code
- Token validation shall occur synchronously for all protected endpoints

#### AUTH-NF-002: Performance
- Token verification shall add minimal overhead to API requests
- Authentication checks shall complete within 100ms

## API Contract

### Authentication Headers
All API requests to protected endpoints must include:
```
Authorization: Bearer <jwt_token>
```

### Error Responses
When authentication fails, the API shall return:
```
HTTP/1.1 401 Unauthorized
{
  "detail": "Not authenticated"
}
```

## Data Model

### JWT Claims
The JWT token shall contain the following claims:
- `sub`: Subject (user ID)
- `iat`: Issued at timestamp
- `exp`: Expiration timestamp
- `jti`: JWT ID (optional)

## Integration Points

### Frontend Integration
- Better Auth client shall be initialized with proper configuration
- Frontend shall store JWT tokens securely (preferably in httpOnly cookies or secure storage)
- API requests shall include the JWT token in the Authorization header

### Backend Integration
- Backend shall accept JWT tokens from Authorization header
- Backend shall verify tokens using BETTER_AUTH_SECRET
- Backend shall extract user ID from token claims for authorization checks

## Security Considerations
- BETTER_AUTH_SECRET must be kept secure and never exposed to the frontend
- JWT tokens should have reasonable expiration times managed by Better Auth
- The system shall prevent token replay attacks
- All communication shall occur over HTTPS in production

## Dependencies
- Better Auth library for frontend authentication
- JWT verification library (e.g., python-jose) for backend
- Secure secret management for BETTER_AUTH_SECRET

## Testing Considerations
- Test token verification with valid and invalid tokens
- Test unauthorized access to protected endpoints
- Test user-specific data access controls
- Test token expiration handling