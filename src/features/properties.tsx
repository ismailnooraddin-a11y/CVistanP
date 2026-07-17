"use client";

import {
  Bath,
  BedDouble,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Eye,
  Filter,
  Grid2X2,
  House,
  KeyRound,
  Layers3,
  List,
  MapPin,
  Megaphone,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Ruler,
  Search,
  Share2,
  SlidersHorizontal,
  Sparkles,
  UploadCloud,
  Wrench
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import { validateRequired } from "@/lib/validation";
import { useWorkspace } from "@/store/workspace-store";
import type { PropertyStatus } from "@/types/domain";
import { Avatar, Badge, Button, Card, CardHeader, Input, Modal, PageHeader, Progress, SearchInput, Select, StatCard, Tabs, cn, useToast } from "@/components/ui";

const statusTone: Record<PropertyStatus, "success" | "warning" | "neutral" | "danger"> = {
  available: "success",
  reserved: "warning",
  sold: "neutral",
  "off-market": "danger"
};

function PropertyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { tenant, addProperty, can } = useWorkspace();
  const toast = useToast();
  const [form, setForm] = useState({ title: "", type: "apartment", purpose: "sale", city: "Erbil", area: "", address: "", price: "", bedrooms: "3", bathrooms: "2", sizeSqm: "", ownerName: "", assignedTo: tenant.employees[0]?.id ?? "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!can("manage:properties")) {
      toast({ title: "Permission denied", message: "This role cannot create property records.", tone: "danger" });
      return;
    }
    const result = validateRequired(form, ["title", "area", "address", "price", "sizeSqm", "ownerName", "assignedTo"]);
    if (!result.valid) return setErrors(result.errors);
    addProperty({
      title: form.title,
      type: form.type as "apartment" | "villa" | "office" | "land" | "retail",
      purpose: form.purpose as "sale" | "rent",
      city: form.city,
      area: form.area,
      address: form.address,
      price: Number(form.price),
      currency: "USD",
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      sizeSqm: Number(form.sizeSqm),
      status: "available",
      ownerName: form.ownerName,
      assignedTo: form.assignedTo
    });
    toast({ title: "Property added", message: `${form.title} is now available in inventory.`, tone: "success" });
    setErrors({});
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title="Add property" description="Create a complete, market-ready inventory record." size="xl" footer={<><Button variant="secondary" onClick={onClose}>Save draft</Button><Button type="submit" form="property-form"><Plus size={17} /> Add property</Button></>}>
      <form id="property-form" className="form-grid form-grid--3" onSubmit={submit}>
        <Input label="Property title" value={form.title} error={errors.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Contemporary family villa" className="form-grid__span-2" />
        <Select label="Type" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}><option value="apartment">Apartment</option><option value="villa">Villa</option><option value="office">Office</option><option value="retail">Retail</option><option value="land">Land</option></Select>
        <Select label="Purpose" value={form.purpose} onChange={(event) => setForm({ ...form, purpose: event.target.value })}><option value="sale">For sale</option><option value="rent">For rent</option></Select>
        <Input label="City" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
        <Input label="Area / compound" value={form.area} error={errors.area} onChange={(event) => setForm({ ...form, area: event.target.value })} placeholder="Dream City" />
        <Input label="Full address" value={form.address} error={errors.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Zone 4, Street 12" className="form-grid__span-2" />
        <Input label="Price (USD)" type="number" value={form.price} error={errors.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
        <Input label="Bedrooms" type="number" min="0" value={form.bedrooms} onChange={(event) => setForm({ ...form, bedrooms: event.target.value })} />
        <Input label="Bathrooms" type="number" min="0" value={form.bathrooms} onChange={(event) => setForm({ ...form, bathrooms: event.target.value })} />
        <Input label="Size (sqm)" type="number" value={form.sizeSqm} error={errors.sizeSqm} onChange={(event) => setForm({ ...form, sizeSqm: event.target.value })} />
        <Input label="Owner name" value={form.ownerName} error={errors.ownerName} onChange={(event) => setForm({ ...form, ownerName: event.target.value })} />
        <Select label="Listing agent" value={form.assignedTo} onChange={(event) => setForm({ ...form, assignedTo: event.target.value })}>{tenant.employees.map((employee) => <option value={employee.id} key={employee.id}>{employee.firstName} {employee.lastName}</option>)}</Select>
        <div className="upload-zone form-grid__full"><UploadCloud size={24} /><strong>Drop property media here</strong><span>Photos, video, floor plans, and ownership documents can be attached after creation.</span></div>
      </form>
    </Modal>
  );
}

export function InventoryPage() {
  const { tenant, updatePropertyStatus } = useWorkspace();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"cards" | "table">("cards");
  const [status, setStatus] = useState<PropertyStatus | "all">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const properties = useMemo(() => tenant.properties.filter((property) => {
    const text = `${property.title} ${property.reference} ${property.area} ${property.ownerName}`.toLowerCase();
    return text.includes(search.toLowerCase()) && (status === "all" || property.status === status);
  }), [tenant.properties, search, status]);
  return (
    <div className="page-stack">
      <PageHeader eyebrow="Property operations" title="Property inventory" description="Control availability, pricing, ownership, listings, media, and property lifecycle from one workspace." actions={<><Button variant="secondary"><UploadCloud size={17} /> Import</Button><Button onClick={() => setModalOpen(true)}><Plus size={17} /> Add property</Button></>} />
      <div className="metrics-grid metrics-grid--4 metrics-grid--compact">
        <StatCard label="Total inventory" value={tenant.properties.length} change={7.2} icon={<Building2 size={20} />} tone="brand" detail="all properties" />
        <StatCard label="Available" value={tenant.properties.filter((item) => item.status === "available").length} change={4.1} icon={<CheckCircle2 size={20} />} tone="green" detail="ready to market" />
        <StatCard label="Reserved" value={tenant.properties.filter((item) => item.status === "reserved").length} icon={<KeyRound size={20} />} tone="amber" detail="active holds" />
        <StatCard label="Portfolio value" value={formatCurrency(tenant.properties.filter((item) => item.purpose === "sale").reduce((sum, item) => sum + item.price, 0))} change={5.7} icon={<CircleDollarSign size={20} />} tone="blue" detail="sale inventory" />
      </div>
      <Card className="toolbar-card"><div className="module-toolbar"><SearchInput value={search} onChange={setSearch} placeholder="Search properties, references, owners..." /><div className="module-toolbar__actions"><Select value={status} onChange={(event) => setStatus(event.target.value as PropertyStatus | "all")} aria-label="Property status"><option value="all">All statuses</option><option value="available">Available</option><option value="reserved">Reserved</option><option value="sold">Sold</option><option value="off-market">Off market</option></Select><Button variant="secondary"><Filter size={16} /> Filters</Button><div className="view-toggle"><button className={cn(view === "cards" && "active")} onClick={() => setView("cards")}><Grid2X2 size={17} /></button><button className={cn(view === "table" && "active")} onClick={() => setView("table")}><List size={17} /></button></div></div></div></Card>
      {view === "cards" ? <div className="property-grid">{properties.map((property, index) => {
        const agent = tenant.employees.find((employee) => employee.id === property.assignedTo);
        return <article className="property-card" key={property.id}>
          <div className={`property-card__visual property-card__visual--${index % 6}`}><div className="property-card__badges"><Badge tone={statusTone[property.status]}>{property.status}</Badge>{property.featured ? <Badge tone="purple"><Sparkles size={12} /> Featured</Badge> : null}</div><button className="property-card__more"><MoreHorizontal size={18} /></button><div className="property-card__building"><House size={60} strokeWidth={1.1} /></div></div>
          <div className="property-card__body"><div className="property-card__ref">{property.reference} · {property.purpose === "sale" ? "For sale" : "For rent"}</div><h3>{property.title}</h3><p><MapPin size={14} /> {property.area}, {property.city}</p><strong className="property-card__price">{formatCurrency(property.price, property.currency)}{property.purpose === "rent" ? <small>/ month</small> : null}</strong><div className="property-card__facts"><span><BedDouble size={15} /> {property.bedrooms || "—"}</span><span><Bath size={15} /> {property.bathrooms || "—"}</span><span><Ruler size={15} /> {property.sizeSqm} m²</span></div></div>
          <div className="property-card__footer"><div className="mini-person"><Avatar name={agent ? `${agent.firstName} ${agent.lastName}` : "Team"} size="sm" /><span>{agent?.firstName ?? "Team"}</span></div><div className="inline-actions"><Button variant="ghost" size="sm"><Eye size={15} /> View</Button><select value={property.status} onChange={(event) => { const next = event.target.value as PropertyStatus; updatePropertyStatus(property.id, next); toast({ title: "Status updated", message: `${property.reference} is now ${next}.`, tone: "success" }); }}><option value="available">Available</option><option value="reserved">Reserved</option><option value="sold">Sold</option><option value="off-market">Off market</option></select></div></div>
        </article>;
      })}</div> : <Card className="table-card"><div className="data-table-wrap"><table className="data-table"><thead><tr><th>Property</th><th>Type</th><th>Location</th><th>Price</th><th>Size</th><th>Status</th><th>Owner</th><th /></tr></thead><tbody>{properties.map((property) => <tr key={property.id}><td><div className="property-table-cell"><span className="property-table-cell__thumb"><Building2 size={19} /></span><span><strong>{property.title}</strong><small>{property.reference}</small></span></div></td><td>{property.type}</td><td>{property.area}, {property.city}</td><td><strong>{formatCurrency(property.price)}</strong></td><td>{property.sizeSqm} m²</td><td><Badge tone={statusTone[property.status]}>{property.status}</Badge></td><td>{property.ownerName}</td><td><button className="icon-button icon-button--small"><MoreHorizontal size={16} /></button></td></tr>)}</tbody></table></div></Card>}
      <PropertyModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export function PropertyMapPage() {
  const { tenant } = useWorkspace();
  const [selected, setSelected] = useState(tenant.properties[0]?.id);
  const selectedProperty = tenant.properties.find((property) => property.id === selected);
  return (
    <div className="page-stack page-stack--map">
      <PageHeader eyebrow="Geographic intelligence" title="Property map" description="Explore availability, pricing, and coverage by neighborhood." actions={<><Button variant="secondary"><SlidersHorizontal size={17} /> Map filters</Button><Button><Plus size={17} /> Add property</Button></>} />
      <div className="map-layout">
        <Card className="map-list-panel"><div className="map-list-panel__search"><Search size={17} /><input placeholder="Search this area" /></div><div className="map-list-panel__header"><strong>{tenant.properties.length} properties</strong><button><SlidersHorizontal size={15} /> Sort</button></div><div className="map-result-list">{tenant.properties.map((property) => <button className={cn("map-result", property.id === selected && "map-result--selected")} key={property.id} onClick={() => setSelected(property.id)}><span className="map-result__thumb"><House size={24} /></span><span><strong>{property.title}</strong><small>{property.area} · {property.sizeSqm} m²</small><b>{formatCurrency(property.price)}</b></span><Badge tone={statusTone[property.status]}>{property.status}</Badge></button>)}</div></Card>
        <Card className="property-map"><div className="map-background"><div className="map-river" /><div className="map-road map-road--one" /><div className="map-road map-road--two" /><div className="map-road map-road--three" /><div className="map-blocks">{Array.from({ length: 38 }).map((_, index) => <span style={{ left: `${(index * 23) % 90 + 4}%`, top: `${(index * 37) % 83 + 5}%`, transform: `rotate(${index * 11}deg)` }} key={index} />)}</div>{tenant.properties.map((property) => <button className={cn("map-pin", `map-pin--${property.status}`, property.id === selected && "map-pin--selected")} style={{ left: `${property.mapX}%`, top: `${property.mapY}%` }} onClick={() => setSelected(property.id)} key={property.id}><MapPin size={16} /><span>{formatCurrency(property.price).replace("US$", "$ ")}</span></button>)}</div>{selectedProperty ? <div className="map-property-card"><div className="map-property-card__visual"><House size={32} /></div><div><Badge tone={statusTone[selectedProperty.status]}>{selectedProperty.status}</Badge><h3>{selectedProperty.title}</h3><p>{selectedProperty.area}, {selectedProperty.city}</p><strong>{formatCurrency(selectedProperty.price)}</strong></div><Button size="sm">Open</Button></div> : null}</Card>
      </div>
    </div>
  );
}

export function ReservationsPage() {
  const { tenant } = useWorkspace();
  return <div className="page-stack"><PageHeader eyebrow="Property operations" title="Reservations" description="Control temporary holds, deposits, approvals, expiry, and conversion to contract." actions={<Button><Plus size={17} /> New reservation</Button>} />
    <div className="metrics-grid metrics-grid--4 metrics-grid--compact"><StatCard label="Active reservations" value={tenant.reservations.filter((item) => item.status === "active").length} icon={<KeyRound size={20} />} tone="brand" detail="current holds" /><StatCard label="Deposits held" value={formatCurrency(tenant.reservations.filter((item) => item.status === "active").reduce((sum, item) => sum + item.deposit, 0))} icon={<CircleDollarSign size={20} />} tone="green" detail="refundable and applied" /><StatCard label="Expiring this week" value={tenant.reservations.filter((item) => item.status === "active").length} icon={<RefreshCw size={20} />} tone="amber" detail="requires action" /><StatCard label="Conversion rate" value="68%" change={6.4} icon={<CheckCircle2 size={20} />} tone="blue" detail="last 90 days" /></div>
    <Card className="table-card"><CardHeader title="Reservation register" description="Every hold is time-bound and auditable" action={<Button variant="secondary"><Filter size={16} /> Filter</Button>} /><div className="data-table-wrap"><table className="data-table"><thead><tr><th>Reservation</th><th>Property</th><th>Customer</th><th>Agent</th><th>Deposit</th><th>Expiry</th><th>Status</th><th /></tr></thead><tbody>{tenant.reservations.map((reservation) => { const property = tenant.properties.find((item) => item.id === reservation.propertyId); const agent = tenant.employees.find((item) => item.id === reservation.agentId); return <tr key={reservation.id}><td><strong>{reservation.id.toUpperCase()}</strong><small className="table-subtext">Created {formatDate(reservation.createdAt)}</small></td><td><div className="property-table-cell"><span className="property-table-cell__thumb"><Building2 size={18} /></span><span><strong>{property?.title}</strong><small>{property?.reference}</small></span></div></td><td>{reservation.customerName}</td><td>{agent ? `${agent.firstName} ${agent.lastName}` : "—"}</td><td><strong>{formatCurrency(reservation.deposit)}</strong></td><td>{formatDateTime(reservation.expiresAt)}</td><td><Badge tone="success">{reservation.status}</Badge></td><td><Button variant="ghost" size="sm">Convert</Button></td></tr>; })}</tbody></table></div></Card>
  </div>;
}

export function OwnersPage() {
  const { tenant } = useWorkspace();
  const owners = [...new Set(tenant.properties.map((property) => property.ownerName))];
  return <div className="page-stack"><PageHeader eyebrow="Property relationships" title="Property owners" description="Manage mandates, ownership documents, communication, and portfolio performance." actions={<Button><Plus size={17} /> Add owner</Button>} /><div className="owner-grid">{owners.map((owner, index) => { const properties = tenant.properties.filter((property) => property.ownerName === owner); return <Card interactive key={owner} className="owner-card"><div className="owner-card__top"><Avatar name={owner} size="lg" status="online" /><Badge tone={index % 2 ? "purple" : "success"}>{index % 2 ? "Company" : "Individual"}</Badge></div><h3>{owner}</h3><p>{properties.length} active property relationship{properties.length === 1 ? "" : "s"}</p><div className="owner-card__stats"><span><small>Portfolio value</small><strong>{formatCurrency(properties.reduce((sum, item) => sum + item.price, 0))}</strong></span><span><small>Available</small><strong>{properties.filter((item) => item.status === "available").length}</strong></span></div><div className="owner-card__footer"><Button variant="secondary" size="sm"><Eye size={15} /> View portfolio</Button><button className="icon-button icon-button--small"><MoreHorizontal size={16} /></button></div></Card>; })}</div></div>;
}

export function ProjectsPage() {
  const projects = [
    { name: "Northstar Residences", location: "Erbil · 100 Meter Road", units: 240, available: 68, sold: 142, reserved: 30, value: 28600000, progress: 76 },
    { name: "Goizha Heights", location: "Sulaymaniyah · Goizha", units: 96, available: 31, sold: 52, reserved: 13, value: 11200000, progress: 58 },
    { name: "Gulan Business Park", location: "Erbil · Gulan", units: 48, available: 18, sold: 21, reserved: 9, value: 16800000, progress: 44 }
  ];
  return <div className="page-stack"><PageHeader eyebrow="Development inventory" title="Projects & units" description="Manage developers, projects, phases, buildings, floors, and individual units." actions={<Button><Plus size={17} /> Add project</Button>} /><div className="project-grid">{projects.map((project, index) => <Card key={project.name} className="project-card"><div className={`project-card__visual project-card__visual--${index}`}><Layers3 size={42} /><Badge tone="success">Active sales</Badge></div><div className="project-card__body"><span className="eyebrow">PROJECT {String(index + 1).padStart(2, "0")}</span><h2>{project.name}</h2><p><MapPin size={14} /> {project.location}</p><div className="project-card__metrics"><span><small>Total units</small><strong>{project.units}</strong></span><span><small>Available</small><strong>{project.available}</strong></span><span><small>Reserved</small><strong>{project.reserved}</strong></span><span><small>Sold</small><strong>{project.sold}</strong></span></div><Progress value={project.progress} label={`${project.progress}% construction progress`} /><div className="project-card__footer"><strong>{formatCurrency(project.value)}</strong><Button variant="secondary" size="sm">Open inventory</Button></div></div></Card>)}</div></div>;
}

export function ListingsPage() {
  const { tenant } = useWorkspace();
  const portals = ["Agency Website", "Property Finder", "Bayut", "Facebook Marketplace"];
  return <div className="page-stack"><PageHeader eyebrow="Distribution" title="Listings & publishing" description="Prepare market-ready content and control publication across every connected channel." actions={<Button><Megaphone size={17} /> Publish listing</Button>} /><div className="listing-layout"><Card><CardHeader title="Publication queue" description={`${tenant.properties.filter((item) => item.status === "available").length} marketable properties`} action={<Button variant="secondary"><Filter size={16} /> Filters</Button>} /><div className="listing-queue">{tenant.properties.filter((item) => item.status === "available").map((property, index) => <div className="listing-row" key={property.id}><span className="listing-row__thumb"><House size={24} /></span><div className="listing-row__main"><strong>{property.title}</strong><span>{property.reference} · {property.area}</span><div className="portal-pills">{portals.map((portal, portalIndex) => <span className={cn(portalIndex <= index % 4 && "portal-pill--active")} key={portal}>{portal}</span>)}</div></div><div className="listing-row__quality"><small>Listing quality</small><Progress value={82 + (index % 3) * 6} label={`${82 + (index % 3) * 6}%`} /></div><Button variant="secondary" size="sm"><Share2 size={15} /> Manage</Button></div>)}</div></Card><Card><CardHeader title="Channel health" description="Connected publishing destinations" /><div className="integration-list">{portals.map((portal, index) => <div className="integration-row" key={portal}><span className={`integration-logo integration-logo--${index}`}><Megaphone size={18} /></span><div><strong>{portal}</strong><small>{index === 3 ? "Manual publishing" : "Last sync 12 minutes ago"}</small></div><Badge tone={index === 3 ? "warning" : "success"} dot>{index === 3 ? "Manual" : "Connected"}</Badge></div>)}</div></Card></div></div>;
}

export function MaintenancePage() {
  const items = [
    { id: "WO-1041", property: "Skyline Apartment", issue: "Air-conditioning inspection", assignee: "CoolAir Services", priority: "medium", due: "2026-07-19", status: "scheduled" },
    { id: "WO-1040", property: "Contemporary Villa", issue: "Garden irrigation leak", assignee: "GreenWorks", priority: "high", due: "2026-07-18", status: "in progress" },
    { id: "WO-1039", property: "Prime Retail Corner", issue: "Replace entrance lock", assignee: "Internal team", priority: "urgent", due: "2026-07-17", status: "open" }
  ];
  return <div className="page-stack"><PageHeader eyebrow="Property care" title="Maintenance" description="Coordinate work orders, vendors, cost approvals, and property service history." actions={<Button><Wrench size={17} /> New work order</Button>} /><Card className="table-card"><CardHeader title="Open work orders" description="Prioritized by service impact and due date" /><div className="data-table-wrap"><table className="data-table"><thead><tr><th>Work order</th><th>Property</th><th>Issue</th><th>Vendor / assignee</th><th>Priority</th><th>Due</th><th>Status</th><th /></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><strong>{item.id}</strong></td><td>{item.property}</td><td>{item.issue}</td><td>{item.assignee}</td><td><Badge tone={item.priority === "urgent" ? "danger" : item.priority === "high" ? "warning" : "neutral"}>{item.priority}</Badge></td><td>{formatDate(item.due)}</td><td><Badge tone={item.status === "in progress" ? "info" : item.status === "scheduled" ? "purple" : "warning"}>{item.status}</Badge></td><td><button className="icon-button icon-button--small"><MoreHorizontal size={16} /></button></td></tr>)}</tbody></table></div></Card></div>;
}
