import ModulePage from "@/components/ModulePage";
import { branches } from "@/lib/mock-data";
import { organizationTabs } from "@/lib/tabs";

export default function BranchesPage() {
  return <ModulePage title="Branches" subtitle="Manage company locations and branch access" tabs={organizationTabs} current="/organization/branches"><div className="card-grid">{branches.map((b) => <article className="list-card" key={b.name}><div><h2>{b.name}</h2><p>{b.city}, Kurdistan Region, {b.country}</p></div><span className="status success">Active</span></article>)}</div></ModulePage>;
}
