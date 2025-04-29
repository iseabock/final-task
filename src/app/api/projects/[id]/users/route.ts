import { NextRequest, NextResponse } from 'next/server';

import Project from '@/db/models/Project';
import User from '@/db/models/User';
import { connectDB } from '@/lib/mongodb';

// 🟢 GET - Fetch users by projectId
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await connectDB();
  try {
    const { id } = await context.params;
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const users = await User.find({ organization_id: project.organizationId });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch users: ${error}` },
      { status: 500 }
    );
  }
}
