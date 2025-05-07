import mongoose from 'mongoose';

export interface IProjectConfig {
  _id: mongoose.Schema.Types.ObjectId;
  project_id: mongoose.Schema.Types.ObjectId;
  statuses: {
    name: string;
  }[];
  created_at: Date;
  updated_at: Date;
}

const projectConfigSchema = new mongoose.Schema<IProjectConfig>(
  {
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    statuses: [
      {
        name: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Ensure one config per project
projectConfigSchema.index({ project_id: 1 }, { unique: true });

// Create default statuses if none exist
projectConfigSchema.pre('save', function (next) {
  if (this.statuses.length === 0) {
    this.statuses = [
      { name: 'backlog' },
      { name: 'open' },
      { name: 'inProgress' },
      { name: 'closed' },
    ];
  }
  next();
});

export const ProjectConfig = mongoose.model<IProjectConfig>(
  'ProjectConfig',
  projectConfigSchema
);
