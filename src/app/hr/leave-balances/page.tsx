import ModulePage from "@/components/ModulePage";
import { hrTabs } from "@/lib/tabs";

export default function LeaveBalancesPage() {
  const balances = [{ name: "Ava Karim", annual: 14, sick: 7 }, { name: "Dana Ahmed", annual: 11, sick: 6 }, { name: "Shilan Omar", annual: 17, sick: 8 }];
  return <ModulePage title="Leave Balances" subtitle="Current annual and sick leave entitlements" tabs={hrTabs} current="/hr/leave-balances"><div className="table-card"><table><thead><tr><th>Employee</th><th>Annual leave</th><th>Sick leave</th><th>Last updated</th></tr></thead><tbody>{balances.map((b) => <tr key={b.name}><td>{b.name}</td><td>{b.annual} days</td><td>{b.sick} days</td><td>29 Jul 2026</td></tr>)}</tbody></table></div></ModulePage>;
}
