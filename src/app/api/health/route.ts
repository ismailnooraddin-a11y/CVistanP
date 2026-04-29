import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Health check endpoint for monitoring and uptime checks
 *
 * Returns only essential information to avoid information disclosure.
 * Do NOT include version, service name, or internal details.
 */
export async function GET(req: NextRequest) {
  // Minimal health response - only what's needed for uptime monitoring
  return NextResponse.json(
    { status: 'ok' },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    }
  );
}

// Also allow HEAD requests for health checks
export async function HEAD(req: NextRequest) {
  return new NextResponse(null, { status: 200 });
}