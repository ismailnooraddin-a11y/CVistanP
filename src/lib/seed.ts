import type { WorkspaceState } from "@/types/domain";

const seed: WorkspaceState = {
  currentTenantId: "tenant-northstar",
  currentUserId: "user-owner",
  currentRole: "owner",
  theme: "light",
  sidebarCollapsed: false,
  tenants: [
    {
      id: "tenant-northstar",
      name: "Northstar Realty",
      slug: "northstar-realty",
      city: "Erbil",
      country: "Iraq",
      planId: "enterprise",
      accent: "#5b5ce2",
      status: "active",
      createdAt: "2025-09-02T09:00:00Z"
    },
    {
      id: "tenant-cedar",
      name: "Cedar Gate Properties",
      slug: "cedar-gate",
      city: "Sulaymaniyah",
      country: "Iraq",
      planId: "professional",
      accent: "#0f9f7f",
      status: "active",
      createdAt: "2026-02-12T09:00:00Z"
    }
  ],
  users: [
    { id: "user-owner", tenantId: "tenant-northstar", employeeId: "emp-001", name: "Lana Barzani", email: "lana@northstar.demo", role: "owner", status: "active" },
    { id: "user-manager", tenantId: "tenant-northstar", employeeId: "emp-002", name: "Kawa Mahmoud", email: "kawa@northstar.demo", role: "manager", status: "active" },
    { id: "user-agent", tenantId: "tenant-northstar", employeeId: "emp-004", name: "Sara Kareem", email: "sara@northstar.demo", role: "agent", status: "active" },
    { id: "user-finance", tenantId: "tenant-northstar", employeeId: "emp-008", name: "Dana Salih", email: "dana@northstar.demo", role: "finance", status: "active" },
    { id: "user-people", tenantId: "tenant-northstar", employeeId: "emp-010", name: "Rojin Ahmad", email: "rojin@northstar.demo", role: "people", status: "active" },
    { id: "user-cedar-owner", tenantId: "tenant-cedar", employeeId: "emp-101", name: "Shwan Rasul", email: "shwan@cedargate.demo", role: "owner", status: "active" },
    { id: "user-cedar-agent", tenantId: "tenant-cedar", employeeId: "emp-102", name: "Narin Jamal", email: "narin@cedargate.demo", role: "agent", status: "active" }
  ],
  branches: [
    { id: "branch-hq", tenantId: "tenant-northstar", name: "Erbil Headquarters", code: "EBL-HQ", city: "Erbil", address: "Gulan Street, English Village", managerId: "emp-002", phone: "+964 750 100 1000", status: "active" },
    { id: "branch-dream", tenantId: "tenant-northstar", name: "Dream City Office", code: "EBL-DC", city: "Erbil", address: "Dream City Gate 2", managerId: "emp-003", phone: "+964 750 100 1100", status: "active" },
    { id: "branch-suli", tenantId: "tenant-northstar", name: "Sulaymaniyah Branch", code: "SLM-01", city: "Sulaymaniyah", address: "Salim Street", managerId: "emp-006", phone: "+964 770 200 2200", status: "active" },
    { id: "branch-cedar", tenantId: "tenant-cedar", name: "Cedar Gate Main", code: "CG-SLM", city: "Sulaymaniyah", address: "Bakrajo Road", managerId: "emp-101", phone: "+964 770 500 5000", status: "active" }
  ],
  departments: [
    { id: "dept-exec", tenantId: "tenant-northstar", name: "Executive", branchId: "branch-hq", leadEmployeeId: "emp-001" },
    { id: "dept-sales", tenantId: "tenant-northstar", name: "Sales", branchId: "branch-hq", leadEmployeeId: "emp-002" },
    { id: "dept-sales-dream", tenantId: "tenant-northstar", name: "Sales - Dream City", branchId: "branch-dream", leadEmployeeId: "emp-003" },
    { id: "dept-finance", tenantId: "tenant-northstar", name: "Finance", branchId: "branch-hq", leadEmployeeId: "emp-008" },
    { id: "dept-people", tenantId: "tenant-northstar", name: "People & Culture", branchId: "branch-hq", leadEmployeeId: "emp-010" },
    { id: "dept-marketing", tenantId: "tenant-northstar", name: "Marketing", branchId: "branch-hq", leadEmployeeId: "emp-011" },
    { id: "dept-cedar-sales", tenantId: "tenant-cedar", name: "Sales", branchId: "branch-cedar", leadEmployeeId: "emp-101" }
  ],
  employees: [
    { id: "emp-001", tenantId: "tenant-northstar", employeeNumber: "NS-0001", firstName: "Lana", lastName: "Barzani", email: "lana@northstar.demo", phone: "+964 750 111 0001", jobTitle: "Managing Director", branchId: "branch-hq", departmentId: "dept-exec", employmentType: "full-time", contractType: "permanent", startDate: "2025-09-02", status: "active", annualLeaveAllowance: 24, annualLeaveUsed: 4 },
    { id: "emp-002", tenantId: "tenant-northstar", employeeNumber: "NS-0002", firstName: "Kawa", lastName: "Mahmoud", email: "kawa@northstar.demo", phone: "+964 750 111 0002", jobTitle: "Sales Director", branchId: "branch-hq", departmentId: "dept-sales", managerId: "emp-001", employmentType: "full-time", contractType: "permanent", startDate: "2025-09-15", status: "active", annualLeaveAllowance: 22, annualLeaveUsed: 7 },
    { id: "emp-003", tenantId: "tenant-northstar", employeeNumber: "NS-0003", firstName: "Ari", lastName: "Hassan", email: "ari@northstar.demo", phone: "+964 750 111 0003", jobTitle: "Branch Manager", branchId: "branch-dream", departmentId: "dept-sales-dream", managerId: "emp-002", employmentType: "full-time", contractType: "permanent", startDate: "2025-10-01", status: "active", annualLeaveAllowance: 21, annualLeaveUsed: 3 },
    { id: "emp-004", tenantId: "tenant-northstar", employeeNumber: "NS-0004", firstName: "Sara", lastName: "Kareem", email: "sara@northstar.demo", phone: "+964 750 111 0004", jobTitle: "Senior Property Consultant", branchId: "branch-hq", departmentId: "dept-sales", managerId: "emp-002", employmentType: "full-time", contractType: "commission-only", startDate: "2025-10-05", status: "active", annualLeaveAllowance: 20, annualLeaveUsed: 6 },
    { id: "emp-005", tenantId: "tenant-northstar", employeeNumber: "NS-0005", firstName: "Diyar", lastName: "Omer", email: "diyar@northstar.demo", phone: "+964 750 111 0005", jobTitle: "Property Consultant", branchId: "branch-dream", departmentId: "dept-sales-dream", managerId: "emp-003", employmentType: "full-time", contractType: "commission-only", startDate: "2025-11-12", status: "active", annualLeaveAllowance: 20, annualLeaveUsed: 2 },
    { id: "emp-006", tenantId: "tenant-northstar", employeeNumber: "NS-0006", firstName: "Shler", lastName: "Aziz", email: "shler@northstar.demo", phone: "+964 770 111 0006", jobTitle: "Sulaymaniyah Branch Manager", branchId: "branch-suli", departmentId: "dept-sales", managerId: "emp-002", employmentType: "full-time", contractType: "permanent", startDate: "2026-01-08", status: "active", annualLeaveAllowance: 21, annualLeaveUsed: 5 },
    { id: "emp-007", tenantId: "tenant-northstar", employeeNumber: "NS-0007", firstName: "Karwan", lastName: "Nabi", email: "karwan@northstar.demo", phone: "+964 770 111 0007", jobTitle: "Property Consultant", branchId: "branch-suli", departmentId: "dept-sales", managerId: "emp-006", employmentType: "full-time", contractType: "commission-only", startDate: "2026-02-02", status: "on-leave", annualLeaveAllowance: 20, annualLeaveUsed: 8 },
    { id: "emp-008", tenantId: "tenant-northstar", employeeNumber: "NS-0008", firstName: "Dana", lastName: "Salih", email: "dana@northstar.demo", phone: "+964 750 111 0008", jobTitle: "Finance Manager", branchId: "branch-hq", departmentId: "dept-finance", managerId: "emp-001", employmentType: "full-time", contractType: "permanent", startDate: "2025-09-20", status: "active", annualLeaveAllowance: 22, annualLeaveUsed: 4 },
    { id: "emp-009", tenantId: "tenant-northstar", employeeNumber: "NS-0009", firstName: "Alan", lastName: "Fatah", email: "alan@northstar.demo", phone: "+964 750 111 0009", jobTitle: "Accountant", branchId: "branch-hq", departmentId: "dept-finance", managerId: "emp-008", employmentType: "full-time", contractType: "permanent", startDate: "2025-12-01", status: "active", annualLeaveAllowance: 20, annualLeaveUsed: 1 },
    { id: "emp-010", tenantId: "tenant-northstar", employeeNumber: "NS-0010", firstName: "Rojin", lastName: "Ahmad", email: "rojin@northstar.demo", phone: "+964 750 111 0010", jobTitle: "People Operations Lead", branchId: "branch-hq", departmentId: "dept-people", managerId: "emp-001", employmentType: "full-time", contractType: "permanent", startDate: "2025-11-01", status: "active", annualLeaveAllowance: 22, annualLeaveUsed: 5 },
    { id: "emp-011", tenantId: "tenant-northstar", employeeNumber: "NS-0011", firstName: "Hana", lastName: "Qadir", email: "hana@northstar.demo", phone: "+964 750 111 0011", jobTitle: "Marketing Manager", branchId: "branch-hq", departmentId: "dept-marketing", managerId: "emp-001", employmentType: "full-time", contractType: "permanent", startDate: "2025-10-18", status: "active", annualLeaveAllowance: 22, annualLeaveUsed: 6 },
    { id: "emp-012", tenantId: "tenant-northstar", employeeNumber: "NS-0012", firstName: "Saman", lastName: "Jalal", email: "saman@northstar.demo", phone: "+964 750 111 0012", jobTitle: "Content Specialist", branchId: "branch-hq", departmentId: "dept-marketing", managerId: "emp-011", employmentType: "full-time", contractType: "fixed-term", startDate: "2026-03-15", status: "active", annualLeaveAllowance: 18, annualLeaveUsed: 2 },
    { id: "emp-101", tenantId: "tenant-cedar", employeeNumber: "CG-0001", firstName: "Shwan", lastName: "Rasul", email: "shwan@cedargate.demo", phone: "+964 770 555 0101", jobTitle: "General Manager", branchId: "branch-cedar", departmentId: "dept-cedar-sales", employmentType: "full-time", contractType: "permanent", startDate: "2026-02-12", status: "active", annualLeaveAllowance: 24, annualLeaveUsed: 2 },
    { id: "emp-102", tenantId: "tenant-cedar", employeeNumber: "CG-0002", firstName: "Narin", lastName: "Jamal", email: "narin@cedargate.demo", phone: "+964 770 555 0102", jobTitle: "Property Consultant", branchId: "branch-cedar", departmentId: "dept-cedar-sales", managerId: "emp-101", employmentType: "full-time", contractType: "commission-only", startDate: "2026-03-01", status: "active", annualLeaveAllowance: 20, annualLeaveUsed: 1 }
  ],
  leaveRequests: [
    { id: "leave-001", tenantId: "tenant-northstar", employeeId: "emp-004", type: "annual", startDate: "2026-07-28", endDate: "2026-07-30", days: 3, reason: "Family travel", status: "pending", submittedAt: "2026-07-16T09:15:00Z" },
    { id: "leave-002", tenantId: "tenant-northstar", employeeId: "emp-007", type: "annual", startDate: "2026-07-14", endDate: "2026-07-21", days: 6, reason: "Annual leave", status: "approved", approverId: "emp-006", submittedAt: "2026-07-05T10:00:00Z", reviewedAt: "2026-07-06T08:30:00Z" },
    { id: "leave-003", tenantId: "tenant-northstar", employeeId: "emp-012", type: "personal", startDate: "2026-07-22", endDate: "2026-07-22", days: 1, reason: "Personal appointment", status: "pending", submittedAt: "2026-07-17T08:45:00Z" },
    { id: "leave-101", tenantId: "tenant-cedar", employeeId: "emp-102", type: "annual", startDate: "2026-08-02", endDate: "2026-08-04", days: 3, reason: "Short break", status: "pending", submittedAt: "2026-07-15T11:00:00Z" }
  ],
  leads: [
    { id: "lead-001", tenantId: "tenant-northstar", name: "Ahmed Salih", phone: "+964 750 200 0001", email: "ahmed@example.com", source: "Meta Ads", budget: 260000, currency: "USD", interest: "4-bedroom villa in Dream City", stage: "new", score: 91, assignedTo: "emp-004", nextFollowUp: "2026-07-17T14:00:00Z", createdAt: "2026-07-17T08:10:00Z", lastActivityAt: "2026-07-17T08:10:00Z" },
    { id: "lead-002", tenantId: "tenant-northstar", name: "Shirin Omar", phone: "+964 770 200 0002", email: "shirin@example.com", source: "Website", budget: 145000, currency: "USD", interest: "Modern apartment near Empire", stage: "qualified", score: 84, assignedTo: "emp-005", nextFollowUp: "2026-07-18T09:30:00Z", createdAt: "2026-07-15T10:20:00Z", lastActivityAt: "2026-07-17T07:45:00Z" },
    { id: "lead-003", tenantId: "tenant-northstar", name: "Rebin Mustafa", phone: "+964 750 200 0003", source: "Referral", budget: 420000, currency: "USD", interest: "Investment villa", stage: "viewing", score: 88, assignedTo: "emp-004", nextFollowUp: "2026-07-19T12:00:00Z", createdAt: "2026-07-10T09:00:00Z", lastActivityAt: "2026-07-16T16:20:00Z" },
    { id: "lead-004", tenantId: "tenant-northstar", name: "Nawzad Ali", phone: "+964 750 200 0004", email: "nawzad@example.com", source: "WhatsApp", budget: 95000, currency: "USD", interest: "2-bedroom apartment", stage: "negotiation", score: 79, assignedTo: "emp-005", nextFollowUp: "2026-07-17T15:30:00Z", createdAt: "2026-07-08T11:00:00Z", lastActivityAt: "2026-07-17T09:05:00Z" },
    { id: "lead-005", tenantId: "tenant-northstar", name: "Dilan Karim", phone: "+964 770 200 0005", source: "Property Portal", budget: 310000, currency: "USD", interest: "Commercial office", stage: "reserved", score: 93, assignedTo: "emp-004", createdAt: "2026-06-29T09:30:00Z", lastActivityAt: "2026-07-16T14:10:00Z" },
    { id: "lead-006", tenantId: "tenant-northstar", name: "Aram Hussein", phone: "+964 750 200 0006", email: "aram@example.com", source: "Google Ads", budget: 185000, currency: "USD", interest: "Family apartment", stage: "won", score: 97, assignedTo: "emp-004", createdAt: "2026-06-12T08:00:00Z", lastActivityAt: "2026-07-11T13:00:00Z" },
    { id: "lead-007", tenantId: "tenant-northstar", name: "Zana Qadir", phone: "+964 750 200 0007", source: "Instagram", budget: 75000, currency: "USD", interest: "Studio investment", stage: "lost", score: 42, assignedTo: "emp-005", createdAt: "2026-07-01T12:00:00Z", lastActivityAt: "2026-07-12T12:00:00Z" },
    { id: "lead-008", tenantId: "tenant-northstar", name: "Renas Abdullah", phone: "+964 770 200 0008", source: "Walk-in", budget: 520000, currency: "USD", interest: "Luxury villa", stage: "qualified", score: 86, assignedTo: "emp-003", nextFollowUp: "2026-07-18T11:00:00Z", createdAt: "2026-07-16T13:00:00Z", lastActivityAt: "2026-07-16T13:20:00Z" },
    { id: "lead-101", tenantId: "tenant-cedar", name: "Bahar Hama", phone: "+964 770 600 0101", source: "Website", budget: 120000, currency: "USD", interest: "Apartment in Suli", stage: "new", score: 82, assignedTo: "emp-102", nextFollowUp: "2026-07-18T10:00:00Z", createdAt: "2026-07-17T07:30:00Z", lastActivityAt: "2026-07-17T07:30:00Z" },
    { id: "lead-102", tenantId: "tenant-cedar", name: "Hiwa Latif", phone: "+964 770 600 0102", source: "Referral", budget: 210000, currency: "USD", interest: "Villa", stage: "viewing", score: 89, assignedTo: "emp-102", createdAt: "2026-07-12T10:00:00Z", lastActivityAt: "2026-07-16T11:00:00Z" }
  ],
  customers: [
    { id: "customer-001", tenantId: "tenant-northstar", name: "Aram Hussein", phone: "+964 750 200 0006", email: "aram@example.com", type: "buyer", preferredLanguage: "Kurdish", assignedTo: "emp-004", status: "active", createdAt: "2026-06-12T08:00:00Z" },
    { id: "customer-002", tenantId: "tenant-northstar", name: "Dilan Karim", phone: "+964 770 200 0005", email: "dilan@example.com", type: "investor", preferredLanguage: "English", assignedTo: "emp-004", status: "active", createdAt: "2026-06-29T09:30:00Z" },
    { id: "customer-003", tenantId: "tenant-northstar", name: "Aso Property Holdings", phone: "+964 750 800 2000", email: "office@aso-holdings.demo", type: "company", preferredLanguage: "English", assignedTo: "emp-002", status: "active", createdAt: "2026-01-15T09:00:00Z" },
    { id: "customer-004", tenantId: "tenant-northstar", name: "Lavin Hamad", phone: "+964 750 345 6789", type: "owner", preferredLanguage: "Arabic", assignedTo: "emp-003", status: "active", createdAt: "2026-03-11T09:00:00Z" },
    { id: "customer-101", tenantId: "tenant-cedar", name: "Soran Ibrahim", phone: "+964 770 456 7890", email: "soran@example.com", type: "buyer", preferredLanguage: "Kurdish", assignedTo: "emp-102", status: "active", createdAt: "2026-06-02T09:00:00Z" }
  ],
  properties: [
    { id: "property-001", tenantId: "tenant-northstar", reference: "NS-EBL-1042", title: "Contemporary Villa with Garden", type: "villa", purpose: "sale", city: "Erbil", area: "Dream City", address: "Dream City, Zone 4", price: 385000, currency: "USD", bedrooms: 5, bathrooms: 4, sizeSqm: 420, status: "available", ownerName: "Lavin Hamad", assignedTo: "emp-004", createdAt: "2026-06-28T09:00:00Z", mapX: 67, mapY: 31, featured: true },
    { id: "property-002", tenantId: "tenant-northstar", reference: "NS-EBL-1043", title: "Skyline Apartment", type: "apartment", purpose: "sale", city: "Erbil", area: "Empire World", address: "Empire Royal City, Tower B", price: 168000, currency: "USD", bedrooms: 3, bathrooms: 2, sizeSqm: 186, status: "available", ownerName: "Aso Property Holdings", assignedTo: "emp-005", createdAt: "2026-07-02T10:00:00Z", mapX: 47, mapY: 44, featured: true },
    { id: "property-003", tenantId: "tenant-northstar", reference: "NS-EBL-1044", title: "Prime Retail Corner", type: "retail", purpose: "rent", city: "Erbil", area: "Gulan", address: "Gulan Street", price: 4200, currency: "USD", bedrooms: 0, bathrooms: 2, sizeSqm: 240, status: "reserved", ownerName: "Dilan Properties", assignedTo: "emp-004", createdAt: "2026-06-17T08:00:00Z", mapX: 57, mapY: 57 },
    { id: "property-004", tenantId: "tenant-northstar", reference: "NS-EBL-1045", title: "Family Apartment near Park", type: "apartment", purpose: "sale", city: "Erbil", area: "Italian Village", address: "Italian Village 1", price: 112000, currency: "USD", bedrooms: 2, bathrooms: 2, sizeSqm: 138, status: "sold", ownerName: "Rabar Aziz", assignedTo: "emp-004", createdAt: "2026-05-21T09:00:00Z", mapX: 35, mapY: 61 },
    { id: "property-005", tenantId: "tenant-northstar", reference: "NS-EBL-1046", title: "Executive Office Floor", type: "office", purpose: "rent", city: "Erbil", area: "English Village", address: "Business District, Building 8", price: 5800, currency: "USD", bedrooms: 0, bathrooms: 4, sizeSqm: 510, status: "available", ownerName: "Aso Property Holdings", assignedTo: "emp-002", createdAt: "2026-07-05T11:00:00Z", mapX: 40, mapY: 29 },
    { id: "property-006", tenantId: "tenant-northstar", reference: "NS-SLM-2001", title: "Goizha View Residence", type: "apartment", purpose: "sale", city: "Sulaymaniyah", area: "Goizha", address: "Goizha Heights", price: 132000, currency: "USD", bedrooms: 3, bathrooms: 2, sizeSqm: 170, status: "available", ownerName: "Shaho Developments", assignedTo: "emp-007", createdAt: "2026-07-06T09:00:00Z", mapX: 73, mapY: 69 },
    { id: "property-007", tenantId: "tenant-northstar", reference: "NS-EBL-1047", title: "Land Plot for Development", type: "land", purpose: "sale", city: "Erbil", area: "Mass City", address: "Mass City Extension", price: 240000, currency: "USD", bedrooms: 0, bathrooms: 0, sizeSqm: 600, status: "off-market", ownerName: "Kamal Ibrahim", assignedTo: "emp-003", createdAt: "2026-06-08T09:00:00Z", mapX: 79, mapY: 48 },
    { id: "property-101", tenantId: "tenant-cedar", reference: "CG-SLM-0101", title: "Modern Bakrajo Apartment", type: "apartment", purpose: "sale", city: "Sulaymaniyah", area: "Bakrajo", address: "Bakrajo Heights", price: 118000, currency: "USD", bedrooms: 3, bathrooms: 2, sizeSqm: 165, status: "available", ownerName: "Soran Ibrahim", assignedTo: "emp-102", createdAt: "2026-07-01T09:00:00Z", mapX: 52, mapY: 42, featured: true },
    { id: "property-102", tenantId: "tenant-cedar", reference: "CG-SLM-0102", title: "City Center Office", type: "office", purpose: "rent", city: "Sulaymaniyah", area: "Salim Street", address: "Salim Street, Building 14", price: 1800, currency: "USD", bedrooms: 0, bathrooms: 1, sizeSqm: 120, status: "available", ownerName: "Hawar Group", assignedTo: "emp-101", createdAt: "2026-07-08T09:00:00Z", mapX: 36, mapY: 55 }
  ],
  tasks: [
    { id: "task-001", tenantId: "tenant-northstar", title: "Call Ahmed about villa shortlist", dueAt: "2026-07-17T14:00:00Z", assignedTo: "emp-004", priority: "urgent", status: "open", relatedType: "lead", relatedId: "lead-001" },
    { id: "task-002", tenantId: "tenant-northstar", title: "Prepare retail lease proposal", dueAt: "2026-07-17T16:30:00Z", assignedTo: "emp-004", priority: "high", status: "open", relatedType: "property", relatedId: "property-003" },
    { id: "task-003", tenantId: "tenant-northstar", title: "Upload ownership document", dueAt: "2026-07-18T10:00:00Z", assignedTo: "emp-005", priority: "medium", status: "open", relatedType: "property", relatedId: "property-002" },
    { id: "task-004", tenantId: "tenant-northstar", title: "Review July commission batch", dueAt: "2026-07-19T12:00:00Z", assignedTo: "emp-008", priority: "high", status: "open" },
    { id: "task-005", tenantId: "tenant-northstar", title: "Confirm viewing attendance", dueAt: "2026-07-17T09:00:00Z", assignedTo: "emp-005", priority: "medium", status: "done" },
    { id: "task-101", tenantId: "tenant-cedar", title: "Call Bahar for qualification", dueAt: "2026-07-18T10:00:00Z", assignedTo: "emp-102", priority: "high", status: "open", relatedType: "lead", relatedId: "lead-101" }
  ],
  viewings: [
    { id: "viewing-001", tenantId: "tenant-northstar", propertyId: "property-001", customerName: "Rebin Mustafa", agentId: "emp-004", startsAt: "2026-07-17T13:00:00Z", status: "scheduled" },
    { id: "viewing-002", tenantId: "tenant-northstar", propertyId: "property-002", customerName: "Shirin Omar", agentId: "emp-005", startsAt: "2026-07-18T09:30:00Z", status: "scheduled" },
    { id: "viewing-003", tenantId: "tenant-northstar", propertyId: "property-005", customerName: "Baran Tech", agentId: "emp-002", startsAt: "2026-07-18T14:00:00Z", status: "scheduled" },
    { id: "viewing-101", tenantId: "tenant-cedar", propertyId: "property-101", customerName: "Hiwa Latif", agentId: "emp-102", startsAt: "2026-07-19T10:00:00Z", status: "scheduled" }
  ],
  reservations: [
    { id: "reservation-001", tenantId: "tenant-northstar", propertyId: "property-003", customerName: "Dilan Karim", agentId: "emp-004", deposit: 5000, currency: "USD", expiresAt: "2026-07-21T17:00:00Z", status: "active", createdAt: "2026-07-16T14:00:00Z" }
  ],
  contracts: [
    { id: "contract-001", tenantId: "tenant-northstar", reference: "CNT-2026-0041", title: "Apartment Sale Agreement", customerName: "Aram Hussein", propertyId: "property-004", value: 112000, currency: "USD", status: "signed", ownerId: "emp-004", createdAt: "2026-07-08T09:00:00Z", updatedAt: "2026-07-11T13:00:00Z" },
    { id: "contract-002", tenantId: "tenant-northstar", reference: "CNT-2026-0042", title: "Retail Reservation Agreement", customerName: "Dilan Karim", propertyId: "property-003", value: 50400, currency: "USD", status: "sent", ownerId: "emp-004", createdAt: "2026-07-16T14:00:00Z", updatedAt: "2026-07-17T08:00:00Z" },
    { id: "contract-003", tenantId: "tenant-northstar", reference: "CNT-2026-0043", title: "Exclusive Listing Agreement", customerName: "Lavin Hamad", propertyId: "property-001", value: 385000, currency: "USD", status: "review", ownerId: "emp-003", createdAt: "2026-07-15T10:00:00Z", updatedAt: "2026-07-17T09:20:00Z" },
    { id: "contract-101", tenantId: "tenant-cedar", reference: "CG-CNT-0012", title: "Buyer Representation Agreement", customerName: "Soran Ibrahim", propertyId: "property-101", value: 118000, currency: "USD", status: "draft", ownerId: "emp-102", createdAt: "2026-07-13T09:00:00Z", updatedAt: "2026-07-13T09:00:00Z" }
  ],
  invoices: [
    { id: "invoice-001", tenantId: "tenant-northstar", reference: "INV-2026-0078", customerName: "Aram Hussein", amount: 3360, currency: "USD", dueDate: "2026-07-15", status: "paid", createdAt: "2026-07-11T13:00:00Z" },
    { id: "invoice-002", tenantId: "tenant-northstar", reference: "INV-2026-0079", customerName: "Dilan Karim", amount: 5000, currency: "USD", dueDate: "2026-07-17", status: "paid", createdAt: "2026-07-16T14:00:00Z" },
    { id: "invoice-003", tenantId: "tenant-northstar", reference: "INV-2026-0080", customerName: "Baran Tech", amount: 5800, currency: "USD", dueDate: "2026-07-20", status: "sent", createdAt: "2026-07-17T08:30:00Z" },
    { id: "invoice-004", tenantId: "tenant-northstar", reference: "INV-2026-0081", customerName: "Aso Property Holdings", amount: 2750, currency: "USD", dueDate: "2026-07-10", status: "overdue", createdAt: "2026-06-30T09:00:00Z" },
    { id: "invoice-101", tenantId: "tenant-cedar", reference: "CG-INV-0011", customerName: "Soran Ibrahim", amount: 2360, currency: "USD", dueDate: "2026-07-23", status: "sent", createdAt: "2026-07-16T09:00:00Z" }
  ],
  payments: [
    { id: "payment-001", tenantId: "tenant-northstar", invoiceId: "invoice-001", amount: 3360, currency: "USD", method: "bank", paidAt: "2026-07-12T10:30:00Z", reference: "NBI-902118" },
    { id: "payment-002", tenantId: "tenant-northstar", invoiceId: "invoice-002", amount: 5000, currency: "USD", method: "cash", paidAt: "2026-07-16T14:15:00Z", reference: "RCPT-5562" }
  ],
  commissions: [
    { id: "commission-001", tenantId: "tenant-northstar", employeeId: "emp-004", contractId: "contract-001", amount: 1680, currency: "USD", status: "approved", earnedAt: "2026-07-11T13:00:00Z" },
    { id: "commission-002", tenantId: "tenant-northstar", employeeId: "emp-005", contractId: "contract-002", amount: 600, currency: "USD", status: "pending", earnedAt: "2026-07-16T14:00:00Z" }
  ],
  conversations: [
    { id: "conversation-001", tenantId: "tenant-northstar", customerName: "Ahmed Salih", channel: "whatsapp", assignedTo: "emp-004", unread: 2, lastMessage: "Can we view the villa after lunch?", updatedAt: "2026-07-17T10:12:00Z" },
    { id: "conversation-002", tenantId: "tenant-northstar", customerName: "Shirin Omar", channel: "whatsapp", assignedTo: "emp-005", unread: 0, lastMessage: "Thank you, the brochure looks good.", updatedAt: "2026-07-17T09:25:00Z" },
    { id: "conversation-003", tenantId: "tenant-northstar", customerName: "Dilan Karim", channel: "email", assignedTo: "emp-004", unread: 1, lastMessage: "Please send the revised reservation terms.", updatedAt: "2026-07-17T08:50:00Z" },
    { id: "conversation-101", tenantId: "tenant-cedar", customerName: "Bahar Hama", channel: "whatsapp", assignedTo: "emp-102", unread: 1, lastMessage: "Is the apartment still available?", updatedAt: "2026-07-17T07:45:00Z" }
  ],
  messages: [
    { id: "message-001", tenantId: "tenant-northstar", conversationId: "conversation-001", direction: "inbound", senderName: "Ahmed Salih", body: "Hello, I saw the Dream City villa on Instagram.", sentAt: "2026-07-17T09:55:00Z", status: "read" },
    { id: "message-002", tenantId: "tenant-northstar", conversationId: "conversation-001", direction: "outbound", senderName: "Sara Kareem", body: "Hi Ahmed. Yes, it is available. I can arrange a private viewing today.", sentAt: "2026-07-17T10:01:00Z", status: "read" },
    { id: "message-003", tenantId: "tenant-northstar", conversationId: "conversation-001", direction: "inbound", senderName: "Ahmed Salih", body: "Can we view the villa after lunch?", sentAt: "2026-07-17T10:12:00Z", status: "read" },
    { id: "message-004", tenantId: "tenant-northstar", conversationId: "conversation-002", direction: "outbound", senderName: "Diyar Omer", body: "I have sent the floor plan and payment schedule.", sentAt: "2026-07-17T09:20:00Z", status: "read" },
    { id: "message-005", tenantId: "tenant-northstar", conversationId: "conversation-002", direction: "inbound", senderName: "Shirin Omar", body: "Thank you, the brochure looks good.", sentAt: "2026-07-17T09:25:00Z", status: "read" },
    { id: "message-101", tenantId: "tenant-cedar", conversationId: "conversation-101", direction: "inbound", senderName: "Bahar Hama", body: "Is the apartment still available?", sentAt: "2026-07-17T07:45:00Z", status: "read" }
  ],
  campaigns: [
    { id: "campaign-001", tenantId: "tenant-northstar", name: "Dream City Luxury Villas", channel: "Meta", budget: 8500, spend: 6120, leads: 94, conversions: 7, status: "active", startsAt: "2026-07-01", endsAt: "2026-07-31" },
    { id: "campaign-002", tenantId: "tenant-northstar", name: "Empire Apartments Search", channel: "Google", budget: 4500, spend: 2830, leads: 51, conversions: 4, status: "active", startsAt: "2026-07-05", endsAt: "2026-08-05" },
    { id: "campaign-003", tenantId: "tenant-northstar", name: "Investor Newsletter", channel: "Email", budget: 500, spend: 240, leads: 18, conversions: 2, status: "completed", startsAt: "2026-06-20", endsAt: "2026-07-10" },
    { id: "campaign-101", tenantId: "tenant-cedar", name: "Bakrajo Homes", channel: "Meta", budget: 1800, spend: 640, leads: 14, conversions: 1, status: "active", startsAt: "2026-07-10", endsAt: "2026-08-10" }
  ],
  notifications: [
    { id: "notification-001", tenantId: "tenant-northstar", title: "New high-intent lead", body: "Ahmed Salih scored 91 and requested a Dream City villa.", type: "success", read: false, createdAt: "2026-07-17T08:10:00Z", href: "/sales/leads" },
    { id: "notification-002", tenantId: "tenant-northstar", title: "Reservation expires soon", body: "Prime Retail Corner reservation expires in four days.", type: "warning", read: false, createdAt: "2026-07-17T07:30:00Z", href: "/properties/reservations" },
    { id: "notification-003", tenantId: "tenant-northstar", title: "Leave approval required", body: "Two leave requests are waiting for review.", type: "info", read: false, createdAt: "2026-07-17T08:45:00Z", href: "/people/leave" },
    { id: "notification-004", tenantId: "tenant-northstar", title: "Invoice overdue", body: "INV-2026-0081 is seven days overdue.", type: "danger", read: true, createdAt: "2026-07-17T06:00:00Z", href: "/finance/invoices" },
    { id: "notification-101", tenantId: "tenant-cedar", title: "New website lead", body: "Bahar Hama asked about Bakrajo apartments.", type: "success", read: false, createdAt: "2026-07-17T07:30:00Z", href: "/sales/leads" }
  ],
  auditEvents: [
    { id: "audit-001", tenantId: "tenant-northstar", actorId: "user-owner", action: "tenant.settings.updated", entityType: "tenant", entityId: "tenant-northstar", summary: "Updated company notification policy", createdAt: "2026-07-17T09:40:00Z" },
    { id: "audit-002", tenantId: "tenant-northstar", actorId: "user-agent", action: "lead.stage.changed", entityType: "lead", entityId: "lead-004", summary: "Moved Nawzad Ali to Negotiation", createdAt: "2026-07-17T09:05:00Z" },
    { id: "audit-003", tenantId: "tenant-northstar", actorId: "user-finance", action: "invoice.created", entityType: "invoice", entityId: "invoice-003", summary: "Created INV-2026-0080 for Baran Tech", createdAt: "2026-07-17T08:30:00Z" },
    { id: "audit-004", tenantId: "tenant-northstar", actorId: "user-manager", action: "contract.updated", entityType: "contract", entityId: "contract-003", summary: "Moved listing agreement to legal review", createdAt: "2026-07-17T09:20:00Z" }
  ]
};

export function createSeedState(): WorkspaceState {
  return structuredClone(seed);
}
