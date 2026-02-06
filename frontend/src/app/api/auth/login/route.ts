import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { users } from '@/lib/vercelAuthUtils';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Find user by email
    const user = users.find(u => u.email === email);
    if (!user) {
      return NextResponse.json(
        { error: 'Incorrect email or password' },
        { status: 401 }
      );
    }

    // In a real app, you'd hash the password and compare with bcrypt
    // For this demo, we'll just compare directly (NOT secure for production!)
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Incorrect email or password' },
        { status: 401 }
      );
    }

    // Get the secret from environment variables
    const secretKey = process.env.BETTER_AUTH_SECRET;
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing BETTER_AUTH_SECRET' },
        { status: 500 }
      );
    }

    const secret = new TextEncoder().encode(secretKey);

    const token = await new SignJWT({ sub: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(secret);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
      session: {
        accessToken: token,
        expiresAt: 3600, // 1 hour in seconds
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}