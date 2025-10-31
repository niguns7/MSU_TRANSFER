import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { hash, verify } from 'argon2';
import prisma from './prisma';
import { adminLoginSchema } from './validations';

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

// Helper function to hash password (used in seed)
export async function hashPassword(password: string): Promise<string> {
  return hash(password);
}
