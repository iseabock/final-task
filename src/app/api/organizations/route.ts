import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import Organization from '@/db/models/Organization';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.log('GET Unauthorized - No session or user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const organization = await Organization.findOne({
      $or: [{ owner: session.user.id }, { members: session.user.id }],
    });

    return NextResponse.json(organization);
  } catch (error) {
    console.error('Error fetching organization:', error);
    return NextResponse.json(
      { error: 'Failed to fetch organization' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.log('POST Unauthorized - No session or user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Organization name is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const existingOrg = await Organization.findOne({
      $or: [{ owner: session.user.id }, { members: session.user.id }],
    });

    if (existingOrg) {
      return NextResponse.json(
        { error: 'User already belongs to an organization' },
        { status: 400 }
      );
    }

    const organization = await Organization.create({
      name,
      description,
      owner: session.user.id,
      members: [session.user.id],
    });

    return NextResponse.json(organization, { status: 201 });
  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json(
      { error: 'Failed to create organization' },
      { status: 500 }
    );
  }
}
