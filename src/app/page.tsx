'use client';

import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { useDemo } from '@/components/DemoProvider';

export default function Home() {
  const { state } = useDemo();
  const companyName = state.company.tradingName || state.company.legalName || 'EstateFlow';
  return (
    <main className="landing">
      <div>
        {state.company.logoDataUrl
          ? <img className="landing-logo" src={state.company.logoDataUrl} alt={`${companyName} logo`} />
          : <span className="landing-logo fallback"><Building2 /></span>}
        <h1>{companyName}</h1>
        <p>Multi-branch real estate management platform</p>
        <Link className="btn" href="/login">Sign In</Link>
      </div>
    </main>
  );
}
