"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="system-state">
      <section className="system-state__card">
        <span className="system-state__icon system-state__icon--danger"><AlertTriangle size={28} /></span>
        <p className="eyebrow">Application recovery</p>
        <h1>Something went wrong</h1>
        <p>The workspace caught an unexpected error. Your locally saved demo records remain available in this browser.</p>
        <button className="button button--primary button--md" onClick={reset}><RotateCcw size={16} /> Try again</button>
      </section>
    </main>
  );
}
