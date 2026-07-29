import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-card">
        <div>
          <p className="eyebrow">WELCOME BACK</p>
          <h1>Sign in to EstateFlow</h1>
          <p className="muted">Frontend demo only. Authentication will be connected to Supabase later.</p>
        </div>
        <div className="login-options">
          <button className="social-button" type="button">Continue with Google</button>
          <label>
            Email address
            <input type="email" placeholder="name@company.com" />
          </label>
          <label>
            Phone number
            <input type="tel" placeholder="+964 750 000 0000" />
          </label>
          <Link className="primary-button full" href="/dashboard">Enter Demo System</Link>
        </div>
      </section>
    </main>
  );
}
