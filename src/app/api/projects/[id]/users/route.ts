import { NextRequest, NextResponse } from 'next/server';

import User from '@/db/models/User';
import { connectDB } from '@/lib/mongodb';

// 🟢 GET - Fetch a users by projectId
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await connectDB();
  try {
    // TODO find out why this await is needed
    const { id } = await context.params;
    const users = await User.find({ project_id: id });

    if (!users) {
      return NextResponse.json({ error: 'Users not found' }, { status: 404 });
    }

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch tickets: ${error}` },
      { status: 500 }
    );
  }
}
