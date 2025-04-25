import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  description: string;
  createdBy: mongoose.Schema.Types.ObjectId;
  organizationId: mongoose.Schema.Types.ObjectId;
  mode: 'scrum' | 'kanban' | 'none';
}

const ProjectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  description: { type: String, required: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
  organizationId: { type: mongoose.Schema.Types.ObjectId, required: true },
  mode: { type: String, enum: ['scrum', 'kanban', 'none'], default: 'none' },
});

const Project =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
