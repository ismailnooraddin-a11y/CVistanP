import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="system-state">
      <section className="system-state__card">
        <span className="system-state__icon"><SearchX size={28} /></span>
        <p className="eyebrow">EstateFlow Pro</p>
        <h1>Page not found</h1>
        <p>The workspace route may have moved, or your plan does not include this module.</p>
        <Link href="/dashboard" className="button button--primary button--md"><ArrowLeft size={16} /> Return to dashboard</Link>
      </section>
    </main>
  );
}
