"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Command,
  Download,
  LockKeyhole,
  Menu,
  Moon,
  Plus,
  Search,
  Sun,
  Upload,
  X
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { navigation, routeMeta } from "@/lib/navigation";
import { PLANS } from "@/lib/plans";
import { formatCurrency, formatDateTime, initials } from "@/lib/format";
import { useWorkspace } from "@/store/workspace-store";
import type { ModuleKey, Role } from "@/types/domain";
import { AppIcon } from "@/components/icon";
import { Avatar, Badge, Button, cn, useToast } from "@/components/ui";

function LogoMark() {
  return (
    <span className="logo-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

function TenantSwitcher() {
  const { state, currentTenant, switchTenant } = useWorkspace();
  const [open, setOpen] = useState(false);
  return (
    <div className="tenant-switcher">
      <button type="button" className="tenant-switcher__button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span className="tenant-switcher__logo">{initials(currentTenant.name)}</span>
        <span className="tenant-switcher__copy">
          <strong>{currentTenant.name}</strong>
          <small>{PLANS[currentTenant.planId].name} workspace</small>
        </span>
        <ChevronDown size={16} />
      </button>
      {open ? (
        <div className="popover tenant-switcher__menu">
          <div className="popover__label">Your workspaces</div>
          {state.tenants.map((tenant) => (
            <button
              type="button"
              key={tenant.id}
              className={cn("tenant-option", tenant.id === currentTenant.id && "tenant-option--active")}
              onClick={() => {
                switchTenant(tenant.id);
                setOpen(false);
              }}
            >
              <span className="tenant-option__logo" style={{ background: tenant.accent }}>
                {initials(tenant.name)}
              </span>
              <span>
                <strong>{tenant.name}</strong>
                <small>{tenant.city} · {PLANS[tenant.planId].name}</small>
              </span>
              {tenant.id === currentTenant.id ? <Badge tone="success">Active</Badge> : null}
            </button>
          ))}
          <div className="popover__footer">
            <Button size="sm" variant="ghost"><Plus size={15} /> Create workspace</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { state, toggleSidebar, moduleEnabled } = useWorkspace();
  return (
    <>
      <aside className={cn("sidebar", state.sidebarCollapsed && "sidebar--collapsed", mobileOpen && "sidebar--mobile-open")}>
        <div className="sidebar__brand">
          <Link href="/dashboard" className="brand" onClick={onClose}>
            <LogoMark />
            <span className="brand__copy"><strong>EstateFlow</strong><small>Real Estate OS</small></span>
          </Link>
          <button className="icon-button sidebar__close-mobile" onClick={onClose} aria-label="Close navigation"><X size={19} /></button>
        </div>
        <div className="sidebar__tenant"><TenantSwitcher /></div>
        <nav className="sidebar__nav" aria-label="Primary navigation">
          {navigation.map((section) => (
            <div className="nav-section" key={section.label}>
              <div className="nav-section__label">{section.label}</div>
              {section.items.map((item) => {
                const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
                const enabled = moduleEnabled(item.module);
                return (
                  <Link
                    href={enabled ? item.href : "/admin/packages"}
                    className={cn("nav-item", active && "nav-item--active", !enabled && "nav-item--locked")}
                    key={item.href}
                    title={state.sidebarCollapsed ? item.label : undefined}
                    onClick={onClose}
                  >
                    <span className="nav-item__icon"><AppIcon name={item.icon} size={18} /></span>
                    <span className="nav-item__label">{item.label}</span>
                    {!enabled ? <LockKeyhole className="nav-item__lock" size={13} /> : item.badge ? <span className="nav-item__badge">{item.badge}</span> : null}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="sidebar__footer">
          <Link href="/admin/settings" className="nav-item"><span className="nav-item__icon"><CircleHelp size={18} /></span><span className="nav-item__label">Help & support</span></Link>
          <button type="button" className="sidebar-collapse" onClick={toggleSidebar}>
            {state.sidebarCollapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
            <span>{state.sidebarCollapsed ? "Expand" : "Collapse sidebar"}</span>
          </button>
        </div>
      </aside>
      {mobileOpen ? <button className="mobile-overlay" onClick={onClose} aria-label="Close navigation" /> : null}
    </>
  );
}

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: string;
}

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { tenant, moduleEnabled } = useWorkspace();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(focusTimer);
  }, [open]);

  const results = useMemo<SearchResult[]>(() => {
    const modules = navigation.flatMap((section) => section.items)
      .filter((item) => moduleEnabled(item.module))
      .map((item) => ({ id: item.href, title: item.label, subtitle: "Open module", href: item.href, icon: item.icon }));
    const entities: SearchResult[] = [
      ...tenant.leads.map((lead) => ({ id: lead.id, title: lead.name, subtitle: `Lead · ${lead.interest}`, href: "/sales/leads", icon: "UserRoundSearch" })),
      ...tenant.properties.map((property) => ({ id: property.id, title: property.title, subtitle: `${property.reference} · ${formatCurrency(property.price, property.currency)}`, href: "/properties/inventory", icon: "Building2" })),
      ...tenant.employees.map((employee) => ({ id: employee.id, title: `${employee.firstName} ${employee.lastName}`, subtitle: `${employee.jobTitle} · ${employee.employeeNumber}`, href: "/people/employees", icon: "Contact" })),
      ...tenant.contracts.map((contract) => ({ id: contract.id, title: contract.reference, subtitle: `${contract.title} · ${contract.customerName}`, href: "/operations/contracts", icon: "FileSignature" }))
    ];
    const term = query.trim().toLowerCase();
    const source = [...modules, ...entities];
    return term ? source.filter((item) => `${item.title} ${item.subtitle}`.toLowerCase().includes(term)).slice(0, 12) : source.slice(0, 8);
  }, [query, tenant, moduleEnabled]);

  if (!open) return null;
  return (
    <div className="command-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="command-palette" role="dialog" aria-modal="true" aria-label="Global search">
        <div className="command-palette__search">
          <Search size={20} />
          <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search people, properties, leads, contracts..." />
          <kbd>ESC</kbd>
        </div>
        <div className="command-palette__results">
          <div className="popover__label">{query ? "Search results" : "Suggested"}</div>
          {results.map((result) => (
            <button
              type="button"
              className="command-result"
              key={`${result.id}-${result.href}`}
              onClick={() => {
                router.push(result.href);
                onClose();
              }}
            >
              <span className="command-result__icon"><AppIcon name={result.icon} size={18} /></span>
              <span><strong>{result.title}</strong><small>{result.subtitle}</small></span>
              <span className="command-result__arrow">↵</span>
            </button>
          ))}
          {results.length === 0 ? <div className="command-empty">No matching records.</div> : null}
        </div>
        <div className="command-palette__footer"><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>↵</kbd> Open</span></div>
      </div>
    </div>
  );
}

function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { tenant, markNotificationRead, markAllNotificationsRead } = useWorkspace();
  const router = useRouter();
  if (!open) return null;
  return (
    <div className="drawer-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Notifications">
        <div className="drawer__header">
          <div><h2>Notifications</h2><p>{tenant.notifications.filter((item) => !item.read).length} unread updates</p></div>
          <Button variant="ghost" size="icon" onClick={onClose}><X size={19} /></Button>
        </div>
        <div className="drawer__toolbar"><button type="button" onClick={markAllNotificationsRead}>Mark all as read</button></div>
        <div className="notification-list">
          {tenant.notifications.map((item) => (
            <button
              type="button"
              className={cn("notification-item", !item.read && "notification-item--unread")}
              key={item.id}
              onClick={() => {
                markNotificationRead(item.id);
                if (item.href) router.push(item.href);
                onClose();
              }}
            >
              <span className={cn("notification-item__marker", `notification-item__marker--${item.type}`)} />
              <span><strong>{item.title}</strong><p>{item.body}</p><small>{formatDateTime(item.createdAt)}</small></span>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}

function ProfileMenu() {
  const { currentUser, currentTenant, state, switchRole, exportWorkspace, importWorkspace, resetWorkspace } = useWorkspace();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const roleLabels: Record<Role, string> = {
    owner: "Owner",
    admin: "Administrator",
    manager: "Manager",
    agent: "Sales Agent",
    finance: "Finance",
    people: "People Ops",
    marketing: "Marketing",
    viewer: "Viewer"
  };
  return (
    <div className="profile-menu">
      <button type="button" className="profile-menu__button" onClick={() => setOpen((value) => !value)}>
        <Avatar name={currentUser?.name ?? "Demo User"} size="sm" status="online" />
        <span><strong>{currentUser?.name ?? "Demo User"}</strong><small>{roleLabels[state.currentRole]}</small></span>
        <ChevronDown size={15} />
      </button>
      {open ? (
        <div className="popover profile-menu__popover">
          <div className="profile-summary">
            <Avatar name={currentUser?.name ?? "Demo User"} size="lg" status="online" />
            <div><strong>{currentUser?.name ?? "Demo User"}</strong><span>{currentUser?.email}</span><small>{currentTenant.name}</small></div>
          </div>
          <div className="popover__label">Preview permissions as</div>
          <div className="role-grid">
            {(Object.keys(roleLabels) as Role[]).map((role) => (
              <button type="button" className={cn(state.currentRole === role && "role-option--active")} key={role} onClick={() => switchRole(role)}>{roleLabels[role]}</button>
            ))}
          </div>
          <div className="popover__divider" />
          <button type="button" className="menu-action" onClick={exportWorkspace}><Download size={16} /> Export demo data</button>
          <button type="button" className="menu-action" onClick={() => fileRef.current?.click()}><Upload size={16} /> Import demo data</button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              try {
                await importWorkspace(file);
                toast({ title: "Workspace imported", message: "The demo data was restored successfully.", tone: "success" });
              } catch (error) {
                toast({ title: "Import failed", message: error instanceof Error ? error.message : "Invalid backup file.", tone: "danger" });
              }
            }}
          />
          <button type="button" className="menu-action menu-action--danger" onClick={() => {
            resetWorkspace();
            toast({ title: "Demo reset", message: "The original sample data has been restored.", tone: "info" });
          }}>Reset demo workspace</button>
        </div>
      ) : null}
    </div>
  );
}

function Topbar({ onMenu, onCommand, onNotifications }: { onMenu: () => void; onCommand: () => void; onNotifications: () => void }) {
  const pathname = usePathname();
  const { state, tenant, toggleTheme, currentTenant } = useWorkspace();
  const meta = routeMeta.get(pathname);
  const unread = tenant.notifications.filter((item) => !item.read).length;
  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className="icon-button topbar__mobile-menu" onClick={onMenu} aria-label="Open navigation"><Menu size={20} /></button>
        <div className="breadcrumbs"><span>{meta?.section ?? "EstateFlow"}</span><ChevronRight size={14} /><strong>{meta?.label ?? "Workspace"}</strong></div>
      </div>
      <div className="topbar__center">
        <button type="button" className="global-search" onClick={onCommand}>
          <Search size={17} /><span>Search {currentTenant.name}</span><kbd><Command size={12} /> K</kbd>
        </button>
      </div>
      <div className="topbar__actions">
        <button className="icon-button" onClick={toggleTheme} aria-label="Toggle color theme">{state.theme === "light" ? <Moon size={18} /> : <Sun size={18} />}</button>
        <button className="icon-button notification-button" onClick={onNotifications} aria-label="Open notifications"><Bell size={18} />{unread ? <span>{unread}</span> : null}</button>
        <ProfileMenu />
      </div>
    </header>
  );
}

function ModuleGuard({ module, children }: { module: ModuleKey; children: ReactNode }) {
  const { moduleEnabled, currentTenant } = useWorkspace();
  if (moduleEnabled(module)) return children;
  const plan = PLANS[currentTenant.planId];
  return (
    <div className="locked-module">
      <div className="locked-module__visual"><LockKeyhole size={36} /></div>
      <Badge tone="purple">Plan upgrade</Badge>
      <h1>This module is not included in {plan.name}</h1>
      <p>Upgrade the workspace to unlock this module, advanced workflows, and additional usage limits.</p>
      <Link href="/admin/packages" className="button button--primary button--lg">Compare plans</Link>
    </div>
  );
}

export function AppShell({ children, module = "dashboard" }: { children: ReactNode; module?: ModuleKey }) {
  const { state } = useWorkspace();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
      if (event.key === "Escape") {
        setCommandOpen(false);
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, []);

  return (
    <div className={cn("app-shell", state.sidebarCollapsed && "app-shell--sidebar-collapsed")}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="app-shell__main">
        <Topbar onMenu={() => setMobileOpen(true)} onCommand={() => setCommandOpen(true)} onNotifications={() => setNotificationsOpen(true)} />
        <main className="page-content"><ModuleGuard module={module}>{children}</ModuleGuard></main>
      </div>
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
      <NotificationPanel open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </div>
  );
}
