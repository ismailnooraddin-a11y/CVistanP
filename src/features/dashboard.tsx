"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building,
  CalendarCheck,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Flame,
  House,
  MoreHorizontal,
  Target,
  UserRoundPlus,
  UsersRound
} from "lucide-react";
import { useMemo } from "react";
import { leadConversionRate, leadStageCounts, propertyInventoryValue } from "@/lib/analytics";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { useWorkspace } from "@/store/workspace-store";
import { Avatar, Badge, Button, Card, CardHeader, PageHeader, Progress, StatCard, cn } from "@/components/ui";

function RevenueChart() {
  const values = [22, 31, 27, 42, 48, 55, 46, 68, 72, 84, 78, 96];
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${100 - value}`).join(" ");
  return (
    <div className="chart-panel">
      <div className="chart-panel__summary">
        <div><span>Gross revenue</span><strong>$184,620</strong></div>
        <Badge tone="success">+18.4% vs last month</Badge>
      </div>
      <div className="area-chart">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Revenue trend chart">
          <defs>
            <linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" x2="100" y1="20" y2="20" className="chart-gridline" />
          <line x1="0" x2="100" y1="50" y2="50" className="chart-gridline" />
          <line x1="0" x2="100" y1="80" y2="80" className="chart-gridline" />
          <polygon points={`0,100 ${points} 100,100`} fill="url(#revenue-fill)" />
          <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2.1" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="chart-axis"><span>Aug</span><span>Oct</span><span>Dec</span><span>Feb</span><span>Apr</span><span>Jun</span><span>Jul</span></div>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { tenant, currentUser, toggleTask } = useWorkspace();
  const stageCounts = useMemo(() => leadStageCounts(tenant.leads), [tenant.leads]);
  const inventoryValue = propertyInventoryValue(tenant.properties);
  const conversion = leadConversionRate(tenant.leads);
  const openTasks = tenant.tasks.filter((task) => task.status === "open").slice(0, 5);
  const upcomingViewings = tenant.viewings.filter((viewing) => viewing.status === "scheduled").slice(0, 4);
  const agents = tenant.employees
    .filter((employee) => employee.jobTitle.toLowerCase().includes("consultant") || employee.jobTitle.toLowerCase().includes("manager"))
    .slice(0, 4)
    .map((employee, index) => ({ employee, deals: [8, 6, 5, 4][index] ?? 3, value: [422000, 308000, 246000, 194000][index] ?? 150000 }));

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Executive workspace"
        title={`Good afternoon, ${currentUser?.name.split(" ")[0] ?? "there"}`}
        description="Here is what requires attention across sales, properties, finance, and your team today."
        actions={<><Button variant="secondary"><CalendarCheck size={17} /> Schedule viewing</Button><Link className="button button--primary button--md" href="/sales/leads"><UserRoundPlus size={17} /> Add lead</Link></>}
      />

      <div className="metrics-grid metrics-grid--4">
        <StatCard label="Active pipeline" value={formatCurrency(1680000)} change={12.8} detail="weighted value" icon={<Target size={21} />} tone="brand" />
        <StatCard label="Available inventory" value={formatCurrency(inventoryValue)} change={7.2} detail={`${tenant.properties.filter((item) => item.status === "available").length} properties`} icon={<House size={21} />} tone="blue" />
        <StatCard label="Conversion rate" value={`${conversion}%`} change={3.4} detail="rolling 90 days" icon={<Flame size={21} />} tone="amber" />
        <StatCard label="Collected this month" value={formatCurrency(tenant.payments.reduce((sum, item) => sum + item.amount, 0))} change={18.4} detail="cash received" icon={<CircleDollarSign size={21} />} tone="green" />
      </div>

      <div className="dashboard-grid dashboard-grid--wide">
        <Card className="dashboard-revenue">
          <CardHeader title="Revenue performance" description="Closed revenue and projected monthly trajectory" action={<select className="select select--compact" aria-label="Chart range"><option>Last 12 months</option><option>Last 6 months</option></select>} />
          <RevenueChart />
        </Card>
        <Card>
          <CardHeader title="Sales funnel" description={`${tenant.leads.length} active and historic leads`} action={<Link href="/sales/pipeline" className="text-link">View pipeline <ArrowRight size={14} /></Link>} />
          <div className="funnel-list">
            {[
              ["New", stageCounts.new, "funnel--blue"],
              ["Qualified", stageCounts.qualified, "funnel--purple"],
              ["Viewing", stageCounts.viewing, "funnel--amber"],
              ["Negotiation", stageCounts.negotiation, "funnel--orange"],
              ["Reserved", stageCounts.reserved, "funnel--green"],
              ["Won", stageCounts.won, "funnel--dark"]
            ].map(([label, count, className], index) => (
              <div className="funnel-row" key={String(label)}>
                <div className="funnel-row__head"><span>{label}</span><strong>{count}</strong></div>
                <div className="funnel-track"><span className={String(className)} style={{ width: `${Math.max(12, 100 - index * 13)}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="dashboard-grid dashboard-grid--thirds">
        <Card>
          <CardHeader title="Today’s priorities" description={`${openTasks.length} open items`} action={<Link href="/sales/activities" className="text-link">All tasks</Link>} />
          <div className="task-list">
            {openTasks.map((task) => (
              <button type="button" className="task-row" key={task.id} onClick={() => toggleTask(task.id)}>
                <span className="task-row__check"><CheckCircle2 size={18} /></span>
                <span className="task-row__content"><strong>{task.title}</strong><small><Clock3 size={13} /> {formatDateTime(task.dueAt)}</small></span>
                <Badge tone={task.priority === "urgent" ? "danger" : task.priority === "high" ? "warning" : "neutral"}>{task.priority}</Badge>
              </button>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Upcoming viewings" description="Next scheduled property tours" action={<Link href="/sales/viewings" className="text-link">Calendar</Link>} />
          <div className="timeline-list">
            {upcomingViewings.map((viewing) => {
              const property = tenant.properties.find((item) => item.id === viewing.propertyId);
              const agent = tenant.employees.find((item) => item.id === viewing.agentId);
              return (
                <div className="timeline-row" key={viewing.id}>
                  <div className="timeline-row__time"><strong>{new Date(viewing.startsAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</strong><span>{new Date(viewing.startsAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</span></div>
                  <div className="timeline-row__line"><span /></div>
                  <div className="timeline-row__content"><strong>{viewing.customerName}</strong><span>{property?.title}</span><small>with {agent ? `${agent.firstName} ${agent.lastName}` : "Agent"}</small></div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
          <CardHeader title="Top performers" description="Closed value this month" action={<button className="icon-button"><MoreHorizontal size={18} /></button>} />
          <div className="leaderboard">
            {agents.map(({ employee, deals, value }, index) => (
              <div className="leaderboard__row" key={employee.id}>
                <span className={cn("leaderboard__rank", index < 3 && `leaderboard__rank--${index + 1}`)}>{index + 1}</span>
                <Avatar name={`${employee.firstName} ${employee.lastName}`} size="sm" status={employee.status === "active" ? "online" : "away"} />
                <span className="leaderboard__person"><strong>{employee.firstName} {employee.lastName}</strong><small>{deals} closed deals</small></span>
                <strong className="leaderboard__value">{formatCurrency(value)}</strong>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="dashboard-grid dashboard-grid--halves">
        <Card>
          <CardHeader title="Branch performance" description="Monthly target attainment" action={<Link href="/reports" className="text-link">Detailed report</Link>} />
          <div className="branch-performance">
            {tenant.branches.map((branch, index) => {
              const values = [87, 72, 64, 51];
              const value = values[index] ?? 55;
              const teamSize = tenant.employees.filter((employee) => employee.branchId === branch.id).length;
              return (
                <div className="branch-performance__row" key={branch.id}>
                  <div className="branch-performance__icon"><Building size={18} /></div>
                  <div className="branch-performance__content"><div><strong>{branch.name}</strong><span><UsersRound size={13} /> {teamSize} people</span></div><Progress value={value} label={`${value}% of target`} /></div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="attention-card">
          <CardHeader title="Needs attention" description="Risks and exceptions detected by workflow rules" />
          <div className="attention-list">
            <Link href="/finance/invoices" className="attention-item attention-item--danger"><span className="attention-item__icon">!</span><div><strong>1 overdue invoice</strong><p>$2,750 is seven days overdue from Aso Property Holdings.</p></div><ArrowRight size={16} /></Link>
            <Link href="/properties/reservations" className="attention-item attention-item--warning"><span className="attention-item__icon">4d</span><div><strong>Reservation approaching expiry</strong><p>Prime Retail Corner needs conversion or extension.</p></div><ArrowRight size={16} /></Link>
            <Link href="/people/leave" className="attention-item attention-item--info"><span className="attention-item__icon">2</span><div><strong>Leave requests waiting</strong><p>Manager action is required before team calendars update.</p></div><ArrowRight size={16} /></Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
