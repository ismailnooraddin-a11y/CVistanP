import Link from "next/link";

export default function HomePage() {
  return (
    <main className="landing">
      <section className="landing-card">
        <p className="eyebrow">REAL ESTATE OPERATIONS</p>
        <h1>EstateFlow ERP</h1>
        <p>Multi-branch real estate management platform</p>
        <Link className="primary-button" href="/login">Sign In</Link>
      </section>
    </main>
  );
}
