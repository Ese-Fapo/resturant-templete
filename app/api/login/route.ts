import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/services/auth.service';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required.' }, { status: 400 });
    }

    // Fetch user from database/service
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Invalid credentials.' }, { status: 401 });
    }

    // Remove sensitive info before sending user data
    const parsedUser = JSON.parse(JSON.stringify(user)) as Record<string, unknown> & {
      password?: unknown;
    };

    if (Object.prototype.hasOwnProperty.call(parsedUser, "password")) {
      delete parsedUser.password;
    }

    return NextResponse.json({ success: true, user: parsedUser });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
