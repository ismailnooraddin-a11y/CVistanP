'use client';

import { useState } from 'react';
import { Input, Button } from '@/components/ui/FormElements';
import { FileText } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
          <h1 className="text-xl font-semibold text-surface-800 mb-6 text-center">Sign In</h1>
          <form onSubmit={handleSignIn} className="space-y-4">
            <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" loading={loading} className="w-full" size="lg">Sign In</Button>
          </form>
          <p className="mt-4 text-sm text-surface-500 text-center">
            Don&apos;t have an account? <a href="/auth/signup" className="text-brand-600 font-medium">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
