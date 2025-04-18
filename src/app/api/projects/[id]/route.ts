import { NextRequest, NextResponse } from 'next/server';

import Ticket from '@/db/models/Project';
import { connectDB } from '@/lib/mongodb';

// 🟢  GET - Fetch a single project by ID
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await connectDB();
  try {
    const { id } = await context.params;
    const project = await Ticket.findById(id);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch project: ${error}` },
      { status: 500 }
    );
  }
}
