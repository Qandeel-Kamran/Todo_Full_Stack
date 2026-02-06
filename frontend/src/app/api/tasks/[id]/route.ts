import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { tasks, users } from '@/lib/vercelAuthUtils';
import { v4 as uuidv4 } from 'uuid';

// GET /api/tasks/[id] - Get a specific task
export async function GET(
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
    const task = tasks.find(t => t.id === taskId && t.userId === userId);
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    return NextResponse.json(
      { error: 'Failed to get task' },
      { status: 500 }
    );
  }
}

// PUT /api/tasks/[id] - Update a specific task
export async function PUT(
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

    // Get updated task data from request
    const { title, description, completed } = await request.json();

    // Validate title if provided
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return NextResponse.json(
          { error: 'Title must be a non-empty string' },
          { status: 400 }
        );
      }

      if (title.length > 200) {
        return NextResponse.json(
          { error: 'Title must not exceed 200 characters' },
          { status: 400 }
        );
      }
    }

    // Validate description if provided
    if (description !== undefined && description !== null) {
      if (typeof description !== 'string') {
        return NextResponse.json(
          { error: 'Description must be a string' },
          { status: 400 }
        );
      }

      if (description.length > 1000) {
        return NextResponse.json(
          { error: 'Description must not exceed 1000 characters' },
          { status: 400 }
        );
      }
    }

    // Validate completed if provided
    if (completed !== undefined && typeof completed !== 'boolean') {
      return NextResponse.json(
        { error: 'Completed must be a boolean' },
        { status: 400 }
      );
    }

    // Update the task
    const updatedTask = {
      ...tasks[taskIndex],
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(completed !== undefined && { completed }),
      updatedAt: new Date(),
    };

    tasks[taskIndex] = updatedTask;

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] - Delete a specific task
export async function DELETE(
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

    // Remove the task
    const deletedTask = tasks.splice(taskIndex, 1)[0];

    return NextResponse.json({
      message: 'Task deleted successfully',
      task: deletedTask
    });
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}