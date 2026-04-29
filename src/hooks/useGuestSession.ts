import { useState, useEffect, useCallback } from 'react';
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

/**
 * FIXED: Hook for checking if user is authenticated
 * Previously had a bug: useState was used instead of useEffect for async side effects
 */
export function useIsAuthenticated() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);
      } catch (err) {
        console.error('Auth check error:', err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, loading };
}