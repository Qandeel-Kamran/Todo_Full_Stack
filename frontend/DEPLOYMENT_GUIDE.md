# Deployment Guide

## Vercel Deployment

This application can be deployed to Vercel with the following steps:

### Prerequisites
- A Vercel account
- The project connected to a Git repository
- Proper environment variables configured

### Environment Variables

Before deploying, configure these environment variables in your Vercel project settings:

```
BETTER_AUTH_SECRET=your_secure_jwt_secret_here
NEXT_PUBLIC_BETTER_AUTH_CLIENT_KEY=your_client_key_here
```

> **Note**: For production, make sure to use a strong, randomly generated secret for `BETTER_AUTH_SECRET`.

### Deployment Steps

1. Push your code to the connected Git repository
2. Vercel will automatically detect the Next.js application and begin deployment
3. In the Vercel dashboard, set the environment variables under Settings > Environment Variables
4. Redeploy after setting environment variables

### Important Limitations

⚠️ **Critical**: This application currently uses in-memory storage for users and tasks. This means:
- Data will not persist between deployments
- Data will not be shared across serverless function instances
- Each function invocation starts with an empty database

For production use, you'll need to integrate with a persistent database like:
- PostgreSQL
- MySQL
- MongoDB
- Supabase
- or any other database service

### Database Integration

To make this application production-ready, replace the in-memory arrays in `src/lib/vercelAuthUtils.ts` with actual database connections:

```typescript
// Instead of:
export let users: Array<{...}> = [];
export let tasks: Array<{...}> = [];

// Use a database client:
import { db } from './database-client'; // Your database implementation
```

### API Routes

All API routes are implemented using Next.js App Router in the `src/app/api/` directory:
- `/api/auth/login` - User login
- `/api/auth/register` - User registration
- `/api/auth/me` - Get current user
- `/api/tasks` - Task CRUD operations
- `/api/tasks/[id]` - Individual task operations
- `/api/tasks/[id]/complete` - Toggle task completion

### Troubleshooting

If authentication fails after deployment:
1. Verify that `BETTER_AUTH_SECRET` is set correctly
2. Check that the secret is consistent across all deployments
3. Ensure your client-side code uses the correct API endpoints

If you encounter issues with API routes:
1. Check Vercel logs in the dashboard
2. Verify that CORS is properly configured if making cross-origin requests
3. Confirm that authentication tokens are being passed correctly in headers