"use client";

import {
  CalendarDays,
  Check,
  Clock3,
  Filter,
  Grid2X2,
  List,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  UserRoundCheck,
  UserRoundPlus,
  UsersRound
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { formatCurrency, formatDate, formatDateTime, relativeDate } from "@/lib/format";
import { validateRequired } from "@/lib/validation";
import { useWorkspace } from "@/store/workspace-store";
import type { LeadStage } from "@/types/domain";
import { Avatar, Badge, Button, Card, CardHeader, Input, Modal, PageHeader, SearchInput, Select, StatCard, Tabs, Textarea, cn, useToast } from "@/components/ui";

const leadStages: Array<{ id: LeadStage; label: string; tone: "neutral" | "info" | "success" | "warning" | "danger" | "purple" }> = [
  { id: "new", label: "New", tone: "info" },
  { id: "qualified", label: "Qualified", tone: "purple" },
  { id: "viewing", label: "Viewing", tone: "warning" },
  { id: "negotiation", label: "Negotiation", tone: "warning" },
  { id: "reserved", label: "Reserved", tone: "success" },
  { id: "won", label: "Won", tone: "success" },
  { id: "lost", label: "Lost", tone: "danger" }
];

function LeadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { tenant, addLead, can } = useWorkspace();
  const toast = useToast();
  const [form, setForm] = useState({ name: "", phone: "", email: "", source: "Website", budget: "", interest: "", assignedTo: tenant.employees[0]?.id ?? "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!can("manage:leads")) {
      toast({ title: "Permission denied", message: "This role cannot create leads.", tone: "danger" });
      return;
    }
    const result = validateRequired(form, ["name", "phone", "budget", "interest", "assignedTo"]);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    addLead({
      name: form.name,
      phone: form.phone,
      email: form.email || undefined,
      source: form.source,
      budget: Number(form.budget),
      currency: "USD",
      interest: form.interest,
      stage: "new",
      score: 72,
      assignedTo: form.assignedTo,
      nextFollowUp: "2026-07-18T10:00:00Z"
    });
    toast({ title: "Lead created", message: `${form.name} is now in the New stage.`, tone: "success" });
    setForm({ name: "", phone: "", email: "", source: "Website", budget: "", interest: "", assignedTo: tenant.employees[0]?.id ?? "" });
    setErrors({});
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title="Add a new lead" description="Capture the enquiry and assign the next action immediately." size="lg" footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" form="lead-form"><UserRoundPlus size={17} /> Create lead</Button></>}>
      <form id="lead-form" className="form-grid" onSubmit={submit}>
        <Input label="Full name" value={form.name} error={errors.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Ahmed Salih" />
        <Input label="Phone number" value={form.phone} error={errors.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="+964 750 000 0000" />
        <Input label="Email (optional)" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="name@example.com" />
        <Select label="Lead source" value={form.source} onChange={(event) => setForm({ ...form, source: event.target.value })}>
          {['Website', 'Meta Ads', 'Google Ads', 'WhatsApp', 'Referral', 'Walk-in', 'Property Portal'].map((source) => <option key={source}>{source}</option>)}
        </Select>
        <Input label="Budget (USD)" type="number" min="0" value={form.budget} error={errors.budget} onChange={(event) => setForm({ ...form, budget: event.target.value })} placeholder="250000" />
        <Select label="Assigned agent" value={form.assignedTo} onChange={(event) => setForm({ ...form, assignedTo: event.target.value })}>
          {tenant.employees.map((employee) => <option value={employee.id} key={employee.id}>{employee.firstName} {employee.lastName}</option>)}
        </Select>
        <Textarea label="Requirement" value={form.interest} onChange={(event) => setForm({ ...form, interest: event.target.value })} placeholder="Describe location, property type, bedrooms, timeline, and payment preference." className="form-grid__full" rows={4} />
      </form>
    </Modal>
  );
}

export function LeadsPage({ pipelineOnly = false }: { pipelineOnly?: boolean }) {
  const { tenant, updateLeadStage } = useWorkspace();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"board" | "list">(pipelineOnly ? "board" : "board");
  const [modalOpen, setModalOpen] = useState(false);
  const [stageFilter, setStageFilter] = useState<LeadStage | "all">("all");
  const leads = useMemo(() => tenant.leads.filter((lead) => {
    const matchesText = `${lead.name} ${lead.phone} ${lead.interest} ${lead.source}`.toLowerCase().includes(search.toLowerCase());
    return matchesText && (stageFilter === "all" || lead.stage === stageFilter);
  }), [tenant.leads, search, stageFilter]);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Sales workspace"
        title={pipelineOnly ? "Sales pipeline" : "Lead management"}
        description={pipelineOnly ? "Move opportunities through a controlled, visible sales process." : "Capture, qualify, assign, and convert every property enquiry."}
        actions={<><Button variant="secondary"><Sparkles size={17} /> AI qualify</Button><Button onClick={() => setModalOpen(true)}><Plus size={17} /> Add lead</Button></>}
      />
      <div className="metrics-grid metrics-grid--4 metrics-grid--compact">
        <StatCard label="Open leads" value={tenant.leads.filter((lead) => !["won", "lost"].includes(lead.stage)).length} change={10.2} icon={<UsersRound size={20} />} tone="brand" detail="in active pipeline" />
        <StatCard label="Hot prospects" value={tenant.leads.filter((lead) => lead.score >= 85 && lead.stage !== "won").length} change={16} icon={<UserRoundCheck size={20} />} tone="amber" detail="score 85 or higher" />
        <StatCard label="Pipeline value" value={formatCurrency(tenant.leads.filter((lead) => !["won", "lost"].includes(lead.stage)).reduce((sum, lead) => sum + lead.budget, 0))} change={8.6} icon={<Sparkles size={20} />} tone="green" detail="unweighted budgets" />
        <StatCard label="Follow-ups today" value={tenant.leads.filter((lead) => lead.nextFollowUp?.startsWith("2026-07-17")).length} icon={<Clock3 size={20} />} tone="blue" detail="2 overdue" />
      </div>
      <Card className="toolbar-card">
        <div className="module-toolbar">
          <SearchInput value={search} onChange={setSearch} placeholder="Search leads, phones, requirements..." />
          <div className="module-toolbar__actions">
            <Select value={stageFilter} onChange={(event) => setStageFilter(event.target.value as LeadStage | "all")} aria-label="Filter by stage">
              <option value="all">All stages</option>
              {leadStages.map((stage) => <option value={stage.id} key={stage.id}>{stage.label}</option>)}
            </Select>
            <Button variant="secondary"><Filter size={16} /> Filters</Button>
            <div className="view-toggle">
              <button className={cn(view === "board" && "active")} onClick={() => setView("board")} aria-label="Board view"><Grid2X2 size={17} /></button>
              <button className={cn(view === "list" && "active")} onClick={() => setView("list")} aria-label="List view"><List size={17} /></button>
            </div>
          </div>
        </div>
      </Card>

      {view === "board" ? (
        <div className="kanban-board">
          {leadStages.filter((stage) => pipelineOnly ? stage.id !== "lost" : true).map((stage) => {
            const items = leads.filter((lead) => lead.stage === stage.id);
            return (
              <section className="kanban-column" key={stage.id}>
                <header className="kanban-column__header"><span><i className={`stage-dot stage-dot--${stage.id}`} />{stage.label}</span><strong>{items.length}</strong></header>
                <div className="kanban-column__body">
                  {items.map((lead) => {
                    const agent = tenant.employees.find((employee) => employee.id === lead.assignedTo);
                    return (
                      <article className="lead-card" key={lead.id}>
                        <div className="lead-card__top"><Badge tone={lead.score >= 85 ? "success" : lead.score >= 70 ? "warning" : "neutral"}>{lead.score} score</Badge><button className="icon-button icon-button--small"><MoreHorizontal size={16} /></button></div>
                        <h3>{lead.name}</h3><p>{lead.interest}</p>
                        <div className="lead-card__budget"><span>Budget</span><strong>{formatCurrency(lead.budget, lead.currency)}</strong></div>
                        <div className="lead-card__source"><span>{lead.source}</span><small>{relativeDate(lead.lastActivityAt)}</small></div>
                        <div className="lead-card__footer">
                          <Avatar name={agent ? `${agent.firstName} ${agent.lastName}` : "Unassigned"} size="sm" status="online" />
                          <select
                            aria-label={`Change stage for ${lead.name}`}
                            value={lead.stage}
                            onChange={(event) => {
                              const next = event.target.value as LeadStage;
                              updateLeadStage(lead.id, next);
                              toast({ title: "Pipeline updated", message: `${lead.name} moved to ${next}.`, tone: "success" });
                            }}
                          >
                            {leadStages.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}
                          </select>
                        </div>
                      </article>
                    );
                  })}
                  {items.length === 0 ? <div className="kanban-empty">No leads</div> : null}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <Card className="table-card">
          <div className="data-table-wrap">
            <table className="data-table">
              <thead><tr><th>Lead</th><th>Requirement</th><th>Source</th><th>Budget</th><th>Stage</th><th>Owner</th><th>Next action</th><th /></tr></thead>
              <tbody>{leads.map((lead) => {
                const agent = tenant.employees.find((employee) => employee.id === lead.assignedTo);
                const meta = leadStages.find((stage) => stage.id === lead.stage);
                return <tr key={lead.id}>
                  <td><div className="person-cell"><Avatar name={lead.name} size="sm" /><span><strong>{lead.name}</strong><small>{lead.phone}</small></span></div></td>
                  <td><span className="truncate-cell">{lead.interest}</span></td><td>{lead.source}</td><td><strong>{formatCurrency(lead.budget)}</strong></td>
                  <td><Badge tone={meta?.tone}>{meta?.label}</Badge></td>
                  <td><div className="mini-person"><Avatar name={agent ? `${agent.firstName} ${agent.lastName}` : "Unassigned"} size="sm" /><span>{agent?.firstName ?? "Unassigned"}</span></div></td>
                  <td>{lead.nextFollowUp ? formatDateTime(lead.nextFollowUp) : "—"}</td><td><button className="icon-button icon-button--small"><MoreHorizontal size={16} /></button></td>
                </tr>;
              })}</tbody>
            </table>
          </div>
        </Card>
      )}
      <LeadModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export function CustomersPage() {
  const { tenant } = useWorkspace();
  const [search, setSearch] = useState("");
  const customers = tenant.customers.filter((customer) => `${customer.name} ${customer.phone} ${customer.email ?? ""}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="page-stack">
      <PageHeader eyebrow="Sales workspace" title="Customers" description="A complete relationship record for buyers, tenants, investors, owners, and companies." actions={<Button><Plus size={17} /> Add customer</Button>} />
      <div className="metrics-grid metrics-grid--4 metrics-grid--compact">
        <StatCard label="Total customers" value={tenant.customers.length} change={9.1} icon={<UsersRound size={20} />} tone="brand" detail="all active profiles" />
        <StatCard label="Buyers" value={tenant.customers.filter((item) => item.type === "buyer").length} icon={<UserRoundCheck size={20} />} tone="green" detail="verified demand" />
        <StatCard label="Owners" value={tenant.customers.filter((item) => item.type === "owner").length} icon={<UserRoundPlus size={20} />} tone="blue" detail="listing relationships" />
        <StatCard label="Companies" value={tenant.customers.filter((item) => item.type === "company").length} icon={<Sparkles size={20} />} tone="amber" detail="B2B accounts" />
      </div>
      <Card className="toolbar-card"><div className="module-toolbar"><SearchInput value={search} onChange={setSearch} placeholder="Search customer profiles..." /><div className="module-toolbar__actions"><Button variant="secondary"><SlidersHorizontal size={16} /> Segments</Button><Button variant="secondary">Export</Button></div></div></Card>
      <Card className="table-card">
        <div className="data-table-wrap"><table className="data-table"><thead><tr><th>Customer</th><th>Type</th><th>Language</th><th>Assigned agent</th><th>Contact</th><th>Created</th><th>Status</th><th /></tr></thead>
        <tbody>{customers.map((customer) => {
          const agent = tenant.employees.find((employee) => employee.id === customer.assignedTo);
          return <tr key={customer.id}><td><div className="person-cell"><Avatar name={customer.name} size="sm" status="online" /><span><strong>{customer.name}</strong><small>{customer.email ?? "No email"}</small></span></div></td><td><Badge tone={customer.type === "owner" ? "purple" : customer.type === "investor" ? "warning" : "info"}>{customer.type}</Badge></td><td>{customer.preferredLanguage}</td><td>{agent ? `${agent.firstName} ${agent.lastName}` : "Unassigned"}</td><td><div className="inline-actions"><a href={`tel:${customer.phone}`} className="icon-button icon-button--small"><Phone size={15} /></a>{customer.email ? <a href={`mailto:${customer.email}`} className="icon-button icon-button--small"><Mail size={15} /></a> : null}</div></td><td>{formatDate(customer.createdAt)}</td><td><Badge tone="success" dot>Active</Badge></td><td><button className="icon-button icon-button--small"><MoreHorizontal size={16} /></button></td></tr>;
        })}</tbody></table></div>
      </Card>
    </div>
  );
}

export function ActivitiesPage() {
  const { tenant, toggleTask } = useWorkspace();
  const [tab, setTab] = useState("open");
  const tasks = tenant.tasks.filter((task) => tab === "all" || task.status === tab);
  return (
    <div className="page-stack">
      <PageHeader eyebrow="Productivity" title="Activities & tasks" description="Coordinate calls, follow-ups, documents, and operational work across the agency." actions={<Button><Plus size={17} /> New task</Button>} />
      <Card><CardHeader title="Work queue" description="Prioritized by deadline and business risk" action={<Tabs active={tab} onChange={setTab} items={[{ id: "open", label: "Open", count: tenant.tasks.filter((item) => item.status === "open").length }, { id: "done", label: "Completed", count: tenant.tasks.filter((item) => item.status === "done").length }, { id: "all", label: "All" }]} />} />
        <div className="activity-table">
          {tasks.map((task) => {
            const assignee = tenant.employees.find((employee) => employee.id === task.assignedTo);
            return <div className={cn("activity-row", task.status === "done" && "activity-row--done")} key={task.id}><button className="activity-row__check" onClick={() => toggleTask(task.id)}>{task.status === "done" ? <Check size={15} /> : null}</button><div className="activity-row__main"><strong>{task.title}</strong><span>{task.description ?? `Related to ${task.relatedType ?? "general operations"}`}</span></div><Badge tone={task.priority === "urgent" ? "danger" : task.priority === "high" ? "warning" : "neutral"}>{task.priority}</Badge><div className="mini-person"><Avatar name={assignee ? `${assignee.firstName} ${assignee.lastName}` : "Team"} size="sm" /><span>{assignee?.firstName}</span></div><time><Clock3 size={14} />{formatDateTime(task.dueAt)}</time><button className="icon-button icon-button--small"><MoreHorizontal size={16} /></button></div>;
          })}
        </div>
      </Card>
    </div>
  );
}

export function ViewingsPage() {
  const { tenant } = useWorkspace();
  const days = ["17 Jul", "18 Jul", "19 Jul", "20 Jul", "21 Jul"];
  return (
    <div className="page-stack">
      <PageHeader eyebrow="Sales operations" title="Viewings calendar" description="Plan property tours, manage agent capacity, and capture outcomes." actions={<Button><Plus size={17} /> Schedule viewing</Button>} />
      <div className="calendar-layout">
        <Card className="calendar-main"><CardHeader title="Team schedule" description="Erbil and Sulaymaniyah branches" action={<div className="calendar-controls"><Button variant="secondary" size="sm">Today</Button><Button variant="ghost" size="sm">Week</Button></div>} />
          <div className="week-calendar">
            <div className="week-calendar__times">{["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"].map((time) => <span key={time}>{time}</span>)}</div>
            {days.map((day, dayIndex) => <div className="week-calendar__day" key={day}><header><strong>{day.split(" ")[0]}</strong><span>{day.split(" ")[1]}</span></header><div className="week-calendar__grid">{tenant.viewings.filter((viewing) => new Date(viewing.startsAt).getUTCDate() === 17 + dayIndex).map((viewing, index) => {
              const property = tenant.properties.find((item) => item.id === viewing.propertyId); const agent = tenant.employees.find((item) => item.id === viewing.agentId);
              return <article className={`calendar-event calendar-event--${index % 3}`} style={{ top: `${(new Date(viewing.startsAt).getUTCHours() - 9) * 64 + 10}px` }} key={viewing.id}><strong>{viewing.customerName}</strong><span>{property?.title}</span><small>{agent?.firstName} · {new Date(viewing.startsAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })}</small></article>;
            })}</div></div>)}
          </div>
        </Card>
        <Card><CardHeader title="Upcoming" description="Next property tours" /><div className="viewing-list">{tenant.viewings.map((viewing) => { const property = tenant.properties.find((item) => item.id === viewing.propertyId); const agent = tenant.employees.find((item) => item.id === viewing.agentId); return <div className="viewing-list__item" key={viewing.id}><div className="date-tile"><strong>{new Date(viewing.startsAt).getUTCDate()}</strong><span>JUL</span></div><div><strong>{viewing.customerName}</strong><p>{property?.title}</p><small><CalendarDays size={13} /> {formatDateTime(viewing.startsAt)} · {agent?.firstName}</small></div></div>; })}</div></Card>
      </div>
    </div>
  );
}
