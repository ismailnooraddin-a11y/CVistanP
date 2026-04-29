import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

/**
 * Auth Callback Route
 *
 * Handles OAuth callbacks and password reset redirects from Supabase
 *
 * Required for:
 * - Email verification confirmation
 * - Password reset completion
 * - OAuth provider callbacks
 */
export async function GET(req: NextRequest) {
  const supabase = createClient();

  // Get the code from the URL
  const code = req.nextUrl.searchParams.get('code');
  const next = req.nextUrl.searchParams.get('next') || '/dashboard';

  // Handle type parameter for different auth flows
  const type = req.nextUrl.searchParams.get('type');

  if (code) {
    try {
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('Auth callback error:', error);
        // Redirect to signin with error
        return NextResponse.redirect(
          new URL(`/auth/signin?error=${encodeURIComponent(error.message)}`, req.url)
        );
      }

      // If this is a password recovery flow, redirect to a password reset page
      if (type === 'recovery') {
        return NextResponse.redirect(
          new URL(`/auth/reset-password?token=${code}`, req.url)
        );
      }

      // Successful auth - redirect to the intended destination
      return NextResponse.redirect(new URL(next, req.url));
    } catch (err) {
      console.error('Unexpected auth callback error:', err);
      return NextResponse.redirect(
        new URL('/auth/signin?error=auth_callback_failed', req.url)
      );
    }
  }

  // No code present - this is likely a direct access to the callback URL
  // Redirect to signin
  return NextResponse.redirect(new URL('/auth/signin', req.url));
}

// Also handle POST for magic link callbacks (if needed)
export async function POST(req: NextRequest) {
  return GET(req);
}