'use client';

import Link from 'next/link';
import { Building2, Mail, Phone } from 'lucide-react';
import { useDemo } from '@/components/DemoProvider';

export default function Login() {
  const { state } = useDemo();
  const companyName = state.company.tradingName || state.company.legalName || 'EstateFlow';

  return (
    <main className="landing">
      <div className="login-card">
        <div className="login-brand">
          {state.company.logoDataUrl
            ? <img className="login-logo" src={state.company.logoDataUrl} alt={`${companyName} logo`} />
            : <Building2 aria-hidden="true" />}
          <div><strong>{companyName}</strong><small>Real Estate ERP frontend demo</small></div>
        </div>
        <h1>Welcome back</h1>
        <p>Choose a demo sign-in path. Real authentication and account recovery will be connected during the backend phase.</p>
        <Link className="auth-btn" href="/dashboard"><span className="google-mark" aria-hidden="true">G</span>Continue with Google demo</Link>
        <Link className="auth-btn" href="/dashboard"><Mail size={18} aria-hidden="true" />Continue with email demo</Link>
        <Link className="auth-btn" href="/dashboard"><Phone size={18} aria-hidden="true" />Continue with phone demo</Link>
        <Link className="btn wide" href="/dashboard">Open Super Admin Demo</Link>
        <small className="login-note">Demo records are stored only in this browser using localStorage.</small>
      </div>
    </main>
  );
}
