import NextAuth, { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import UserModel from '@/db/models/User';
import { connectDB } from '@/lib/mongodb';

// Define the shape of our user object
interface User extends NextAuthUser {
  role: string;
}

// Define the shape of our session user
interface SessionUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  role?: string;
}

// Configure NextAuth options
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Validate credentials
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required');
          }

          // Connect to database
          await connectDB();

          // Find user by email
          const user = await UserModel.findOne({ email: credentials.email });
          if (!user) {
            throw new Error('Invalid email or password');
          }

          // Verify password
          const isValid = await user.comparePassword(credentials.password);
          if (!isValid) {
            throw new Error('Invalid email or password');
          }

          // Return user object (excluding sensitive data)
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    // Add user ID and role to the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as User).role;
      }
      return token;
    },
    // Add user ID and role to the session
    async session({ session, token }) {
      if (session.user) {
        (session.user as SessionUser).id = token.id as string;
        (session.user as SessionUser).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
};

// Create and export the NextAuth handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
