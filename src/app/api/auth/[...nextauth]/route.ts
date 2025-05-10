import NextAuth from 'next-auth';

import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

// Export the handler as GET and POST
export const GET = handler;
export const POST = handler;
