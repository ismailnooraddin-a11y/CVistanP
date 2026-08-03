'use client';

import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { BedDouble, Bath, Building2, Edit3, Eye, FileSpreadsheet, ImagePlus, MapPin, Ruler, ShieldCheck, XCircle } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { ConfirmDialog, Empty, FilterButton, Modal, PageHeader, SearchBar, Status } from '@/components/UI';
import { useDemo } from '@/components/DemoProvider';
import { useToast } from '@/components/ToastProvider';
import { Property } from '@/lib/types';
import { exportXlsx } from '@/lib/xlsx';
import { localDate, money, todayInput, uid } from '@/lib/format';

const propertyTypes = ['Apartment', 'House', 'Villa', 'Townhouse', 'Commercial', 'Land', 'Office', 'Warehouse'];

async function compressPhotos(files: File[]) {
  const results: string[] = [];
  for (const file of files.slice(0, 6)) {
    if (!file.type.startsWith('image/') || file.size > 6 * 1024 * 1024) continue;
    const url = URL.createObjectURL(file);
    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => { const element = new Image(); element.onload = () => resolve(element); element.onerror = reject; element.src = url; });
      const scale = Math.min(1, 900 / image.width, 600 / image.height);
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext('2d');
      if (!context) continue;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      results.push(canvas.toDataURL('image/jpeg', 0.7));
    } finally { URL.revokeObjectURL(url); }
  }
  return results;
}

