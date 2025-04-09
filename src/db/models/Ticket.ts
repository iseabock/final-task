import mongoose, { Document, Schema } from 'mongoose';

export interface ITicket extends Document {
  project_id: mongoose.Schema.Types.ObjectId;
  title: string;
  description?: string;
  status?: 'open' | 'inProgress' | 'done';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  points?: number;
  // assignee?: mongoose.Schema.Types.ObjectId;
  // created_by: mongoose.Schema.Types.ObjectId;
  assignee?: string;
  created_by: string;
  created_at?: Date;
}

const ticketSchema = new Schema<ITicket>({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ['open', 'inProgress', 'done'],
    default: 'open',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  points: { type: String, default: 0 },
  // assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignee: { type: String, ref: 'User' },
  created_by: {
    // type: mongoose.Schema.Types.ObjectId,
    type: String,
    ref: 'User',
    // required: true,
  },
  // created_at: { type: Date, default: Date.now },
  created_at: { type: String, default: 'Date.now' },
});

const Ticket =
  mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', ticketSchema);

export default Ticket;
