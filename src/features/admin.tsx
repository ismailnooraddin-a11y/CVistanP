"use client";

import {
  Activity,
  BadgeCheck,
  Building2,
  Bot,
  Boxes,
  Check,
  CheckCircle2,
  ChevronRight,
  Cloud,
  Code2,
  CreditCard,
  Database,
  Download,
  Eye,
  FileKey2,
  Fingerprint,
  Globe2,
  KeyRound,
  Link2,
  LockKeyhole,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserCog,
  UserPlus,
  Users,
  Waypoints,
  Webhook,
  Workflow,
  Zap
} from "lucide-react";
import { useMemo, useState } from "react";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { permissionsFor } from "@/lib/permissions";
import { ALL_MODULES, PLANS } from "@/lib/plans";
import { useWorkspace } from "@/store/workspace-store";
import type { PlanId, Role } from "@/types/domain";
import { Avatar, Badge, Button, Card, CardHeader, Input, PageHeader, Progress, SearchInput, Select, Tabs, cn, useToast } from "@/components/ui";

export function UsersPage() {
  const { tenant } = useWorkspace();
  const [search, setSearch] = useState("");
  const users = tenant.users.filter((user) => `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="page-stack"><PageHeader eyebrow="Administration" title="Users" description="Invite people, manage account status, assign roles, and monitor access." actions={<Button><UserPlus size={17} /> Invite user</Button>} /><div className="metrics-grid metrics-grid--4 metrics-grid--compact"><div className="stat-simple"><span><Users size={20} /></span><div><strong>{tenant.users.length}</strong><small>Active users</small></div></div><div className="stat-simple"><span><ShieldCheck size={20} /></span><div><strong>{new Set(tenant.users.map((user) => user.role)).size}</strong><small>Roles in use</small></div></div><div className="stat-simple"><span><Fingerprint size={20} /></span><div><strong>5</strong><small>MFA enabled</small></div></div><div className="stat-simple"><span><UserPlus size={20} /></span><div><strong>1</strong><small>Pending invite</small></div></div></div><Card className="toolbar-card"><div className="module-toolbar"><SearchInput value={search} onChange={setSearch} placeholder="Search users and roles..." /><div className="module-toolbar__actions"><Select><option>All roles</option><option>Owner</option><option>Manager</option><option>Agent</option></Select><Button variant="secondary"><Download size={16} /> Export</Button></div></div></Card><Card className="table-card"><div className="data-table-wrap"><table className="data-table"><thead><tr><th>User</th><th>Role</th><th>Employee profile</th><th>MFA</th><th>Last active</th><th>Status</th><th /></tr></thead><tbody>{users.map((user, index) => { const employee = tenant.employees.find((item) => item.id === user.employeeId); return <tr key={user.id}><td><div className="person-cell"><Avatar name={user.name} size="md" status="online" /><span><strong>{user.name}</strong><small>{user.email}</small></span></div></td><td><Badge tone={user.role === "owner" ? "purple" : user.role === "manager" ? "info" : "neutral"}>{user.role}</Badge></td><td>{employee ? employee.employeeNumber : "Not linked"}</td><td>{index === 5 ? <Badge tone="warning">Not enabled</Badge> : <Badge tone="success"><ShieldCheck size={12} /> Enabled</Badge>}</td><td>{index < 2 ? "Online now" : `${index + 1}h ago`}</td><td><Badge tone="success" dot>Active</Badge></td><td><button className="icon-button icon-button--small"><MoreHorizontal size={16} /></button></td></tr>; })}</tbody></table></div></Card></div>;
}

const roleLabels: Record<Role, string> = { owner: "Owner", admin: "Administrator", manager: "Manager", agent: "Sales Agent", finance: "Finance", people: "People Operations", marketing: "Marketing", viewer: "Viewer" };
export function RolesPage() {
  const [selected, setSelected] = useState<Role>("manager");
  const permissions = permissionsFor(selected);
  const matrixGroups = [
    { name: "Sales & CRM", permissions: ["manage:leads", "manage:customers"] },
    { name: "Property operations", permissions: ["manage:properties", "manage:contracts"] },
    { name: "Communications", permissions: ["manage:communications"] },
    { name: "Finance", permissions: ["manage:finance"] },
    { name: "Organization & People", permissions: ["manage:people", "approve:leave"] },
    { name: "Platform", permissions: ["manage:settings", "manage:subscription", "view:audit"] }
  ];
  return <div className="page-stack"><PageHeader eyebrow="Identity & access" title="Roles & permissions" description="Control what users can see and do by role, branch, team, and record ownership." actions={<Button><Plus size={17} /> Create custom role</Button>} /><div className="roles-layout"><Card className="role-list"><CardHeader title="Workspace roles" description="System and custom roles" />{(Object.keys(roleLabels) as Role[]).map((role) => <button className={cn("role-list__item", selected === role && "role-list__item--active")} onClick={() => setSelected(role)} key={role}><span><ShieldCheck size={18} /></span><div><strong>{roleLabels[role]}</strong><small>{role === "owner" ? "Full workspace control" : `${permissionsFor(role).length} granted permissions`}</small></div><ChevronRight size={16} /></button>)}</Card><Card className="permission-card"><CardHeader title={roleLabels[selected]} description="Base permissions and data access scope" action={<Button variant="secondary"><Save size={16} /> Save changes</Button>} /><div className="permission-summary"><span className="permission-summary__icon"><UserCog size={24} /></span><div><strong>{roleLabels[selected]}</strong><p>{selected === "manager" ? "Manages sales operations and team approvals without finance or platform administration." : "Role permissions can be combined with branch and team scope."}</p></div><Badge tone="purple">System role</Badge></div><div className="permission-matrix">{matrixGroups.map((group) => <div className="permission-group" key={group.name}><div><strong>{group.name}</strong><small>{group.permissions.length} capability{group.permissions.length === 1 ? "" : "ies"}</small></div><div>{group.permissions.map((permission) => { const granted = permissions.includes(permission as never); return <label className="permission-toggle" key={permission}><span>{permission.replace(":", " ").replaceAll("manage", "Manage").replaceAll("view", "View").replaceAll("approve", "Approve")}</span><input type="checkbox" checked={granted} readOnly /><i /></label>; })}</div></div>)}</div></Card></div></div>;
}

export function PackagesPage() {
  const { currentTenant, tenant, changePlan, can } = useWorkspace();
  const toast = useToast();
  const currentPlan = PLANS[currentTenant.planId];
  const usage = { users: tenant.users.length, properties: tenant.properties.length, storage: 18.6, ai: 7420 };
  return <div className="page-stack"><PageHeader eyebrow="Commercial platform" title="Plans, billing & entitlements" description="Plans are bundles of feature entitlements and usage limits—not separate versions of the codebase." actions={<Button variant="secondary"><CreditCard size={17} /> Billing portal</Button>} />
    <Card className="current-plan-card"><div><span className="current-plan-card__icon"><Boxes size={25} /></span><div><Badge tone="purple">Current plan</Badge><h2>{currentPlan.name}</h2><p>{currentPlan.description}</p></div></div><div className="current-plan-card__price"><strong>{formatCurrency(currentPlan.monthlyPrice)}</strong><span>/ workspace / month</span></div><Button variant="secondary">Manage subscription</Button></Card>
    <div className="plan-grid">{Object.values(PLANS).map((plan) => { const active = plan.id === currentTenant.planId; return <Card className={cn("plan-card", active && "plan-card--active")} key={plan.id}><div className="plan-card__top">{active ? <Badge tone="success"><Check size={12} /> Current plan</Badge> : plan.id === "enterprise" ? <Badge tone="purple"><Sparkles size={12} /> Most complete</Badge> : <span />}<h2>{plan.name}</h2><p>{plan.description}</p><div className="plan-card__price"><strong>{formatCurrency(plan.monthlyPrice)}</strong><span>/ month</span></div></div><div className="plan-card__limits"><span><Users size={16} /><strong>{plan.maxUsers > 1000 ? "Unlimited" : plan.maxUsers}</strong> users</span><span><Database size={16} /><strong>{plan.maxProperties > 100000 ? "Unlimited" : plan.maxProperties.toLocaleString()}</strong> properties</span><span><Cloud size={16} /><strong>{plan.storageGb.toLocaleString()} GB</strong> storage</span></div><div className="plan-card__features">{ALL_MODULES.map((module) => <div className={cn(!plan.modules.includes(module) && "plan-feature--disabled")} key={module}>{plan.modules.includes(module) ? <CheckCircle2 size={16} /> : <LockKeyhole size={15} />}<span>{module === "crm" ? "CRM & sales" : module === "people" ? "Organization & People" : module.charAt(0).toUpperCase() + module.slice(1)}</span></div>)}</div><Button variant={active ? "secondary" : plan.id === "enterprise" ? "primary" : "secondary"} disabled={active} onClick={() => { if (!can("manage:subscription")) { toast({ title: "Permission denied", message: "Only workspace owners can change plans.", tone: "danger" }); return; } changePlan(plan.id); toast({ title: "Plan changed", message: `${currentTenant.name} now uses the ${plan.name} entitlement bundle.`, tone: "success" }); }}>{active ? "Current plan" : `Switch to ${plan.name}`}</Button></Card>; })}</div>
    <div className="dashboard-grid dashboard-grid--halves"><Card><CardHeader title="Usage this billing period" description="Limits are enforced server-side in production" /><div className="usage-list"><div><span><Users size={17} /> Users</span><Progress value={(usage.users / Math.max(1, currentPlan.maxUsers)) * 100} label={`${usage.users} of ${currentPlan.maxUsers > 1000 ? "unlimited" : currentPlan.maxUsers}`} /></div><div><span><Database size={17} /> Properties</span><Progress value={(usage.properties / Math.max(1, currentPlan.maxProperties)) * 100} label={`${usage.properties} of ${currentPlan.maxProperties > 100000 ? "unlimited" : currentPlan.maxProperties.toLocaleString()}`} /></div><div><span><Cloud size={17} /> Storage</span><Progress value={(usage.storage / currentPlan.storageGb) * 100} label={`${usage.storage} GB of ${currentPlan.storageGb} GB`} /></div><div><span><Sparkles size={17} /> AI credits</span><Progress value={(usage.ai / 10000) * 100} label={`${usage.ai.toLocaleString()} of 10,000`} /></div></div></Card><Card><CardHeader title="Optional add-ons" description="Attach capabilities without creating a new plan" /><div className="addon-list">{[
      ["WhatsApp Business inbox", "$39 / month", "Connected"], ["AI Copilot credits", "$79 / 10k credits", "Active"], ["Digital signature", "$29 / month", "Available"], ["Dedicated database", "$249 / month", "Enterprise"]
    ].map(([name, price, status], index) => <div className="addon-row" key={name}><span className={`addon-row__icon addon-row__icon--${index}`}><Zap size={18} /></span><div><strong>{name}</strong><small>{price}</small></div><Badge tone={status === "Active" || status === "Connected" ? "success" : status === "Enterprise" ? "purple" : "neutral"}>{status}</Badge><Button variant="ghost" size="sm">Manage</Button></div>)}</div></Card></div>
  </div>;
}

export function IntegrationsPage() {
  const integrations = [
    { name: "WhatsApp Business", category: "Communications", description: "Unified team inbox, templates, and conversation sync.", status: "connected", icon: <MessageCircle size={22} /> },
    { name: "Microsoft 365", category: "Productivity", description: "Email, calendar, contacts, and document collaboration.", status: "connected", icon: <Mail size={22} /> },
    { name: "Google Maps", category: "Location", description: "Address search, geocoding, routes, and property maps.", status: "connected", icon: <Globe2 size={22} /> },
    { name: "OpenAI", category: "Artificial intelligence", description: "Permission-aware summaries, generation, and analytics.", status: "connected", icon: <Bot size={22} /> },
    { name: "Stripe", category: "Billing", description: "SaaS subscription billing, invoices, and entitlement events.", status: "available", icon: <CreditCard size={22} /> },
    { name: "QuickBooks", category: "Accounting", description: "Synchronize customers, invoices, payments, and accounts.", status: "available", icon: <Database size={22} /> },
    { name: "DocuSign", category: "E-signature", description: "Send and track legally binding signature envelopes.", status: "available", icon: <FileKey2 size={22} /> },
    { name: "Custom Webhooks", category: "Developer", description: "Publish business events to external systems.", status: "configured", icon: <Webhook size={22} /> }
  ];
  return <div className="page-stack"><PageHeader eyebrow="Administration" title="Integrations" description="Connect communications, maps, AI, accounting, signatures, portals, and developer systems." actions={<Button><Plus size={17} /> Request integration</Button>} /><div className="integration-grid">{integrations.map((integration, index) => <Card className="integration-card" key={integration.name}><div className={`integration-card__icon integration-card__icon--${index}`}>{integration.icon}</div><div className="integration-card__head"><div><span>{integration.category}</span><h3>{integration.name}</h3></div><Badge tone={integration.status === "connected" || integration.status === "configured" ? "success" : "neutral"} dot>{integration.status}</Badge></div><p>{integration.description}</p><div className="integration-card__footer"><span>{integration.status === "available" ? "Not configured" : "Healthy · synced recently"}</span><Button variant={integration.status === "available" ? "primary" : "secondary"} size="sm">{integration.status === "available" ? "Connect" : "Manage"}</Button></div></Card>)}</div></div>;
}

export function WorkflowsPage() {
  const workflows = [
    { name: "Reservation approval", trigger: "Reservation created above $250,000", steps: ["Validate availability", "Branch manager approval", "Notify finance", "Start expiry timer"], status: "active", runs: 38 },
    { name: "Leave approval", trigger: "Employee submits leave", steps: ["Check balance", "Direct manager approval", "People Ops review", "Update calendar"], status: "active", runs: 51 },
    { name: "Discount approval", trigger: "Discount exceeds 3%", steps: ["Sales director approval", "Finance validation", "Update proposal"], status: "active", runs: 12 },
    { name: "Overdue invoice escalation", trigger: "Invoice overdue by 3 days", steps: ["Send reminder", "Notify account owner", "Escalate after 7 days"], status: "draft", runs: 0 }
  ];
  return <div className="page-stack"><PageHeader eyebrow="Process automation" title="Approval workflows" description="Configure reusable, auditable business processes across sales, finance, and people operations." actions={<Button><Plus size={17} /> New workflow</Button>} /><div className="workflow-builder-list">{workflows.map((workflow, index) => <Card className="workflow-builder-card" key={workflow.name}><div className={`workflow-builder-card__number workflow-builder-card__number--${index}`}>{String(index + 1).padStart(2, "0")}</div><div className="workflow-builder-card__main"><div><h3>{workflow.name}</h3><Badge tone={workflow.status === "active" ? "success" : "neutral"}>{workflow.status}</Badge></div><p><strong>Trigger:</strong> {workflow.trigger}</p><div className="workflow-steps">{workflow.steps.map((step, stepIndex) => <div key={step}><span>{stepIndex + 1}</span><strong>{step}</strong>{stepIndex < workflow.steps.length - 1 ? <ChevronRight size={15} /> : null}</div>)}</div><small>{workflow.runs} successful runs in the last 90 days</small></div><div className="workflow-builder-card__actions"><Button variant="secondary" size="sm">Edit workflow</Button><button className="icon-button icon-button--small"><MoreHorizontal size={17} /></button></div></Card>)}</div></div>;
}

export function AuditPage() {
  const { tenant, state } = useWorkspace();
  const [search, setSearch] = useState("");
  const events = tenant.auditEvents.filter((event) => `${event.action} ${event.summary} ${event.entityType}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="page-stack"><PageHeader eyebrow="Security & compliance" title="Audit log" description="Immutable visibility into data changes, permissions, exports, approvals, and support access." actions={<Button variant="secondary"><Download size={17} /> Export audit log</Button>} /><Card className="audit-security-banner"><ShieldCheck size={24} /><div><strong>Audit protection enabled</strong><p>Production deployments should write these records server-side to append-only storage with retention controls.</p></div><Badge tone="success">365-day retention</Badge></Card><Card className="toolbar-card"><div className="module-toolbar"><SearchInput value={search} onChange={setSearch} placeholder="Search actions, entities, users..." /><div className="module-toolbar__actions"><Select><option>All actions</option><option>Create</option><option>Update</option><option>Delete</option><option>Access</option></Select><Select><option>All users</option>{tenant.users.map((user) => <option key={user.id}>{user.name}</option>)}</Select></div></div></Card><Card className="table-card"><div className="data-table-wrap"><table className="data-table"><thead><tr><th>Timestamp</th><th>Actor</th><th>Action</th><th>Entity</th><th>Summary</th><th>Source</th><th /></tr></thead><tbody>{events.map((event) => { const actor = state.users.find((user) => user.id === event.actorId); return <tr key={event.id}><td>{formatDateTime(event.createdAt)}</td><td><div className="person-cell"><Avatar name={actor?.name ?? "System"} size="sm" /><span><strong>{actor?.name ?? "System"}</strong><small>{actor?.role ?? "automation"}</small></span></div></td><td><code className="audit-action">{event.action}</code></td><td><Badge tone="neutral">{event.entityType}</Badge></td><td>{event.summary}</td><td><span className="source-ip">Web · 10.20.••.••</span></td><td><button className="icon-button icon-button--small"><Eye size={16} /></button></td></tr>; })}</tbody></table></div></Card></div>;
}

export function SettingsPage() {
  const { currentTenant, currentUser } = useWorkspace();
  const toast = useToast();
  const [tab, setTab] = useState("company");
  return <div className="page-stack"><PageHeader eyebrow="Administration" title="Workspace settings" description="Configure company identity, localization, security, notifications, data, and developer access." actions={<Button onClick={() => toast({ title: "Settings saved", message: "Demo settings were validated and saved locally.", tone: "success" })}><Save size={17} /> Save changes</Button>} /><div className="settings-layout"><Card className="settings-nav">{[
    ["company", "Company profile", Building2], ["localization", "Localization", Globe2], ["security", "Security", ShieldCheck], ["notifications", "Notifications", Mail], ["data", "Data & retention", Database], ["developer", "Developer settings", Code2]
  ].map(([id, label, Icon]) => { const IconComponent = Icon as typeof Building2; return <button className={cn(tab === id && "settings-nav__item--active")} onClick={() => setTab(String(id))} key={String(id)}><IconComponent size={18} /><span>{String(label)}</span><ChevronRight size={15} /></button>; })}</Card><Card className="settings-panel">{tab === "company" ? <><CardHeader title="Company profile" description="Visible across documents, communications, and customer portals" /><div className="company-logo-uploader"><span>{currentTenant.name.slice(0, 2).toUpperCase()}</span><div><strong>Workspace logo</strong><p>SVG, PNG, or JPG. Recommended 512 × 512 px.</p><Button variant="secondary" size="sm">Upload logo</Button></div></div><div className="form-grid"><Input label="Company name" defaultValue={currentTenant.name} /><Input label="Workspace slug" defaultValue={currentTenant.slug} /><Input label="Primary email" defaultValue={currentUser?.email} /><Input label="Phone" defaultValue="+964 750 100 1000" /><Input label="City" defaultValue={currentTenant.city} /><Input label="Country" defaultValue={currentTenant.country} /><Input label="Registered address" defaultValue="Gulan Street, English Village" className="form-grid__full" /></div></> : tab === "security" ? <><CardHeader title="Security controls" description="Protect accounts, sessions, and sensitive workspace data" /><div className="security-setting-list">{[
    ["Require multi-factor authentication", "Enforce MFA for all administrators and managers", true], ["Restrict exports", "Only approved roles can export customer or employee data", true], ["Session timeout", "Automatically sign out inactive users after 60 minutes", true], ["IP allow list", "Restrict access to approved office networks", false]
  ].map(([title, description, enabled]) => <label className="settings-toggle" key={String(title)}><span className="settings-toggle__icon"><LockKeyhole size={18} /></span><div><strong>{String(title)}</strong><p>{String(description)}</p></div><input type="checkbox" defaultChecked={Boolean(enabled)} /><i /></label>)}</div></> : tab === "developer" ? <><CardHeader title="Developer settings" description="API access, webhooks, and environment-safe credentials" /><div className="api-key-card"><div><KeyRound size={20} /><span><strong>Production API key</strong><small>Created 12 July 2026 · Last used 3 minutes ago</small></span></div><code>ef_live_••••••••••••••••7K2Q</code><Button variant="secondary" size="sm">Rotate key</Button></div><div className="webhook-card"><div><Webhook size={20} /><span><strong>Webhook endpoint</strong><small>Receives lead, property, contract, and payment events</small></span></div><Input defaultValue="https://api.example.com/webhooks/estateflow" /><Badge tone="success">Healthy</Badge></div></> : <><CardHeader title={tab.charAt(0).toUpperCase() + tab.slice(1)} description="Workspace configuration and policy controls" /><div className="settings-placeholder"><Settings2 size={32} /><h3>{tab.charAt(0).toUpperCase() + tab.slice(1)} settings</h3><p>This section is fully represented in the architecture and ready for production data bindings.</p></div></>}</Card></div></div>;
}
