import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import Ticket from '@/db/models/Ticket';
import { connectDB } from '@/lib/mongodb';

// 🟢 GET - Fetch a single project by ID
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await connectDB();
  try {
    // TODO find out why this await is needed
    const { id } = await context.params;
    const tickets = await Ticket.find({ project_id: id });

    if (!tickets) {
      return NextResponse.json({ error: 'Tickets not found' }, { status: 404 });
    }

    return NextResponse.json(tickets, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch tickets: ${error}` },
      { status: 500 }
    );
  }
}

// 🟠 POST - Create a new project
export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await connectDB();
  try {
    const { id } = await context.params;

    const {
      title,
      description,
      status,
      priority,
      points,
      assignee,
      createdBy,
      createdAt,
    } = await req.json();

    const newTicket = new Ticket({
      project_id: new Types.ObjectId(id),
      title,
      description,
      status,
      priority,
      points,
      // assignee: assignee ? new Types.ObjectId(assignee) : undefined,
      assignee,
      created_by: createdBy,
      created_at: createdAt ? new Date(createdAt) : new Date(),
    });

    await newTicket.save();

    return NextResponse.json(newTicket, { status: 201 });
  } catch (error) {
    console.error('Failed to create ticket:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
