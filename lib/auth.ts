import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { hash, verify, argon2id } from 'argon2';
import prisma from './prisma';
import { adminLoginSchema } from './validations';

// Optimized argon2 options for better performance
const hashOptions = {
  type: argon2id,
  memoryCost: 2 ** 16, // 64 MB
  timeCost: 3, // Reduced from default 4 for faster hashing
  parallelism: 1,
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Validate input
          const validated = adminLoginSchema.parse(credentials);

          // Find admin user
          const admin = await prisma.adminUser.findUnique({
            where: { email: validated.email },
          });

          if (!admin || !admin.active) {
            return null;
          }

          // Verify password
          const isValid = await verify(admin.password, validated.password);

          if (!isValid) {
            return null;
          }

          return {
            id: admin.id,
            email: admin.email,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Helper function to hash password (used in seed) with optimized settings
export async function hashPassword(password: string): Promise<string> {
  return hash(password, hashOptions);
}
