"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode
} from "react";
import { createSeedState } from "@/lib/seed";
import { can, type Permission } from "@/lib/permissions";
import { hasModule } from "@/lib/plans";
import { tenantSnapshot } from "@/lib/tenancy";
import type {
  Employee,
  ID,
  Invoice,
  Lead,
  LeadStage,
  LeaveRequest,
  Message,
  ModuleKey,
  PlanId,
  Property,
  PropertyStatus,
  Role,
  WorkspaceState
} from "@/types/domain";

const STORAGE_KEY = "estateflow-pro-workspace-v1";

function makeId(prefix: string): string {
  const random = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2);
  return `${prefix}-${random}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function audit(state: WorkspaceState, action: string, entityType: string, entityId: ID, summary: string) {
  return [
    {
      id: makeId("audit"),
      tenantId: state.currentTenantId,
      actorId: state.currentUserId,
      action,
      entityType,
      entityId,
      summary,
      createdAt: nowIso()
    },
    ...state.auditEvents
  ];
}

type NewLead = Omit<Lead, "id" | "tenantId" | "createdAt" | "lastActivityAt">;
type NewProperty = Omit<Property, "id" | "tenantId" | "createdAt" | "reference" | "mapX" | "mapY">;
type NewEmployee = Omit<Employee, "id" | "tenantId" | "employeeNumber">;
type NewLeave = Omit<LeaveRequest, "id" | "tenantId" | "status" | "submittedAt" | "approverId" | "reviewedAt">;
type NewInvoice = Omit<Invoice, "id" | "tenantId" | "reference" | "createdAt" | "status">;

type Action =
  | { type: "hydrate"; payload: WorkspaceState }
  | { type: "switchTenant"; tenantId: ID }
  | { type: "switchRole"; role: Role }
  | { type: "toggleTheme" }
  | { type: "toggleSidebar" }
  | { type: "addLead"; payload: NewLead }
  | { type: "updateLeadStage"; leadId: ID; stage: LeadStage }
  | { type: "addProperty"; payload: NewProperty }
  | { type: "updatePropertyStatus"; propertyId: ID; status: PropertyStatus }
  | { type: "toggleTask"; taskId: ID }
  | { type: "addEmployee"; payload: NewEmployee }
  | { type: "addLeave"; payload: NewLeave }
  | { type: "reviewLeave"; leaveId: ID; status: "approved" | "rejected" }
  | { type: "sendMessage"; conversationId: ID; body: string }
  | { type: "addInvoice"; payload: NewInvoice }
  | { type: "markInvoicePaid"; invoiceId: ID }
  | { type: "markNotificationRead"; notificationId: ID }
  | { type: "markAllNotificationsRead" }
  | { type: "changePlan"; planId: PlanId }
  | { type: "importState"; payload: WorkspaceState }
  | { type: "reset" };

function reducer(state: WorkspaceState, action: Action): WorkspaceState {
  switch (action.type) {
    case "hydrate":
      return action.payload;
    case "switchTenant": {
      const nextUser = state.users.find((user) => user.tenantId === action.tenantId && user.status === "active");
      if (!nextUser) return state;
      return {
        ...state,
        currentTenantId: action.tenantId,
        currentUserId: nextUser.id,
        currentRole: nextUser.role
      };
    }
    case "switchRole":
      return { ...state, currentRole: action.role };
    case "toggleTheme":
      return { ...state, theme: state.theme === "light" ? "dark" : "light" };
    case "toggleSidebar":
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case "addLead": {
      const id = makeId("lead");
      const lead: Lead = {
        ...action.payload,
        id,
        tenantId: state.currentTenantId,
        createdAt: nowIso(),
        lastActivityAt: nowIso()
      };
      return {
        ...state,
        leads: [lead, ...state.leads],
        auditEvents: audit(state, "lead.created", "lead", id, `Created lead ${lead.name}`),
        notifications: [
          {
            id: makeId("notification"),
            tenantId: state.currentTenantId,
            title: "Lead created",
            body: `${lead.name} was added to the sales pipeline.`,
            type: "success",
            read: false,
            createdAt: nowIso(),
            href: "/sales/leads"
          },
          ...state.notifications
        ]
      };
    }
    case "updateLeadStage": {
      const lead = state.leads.find((item) => item.id === action.leadId && item.tenantId === state.currentTenantId);
      if (!lead) return state;
      return {
        ...state,
        leads: state.leads.map((item) =>
          item.id === action.leadId ? { ...item, stage: action.stage, lastActivityAt: nowIso() } : item
        ),
        auditEvents: audit(state, "lead.stage.changed", "lead", lead.id, `Moved ${lead.name} to ${action.stage}`)
      };
    }
    case "addProperty": {
      const sequence = state.properties.filter((property) => property.tenantId === state.currentTenantId).length + 1048;
      const id = makeId("property");
      const property: Property = {
        ...action.payload,
        id,
        tenantId: state.currentTenantId,
        reference: `EF-${sequence}`,
        createdAt: nowIso(),
        mapX: 20 + Math.round(Math.random() * 65),
        mapY: 20 + Math.round(Math.random() * 60)
      };
      return {
        ...state,
        properties: [property, ...state.properties],
        auditEvents: audit(state, "property.created", "property", id, `Created property ${property.title}`)
      };
    }
    case "updatePropertyStatus": {
      const property = state.properties.find((item) => item.id === action.propertyId && item.tenantId === state.currentTenantId);
      if (!property) return state;
      return {
        ...state,
        properties: state.properties.map((item) => (item.id === property.id ? { ...item, status: action.status } : item)),
        auditEvents: audit(state, "property.status.changed", "property", property.id, `Changed ${property.reference} to ${action.status}`)
      };
    }
    case "toggleTask": {
      const task = state.tasks.find((item) => item.id === action.taskId && item.tenantId === state.currentTenantId);
      if (!task) return state;
      const status = task.status === "open" ? "done" : "open";
      return {
        ...state,
        tasks: state.tasks.map((item) => (item.id === task.id ? { ...item, status } : item)),
        auditEvents: audit(state, "task.status.changed", "task", task.id, `${status === "done" ? "Completed" : "Reopened"} ${task.title}`)
      };
    }
    case "addEmployee": {
      const count = state.employees.filter((employee) => employee.tenantId === state.currentTenantId).length + 1;
      const id = makeId("employee");
      const employee: Employee = {
        ...action.payload,
        id,
        tenantId: state.currentTenantId,
        employeeNumber: `EF-${String(count).padStart(4, "0")}`
      };
      return {
        ...state,
        employees: [employee, ...state.employees],
        auditEvents: audit(state, "employee.created", "employee", id, `Added ${employee.firstName} ${employee.lastName}`)
      };
    }
    case "addLeave": {
      const id = makeId("leave");
      const request: LeaveRequest = {
        ...action.payload,
        id,
        tenantId: state.currentTenantId,
        status: "pending",
        submittedAt: nowIso()
      };
      return {
        ...state,
        leaveRequests: [request, ...state.leaveRequests],
        auditEvents: audit(state, "leave.submitted", "leave", id, "Submitted a leave request"),
        notifications: [
          {
            id: makeId("notification"),
            tenantId: state.currentTenantId,
            title: "Leave request submitted",
            body: "The request is waiting for manager approval.",
            type: "info",
            read: false,
            createdAt: nowIso(),
            href: "/people/leave"
          },
          ...state.notifications
        ]
      };
    }
    case "reviewLeave": {
      const request = state.leaveRequests.find((item) => item.id === action.leaveId && item.tenantId === state.currentTenantId);
      if (!request) return state;
      const reviewed = {
        ...request,
        status: action.status,
        approverId: state.users.find((user) => user.id === state.currentUserId)?.employeeId,
        reviewedAt: nowIso()
      } satisfies LeaveRequest;
      const employee = state.employees.find((item) => item.id === request.employeeId);
      return {
        ...state,
        leaveRequests: state.leaveRequests.map((item) => (item.id === request.id ? reviewed : item)),
        employees:
          action.status === "approved" && employee
            ? state.employees.map((item) =>
                item.id === employee.id ? { ...item, annualLeaveUsed: item.annualLeaveUsed + request.days } : item
              )
            : state.employees,
        auditEvents: audit(state, `leave.${action.status}`, "leave", request.id, `${action.status} leave request`)
      };
    }
    case "sendMessage": {
      const conversation = state.conversations.find(
        (item) => item.id === action.conversationId && item.tenantId === state.currentTenantId
      );
      if (!conversation || !action.body.trim()) return state;
      const message: Message = {
        id: makeId("message"),
        tenantId: state.currentTenantId,
        conversationId: conversation.id,
        direction: "outbound",
        senderName: state.users.find((user) => user.id === state.currentUserId)?.name ?? "Team member",
        body: action.body.trim(),
        sentAt: nowIso(),
        status: "delivered"
      };
      return {
        ...state,
        messages: [...state.messages, message],
        conversations: state.conversations.map((item) =>
          item.id === conversation.id
            ? { ...item, lastMessage: message.body, updatedAt: message.sentAt, unread: 0 }
            : item
        ),
        auditEvents: audit(state, "message.sent", "conversation", conversation.id, `Sent ${conversation.channel} message`)
      };
    }
    case "addInvoice": {
      const count = state.invoices.filter((invoice) => invoice.tenantId === state.currentTenantId).length + 82;
      const id = makeId("invoice");
      const invoice: Invoice = {
        ...action.payload,
        id,
        tenantId: state.currentTenantId,
        reference: `INV-2026-${String(count).padStart(4, "0")}`,
        status: "draft",
        createdAt: nowIso()
      };
      return {
        ...state,
        invoices: [invoice, ...state.invoices],
        auditEvents: audit(state, "invoice.created", "invoice", id, `Created ${invoice.reference}`)
      };
    }
    case "markInvoicePaid": {
      const invoice = state.invoices.find((item) => item.id === action.invoiceId && item.tenantId === state.currentTenantId);
      if (!invoice || invoice.status === "paid") return state;
      return {
        ...state,
        invoices: state.invoices.map((item) => (item.id === invoice.id ? { ...item, status: "paid" } : item)),
        payments: [
          {
            id: makeId("payment"),
            tenantId: state.currentTenantId,
            invoiceId: invoice.id,
            amount: invoice.amount,
            currency: invoice.currency,
            method: "bank",
            paidAt: nowIso(),
            reference: `DEMO-${Math.floor(Math.random() * 900000 + 100000)}`
          },
          ...state.payments
        ],
        auditEvents: audit(state, "invoice.paid", "invoice", invoice.id, `Marked ${invoice.reference} as paid`)
      };
    }
    case "markNotificationRead":
      return {
        ...state,
        notifications: state.notifications.map((item) =>
          item.id === action.notificationId && item.tenantId === state.currentTenantId ? { ...item, read: true } : item
        )
      };
    case "markAllNotificationsRead":
      return {
        ...state,
        notifications: state.notifications.map((item) =>
          item.tenantId === state.currentTenantId ? { ...item, read: true } : item
        )
      };
    case "changePlan":
      return {
        ...state,
        tenants: state.tenants.map((tenant) =>
          tenant.id === state.currentTenantId ? { ...tenant, planId: action.planId } : tenant
        ),
        auditEvents: audit(state, "subscription.plan.changed", "tenant", state.currentTenantId, `Changed plan to ${action.planId}`)
      };
    case "importState":
      return action.payload;
    case "reset":
      return createSeedState();
    default:
      return state;
  }
}

interface WorkspaceContextValue {
  state: WorkspaceState;
  ready: boolean;
  tenant: ReturnType<typeof tenantSnapshot>;
  currentTenant: WorkspaceState["tenants"][number];
  currentUser: WorkspaceState["users"][number] | undefined;
  moduleEnabled: (module: ModuleKey) => boolean;
  can: (permission: Permission) => boolean;
  switchTenant: (tenantId: ID) => void;
  switchRole: (role: Role) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  addLead: (payload: NewLead) => void;
  updateLeadStage: (leadId: ID, stage: LeadStage) => void;
  addProperty: (payload: NewProperty) => void;
  updatePropertyStatus: (propertyId: ID, status: PropertyStatus) => void;
  toggleTask: (taskId: ID) => void;
  addEmployee: (payload: NewEmployee) => void;
  addLeave: (payload: NewLeave) => void;
  reviewLeave: (leaveId: ID, status: "approved" | "rejected") => void;
  sendMessage: (conversationId: ID, body: string) => void;
  addInvoice: (payload: NewInvoice) => void;
  markInvoicePaid: (invoiceId: ID) => void;
  markNotificationRead: (notificationId: ID) => void;
  markAllNotificationsRead: () => void;
  changePlan: (planId: PlanId) => void;
  exportWorkspace: () => void;
  importWorkspace: (file: File) => Promise<void>;
  resetWorkspace: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createSeedState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) dispatch({ type: "hydrate", payload: JSON.parse(stored) as WorkspaceState });
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
    document.documentElement.style.colorScheme = state.theme;
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, ready]);

  const tenant = useMemo(() => tenantSnapshot(state), [state]);
  const currentTenant = state.tenants.find((item) => item.id === state.currentTenantId) ?? state.tenants[0];
  if (!currentTenant) throw new Error("EstateFlow requires at least one tenant workspace.");
  const currentUser = state.users.find((item) => item.id === state.currentUserId);

  const moduleEnabled = useCallback(
    (module: ModuleKey) => hasModule(currentTenant.planId, module),
    [currentTenant.planId]
  );
  const canDo = useCallback((permission: Permission) => can(state.currentRole, permission), [state.currentRole]);

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      state,
      ready,
      tenant,
      currentTenant,
      currentUser,
      moduleEnabled,
      can: canDo,
      switchTenant: (tenantId) => dispatch({ type: "switchTenant", tenantId }),
      switchRole: (role) => dispatch({ type: "switchRole", role }),
      toggleTheme: () => dispatch({ type: "toggleTheme" }),
      toggleSidebar: () => dispatch({ type: "toggleSidebar" }),
      addLead: (payload) => dispatch({ type: "addLead", payload }),
      updateLeadStage: (leadId, stage) => dispatch({ type: "updateLeadStage", leadId, stage }),
      addProperty: (payload) => dispatch({ type: "addProperty", payload }),
      updatePropertyStatus: (propertyId, status) => dispatch({ type: "updatePropertyStatus", propertyId, status }),
      toggleTask: (taskId) => dispatch({ type: "toggleTask", taskId }),
      addEmployee: (payload) => dispatch({ type: "addEmployee", payload }),
      addLeave: (payload) => dispatch({ type: "addLeave", payload }),
      reviewLeave: (leaveId, status) => dispatch({ type: "reviewLeave", leaveId, status }),
      sendMessage: (conversationId, body) => dispatch({ type: "sendMessage", conversationId, body }),
      addInvoice: (payload) => dispatch({ type: "addInvoice", payload }),
      markInvoicePaid: (invoiceId) => dispatch({ type: "markInvoicePaid", invoiceId }),
      markNotificationRead: (notificationId) => dispatch({ type: "markNotificationRead", notificationId }),
      markAllNotificationsRead: () => dispatch({ type: "markAllNotificationsRead" }),
      changePlan: (planId) => dispatch({ type: "changePlan", planId }),
      exportWorkspace: () => {
        const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `estateflow-${currentTenant.slug}-backup.json`;
        link.click();
        URL.revokeObjectURL(url);
      },
      importWorkspace: async (file) => {
        const parsed = JSON.parse(await file.text()) as WorkspaceState;
        if (!parsed.currentTenantId || !Array.isArray(parsed.tenants)) throw new Error("Invalid workspace backup.");
        dispatch({ type: "importState", payload: parsed });
      },
      resetWorkspace: () => dispatch({ type: "reset" })
    }),
    [state, ready, tenant, currentTenant, currentUser, moduleEnabled, canDo]
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): WorkspaceContextValue {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return value;
}
