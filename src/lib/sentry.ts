/**
 * Sentry Error Tracking Integration
 *
 * To enable Sentry error tracking:
 * 1. Install: npm install @sentry/nextjs
 * 2. Get your DSN from: https://sentry.io/settings/projects/your-project/keys
 * 3. Set NEXT_PUBLIC_SENTRY_DSN in your .env.local
 * 4. Uncomment the initialization code below
 *
 * Currently commented out - add your DSN to .env.local and uncomment
 * to enable production error tracking.
 */

import * as Sentry from '@sentry/nextjs';

// Sentry is disabled by default. To enable, set NEXT_PUBLIC_SENTRY_DSN in environment
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN && process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: SENTRY_DSN,
    // Set tracesSampleRate to 1.0 to capture 100% of transactions
    tracesSampleRate: 0.1, // Adjust based on traffic
    // Enable session tracking
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    // Environment
    environment: process.env.NODE_ENV,
    // Ignore certain errors
    ignoreErrors: [
      'NetworkError',
      'Failed to fetch',
      'TypeError: Failed to fetch',
    ],
  });
}

/**
 * Helper function to capture errors with context
 * Use this in API routes instead of just console.error
 */
export function captureError(
  error: Error | unknown,
  context: string,
  extra?: Record<string, unknown>
) {
  console.error(`[${context}]`, error);

  if (SENTRY_DSN && process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      tags: { context },
      extra,
    });
  }
}

/**
 * Log a warning (informational, not an error)
 */
export function captureWarning(message: string, context?: string) {
  const logMessage = context ? `[${context}] ${message}` : message;
  console.warn(logMessage);

  if (SENTRY_DSN && process.env.NODE_ENV === 'production') {
    Sentry.captureMessage(logMessage, 'warning');
  }
}

/**
 * Set user context for error tracking
 * Call this when a user logs in to attach user info to errors
 */
export function setUserContext(userId: string, email?: string) {
  if (SENTRY_DSN) {
    Sentry.setUser({
      id: userId,
      email: email || undefined,
    });
  }
}

/**
 * Clear user context (on logout)
 */
export function clearUserContext() {
  if (SENTRY_DSN) {
    Sentry.setUser(null);
  }
}