'use client';

import { useState } from 'react';
import { Input, Button } from '@/components/ui/FormElements';
import { FileText } from 'lucide-react';
import { useBuilderStore } from '@/store/builder';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const guestSessionId = useBuilderStore((s) => s.guestSessionId);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/convert-guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, guestSessionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sign up failed');

      // Sign in after creating account
      const { createClient } = await import('@/lib/supabase');
      const supabase = createClient();
      await supabase.auth.signInWithPassword({ email, password });
      window.location.href = '/dashboard';
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
          <h1 className="text-xl font-semibold text-surface-800 mb-6 text-center">Create Account</h1>
          <form onSubmit={handleSignUp} className="space-y-4">
            <Input label="Full Name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} hint="At least 8 characters" />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" loading={loading} className="w-full" size="lg">Create Account</Button>
          </form>
          <p className="mt-4 text-sm text-surface-500 text-center">
            Already have an account? <a href="/auth/signin" className="text-brand-600 font-medium">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
}
