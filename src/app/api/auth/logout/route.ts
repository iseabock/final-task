import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

import { authOptions } from '../[...nextauth]/route';

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  return NextResponse.json({ message: 'Logged out successfully' });
}
