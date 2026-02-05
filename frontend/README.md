# Task Frontend

This is the frontend for the Task application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- User authentication (login/register)
- Task CRUD operations
- Responsive design
- State management with Context API
- Form validation
- Error handling

## Tech Stack

- Next.js 16+ (with App Router)
- React 18
- TypeScript
- Tailwind CSS
- Axios for API calls
- Better Auth for authentication
- Zustand (optional state management)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root of the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
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