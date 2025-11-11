import { createHash } from 'crypto';
import prisma from './prisma';

interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: Date;
}

interface CachedRateLimit {
  count: number;
  windowStart: number;
  expiresAt: number;
}

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW || '600000', 10); // 10 minutes default
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX || '20', 10);
const CACHE_TTL_MS = 60000; // 1 minute cache

// In-memory cache to reduce DB queries
const rateLimitCache = new Map<string, CachedRateLimit>();

// Clean up expired cache entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  rateLimitCache.forEach((value, key) => {
    if (value.expiresAt < now) {
      rateLimitCache.delete(key);
    }
  });
}, 300000);

export async function checkRateLimit(
  identifier: string,
  type: 'ip' | 'email' = 'ip'
): Promise<RateLimitResult> {
  const key = hashIdentifier(identifier, type);
  const now = new Date();
  const nowMs = now.getTime();
  const windowStart = new Date(nowMs - WINDOW_MS);

  try {
    // Check in-memory cache first
    const cached = rateLimitCache.get(key);
    if (cached && cached.expiresAt > nowMs) {
      // Cache hit - use cached value
      const windowStartDate = new Date(cached.windowStart);
      
      // Check if window has expired
      if (windowStartDate < windowStart) {
        // Window expired, reset count
        cached.count = 1;
        cached.windowStart = nowMs;
        cached.expiresAt = nowMs + CACHE_TTL_MS;
        rateLimitCache.set(key, cached);
        
        // Update DB asynchronously (don't wait)
        prisma.rateLimit.upsert({
          where: { key },
          create: {
            key,
            count: 1,
            windowStart: now,
          },
          update: {
            count: 1,
            windowStart: now,
          },
        }).catch(err => console.error('Failed to update rate limit in DB:', err));
        
        return {
          success: true,
          remaining: MAX_REQUESTS - 1,
          reset: new Date(nowMs + WINDOW_MS),
        };
      }
      
      // Check if limit exceeded
      if (cached.count >= MAX_REQUESTS) {
        return {
          success: false,
          remaining: 0,
          reset: new Date(cached.windowStart + WINDOW_MS),
        };
      }
      
      // Increment count in cache
      cached.count++;
      rateLimitCache.set(key, cached);
      
      // Update DB asynchronously
      prisma.rateLimit.update({
        where: { key },
        data: { count: { increment: 1 } },
      }).catch(err => console.error('Failed to increment rate limit in DB:', err));
      
      return {
        success: true,
        remaining: MAX_REQUESTS - cached.count,
        reset: new Date(cached.windowStart + WINDOW_MS),
      };
    }

    // Cache miss - query database
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

      // Cache the new entry
      rateLimitCache.set(key, {
        count: 1,
        windowStart: nowMs,
        expiresAt: nowMs + CACHE_TTL_MS,
      });

      return {
        success: true,
        remaining: MAX_REQUESTS - 1,
        reset: new Date(nowMs + WINDOW_MS),
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

      // Update cache
      rateLimitCache.set(key, {
        count: 1,
        windowStart: nowMs,
        expiresAt: nowMs + CACHE_TTL_MS,
      });

      return {
        success: true,
        remaining: MAX_REQUESTS - 1,
        reset: new Date(nowMs + WINDOW_MS),
      };
    }

    // Check if limit exceeded
    if (rateLimit.count >= MAX_REQUESTS) {
      // Cache the limit exceeded state
      rateLimitCache.set(key, {
        count: rateLimit.count,
        windowStart: rateLimit.windowStart.getTime(),
        expiresAt: nowMs + CACHE_TTL_MS,
      });

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

    // Update cache
    rateLimitCache.set(key, {
      count: rateLimit.count,
      windowStart: rateLimit.windowStart.getTime(),
      expiresAt: nowMs + CACHE_TTL_MS,
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
      reset: new Date(nowMs + WINDOW_MS),
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
