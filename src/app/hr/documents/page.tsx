import ModulePage from "@/components/ModulePage";
import { hrTabs } from "@/lib/tabs";

export default function DocumentsPage() {
  const docs = [{ title: "Employment Contract", employee: "Ava Karim", expiry: "No expiry" }, { title: "National ID", employee: "Dana Ahmed", expiry: "18 Sep 2028" }, { title: "Sales Certification", employee: "Baran Ali", expiry: "03 Feb 2027" }];
  return <ModulePage title="Employee Documents" subtitle="Documents are assigned to a single employee record" tabs={hrTabs} current="/hr/documents"><div className="table-card"><table><thead><tr><th>Document</th><th>Assigned employee</th><th>Expiry</th><th>Visibility</th></tr></thead><tbody>{docs.map((d) => <tr key={d.title + d.employee}><td>{d.title}</td><td>{d.employee}</td><td>{d.expiry}</td><td>HR restricted</td></tr>)}</tbody></table></div></ModulePage>;
}
