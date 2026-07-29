import AppShell from "@/components/AppShell";
import { branches } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="page-heading"><div><h1>Company Overview</h1><p>All branches</p></div></div>
      <div className="stats-grid">
        <article className="stat-card"><span>Total properties</span><strong>186</strong><small>14 added this month</small></article>
        <article className="stat-card"><span>Active leads</span><strong>69</strong><small>21 require follow-up</small></article>
        <article className="stat-card"><span>Open deals</span><strong>13</strong><small>Combined value $402K</small></article>
        <article className="stat-card"><span>Team members</span><strong>10</strong><small>Across 2 branches</small></article>
      </div>
      <div className="card-grid">
        {branches.map((branch) => (
          <article className="branch-card" key={branch.name}>
            <h2>{branch.name}</h2><p>{branch.city}, {branch.country}</p>
            <div className="metric-grid"><span>Contacts<strong>{branch.contacts}</strong></span><span>Deals<strong>{branch.deals}</strong></span><span>Revenue<strong>{branch.revenue}</strong></span><span>Team<strong>{branch.team}</strong></span></div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
