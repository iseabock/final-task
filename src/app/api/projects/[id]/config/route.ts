import { NextRequest, NextResponse } from 'next/server';

import { ProjectConfig } from '@/db/models/ProjectConfig';

interface RouteSegmentProps {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  props: RouteSegmentProps
): Promise<NextResponse> {
  try {
    const { id } = props.params;
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
  props: RouteSegmentProps
): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { statuses } = body;

    const config = await ProjectConfig.findOneAndUpdate(
      { project_id: props.params.id },
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
