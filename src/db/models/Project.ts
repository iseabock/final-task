import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  mode: 'scrum' | 'kanban' | 'none';
}

const ProjectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  description: { type: String, required: false },
  createdBy: { type: String, required: true },
  mode: { type: String, enum: ['scrum', 'kanban', 'none'], default: 'none' },
});

const Project =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