export default function PropertiesModule() {
  const { state, updateState } = useDemo();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [purposeFilter, setPurposeFilter] = useState('All');
  const [cityFilter, setCityFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);
  const [viewing, setViewing] = useState<Property | null>(null);
  const [reservationProperty, setReservationProperty] = useState<Property | null>(null);
  const [cancelReservation, setCancelReservation] = useState<Property | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  const [photoData, setPhotoData] = useState<string[]>([]);
  const [photoBusy, setPhotoBusy] = useState(false);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return state.properties.filter((property) => {
      const text = [property.reference, property.title, property.type, property.purpose, property.status, property.city, property.district, property.address, property.description].join(' ').toLowerCase();
      return (!query || text.includes(query)) && (statusFilter === 'All' || property.status === statusFilter) && (purposeFilter === 'All' || property.purpose === purposeFilter) && (cityFilter === 'All' || property.city === cityFilter);
    });
  }, [cityFilter, purposeFilter, search, state.properties, statusFilter]);

  function nextReference() {
    const max = state.properties.reduce((highest, property) => Math.max(highest, Number(property.reference.match(/(\d+)$/)?.[1] || 0)), 0);
    return `EF-P-${String(max + 1).padStart(4, '0')}`;
  }

  function openNew() { setEditing(null); setPhotoData([]); setError(''); setModalOpen(true); }
  function openEdit(property: Property) { setEditing(property); setPhotoData(property.photoDataUrls); setError(''); setModalOpen(true); }

  async function onPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length) return;
    setPhotoBusy(true);
    try {
      const compressed = await compressPhotos(files);
      setPhotoData((current) => [...current, ...compressed].slice(0, 6));
      if (compressed.length !== files.length) showToast('Some files were skipped because they were invalid or too large.', 'info');
    } finally { setPhotoBusy(false); }
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    const priceFrom = Number(form.get('priceFrom') || 0);
    const priceTo = Number(form.get('priceTo') || 0);
    if (priceTo < priceFrom) { setError('Price to must be equal to or greater than price from.'); return; }
    const status = String(form.get('status') || 'Available') as Property['status'];
    if (status === 'Reserved' && !editing?.reservation) { setError('Use the reservation action to mark a property as reserved so the client, dates, and deposit are recorded.'); return; }
    const now = todayInput();
    const record: Property = {
      id: editing?.id || uid('property'),
      reference: editing?.reference || nextReference(),
      title: String(form.get('title') || '').trim(),
      type: String(form.get('type') || ''),
      purpose: String(form.get('purpose') || 'Sale') as Property['purpose'],
      status,
      city: String(form.get('city') || '').trim(),
      district: String(form.get('district') || '').trim(),
      address: String(form.get('address') || '').trim(),
      area: Number(form.get('area') || 0),
      bedrooms: Number(form.get('bedrooms') || 0),
      bathrooms: Number(form.get('bathrooms') || 0),
      priceFrom,
      priceTo,
      currency: String(form.get('currency') || 'USD') as Property['currency'],
      ownerId: String(form.get('ownerId') || ''),
      assignedTo: String(form.get('assignedTo') || ''),
      branchId: String(form.get('branchId') || ''),
      description: String(form.get('description') || '').trim(),
      photoDataUrls: photoData,
      reservation: status === 'Reserved' ? editing?.reservation : undefined,
      createdAt: editing?.createdAt || now,
      updatedAt: now,
    };
    updateState((current) => ({ ...current, properties: editing ? current.properties.map((item) => item.id === editing.id ? record : item) : [record, ...current.properties] }));
    setModalOpen(false);
    showToast(editing ? 'Property updated.' : 'Property created.');
  }

  function saveReservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reservationProperty) return;
    const form = new FormData(event.currentTarget);
    const from = String(form.get('from') || '');
    const to = String(form.get('to') || '');
    if (to < from) { setError('Reservation expiry must be on or after the start date.'); return; }
    const reservation = { clientId: String(form.get('clientId') || ''), reservedBy: String(form.get('reservedBy') || ''), from, to, depositAmount: Number(form.get('depositAmount') || 0), status: String(form.get('reservationStatus') || 'Pending deposit') as NonNullable<Property['reservation']>['status'] };
    updateState((current) => ({ ...current, properties: current.properties.map((property) => property.id === reservationProperty.id ? { ...property, status: 'Reserved', reservation, updatedAt: todayInput() } : property) }));
    setReservationProperty(null); setError(''); showToast('Property reserved. The availability status and reservation details were updated together.');
  }

  function releaseReservation(property: Property) {
    updateState((current) => ({ ...current, properties: current.properties.map((item) => item.id === property.id ? { ...item, status: 'Available', reservation: undefined, updatedAt: todayInput() } : item) }));
    setCancelReservation(null); showToast('Reservation released and property returned to Available.', 'info');
  }

  function toggleSelected(id: string) { setSelected((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; }); }

  function doExport(scope: 'filtered' | 'all' | 'selected') {
    const rows = scope === 'all' ? state.properties : scope === 'selected' ? state.properties.filter((property) => selected.has(property.id)) : filtered;
    if (!rows.length) { showToast('There are no property records in the selected export scope.', 'error'); return; }
    const propertyRows = rows.map((property) => [property.reference, property.title, property.type, property.purpose, property.status, property.city, property.district, property.address, property.area, property.bedrooms, property.bathrooms, property.priceFrom, property.priceTo, property.currency, contactName(property.ownerId), employeeName(property.assignedTo), branchName(property.branchId), property.photoDataUrls.length, property.createdAt, property.updatedAt]);
    const reservationRows = rows.filter((property) => property.reservation).map((property) => [property.reference, property.title, contactName(property.reservation!.clientId), employeeName(property.reservation!.reservedBy), property.reservation!.from, property.reservation!.to, property.reservation!.depositAmount, property.currency, property.reservation!.status]);
    exportXlsx(`EstateFlow-Properties-${todayInput()}`, state.company.legalName, [
      { name: 'Properties', headers: ['Reference', 'Title', 'Type', 'Purpose', 'Status', 'City', 'District', 'Address', 'Area m²', 'Bedrooms', 'Bathrooms', 'Price From', 'Price To', 'Currency', 'Owner', 'Assigned Agent', 'Branch', 'Photo Count', 'Created', 'Updated'], rows: propertyRows },
      { name: 'Reservations', headers: ['Property Reference', 'Property', 'Client', 'Reserved By', 'Start', 'Expiry', 'Deposit', 'Currency', 'Status'], rows: reservationRows },
    ]);
    setExportOpen(false); showToast(`${rows.length} property record${rows.length === 1 ? '' : 's'} exported to Excel.`);
  }

  return (
    <AppShell>
      <PageHeader title="Properties" subtitle="Trusted inventory with availability, ownership, reservation, and export controls" action="New Property" onAction={openNew} secondaryAction="Export Excel" onSecondaryAction={() => setExportOpen(true)} />
      <div className="toolbar"><SearchBar value={search} onChange={setSearch} placeholder="Search reference, property, location, or description" /><FilterButton open={filtersOpen} onClick={() => setFiltersOpen((open) => !open)} /></div>
      {filtersOpen && <div className="filters"><label>Status<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All</option><option>Available</option><option>Reserved</option><option>Sold</option><option>Rented</option><option>Inactive</option></select></label><label>Purpose<select value={purposeFilter} onChange={(event) => setPurposeFilter(event.target.value)}><option>All</option><option>Sale</option><option>Rent</option></select></label><label>City<select value={cityFilter} onChange={(event) => setCityFilter(event.target.value)}><option>All</option>{Array.from(new Set(state.properties.map((property) => property.city))).map((city) => <option key={city}>{city}</option>)}</select></label><button className="btn ghost filter-reset" onClick={() => { setStatusFilter('All'); setPurposeFilter('All'); setCityFilter('All'); setSearch(''); }}>Clear filters</button></div>}
      <div className="selection-strip"><label className="check-line"><input type="checkbox" checked={filtered.length > 0 && filtered.every((property) => selected.has(property.id))} onChange={(event) => setSelected(event.target.checked ? new Set([...selected, ...filtered.map((property) => property.id)]) : new Set([...selected].filter((id) => !filtered.some((property) => property.id === id))))} />Select filtered properties</label><span>{selected.size} selected</span>{selected.size > 0 && <button className="text-link" onClick={() => setSelected(new Set())}>Clear selection</button>}</div>
      {filtered.length ? <div className="property-grid">{filtered.map((property) => <PropertyCard key={property.id} property={property} />)}</div> : <div className="panel"><Empty title="No properties found" body="Change the filters or add a new property." /></div>}

      {modalOpen && <Modal title={editing ? `Edit ${editing.reference}` : 'New Property'} onClose={() => setModalOpen(false)} extraWide>
        <form onSubmit={save} key={editing?.id || 'new-property'}>
          {error && <div className="error-box" role="alert">{error}</div>}
          <div className="form-grid top-gap">
            <label className="span-2">Property title *<input name="title" defaultValue={editing?.title} required /></label>
            <label>Type<select name="type" defaultValue={editing?.type || 'Apartment'}>{propertyTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
            <label>Purpose<select name="purpose" defaultValue={editing?.purpose || 'Sale'}><option>Sale</option><option>Rent</option></select></label>
            <label>Status<select name="status" defaultValue={editing?.status || 'Available'}><option>Available</option>{editing?.reservation && <option>Reserved</option>}<option>Sold</option><option>Rented</option><option>Inactive</option></select></label>
            <label>Branch<select name="branchId" defaultValue={editing?.branchId || state.branches[0]?.id}>{state.branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></label>
            <label>City *<input name="city" defaultValue={editing?.city || 'Erbil'} required /></label>
            <label>District *<input name="district" defaultValue={editing?.district} required /></label>
            <label className="span-2">Address *<input name="address" defaultValue={editing?.address} required /></label>
            <label>Area (m²) *<input name="area" type="number" min="1" step="0.1" defaultValue={editing?.area} required /></label>
            <label>Bedrooms<input name="bedrooms" type="number" min="0" defaultValue={editing?.bedrooms || 0} /></label>
            <label>Bathrooms<input name="bathrooms" type="number" min="0" defaultValue={editing?.bathrooms || 0} /></label>
            <label>Currency<select name="currency" defaultValue={editing?.currency || state.company.defaultCurrency}><option>USD</option><option>IQD</option></select></label>
            <label>Price from *<input name="priceFrom" type="number" min="0" step="1" defaultValue={editing?.priceFrom} required /></label>
            <label>Price to *<input name="priceTo" type="number" min="0" step="1" defaultValue={editing?.priceTo} required /></label>
            <label>Owner *<select name="ownerId" defaultValue={editing?.ownerId || state.contacts.find((contact) => contact.types.includes('Seller') || contact.types.includes('Landlord'))?.id}>{state.contacts.filter((contact) => contact.types.includes('Seller') || contact.types.includes('Landlord')).map((contact) => <option key={contact.id} value={contact.id}>{contact.name}</option>)}</select></label>
            <label>Assigned agent<select name="assignedTo" defaultValue={editing?.assignedTo || state.employees[0]?.id}>{state.employees.filter((employee) => employee.status === 'Active').map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}</select></label>
            <label className="span-2">Description<textarea name="description" rows={4} defaultValue={editing?.description} /></label>
            <div className="span-2 photo-uploader"><div><strong>Property photos</strong><p>Up to 6 images. Files are compressed for the frontend demo and stored locally.</p></div><label className="btn secondary file-button"><ImagePlus size={17} />{photoBusy ? 'Processing...' : 'Add photos'}<input type="file" accept="image/*" multiple disabled={photoBusy || photoData.length >= 6} onChange={onPhotos} /></label></div>
            {photoData.length > 0 && <div className="span-2 photo-preview-grid">{photoData.map((photo, index) => <div key={`${photo.slice(-20)}-${index}`}><img src={photo} alt={`Property preview ${index + 1}`} /><button type="button" aria-label={`Remove photo ${index + 1}`} onClick={() => setPhotoData((current) => current.filter((_, itemIndex) => itemIndex !== index))}><XCircle size={19} /></button></div>)}</div>}
          </div>
          <div className="modal-actions"><button type="button" className="btn ghost" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn" disabled={photoBusy}>{editing ? 'Save Changes' : 'Create Property'}</button></div>
        </form>
      </Modal>}

      {viewing && <Modal title={`${viewing.reference} · ${viewing.title}`} onClose={() => setViewing(null)} extraWide>
        <div className="property-detail-hero">{viewing.photoDataUrls[0] ? <img src={viewing.photoDataUrls[0]} alt={viewing.title} /> : <div className="photo-placeholder large"><Building2 size={48} /><span>No photos uploaded</span></div>}<div><Status tone={viewing.status === 'Available' ? 'good' : viewing.status === 'Reserved' ? 'warn' : 'neutral'}>{viewing.status}</Status><h2>{money(viewing.priceFrom, viewing.currency)}{viewing.priceTo !== viewing.priceFrom && ` – ${money(viewing.priceTo, viewing.currency)}`}</h2><p><MapPin size={16} />{viewing.address}</p><div className="property-facts"><span><Ruler size={16} />{viewing.area} m²</span><span><BedDouble size={16} />{viewing.bedrooms} beds</span><span><Bath size={16} />{viewing.bathrooms} baths</span></div></div></div>
        <div className="detail-grid top-gap"><Detail label="Owner" value={contactName(viewing.ownerId)} /><Detail label="Assigned agent" value={employeeName(viewing.assignedTo)} /><Detail label="Branch" value={branchName(viewing.branchId)} /><Detail label="Last updated" value={localDate(viewing.updatedAt)} /></div>
        <section className="detail-section"><h3>Description</h3><p>{viewing.description || 'No description provided.'}</p></section>
        {viewing.reservation && <section className="reservation-panel"><div><ShieldCheck /><div><h3>Active reservation</h3><p>{contactName(viewing.reservation.clientId)} · {localDate(viewing.reservation.from)} to {localDate(viewing.reservation.to)}</p><small>Reserved by {employeeName(viewing.reservation.reservedBy)} · Deposit {money(viewing.reservation.depositAmount, viewing.currency)} · {viewing.reservation.status}</small></div></div><button className="btn ghost" onClick={() => { setViewing(null); setCancelReservation(viewing); }}>Release reservation</button></section>}
        <div className="modal-actions">{viewing.status === 'Available' && <button className="btn secondary" onClick={() => { setViewing(null); setError(''); setReservationProperty(viewing); }}>Reserve Property</button>}<button className="btn" onClick={() => { setViewing(null); openEdit(viewing); }}><Edit3 size={16} />Edit Property</button></div>
      </Modal>}

      {reservationProperty && <Modal title={`Reserve ${reservationProperty.reference}`} onClose={() => setReservationProperty(null)} wide>
        <form onSubmit={saveReservation}>{error && <div className="error-box">{error}</div>}<div className="form-grid top-gap"><label>Client *<select name="clientId" required>{state.contacts.filter((contact) => contact.status === 'Active').map((contact) => <option key={contact.id} value={contact.id}>{contact.name}</option>)}</select></label><label>Reserved by *<select name="reservedBy" required>{state.employees.filter((employee) => employee.status === 'Active').map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}</select></label><label>Start date *<input name="from" type="date" min={todayInput()} defaultValue={todayInput()} required /></label><label>Expiry date *<input name="to" type="date" min={todayInput()} required /></label><label>Deposit amount<input name="depositAmount" type="number" min="0" step="1" defaultValue="0" /></label><label>Reservation status<select name="reservationStatus"><option>Pending deposit</option><option>Confirmed</option></select></label></div><div className="form-note top-gap">This demo updates availability and reservation details as one transaction. The backend phase will add database-level conflict protection.</div><div className="modal-actions"><button type="button" className="btn ghost" onClick={() => setReservationProperty(null)}>Cancel</button><button className="btn">Confirm Reservation</button></div></form>
      </Modal>}

      {cancelReservation && <ConfirmDialog title="Release reservation?" body={`${cancelReservation.title} will return to Available and the current reservation details will be removed.`} confirmLabel="Release reservation" tone="danger" onClose={() => setCancelReservation(null)} onConfirm={() => releaseReservation(cancelReservation)} />}

      {exportOpen && <Modal title="Export Properties to Excel" onClose={() => setExportOpen(false)}>
        <p className="modal-copy">Choose which permitted property records to include. The workbook contains formatted Properties and Reservations sheets.</p>
        <div className="export-options"><button onClick={() => doExport('filtered')}><FileSpreadsheet /><span><strong>Filtered results</strong><small>{filtered.length} current result{filtered.length === 1 ? '' : 's'}</small></span></button><button onClick={() => doExport('all')}><FileSpreadsheet /><span><strong>All properties</strong><small>{state.properties.length} total record{state.properties.length === 1 ? '' : 's'}</small></span></button><button disabled={!selected.size} onClick={() => doExport('selected')}><FileSpreadsheet /><span><strong>Selected properties</strong><small>{selected.size || 'No'} selected record{selected.size === 1 ? '' : 's'}</small></span></button></div>
      </Modal>}
    </AppShell>
  );

  function contactName(id: string) { return state.contacts.find((contact) => contact.id === id)?.name || 'Unknown contact'; }
  function employeeName(id: string) { return state.employees.find((employee) => employee.id === id)?.name || 'Unassigned'; }
  function branchName(id: string) { return state.branches.find((branch) => branch.id === id)?.name || 'Unknown branch'; }

  function PropertyCard({ property }: { property: Property }) {
    const selectedNow = selected.has(property.id);
    return <article className={`property-card ${selectedNow ? 'selected-card' : ''}`}><label className="card-select"><input type="checkbox" checked={selectedNow} onChange={() => toggleSelected(property.id)} /><span className="sr-only">Select {property.title}</span></label><div className="property-image">{property.photoDataUrls[0] ? <img src={property.photoDataUrls[0]} alt={property.title} /> : <div className="photo-placeholder"><Building2 size={35} /><span>{property.photoDataUrls.length ? `${property.photoDataUrls.length} photos` : 'Add photos'}</span></div>}<span className="property-ref">{property.reference}</span><Status tone={property.status === 'Available' ? 'good' : property.status === 'Reserved' ? 'warn' : 'neutral'}>{property.status}</Status></div><div className="card-body"><div className="card-row"><small>{property.type} · For {property.purpose}</small><strong>{money(property.priceFrom, property.currency)}</strong></div><h3>{property.title}</h3><p className="property-location"><MapPin size={15} />{property.district}, {property.city}</p><div className="property-facts"><span><Ruler size={15} />{property.area} m²</span><span><BedDouble size={15} />{property.bedrooms}</span><span><Bath size={15} />{property.bathrooms}</span></div>{property.reservation && <button className="reservation-summary" onClick={() => setViewing(property)}><ShieldCheck size={16} /><span>Reserved by {employeeName(property.reservation.reservedBy)} for {contactName(property.reservation.clientId)}<small>Expires {localDate(property.reservation.to)}</small></span></button>}<div className="card-actions"><button className="btn ghost small" onClick={() => setViewing(property)}><Eye size={16} />View</button><button className="btn secondary small" onClick={() => openEdit(property)}><Edit3 size={16} />Edit</button>{property.status === 'Available' && <button className="text-link" onClick={() => { setError(''); setReservationProperty(property); }}>Reserve</button>}</div></div></article>;
  }
}

function Detail({ label, value }: { label: string; value: string }) { return <div><small>{label}</small><strong>{value}</strong></div>; }
