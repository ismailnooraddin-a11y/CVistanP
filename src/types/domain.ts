export type ID = string;

export type Role =
  | "owner"
  | "admin"
  | "manager"
  | "agent"
  | "finance"
  | "people"
  | "marketing"
  | "viewer";

export type PlanId = "starter" | "professional" | "enterprise";

export type ModuleKey =
  | "dashboard"
  | "crm"
  | "properties"
  | "communications"
  | "operations"
  | "finance"
  | "people"
  | "marketing"
  | "reports"
  | "ai"
  | "administration";

export type EntityStatus = "active" | "inactive" | "archived";
export type LeadStage = "new" | "qualified" | "viewing" | "negotiation" | "reserved" | "won" | "lost";
export type PropertyStatus = "available" | "reserved" | "sold" | "off-market";
export type LeaveStatus = "pending" | "approved" | "rejected";
export type Priority = "low" | "medium" | "high" | "urgent";

export interface Tenant {
  id: ID;
  name: string;
  slug: string;
  city: string;
  country: string;
  planId: PlanId;
  accent: string;
  status: EntityStatus;
  createdAt: string;
}

export interface User {
  id: ID;
  tenantId: ID;
  employeeId?: ID;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  status: EntityStatus;
}

export interface Branch {
  id: ID;
  tenantId: ID;
  name: string;
  code: string;
  city: string;
  address: string;
  managerId?: ID;
  phone: string;
  status: EntityStatus;
}

export interface Department {
  id: ID;
  tenantId: ID;
  name: string;
  branchId?: ID;
  leadEmployeeId?: ID;
}

export interface Employee {
  id: ID;
  tenantId: ID;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  branchId: ID;
  departmentId: ID;
  managerId?: ID;
  employmentType: "full-time" | "part-time" | "contractor" | "intern";
  contractType: "permanent" | "fixed-term" | "commission-only";
  startDate: string;
  status: "active" | "on-leave" | "inactive";
  annualLeaveAllowance: number;
  annualLeaveUsed: number;
}

export interface LeaveRequest {
  id: ID;
  tenantId: ID;
  employeeId: ID;
  type: "annual" | "sick" | "unpaid" | "personal" | "business-trip";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  approverId?: ID;
  submittedAt: string;
  reviewedAt?: string;
}

export interface Lead {
  id: ID;
  tenantId: ID;
  name: string;
  phone: string;
  email?: string;
  source: string;
  budget: number;
  currency: "USD" | "IQD";
  interest: string;
  stage: LeadStage;
  score: number;
  assignedTo: ID;
  nextFollowUp?: string;
  createdAt: string;
  lastActivityAt: string;
}

export interface Customer {
  id: ID;
  tenantId: ID;
  name: string;
  phone: string;
  email?: string;
  type: "buyer" | "tenant" | "investor" | "owner" | "company";
  preferredLanguage: "English" | "Arabic" | "Kurdish";
  assignedTo: ID;
  status: EntityStatus;
  createdAt: string;
}

export interface Property {
  id: ID;
  tenantId: ID;
  reference: string;
  title: string;
  type: "apartment" | "villa" | "office" | "land" | "retail";
  purpose: "sale" | "rent";
  city: string;
  area: string;
  address: string;
  price: number;
  currency: "USD" | "IQD";
  bedrooms: number;
  bathrooms: number;
  sizeSqm: number;
  status: PropertyStatus;
  ownerName: string;
  assignedTo: ID;
  createdAt: string;
  mapX: number;
  mapY: number;
  featured?: boolean;
}

export interface Task {
  id: ID;
  tenantId: ID;
  title: string;
  description?: string;
  dueAt: string;
  assignedTo: ID;
  priority: Priority;
  status: "open" | "done";
  relatedType?: "lead" | "property" | "contract" | "employee";
  relatedId?: ID;
}

export interface Viewing {
  id: ID;
  tenantId: ID;
  propertyId: ID;
  customerName: string;
  agentId: ID;
  startsAt: string;
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  outcome?: "interested" | "not-interested" | "follow-up";
}

export interface Reservation {
  id: ID;
  tenantId: ID;
  propertyId: ID;
  customerName: string;
  agentId: ID;
  deposit: number;
  currency: "USD" | "IQD";
  expiresAt: string;
  status: "active" | "converted" | "expired" | "cancelled";
  createdAt: string;
}

export interface Contract {
  id: ID;
  tenantId: ID;
  reference: string;
  title: string;
  customerName: string;
  propertyId?: ID;
  value: number;
  currency: "USD" | "IQD";
  status: "draft" | "review" | "sent" | "signed" | "expired";
  ownerId: ID;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: ID;
  tenantId: ID;
  reference: string;
  customerName: string;
  amount: number;
  currency: "USD" | "IQD";
  dueDate: string;
  status: "draft" | "sent" | "partial" | "paid" | "overdue";
  createdAt: string;
}

export interface Payment {
  id: ID;
  tenantId: ID;
  invoiceId: ID;
  amount: number;
  currency: "USD" | "IQD";
  method: "cash" | "bank" | "card" | "cheque";
  paidAt: string;
  reference?: string;
}

export interface Commission {
  id: ID;
  tenantId: ID;
  employeeId: ID;
  contractId: ID;
  amount: number;
  currency: "USD" | "IQD";
  status: "pending" | "approved" | "paid";
  earnedAt: string;
}

export interface Conversation {
  id: ID;
  tenantId: ID;
  customerName: string;
  channel: "whatsapp" | "email" | "sms";
  assignedTo: ID;
  unread: number;
  lastMessage: string;
  updatedAt: string;
}

export interface Message {
  id: ID;
  tenantId: ID;
  conversationId: ID;
  direction: "inbound" | "outbound";
  senderName: string;
  body: string;
  sentAt: string;
  status: "sent" | "delivered" | "read";
}

export interface Campaign {
  id: ID;
  tenantId: ID;
  name: string;
  channel: "Meta" | "Google" | "Email" | "Portal" | "Organic";
  budget: number;
  spend: number;
  leads: number;
  conversions: number;
  status: "draft" | "active" | "paused" | "completed";
  startsAt: string;
  endsAt: string;
}

export interface Notification {
  id: ID;
  tenantId: ID;
  title: string;
  body: string;
  type: "info" | "success" | "warning" | "danger";
  read: boolean;
  createdAt: string;
  href?: string;
}

export interface AuditEvent {
  id: ID;
  tenantId: ID;
  actorId: ID;
  action: string;
  entityType: string;
  entityId: ID;
  summary: string;
  createdAt: string;
}

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  monthlyPrice: number;
  maxUsers: number;
  maxProperties: number;
  storageGb: number;
  modules: ModuleKey[];
}

export interface WorkspaceState {
  currentTenantId: ID;
  currentUserId: ID;
  currentRole: Role;
  theme: "light" | "dark";
  sidebarCollapsed: boolean;
  tenants: Tenant[];
  users: User[];
  branches: Branch[];
  departments: Department[];
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  leads: Lead[];
  customers: Customer[];
  properties: Property[];
  tasks: Task[];
  viewings: Viewing[];
  reservations: Reservation[];
  contracts: Contract[];
  invoices: Invoice[];
  payments: Payment[];
  commissions: Commission[];
  conversations: Conversation[];
  messages: Message[];
  campaigns: Campaign[];
  notifications: Notification[];
  auditEvents: AuditEvent[];
}
