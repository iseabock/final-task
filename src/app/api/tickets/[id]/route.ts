import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import { Ticket } from '@/db/models/Ticket';
import { connectDB } from '@/lib/mongodb';

// 🟡 PATCH - Update ticket status only
export async function PATCH(req: NextRequest) {
  await connectDB();

  try {
    const { ticketId, status } = await req.json();

    if (!ticketId || !status) {
      return NextResponse.json(
        { error: 'ticketId and status are required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return NextResponse.json(
        { error: 'Invalid ticket ID format' },
        { status: 400 }
      );
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      { status },
      { new: true }
    );

    if (!updatedTicket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json(updatedTicket, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update ticket status: ${error}` },
      { status: 500 }
    );
  }
}
