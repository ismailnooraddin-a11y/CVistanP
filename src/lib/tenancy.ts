import type { ID, WorkspaceState } from "@/types/domain";

export type TenantCollectionKey = Exclude<
  keyof WorkspaceState,
  "currentTenantId" | "currentUserId" | "currentRole" | "theme" | "sidebarCollapsed" | "tenants"
>;

export function forTenant<T extends { tenantId: ID }>(items: T[], tenantId: ID): T[] {
  return items.filter((item) => item.tenantId === tenantId);
}

export function assertTenantAccess<T extends { tenantId: ID }>(item: T, tenantId: ID): T {
  if (item.tenantId !== tenantId) {
    throw new Error("Tenant isolation violation");
  }
  return item;
}

export function tenantSnapshot(state: WorkspaceState, tenantId = state.currentTenantId) {
  return {
    tenant: state.tenants.find((tenant) => tenant.id === tenantId),
    users: forTenant(state.users, tenantId),
    branches: forTenant(state.branches, tenantId),
    departments: forTenant(state.departments, tenantId),
    employees: forTenant(state.employees, tenantId),
    leaveRequests: forTenant(state.leaveRequests, tenantId),
    leads: forTenant(state.leads, tenantId),
    customers: forTenant(state.customers, tenantId),
    properties: forTenant(state.properties, tenantId),
    tasks: forTenant(state.tasks, tenantId),
    viewings: forTenant(state.viewings, tenantId),
    reservations: forTenant(state.reservations, tenantId),
    contracts: forTenant(state.contracts, tenantId),
    invoices: forTenant(state.invoices, tenantId),
    payments: forTenant(state.payments, tenantId),
    commissions: forTenant(state.commissions, tenantId),
    conversations: forTenant(state.conversations, tenantId),
    messages: forTenant(state.messages, tenantId),
    campaigns: forTenant(state.campaigns, tenantId),
    notifications: forTenant(state.notifications, tenantId),
    auditEvents: forTenant(state.auditEvents, tenantId)
  };
}
