import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function GET(request: NextRequest) {
  try {
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

    // Find user by ID from token
    const userId = decodedToken.payload.sub as string;
    const user = users.find(u => u.id === userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      emailVerified: true, // In a real app, this would come from the user record
      name: user.email.split('@')[0], // Extract name from email
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to get user information' },
      { status: 500 }
    );
  }
}

// Import users from the same file where they're defined
import { users } from '@/lib/vercelAuthUtils';