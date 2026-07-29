import ModulePage from "@/components/ModulePage";
import { employees } from "@/lib/mock-data";
import { hrTabs } from "@/lib/tabs";

export default function HrEmployeesPage() {
  return <ModulePage title="HR Employees" subtitle="Employment records and lifecycle status" tabs={hrTabs} current="/hr/employees"><div className="table-card"><table><thead><tr><th>Name</th><th>Position</th><th>Branch</th><th>Employment status</th></tr></thead><tbody>{employees.map((e) => <tr key={e.name}><td>{e.name}</td><td>{e.role}</td><td>{e.branch}</td><td>{e.status}</td></tr>)}</tbody></table></div></ModulePage>;
}
