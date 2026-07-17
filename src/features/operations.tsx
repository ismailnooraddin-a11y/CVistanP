"use client";

import {
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileCheck2,
  FileClock,
  FileSignature,
  FileText,
  Filter,
  FolderArchive,
  Handshake,
  KeyRound,
  MoreHorizontal,
  PenTool,
  Plus,
  Search,
  Send,
  ShieldCheck,
  UploadCloud
} from "lucide-react";
import { useState } from "react";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import { useWorkspace } from "@/store/workspace-store";
import { Avatar, Badge, Button, Card, CardHeader, Input, Modal, PageHeader, Progress, SearchInput, Select, StatCard, Textarea, cn, useToast } from "@/components/ui";

const contractTone = {
  draft: "neutral",
  review: "warning",
  sent: "info",
  signed: "success",
  expired: "danger"
} as const;

export function ContractsPage() {
  const { tenant, can } = useWorkspace();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const contracts = tenant.contracts.filter((item) => `${item.reference} ${item.title} ${item.customerName}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="page-stack"><PageHeader eyebrow="Legal operations" title="Contracts" description="Generate, approve, send, sign, and audit every agreement in one controlled workflow." actions={<><Button variant="secondary"><FileText size={17} /> Templates</Button><Button onClick={() => setOpen(true)}><Plus size={17} /> New contract</Button></>} />
    <div className="metrics-grid metrics-grid--4 metrics-grid--compact"><StatCard label="Active contracts" value={tenant.contracts.filter((item) => !["expired"].includes(item.status)).length} icon={<FileSignature size={20} />} tone="brand" detail="all workflows" /><StatCard label="Awaiting signature" value={tenant.contracts.filter((item) => item.status === "sent").length} icon={<PenTool size={20} />} tone="amber" detail="customer action" /><StatCard label="Signed this month" value={tenant.contracts.filter((item) => item.status === "signed").length} change={12} icon={<FileCheck2 size={20} />} tone="green" detail="completed" /><StatCard label="Contract value" value={formatCurrency(tenant.contracts.reduce((sum, item) => sum + item.value, 0))} change={8.2} icon={<ShieldCheck size={20} />} tone="blue" detail="total represented" /></div>
    <Card className="toolbar-card"><div className="module-toolbar"><SearchInput value={search} onChange={setSearch} placeholder="Search contracts, references, customers..." /><div className="module-toolbar__actions"><Button variant="secondary"><Filter size={16} /> Filters</Button><Button variant="secondary"><Download size={16} /> Export</Button></div></div></Card>
    <Card className="table-card"><div className="data-table-wrap"><table className="data-table"><thead><tr><th>Contract</th><th>Customer</th><th>Property</th><th>Value</th><th>Owner</th><th>Updated</th><th>Status</th><th /></tr></thead><tbody>{contracts.map((contract) => { const property = tenant.properties.find((item) => item.id === contract.propertyId); const owner = tenant.employees.find((item) => item.id === contract.ownerId); return <tr key={contract.id}><td><div className="document-cell"><span className="document-cell__icon"><FileSignature size={18} /></span><span><strong>{contract.title}</strong><small>{contract.reference}</small></span></div></td><td>{contract.customerName}</td><td>{property?.reference ?? "General"}</td><td><strong>{formatCurrency(contract.value)}</strong></td><td><div className="mini-person"><Avatar name={owner ? `${owner.firstName} ${owner.lastName}` : "Team"} size="sm" /><span>{owner?.firstName ?? "Team"}</span></div></td><td>{formatDateTime(contract.updatedAt)}</td><td><Badge tone={contractTone[contract.status]}>{contract.status}</Badge></td><td><button className="icon-button icon-button--small"><MoreHorizontal size={16} /></button></td></tr>; })}</tbody></table></div></Card>
    <Modal open={open} onClose={() => setOpen(false)} title="Create contract" description="Start from an approved template and merge customer and property data." size="lg" footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { if (!can("manage:contracts")) { toast({ title: "Permission denied", tone: "danger" }); return; } toast({ title: "Contract draft created", message: "The new agreement is ready for legal review.", tone: "success" }); setOpen(false); }}><FileSignature size={17} /> Create draft</Button></>}><div className="form-grid"><Select label="Contract type"><option>Property sale agreement</option><option>Lease agreement</option><option>Exclusive listing mandate</option><option>Reservation agreement</option></Select><Select label="Template"><option>Standard sale agreement v4</option><option>Standard lease agreement v2</option></Select><Input label="Customer" placeholder="Search customer" /><Select label="Property"><option>Select a property</option>{tenant.properties.map((property) => <option key={property.id}>{property.reference} · {property.title}</option>)}</Select><Input label="Contract value" type="number" placeholder="0" /><Input label="Effective date" type="date" defaultValue="2026-07-17" /><Textarea label="Internal instructions" className="form-grid__full" rows={4} placeholder="Notes for legal review, special conditions, and approval context." /></div></Modal>
  </div>;
}

export function DocumentsPage() {
  const folders = [
    { name: "Property ownership", files: 146, size: "3.8 GB", icon: <KeyRound size={22} /> },
    { name: "Customer identification", files: 82, size: "1.2 GB", icon: <ShieldCheck size={22} /> },
    { name: "Contracts", files: 64, size: "892 MB", icon: <FileSignature size={22} /> },
    { name: "Invoices & receipts", files: 119, size: "640 MB", icon: <FileText size={22} /> },
    { name: "Employee documents", files: 58, size: "420 MB", icon: <FolderArchive size={22} /> }
  ];
  const recent = [
    { name: "CNT-2026-0043-listing-agreement.pdf", type: "PDF", owner: "Ari Hassan", size: "1.8 MB", updated: "Today, 09:20" },
    { name: "property-1042-ownership.pdf", type: "PDF", owner: "Sara Kareem", size: "4.2 MB", updated: "Yesterday, 15:42" },
    { name: "customer-id-dilan-karim.jpg", type: "Image", owner: "Sara Kareem", size: "2.1 MB", updated: "Yesterday, 14:02" }
  ];
  return <div className="page-stack"><PageHeader eyebrow="Content operations" title="Documents" description="Secure, searchable, versioned records with expiry tracking and access controls." actions={<Button><UploadCloud size={17} /> Upload files</Button>} /><Card className="document-search"><Search size={20} /><input placeholder="Search file names, document content, properties, or customers..." /><kbd>⌘ K</kbd></Card><div className="folder-grid">{folders.map((folder, index) => <Card interactive className="folder-card" key={folder.name}><div className={`folder-card__icon folder-card__icon--${index}`}>{folder.icon}</div><button className="icon-button icon-button--small"><MoreHorizontal size={16} /></button><h3>{folder.name}</h3><p>{folder.files} files · {folder.size}</p><Progress value={[72, 54, 39, 61, 31][index] ?? 0} label="Storage usage" /></Card>)}</div><Card className="table-card"><CardHeader title="Recently updated" description="Latest files across the workspace" action={<Button variant="secondary">View all files</Button>} /><div className="data-table-wrap"><table className="data-table"><thead><tr><th>Name</th><th>Type</th><th>Owner</th><th>Size</th><th>Updated</th><th>Security</th><th /></tr></thead><tbody>{recent.map((file) => <tr key={file.name}><td><div className="document-cell"><span className="document-cell__icon"><FileText size={18} /></span><strong>{file.name}</strong></div></td><td>{file.type}</td><td>{file.owner}</td><td>{file.size}</td><td>{file.updated}</td><td><Badge tone="success"><ShieldCheck size={12} /> Encrypted</Badge></td><td><button className="icon-button icon-button--small"><MoreHorizontal size={16} /></button></td></tr>)}</tbody></table></div></Card></div>;
}

export function InspectionsPage() {
  const inspections = [
    { ref: "INS-2041", property: "Contemporary Villa with Garden", type: "Pre-sale inspection", inspector: "Ari Hassan", date: "2026-07-18T10:00:00Z", progress: 64, status: "in progress" },
    { ref: "INS-2042", property: "Skyline Apartment", type: "Owner condition report", inspector: "Diyar Omer", date: "2026-07-19T12:00:00Z", progress: 0, status: "scheduled" },
    { ref: "INS-2039", property: "Family Apartment near Park", type: "Handover inspection", inspector: "Sara Kareem", date: "2026-07-11T11:00:00Z", progress: 100, status: "completed" }
  ];
  return <div className="page-stack"><PageHeader eyebrow="Quality control" title="Inspections" description="Standardize property condition checks, evidence, defects, approvals, and reports." actions={<Button><ClipboardCheck size={17} /> Schedule inspection</Button>} /><div className="inspection-grid">{inspections.map((inspection) => <Card className="inspection-card" key={inspection.ref}><div className="inspection-card__top"><span className="inspection-card__icon"><ClipboardCheck size={21} /></span><Badge tone={inspection.status === "completed" ? "success" : inspection.status === "in progress" ? "warning" : "info"}>{inspection.status}</Badge></div><span className="eyebrow">{inspection.ref}</span><h3>{inspection.property}</h3><p>{inspection.type}</p><dl><div><dt>Inspector</dt><dd>{inspection.inspector}</dd></div><div><dt>Date</dt><dd>{formatDateTime(inspection.date)}</dd></div></dl><Progress value={inspection.progress} label={`${inspection.progress}% checklist complete`} /><div className="inspection-card__footer"><Button variant="secondary" size="sm">Open checklist</Button><button className="icon-button icon-button--small"><MoreHorizontal size={16} /></button></div></Card>)}</div></div>;
}

export function HandoverPage() {
  const stages = ["Contract signed", "Final payment", "Property inspection", "Documents verified", "Keys prepared", "Customer handover"];
  const handovers = [
    { customer: "Aram Hussein", property: "Family Apartment near Park", date: "2026-07-22", progress: 4, owner: "Sara Kareem" },
    { customer: "Dilan Karim", property: "Prime Retail Corner", date: "2026-07-29", progress: 2, owner: "Sara Kareem" }
  ];
  return <div className="page-stack"><PageHeader eyebrow="Closing operations" title="Property handover" description="Coordinate final payment, inspection, documents, keys, and customer acceptance." actions={<Button><Handshake size={17} /> Start handover</Button>} /><div className="handover-grid">{handovers.map((handover) => <Card className="handover-card" key={handover.customer}><div className="handover-card__header"><div><span className="eyebrow">PLANNED {formatDate(handover.date)}</span><h2>{handover.customer}</h2><p>{handover.property}</p></div><Avatar name={handover.owner} size="lg" status="online" /></div><div className="handover-steps">{stages.map((stage, index) => <div className={cn("handover-step", index < handover.progress && "handover-step--done", index === handover.progress && "handover-step--current")} key={stage}><span>{index < handover.progress ? <CheckCircle2 size={15} /> : index + 1}</span><div><strong>{stage}</strong><small>{index < handover.progress ? "Completed" : index === handover.progress ? "Current step" : "Waiting"}</small></div></div>)}</div><div className="handover-card__footer"><Progress value={(handover.progress / stages.length) * 100} label={`${handover.progress} of ${stages.length} steps`} /><Button size="sm">Continue handover</Button></div></Card>)}</div></div>;
}
