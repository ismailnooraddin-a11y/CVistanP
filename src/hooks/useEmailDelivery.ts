import { useState, useCallback } from 'react';
import { API_PATHS } from '@/lib/constants';

interface UseEmailDeliveryOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resume: any;
  language: 'en' | 'ar';
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface EmailDeliveryState {
  loading: boolean;
  success: boolean;
  error: string | null;
  emailSent: boolean;
}

export function useEmailDelivery({ resume, language, onSuccess, onError }: UseEmailDeliveryOptions) {
  const [state, setState] = useState<EmailDeliveryState>({
    loading: false,
    success: false,
    error: null,
    emailSent: false,
  });

  const sendEmail = useCallback(async (email: string, resumeId: string) => {
    if (!email || !resumeId) {
      setState((prev) => ({ ...prev, error: 'Email and resume ID are required' }));
      onError?.('Email and resume ID are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setState((prev) => ({ ...prev, error: 'Invalid email address' }));
      onError?.('Invalid email address');
      return;
    }

    setState({ loading: true, success: false, error: null, emailSent: false });

    try {
      const response = await fetch(API_PATHS.SEND_EMAIL(resumeId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          resume,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setState({ loading: false, success: true, error: null, emailSent: true });
      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send email';
      setState({ loading: false, success: false, error: errorMessage, emailSent: false });
      onError?.(errorMessage);
    }
  }, [resume, language, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({ loading: false, success: false, error: null, emailSent: false });
  }, []);

  return {
    ...state,
    sendEmail,
    reset,
  };
}
