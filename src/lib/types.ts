export type Currency = 'USD' | 'IQD';
export type RecordStatus = 'Active' | 'Inactive';

export interface CompanySettings {
  legalName: string;
  tradingName: string;
  registrationNumber: string;
  taxNumber: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  defaultCurrency: Currency;
  defaultLanguage: 'English' | 'Arabic' | 'Kurdish';
  signatoryName: string;
  signatoryTitle: string;
  logoDataUrl: string;
  logoWidth: number;
  logoHeight: number;
}

export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  status: RecordStatus;
}

export interface Team {
  id: string;
  name: string;
  branchId: string;
  managerId?: string;
  status: RecordStatus;
}

export interface Employee {
  id: string;
  employeeNumber: string;
  name: string;
  title: string;
  teamId: string;
  branchId: string;
  managerId?: string;
  contractType: 'Permanent' | 'Temporary' | 'Part-time' | 'Contractor';
  status: 'Active' | 'On hold' | 'Inactive';
  startDate: string;
  phone: string;
  email: string;
  annualLeave: number;
  sickLeave: number;
  documentsComplete: boolean;
}

export interface Contact {
  id: string;
  name: string;
  phone1: string;
  phone2: string;
  email: string;
  city: string;
  source: string;
  types: string[];
  status: 'Active' | 'Inactive' | 'Do not contact';
  statusReason: string;
  budgetFrom: number;
  budgetTo: number;
  currency: Currency;
  assignedTo: string;
  notes: string;
  createdAt: string;
}

export interface Reservation {
  clientId: string;
  reservedBy: string;
  from: string;
  to: string;
  depositAmount: number;
  status: 'Pending deposit' | 'Confirmed';
}

export interface Property {
  id: string;
  reference: string;
  title: string;
  type: string;
  purpose: 'Sale' | 'Rent';
  status: 'Available' | 'Reserved' | 'Sold' | 'Rented' | 'Inactive';
  city: string;
  district: string;
  address: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  priceFrom: number;
  priceTo: number;
  currency: Currency;
  ownerId: string;
  assignedTo: string;
  branchId: string;
  description: string;
  photoDataUrls: string[];
  reservation?: Reservation;
  createdAt: string;
  updatedAt: string;
}

export const DEAL_STAGES = [
  'New lead',
  'Qualified',
  'Property matched',
  'Viewing scheduled',
  'Negotiation',
  'Reservation',
  'Contract preparation',
  'Closed won',
  'Closed lost',
] as const;
export type DealStage = (typeof DEAL_STAGES)[number];

export interface DealHistory {
  at: string;
  from?: DealStage;
  to: DealStage;
  note: string;
}

export interface Deal {
  id: string;
  contactId: string;
  propertyId: string;
  assignedTo: string;
  stage: DealStage;
  valueFrom: number;
  valueTo: number;
  currency: Currency;
  expectedClose: string;
  nextAction: string;
  lossReason: string;
  createdAt: string;
  updatedAt: string;
  history: DealHistory[];
}

export interface Meeting {
  id: string;
  contactId: string;
  propertyId: string;
  type: string;
  agentId: string;
  date: string;
  time: string;
  duration: number;
  locationType: 'Office' | 'Property' | 'Online' | 'Other';
  location: string;
  reminder: boolean;
  notes: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No-show';
  cancelReason: string;
}

export interface Task {
  id: string;
  title: string;
  assigneeId: string;
  assignedById: string;
  dueDate: string;
  dueTime: string;
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  status: 'Not started' | 'In progress' | 'Waiting' | 'Completed' | 'Cancelled';
  relatedType: 'Contact' | 'Property' | 'Deal' | 'General';
  relatedId: string;
  notes: string;
  reminder: boolean;
  completedAt: string;
}

export type ContractSectionType = 'protected' | 'clause-group' | 'editable';
export interface ContractClauseOption {
  id: string;
  label: string;
  body: string;
}
export interface ContractSection {
  id: string;
  title: string;
  type: ContractSectionType;
  body: string;
  required: boolean;
  options: ContractClauseOption[];
}
export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  active: boolean;
  version: number;
  sections: ContractSection[];
}

export interface ContractDraft {
  templateId: string;
  contactId: string;
  propertyId: string;
  contractNumber: string;
  contractDate: string;
  customValues: Record<string, string>;
  clauseSelections: Record<string, string>;
  editableSections: Record<string, string>;
}

export interface DemoState {
  company: CompanySettings;
  branches: Branch[];
  teams: Team[];
  employees: Employee[];
  contacts: Contact[];
  properties: Property[];
  deals: Deal[];
  meetings: Meeting[];
  tasks: Task[];
  contractTemplates: ContractTemplate[];
}
