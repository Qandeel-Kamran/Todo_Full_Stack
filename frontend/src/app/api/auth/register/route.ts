import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { v4 as uuidv4 } from 'uuid';
import { users } from '@/lib/vercelAuthUtils';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Validate password length (for bcrypt compatibility)
    if (password.length > 72) {
      return NextResponse.json(
        { error: 'Password must not exceed 72 characters' },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = {
      id: uuidv4(),
      email,
      password, // In production, use bcrypt to hash the password
    };

    users.push(newUser);

    // Get the secret from environment variables
    const secretKey = process.env.BETTER_AUTH_SECRET;
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing BETTER_AUTH_SECRET' },
        { status: 500 }
      );
    }

    const secret = new TextEncoder().encode(secretKey);

    const token = await new SignJWT({ sub: newUser.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(secret);

    return NextResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
      },
      session: {
        accessToken: token,
        expiresAt: 3600, // 1 hour in seconds
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}