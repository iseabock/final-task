import { NextRequest, NextResponse } from 'next/server';

import Project from '@/db/models/Project';
import { connectDB } from '@/lib/mongodb';

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
  await connectDB();
  try {
    const { name, description, createdBy, mode } = await req.json();

    if (!name || !createdBy) {
      return NextResponse.json(
        { error: 'Name and Created By are required' },
        { status: 400 }
      );
    }

    const newProject = new Project({ name, description, createdBy, mode });
    await newProject.save();

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create user: ${error}` },
      { status: 500 }
    );
  }
}
