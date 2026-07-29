import ModulePage from "@/components/ModulePage";
import { hrTabs } from "@/lib/tabs";

export default function LeaveRequestsPage() {
  const requests = [{ employee: "Dana Ahmed", type: "Annual leave", duration: "Full day", date: "04 Aug 2026", status: "Pending" }, { employee: "Ava Karim", type: "Sick leave", duration: "Half day", date: "27 Jul 2026", status: "Approved" }];
  return <ModulePage title="Leave Requests" subtitle="Review hourly, half-day and full-day requests" tabs={hrTabs} current="/hr/leave-requests"><div className="table-card"><table><thead><tr><th>Employee</th><th>Category</th><th>Duration</th><th>Date</th><th>Status</th></tr></thead><tbody>{requests.map((r) => <tr key={r.employee + r.date}><td>{r.employee}</td><td>{r.type}</td><td>{r.duration}</td><td>{r.date}</td><td><span className={r.status === "Approved" ? "status success" : "status warning"}>{r.status}</span></td></tr>)}</tbody></table></div></ModulePage>;
}
