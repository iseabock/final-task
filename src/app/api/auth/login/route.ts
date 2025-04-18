import { NextRequest, NextResponse } from 'next/server';

import User from '@/db/models/User';
import { connectDB } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // * Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // * Compare passwords using the model method
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // * Return user data (excluding password)
    const userData = user.toObject();
    delete userData.password;
    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to login: ${error}` },
      { status: 500 }
    );
  }
}
