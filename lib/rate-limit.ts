import { createHash } from 'crypto';
import prisma from './prisma';

interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: Date;
}

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW || '600000', 10); // 10 minutes default
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX || '20', 10);

export async function checkRateLimit(
  identifier: string,
  type: 'ip' | 'email' = 'ip'
): Promise<RateLimitResult> {
  const key = hashIdentifier(identifier, type);
  const now = new Date();
  const windowStart = new Date(now.getTime() - WINDOW_MS);

  try {
    // Get or create rate limit entry
    let rateLimit = await prisma.rateLimit.findUnique({
      where: { key },
    });

    if (!rateLimit) {
      // Create new rate limit entry
      rateLimit = await prisma.rateLimit.create({
        data: {
          key,
          count: 1,
          windowStart: now,
        },
      });

      return {
        success: true,
        remaining: MAX_REQUESTS - 1,
        reset: new Date(now.getTime() + WINDOW_MS),
      };
    }

    // Check if window has expired
    if (rateLimit.windowStart < windowStart) {
      // Reset the window
      rateLimit = await prisma.rateLimit.update({
        where: { key },
        data: {
          count: 1,
          windowStart: now,
        },
      });

      return {
        success: true,
        remaining: MAX_REQUESTS - 1,
        reset: new Date(now.getTime() + WINDOW_MS),
      };
    }

    // Check if limit exceeded
    if (rateLimit.count >= MAX_REQUESTS) {
      return {
        success: false,
        remaining: 0,
        reset: new Date(rateLimit.windowStart.getTime() + WINDOW_MS),
      };
    }

    // Increment count
    rateLimit = await prisma.rateLimit.update({
      where: { key },
      data: {
        count: { increment: 1 },
      },
    });

    return {
      success: true,
      remaining: MAX_REQUESTS - rateLimit.count,
      reset: new Date(rateLimit.windowStart.getTime() + WINDOW_MS),
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Fail open - allow request if rate limit check fails
    return {
      success: true,
      remaining: MAX_REQUESTS,
      reset: new Date(now.getTime() + WINDOW_MS),
    };
  }
}

export function hashIdentifier(identifier: string, type: string): string {
  const secret = process.env.IP_HASH_SECRET || 'default-secret-change-me';
  return createHash('sha256')
    .update(`${type}:${identifier}:${secret}`)
    .digest('hex');
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
}
