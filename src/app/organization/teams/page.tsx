import ModulePage from "@/components/ModulePage";
import { organizationTabs } from "@/lib/tabs";

export default function TeamsPage() {
  const teams = [{ name: "Dream City Sales", manager: "Ava Karim", members: 5 }, { name: "Empire Pearl Sales", manager: "Shilan Omar", members: 3 }];
  return <ModulePage title="Teams" subtitle="Group employees by branch and reporting line" tabs={organizationTabs} current="/organization/teams"><div className="card-grid">{teams.map((t) => <article className="list-card" key={t.name}><div><h2>{t.name}</h2><p>Manager: {t.manager}</p></div><strong>{t.members} members</strong></article>)}</div></ModulePage>;
}
