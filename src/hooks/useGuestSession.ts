import { useState, useCallback } from 'react';
import { API_PATHS, GUEST_SESSION_EXPIRY_DAYS } from '@/lib/constants';
import { createClient } from '@/lib/supabase';

interface GuestSession {
  id: string;
  token: string;
  expiresAt: Date;
}

interface UseGuestSessionReturn {
  session: GuestSession | null;
  loading: boolean;
  error: string | null;
  createSession: (language: 'en' | 'ar') => Promise<GuestSession | null>;
  refreshSession: () => Promise<GuestSession | null>;
  clearSession: () => void;
}

export function useGuestSession(): UseGuestSessionReturn {
  const [session, setSession] = useState<GuestSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = useCallback(async (language: 'en' | 'ar') => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_PATHS.GUEST_SESSION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create session');
      }

      const data = await response.json();
      const newSession: GuestSession = {
        id: data.sessionId,
        token: data.sessionToken,
        expiresAt: new Date(Date.now() + GUEST_SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
      };

      setSession(newSession);
      return newSession;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create session';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    if (!session) return createSession('en');

    // Check if session is expired
    if (new Date() > session.expiresAt) {
      return createSession('en');
    }

    return session;
  }, [session, createSession]);

  const clearSession = useCallback(() => {
    setSession(null);
    setError(null);
  }, []);

  return {
    session,
    loading,
    error,
    createSession,
    refreshSession,
    clearSession,
  };
}

// Hook for checking if user is authenticated (signed-in)
export function useIsAuthenticated() {
  const { createClient } = require('@/lib/supabase');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useState(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { user } }) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });
  });

  return { isAuthenticated, loading };
}
