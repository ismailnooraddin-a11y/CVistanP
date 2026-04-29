'use client';

import { useState } from 'react';
import { Input, Button } from '@/components/ui/FormElements';
import { FileText } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { createClient } = await import('@/lib/supabase');
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { createClient } = await import('@/lib/supabase');
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });
      if (error) throw error;
      setResetSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <a href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-brand-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-2xl font-bold">Cvistan</span>
        </a>
        <div className="bg-white rounded-2xl border border-surface-100 p-8 shadow-sm">
          {!showReset ? (
            <>
              <h1 className="text-xl font-semibold text-surface-800 mb-6 text-center">Sign In</h1>
              <form onSubmit={handleSignIn} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  label="Password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" loading={loading} className="w-full" size="lg">Sign In</Button>
              </form>
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setShowReset(true)}
                  className="text-sm text-brand-600 hover:underline"
                >
                  Forgot your password?
                </button>
              </div>
              <p className="mt-4 text-sm text-surface-500 text-center">
                Don&apos;t have an account? <a href="/auth/signup" className="text-brand-600 font-medium">Sign Up</a>
              </p>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowReset(false)}
                className="text-sm text-surface-500 hover:text-surface-700 mb-4 flex items-center gap-1"
              >
                ← Back to sign in
              </button>
              <h1 className="text-xl font-semibold text-surface-800 mb-6 text-center">Reset Password</h1>
              {resetSent ? (
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-surface-600 mb-4">
                    Check your email for a link to reset your password.
                  </p>
                  <button
                    onClick={() => setShowReset(false)}
                    className="text-brand-600 text-sm font-medium hover:underline"
                  >
                    Back to sign in
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <Input
                    label="Email"
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email address"
                  />
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" loading={loading} className="w-full" size="lg">Send Reset Link</Button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}