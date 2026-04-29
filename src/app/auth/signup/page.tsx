'use client';

import { useState } from 'react';
import { Input, Button } from '@/components/ui/FormElements';
import { FileText, CheckCircle } from 'lucide-react';
import { useBuilderStore } from '@/store/builder';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const guestSessionId = useBuilderStore((s) => s.guestSessionId);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/convert-guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, guestSessionId, fullName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sign up failed');

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
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
          {!success ? (
            <>
              <h1 className="text-xl font-semibold text-surface-800 mb-2 text-center">Create Account</h1>
              <p className="text-sm text-surface-500 mb-6 text-center">Save your CVs and access them anywhere</p>
              <form onSubmit={handleSignUp} className="space-y-4">
                <Input
                  label="Full Name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ahmed Al-Rashid"
                />
                <Input
                  label="Email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ahmed@example.com"
                />
                <Input
                  label="Password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  hint="At least 8 characters"
                />
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                <Button type="submit" loading={loading} className="w-full" size="lg">Create Account</Button>
              </form>
              <p className="mt-4 text-xs text-surface-400 text-center">
                By creating an account, you agree to our{' '}
                <a href="/terms" className="text-brand-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" className="text-brand-600 hover:underline">Privacy Policy</a>
              </p>
              <p className="mt-4 text-sm text-surface-500 text-center">
                Already have an account? <a href="/auth/signin" className="text-brand-600 font-medium">Sign In</a>
              </p>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-brand-600" />
              </div>
              <h2 className="text-xl font-semibold text-surface-800 mb-2">Check your email!</h2>
              <p className="text-surface-500 mb-6">
                We&apos;ve sent a verification link to<br />
                <span className="font-medium text-surface-700">{email}</span>
              </p>
              <p className="text-sm text-surface-500">
                Please click the link in your email to verify your account before signing in.
              </p>
              <div className="mt-6 pt-6 border-t border-surface-100">
                <a href="/auth/signin" className="text-brand-600 font-medium hover:underline">
                  Already verified? Sign in
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}