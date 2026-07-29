import ModulePage from "@/components/ModulePage";
import { employees } from "@/lib/mock-data";
import { organizationTabs } from "@/lib/tabs";

export default function OrganizationEmployeesPage() {
  return <ModulePage title="Employees" subtitle="Organization placement, branch and reporting structure" tabs={organizationTabs} current="/organization/employees"><div className="table-card"><table><thead><tr><th>Employee</th><th>Role</th><th>Branch</th><th>Status</th></tr></thead><tbody>{employees.map((e) => <tr key={e.name}><td>{e.name}</td><td>{e.role}</td><td>{e.branch}</td><td><span className={e.status === "Active" ? "status success" : "status warning"}>{e.status}</span></td></tr>)}</tbody></table></div></ModulePage>;
}
