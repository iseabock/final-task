import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import Project from '@/db/models/Project';
import { connectDB } from '@/lib/mongodb';

import { authOptions } from '../auth/[...nextauth]/route';

// 🟢 GET - Fetch all projects
export async function GET() {
  await connectDB();

  try {
    const projects = await Project.find();
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch projects: ${error}` },
      { status: 500 }
    );
  }
}

// 🟠 POST - Create a new project
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, mode, organizationId } = await req.json();

    if (!name || !organizationId) {
      return NextResponse.json(
        { error: 'Name and organization ID are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const project = await Project.create({
      name,
      description,
      mode,
      organizationId,
      createdBy: session.user.id,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
