import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    // Optimize connection pooling for remote database
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// Configure connection pool settings for better performance with remote database
// Note: These are runtime optimizations
if (!globalForPrisma.prisma) {
  // Connection pool is managed by Prisma internally
  // For remote databases, Prisma uses:
  // - connection_limit: default 10 connections
  // - pool_timeout: 10 seconds
  // You can override in DATABASE_URL: ?connection_limit=20&pool_timeout=20
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
