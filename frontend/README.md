# Task Frontend

This is the frontend for the Task application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- User authentication (login/register) with JWT-based security
- Task CRUD operations with user-specific data isolation
- Responsive design
- State management with Context API
- Form validation
- Error handling

## Tech Stack

- Next.js 14 (with App Router)
- React 18
- TypeScript
- Tailwind CSS
- Axios for API calls
- Better Auth client implementation
- jose for JWT handling
- UUID for ID generation

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root of the frontend directory:
```env
NEXT_PUBLIC_BETTER_AUTH_CLIENT_KEY=your_client_key_here
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000  # For local development
BETTER_AUTH_SECRET=your_secure_jwt_secret_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── public/               # Static assets
├── src/
│   ├── app/             # Next.js 14 App Router pages
│   │   ├── layout.tsx   # Root layout
│   │   ├── page.tsx     # Main page (auth/todo dashboard)
│   │   └── providers.tsx # App providers wrapper
│   ├── components/      # Reusable components
│   ├── context/         # React Context providers
│   ├── lib/             # Utility functions and API calls
│   └── styles/          # Global styles
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── .env.local          # Environment variables
```

## API Integration

The frontend communicates with the backend API at the URL specified in `NEXT_PUBLIC_API_URL`. All authenticated requests include the JWT token in the Authorization header.

## Authentication Flow

1. User registers or logs in
2. JWT token is stored in localStorage
3. Token is included in requests to protected endpoints
4. Token is verified on each page load
5. User is redirected to login if token is invalid/expired

## Components

- **AppContext**: Manages global app state (user, todos, auth status)
- **API utilities**: Handles all API calls with proper error handling
- **Auth forms**: Registration and login forms
- **Todo components**: Todo list, todo item, add todo form

## Production Deployment

### Vercel Deployment

This application is configured for deployment on Vercel. See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

### Environment Variables for Production

For production deployment, configure these environment variables:

```env
NEXT_PUBLIC_BETTER_AUTH_CLIENT_KEY=your_production_client_key
NEXT_PUBLIC_BETTER_AUTH_URL=https://your-app-name.vercel.app  # Your production URL
NEXT_PUBLIC_VERCEL_URL=your-app-name.vercel.app  # Your Vercel domain
BETTER_AUTH_SECRET=your_strong_production_secret
```

> ⚠️ **Important**: This application currently uses in-memory storage which is not suitable for production. Data will not persist between deployments. For production use, integrate with a persistent database.

## Local Development

For local development, the application uses in-memory storage for demonstration purposes. All data will be cleared when the development server restarts.