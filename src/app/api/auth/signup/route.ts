import { NextRequest, NextResponse } from 'next/server';

import User from '@/db/models/User';
import { connectDB } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // * Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // * Create new user - password will be hashed by the pre-save middleware
    const newUser = new User({
      name,
      email,
      password,
      role: 'developer', // Default role
    });

    await newUser.save();

    // * Return user data (excluding password)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create user: ${error}` },
      { status: 500 }
    );
  }
}
