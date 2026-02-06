import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { tasks, users } from '@/lib/vercelAuthUtils';

// PATCH /api/tasks/[id]/complete - Toggle task completion status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id;

    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Get the secret from environment variables
    const secretKey = process.env.BETTER_AUTH_SECRET;
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing BETTER_AUTH_SECRET' },
        { status: 500 }
      );
    }

    const secret = new TextEncoder().encode(secretKey);

    let decodedToken;
    try {
      decodedToken = await jwtVerify(token, secret);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get user ID from token
    const userId = decodedToken.payload.sub as string;

    // Find user to ensure they exist
    const user = users.find(u => u.id === userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find the task and verify it belongs to the user
    const taskIndex = tasks.findIndex(t => t.id === taskId && t.userId === userId);
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found or access denied' },
        { status: 404 }
      );
    }

    // Toggle the completed status
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      completed: !tasks[taskIndex].completed,
      updatedAt: new Date(),
    };

    return NextResponse.json(tasks[taskIndex]);
  } catch (error) {
    console.error('Toggle task completion error:', error);
    return NextResponse.json(
      { error: 'Failed to toggle task completion' },
      { status: 500 }
    );
  }
}