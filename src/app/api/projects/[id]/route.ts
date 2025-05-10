import { NextRequest, NextResponse } from 'next/server';

import Project from '@/db/models/Project';
import { connectDB } from '@/lib/mongodb';

type RouteContext = {
  params: {
    id: string;
  };
};

// 🟢  GET - Fetch a single project by ID
export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  await connectDB();
  try {
    const { id } = context.params;
    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  await connectDB();
  try {
    const { id } = context.params;
    const body = await request.json();

    const project = await Project.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  await connectDB();
  try {
    const { id } = context.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
