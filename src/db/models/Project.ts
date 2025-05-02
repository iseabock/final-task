import mongoose, { Document, Schema } from 'mongoose';

import { ProjectConfig } from './ProjectConfig';

export interface IProject extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  description: string;
  createdBy: mongoose.Schema.Types.ObjectId;
  organizationId: mongoose.Schema.Types.ObjectId;
  mode: 'scrum' | 'kanban' | 'none';
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    organizationId: { type: mongoose.Schema.Types.ObjectId, required: true },
    mode: { type: String, enum: ['scrum', 'kanban', 'none'], default: 'none' },
  },
  {
    timestamps: true,
  }
);

// Create project config when a project is created
ProjectSchema.post('save', async function (doc) {
  try {
    await ProjectConfig.create({
      project_id: doc._id,
    });
  } catch (error) {
    console.error('Error creating project config:', error);
  }
});

const Project =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
