import { NextRequest, NextResponse } from 'next/server';

import User from '@/db/models/User';
import { connectDB } from '@/lib/mongodb';

// 🟢 GET - Fetch a single user by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  try {
    const { id } = await params;
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch user: ${error}` },
      { status: 500 }
    );
  }
}
