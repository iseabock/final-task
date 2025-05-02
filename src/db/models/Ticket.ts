import mongoose from 'mongoose';

export interface ITicket {
  _id: mongoose.Schema.Types.ObjectId;
  project_id: mongoose.Schema.Types.ObjectId;
  title: string;
  description?: string;
  status: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  points?: string;
  type: 'feature' | 'bug' | 'task';
  assignee?: mongoose.Schema.Types.ObjectId | null;
  created_by: mongoose.Schema.Types.ObjectId;
  created_at: string;
  updated_at: string;
}

const ticketSchema = new mongoose.Schema<ITicket>(
  {
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true,
    },
    points: {
      type: String,
    },
    type: {
      type: String,
      enum: ['feature', 'bug', 'task'],
      required: true,
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for faster queries
ticketSchema.index({ project_id: 1, status: 1 });

export const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema);
