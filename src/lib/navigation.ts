import type { ModuleKey } from "@/types/domain";

export interface NavigationItem {
  label: string;
  href: string;
  icon: string;
  module: ModuleKey;
  badge?: string;
}

export interface NavigationSection {
  label: string;
  items: NavigationItem[];
}

export const navigation: NavigationSection[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard", module: "dashboard" }]
  },
  {
    label: "Sales",
    items: [
      { label: "Leads", href: "/sales/leads", icon: "UserRoundSearch", module: "crm" },
      { label: "Customers", href: "/sales/customers", icon: "ContactRound", module: "crm" },
      { label: "Pipeline", href: "/sales/pipeline", icon: "KanbanSquare", module: "crm" },
      { label: "Activities", href: "/sales/activities", icon: "ListTodo", module: "crm" },
      { label: "Viewings", href: "/sales/viewings", icon: "CalendarDays", module: "operations" }
    ]
  },
  {
    label: "Properties",
    items: [
      { label: "Inventory", href: "/properties/inventory", icon: "Building2", module: "properties" },
      { label: "Projects & Units", href: "/properties/projects", icon: "Blocks", module: "properties" },
      { label: "Owners", href: "/properties/owners", icon: "KeyRound", module: "properties" },
      { label: "Map", href: "/properties/map", icon: "MapPinned", module: "properties" },
      { label: "Listings", href: "/properties/listings", icon: "Megaphone", module: "properties" },
      { label: "Reservations", href: "/properties/reservations", icon: "BadgeCheck", module: "operations" },
      { label: "Maintenance", href: "/properties/maintenance", icon: "Wrench", module: "operations" }
    ]
  },
  {
    label: "Communications",
    items: [
      { label: "Unified Inbox", href: "/communications/inbox", icon: "MessagesSquare", module: "communications", badge: "3" },
      { label: "Email", href: "/communications/email", icon: "Mail", module: "communications" },
      { label: "Calls", href: "/communications/calls", icon: "PhoneCall", module: "communications" },
      { label: "Templates", href: "/communications/templates", icon: "PanelsTopLeft", module: "communications" }
    ]
  },
  {
    label: "Operations",
    items: [
      { label: "Contracts", href: "/operations/contracts", icon: "FileSignature", module: "operations" },
      { label: "Documents", href: "/operations/documents", icon: "FolderKanban", module: "operations" },
      { label: "Inspections", href: "/operations/inspections", icon: "ClipboardCheck", module: "operations" },
      { label: "Handover", href: "/operations/handover", icon: "Handshake", module: "operations" }
    ]
  },
  {
    label: "Finance",
    items: [
      { label: "Finance Overview", href: "/finance/overview", icon: "Landmark", module: "finance" },
      { label: "Invoices", href: "/finance/invoices", icon: "ReceiptText", module: "finance" },
      { label: "Payments", href: "/finance/payments", icon: "CreditCard", module: "finance" },
      { label: "Installments", href: "/finance/installments", icon: "CalendarClock", module: "finance" },
      { label: "Expenses", href: "/finance/expenses", icon: "WalletCards", module: "finance" },
      { label: "Commissions", href: "/finance/commissions", icon: "BadgeDollarSign", module: "finance" }
    ]
  },
  {
    label: "Organization & People",
    items: [
      { label: "People Overview", href: "/people/overview", icon: "UsersRound", module: "people" },
      { label: "Employees", href: "/people/employees", icon: "Contact", module: "people" },
      { label: "Organization Chart", href: "/people/org-chart", icon: "Network", module: "people" },
      { label: "Branches", href: "/people/branches", icon: "GitBranch", module: "people" },
      { label: "Leave", href: "/people/leave", icon: "Palmtree", module: "people" },
      { label: "Attendance", href: "/people/attendance", icon: "Clock3", module: "people" },
      { label: "Onboarding", href: "/people/onboarding", icon: "UserPlus", module: "people" },
      { label: "Assets", href: "/people/assets", icon: "Laptop", module: "people" }
    ]
  },
  {
    label: "Growth",
    items: [
      { label: "Campaigns", href: "/marketing/campaigns", icon: "Rocket", module: "marketing" },
      { label: "Property Portals", href: "/marketing/portals", icon: "Globe2", module: "marketing" },
      { label: "Social Publishing", href: "/marketing/social", icon: "Share2", module: "marketing" },
      { label: "Automation", href: "/marketing/automation", icon: "Workflow", module: "marketing" },
      { label: "Reports", href: "/reports", icon: "ChartNoAxesCombined", module: "reports" },
      { label: "AI Copilot", href: "/ai", icon: "Sparkles", module: "ai", badge: "PRO" }
    ]
  },
  {
    label: "Administration",
    items: [
      { label: "Users", href: "/admin/users", icon: "Users", module: "administration" },
      { label: "Roles & Access", href: "/admin/roles", icon: "ShieldCheck", module: "administration" },
      { label: "Plans & Billing", href: "/admin/packages", icon: "Boxes", module: "administration" },
      { label: "Integrations", href: "/admin/integrations", icon: "PlugZap", module: "administration" },
      { label: "Workflows", href: "/admin/workflows", icon: "Waypoints", module: "administration" },
      { label: "Audit Log", href: "/admin/audit", icon: "ScrollText", module: "administration" },
      { label: "Settings", href: "/admin/settings", icon: "Settings2", module: "administration" }
    ]
  }
];

export const routeMeta = new Map(
  navigation.flatMap((section) => section.items.map((item) => [item.href, { ...item, section: section.label }] as const))
);
