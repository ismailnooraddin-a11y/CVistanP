import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Rate Limiter Middleware
 *
 * IMPORTANT: For Vercel serverless deployment, this in-memory rate limiter
 * has limitations:
 * - Resets on cold starts (each serverless invocation is a new context)
 * - Doesn't share state across instances
 *
 * For production with high traffic, consider:
 * 1. Vercel Edge Config (built-in rate limiting)
 * 2. Upstash Redis (serverless-friendly)
 * 3. Cloudflare Rate Limiting
 *
 * Current implementation provides basic protection within single execution context
 */

// In-memory rate limiter - works within single execution but resets on cold starts
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30; // requests per window per IP
const RATE_WINDOW = 60 * 1000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT) return true;
  return false;
}

// Paths to exclude from rate limiting (health checks, etc.)
const EXCLUDED_PATHS = ['/api/health'];

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Skip rate limiting for excluded paths
  if (EXCLUDED_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Rate limit API routes
  if (pathname.startsWith('/api/')) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]
               || req.headers.get('x-real-ip')
               || 'unknown';

    if (isRateLimited(ip)) {
      console.warn(`Rate limit exceeded for IP: ${ip} on ${pathname}`);
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};