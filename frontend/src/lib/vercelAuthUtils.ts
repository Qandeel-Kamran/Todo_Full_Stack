// In-memory user storage (in production, use a real database)
export let users: Array<{
  id: string;
  email: string;
  password: string; // In production, this should be hashed
}> = [];

// In-memory task storage (in production, use a real database)
export let tasks: Array<{
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string; // Links to user id
  createdAt: Date;
  updatedAt: Date;
}> = [];