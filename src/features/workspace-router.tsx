"use client";

import { AppShell } from "@/components/app-shell";
import { DashboardPage } from "@/features/dashboard";
import { ActivitiesPage, CustomersPage, LeadsPage, ViewingsPage } from "@/features/sales";
import { InventoryPage, ListingsPage, MaintenancePage, OwnersPage, ProjectsPage, PropertyMapPage, ReservationsPage } from "@/features/properties";
import { CallsPage, EmailPage, InboxPage, TemplatesPage } from "@/features/communications";
import { ContractsPage, DocumentsPage, HandoverPage, InspectionsPage } from "@/features/operations";
import { CommissionsPage, ExpensesPage, FinanceOverviewPage, InstallmentsPage, InvoicesPage, PaymentsPage } from "@/features/finance";
import { AssetsPage, AttendancePage, BranchesPage, EmployeesPage, LeavePage, OnboardingPage, OrgChartPage, PeopleOverviewPage } from "@/features/people";
import { AutomationPage, CampaignsPage, PortalsPage, SocialPage } from "@/features/marketing";
import { ReportsPage } from "@/features/reports";
import { AiPage } from "@/features/ai";
import { AuditPage, IntegrationsPage, PackagesPage, RolesPage, SettingsPage, UsersPage, WorkflowsPage } from "@/features/admin";
import { SignInPage } from "@/features/sign-in";
import { routeMeta } from "@/lib/navigation";
import { Card, PageHeader } from "@/components/ui";
import type { ModuleKey } from "@/types/domain";

const pages: Record<string, React.ComponentType> = {
  "/dashboard": DashboardPage,
  "/sales/leads": LeadsPage,
  "/sales/customers": CustomersPage,
  "/sales/pipeline": () => <LeadsPage pipelineOnly />,
  "/sales/activities": ActivitiesPage,
  "/sales/viewings": ViewingsPage,
  "/properties/inventory": InventoryPage,
  "/properties/projects": ProjectsPage,
  "/properties/owners": OwnersPage,
  "/properties/map": PropertyMapPage,
  "/properties/listings": ListingsPage,
  "/properties/reservations": ReservationsPage,
  "/properties/maintenance": MaintenancePage,
  "/communications/inbox": InboxPage,
  "/communications/email": EmailPage,
  "/communications/calls": CallsPage,
  "/communications/templates": TemplatesPage,
  "/operations/contracts": ContractsPage,
  "/operations/documents": DocumentsPage,
  "/operations/inspections": InspectionsPage,
  "/operations/handover": HandoverPage,
  "/finance/overview": FinanceOverviewPage,
  "/finance/invoices": InvoicesPage,
  "/finance/payments": PaymentsPage,
  "/finance/installments": InstallmentsPage,
  "/finance/expenses": ExpensesPage,
  "/finance/commissions": CommissionsPage,
  "/people/overview": PeopleOverviewPage,
  "/people/employees": EmployeesPage,
  "/people/org-chart": OrgChartPage,
  "/people/branches": BranchesPage,
  "/people/leave": LeavePage,
  "/people/attendance": AttendancePage,
  "/people/onboarding": OnboardingPage,
  "/people/assets": AssetsPage,
  "/marketing/campaigns": CampaignsPage,
  "/marketing/portals": PortalsPage,
  "/marketing/social": SocialPage,
  "/marketing/automation": AutomationPage,
  "/reports": ReportsPage,
  "/ai": AiPage,
  "/admin/users": UsersPage,
  "/admin/roles": RolesPage,
  "/admin/packages": PackagesPage,
  "/admin/integrations": IntegrationsPage,
  "/admin/workflows": WorkflowsPage,
  "/admin/audit": AuditPage,
  "/admin/settings": SettingsPage
};

function NotFoundPage() {
  return <div className="page-stack"><PageHeader eyebrow="EstateFlow" title="Page not found" description="This workspace route does not exist or has moved." /><Card className="not-found-card"><h2>404</h2><p>Use the navigation to return to an available module.</p></Card></div>;
}

export function WorkspaceRouter({ path }: { path: string }) {
  if (path === "/sign-in") return <SignInPage />;
  const Page = pages[path] ?? NotFoundPage;
  const requiredModule = (routeMeta.get(path)?.module ?? "dashboard") as ModuleKey;
  return <AppShell module={requiredModule}><Page /></AppShell>;
}
