import mongoose, { Document, Schema } from 'mongoose';

export interface ITicket extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  project_id: mongoose.Schema.Types.ObjectId;
  title: string;
  description?: string;
  status: 'open' | 'inProgress' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  points?: number;
  type: 'bug' | 'feature' | 'task';
  assignee: mongoose.Schema.Types.ObjectId;
  created_by: mongoose.Schema.Types.ObjectId;
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
    enum: ['open', 'inProgress', 'closed'],
    default: 'open',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  points: { type: String, default: 0 },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  type: {
    type: String,
    enum: ['bug', 'feature'],
    default: 'feature',
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  created_at: { type: Date, default: Date.now },
});

const Ticket =
  mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', ticketSchema);

export default Ticket;
