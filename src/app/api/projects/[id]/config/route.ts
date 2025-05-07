import { NextRequest, NextResponse } from 'next/server';

import { ProjectConfig } from '@/db/models/ProjectConfig';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;
    const config = await ProjectConfig.findOne({
      project_id: id,
    });

    if (!config) {
      // Create default config if none exists
      const newConfig = await ProjectConfig.create({
        project_id: id,
      });
      return NextResponse.json(newConfig);
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching project config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project config' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { statuses } = body;

    const config = await ProjectConfig.findOneAndUpdate(
      { project_id: params.id },
      { statuses },
      { new: true, upsert: true }
    );

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error updating project config:', error);
    return NextResponse.json(
      { error: 'Failed to update project config' },
      { status: 500 }
    );
  }
}
