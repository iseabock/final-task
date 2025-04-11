import { Types } from 'mongoose';
import mongoose from 'mongoose';
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

// 🟡 PUT - Update a ticket by ID
export async function PUT(req: NextRequest) {
  await connectDB();
  try {
    const body = await req.json();
    const { _id, title, description, status, priority, points, assignee } =
      body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return NextResponse.json({ error: 'Invalid Ticket ID' }, { status: 400 });
    }

    if (!_id) {
      return NextResponse.json(
        { error: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      _id,
      { title, description, status, priority, points, assignee },
      { new: true }
    );

    if (!updatedTicket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json(updatedTicket, { status: 200 });
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
    const id = await req.json();
    // console.log('_id :', body);

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const deletedUser = await Ticket.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Ticket deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete ticket: ${error}` },
      { status: 500 }
    );
  }
}
