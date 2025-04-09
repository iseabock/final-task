import { NextRequest, NextResponse } from 'next/server';

import User from '@/db/models/User';
import { connectDB } from '@/lib/mongodb';

// 🟢 GET - Fetch all users
export async function GET() {
  await connectDB();
  try {
    const users = await User.find();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch users: ${error}` },
      { status: 500 }
    );
  }
}

// 🟠 POST - Create a new user
export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { name, email, role } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and Email are required' },
        { status: 400 }
      );
    }

    const newUser = new User({ name, email, role });
    await newUser.save();

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create user: ${error}` },
      { status: 500 }
    );
  }
}

// 🟡 PUT - Update a user by ID
export async function PUT(req: NextRequest) {
  await connectDB();
  try {
    const { id, name, email, role } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update user: ${error}` },
      { status: 500 }
    );
  }
}

// 🔴 DELETE - Remove a user by ID
export async function DELETE(req: NextRequest) {
  await connectDB();
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete user: ${error}` },
      { status: 500 }
    );
  }
}
