'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Edit3, Eye, Phone, Mail } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { Empty, FilterButton, Modal, PageHeader, SearchBar, Status } from '@/components/UI';
import { useDemo } from '@/components/DemoProvider';
import { useToast } from '@/components/ToastProvider';
import { Contact } from '@/lib/types';
import { money, normalizePhone, todayInput, uid } from '@/lib/format';

const contactTypes = ['Buyer', 'Seller', 'Tenant', 'Landlord', 'Investor'];
const cities = ['Erbil', 'Duhok', 'Sulaymaniyah', 'Baghdad', 'Other'];
const sources = ['Instagram', 'Facebook', 'TikTok', 'Networking event', 'Friend referral', 'Walk-in', 'Other'];

export default function ContactsModule() {
  const { state, updateState } = useDemo();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [viewing, setViewing] = useState<Contact | null>(null);
  const [error, setError] = useState('');

  const contacts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return state.contacts.filter((contact) => {
      const matchesSearch = !query || [contact.name, contact.phone1, contact.phone2, contact.email, contact.city, contact.source, contact.notes, ...contact.types].join(' ').toLowerCase().includes(query);
      return matchesSearch && (statusFilter === 'All' || contact.status === statusFilter) && (typeFilter === 'All' || contact.types.includes(typeFilter));
    });
  }, [search, state.contacts, statusFilter, typeFilter]);

  function openNew() { setEditing(null); setError(''); setModalOpen(true); }
  function openEdit(contact: Contact) { setEditing(contact); setError(''); setModalOpen(true); }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    const types = contactTypes.filter((type) => form.getAll('types').includes(type));
    const budgetFrom = Number(form.get('budgetFrom') || 0);
    const budgetTo = Number(form.get('budgetTo') || 0);
    const phone1 = normalizePhone(String(form.get('phone1') || ''));
    const email = String(form.get('email') || '').trim().toLowerCase();
    if (!types.length) { setError('Select at least one contact type.'); return; }
    if (budgetTo > 0 && budgetTo < budgetFrom) { setError('Budget to must be equal to or greater than budget from.'); return; }
    const duplicate = state.contacts.find((contact) => contact.id !== editing?.id && (normalizePhone(contact.phone1) === phone1 || (email && contact.email.toLowerCase() === email)));
    if (duplicate) { setError(`A contact with the same ${normalizePhone(duplicate.phone1) === phone1 ? 'phone number' : 'email address'} already exists: ${duplicate.name}.`); return; }
    const record: Contact = {
      id: editing?.id || uid('contact'),
      name: String(form.get('name') || '').trim(),
      phone1,
      phone2: normalizePhone(String(form.get('phone2') || '')),
      email,
      city: String(form.get('city') || ''),
      source: String(form.get('source') || ''),
      types,
      status: String(form.get('status') || 'Active') as Contact['status'],
      statusReason: String(form.get('statusReason') || '').trim(),
      budgetFrom,
      budgetTo,
      currency: String(form.get('currency') || 'USD') as Contact['currency'],
      assignedTo: String(form.get('assignedTo') || ''),
      notes: String(form.get('notes') || '').trim(),
      createdAt: editing?.createdAt || todayInput(),
    };
    if (record.status !== 'Active' && !record.statusReason) { setError('A reason is required when the contact is inactive or marked Do not contact.'); return; }
    updateState((current) => ({ ...current, contacts: editing ? current.contacts.map((item) => item.id === editing.id ? record : item) : [record, ...current.contacts] }));
    setModalOpen(false);
    showToast(editing ? 'Contact updated.' : 'Contact created.');
  }

  return (
    <AppShell>
      <PageHeader title="Contacts" subtitle="One trusted record for buyers, sellers, tenants, landlords, and investors" action="New Contact" onAction={openNew} />
      <div className="toolbar"><SearchBar value={search} onChange={setSearch} placeholder="Search name, phone, email, city, source, or notes" /><FilterButton open={filtersOpen} onClick={() => setFiltersOpen((open) => !open)} /></div>
      {filtersOpen && <div className="filters"><label>Status<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All</option><option>Active</option><option>Inactive</option><option>Do not contact</option></select></label><label>Contact type<select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><option>All</option>{contactTypes.map((type) => <option key={type}>{type}</option>)}</select></label><button className="btn ghost filter-reset" onClick={() => { setStatusFilter('All'); setTypeFilter('All'); setSearch(''); }}>Clear filters</button></div>}
      <div className="table-wrap contacts-desktop">
        {contacts.length ? <table className="data-table contacts-table"><thead><tr><th>Contact</th><th>Types</th><th>City / Source</th><th>Budget</th><th>Assigned to</th><th>Status</th><th aria-label="Actions" /></tr></thead><tbody>{contacts.map((contact) => <ContactRow key={contact.id} contact={contact} />)}</tbody></table> : <Empty title="No contacts found" body="Change the filters or add a new contact." />}
      </div>
      <div className="mobile-record-list contacts-mobile">{contacts.map((contact) => <ContactCard key={contact.id} contact={contact} />)}{!contacts.length && <Empty title="No contacts found" body="Change the filters or add a new contact." />}</div>

      {modalOpen && <Modal title={editing ? 'Edit Contact' : 'New Contact'} onClose={() => setModalOpen(false)} wide>
        <form onSubmit={save} key={editing?.id || 'new-contact'}>
          {error && <div className="error-box" role="alert">{error}</div>}
          <div className="form-grid top-gap">
            <label>Full name *<input name="name" defaultValue={editing?.name} required /></label>
            <label>Primary phone *<input name="phone1" defaultValue={editing?.phone1} placeholder="+964..." required /></label>
            <label>Secondary phone<input name="phone2" defaultValue={editing?.phone2} /></label>
            <label>Email<input name="email" type="email" defaultValue={editing?.email} /></label>
            <fieldset className="span-2"><legend>Contact type *</legend><div className="check-grid">{contactTypes.map((type) => <label className="check" key={type}><input type="checkbox" name="types" value={type} defaultChecked={editing?.types.includes(type)} />{type}</label>)}</div></fieldset>
            <label>City<select name="city" defaultValue={editing?.city || 'Erbil'}>{cities.map((city) => <option key={city}>{city}</option>)}</select></label>
            <label>Source<select name="source" defaultValue={editing?.source || 'Instagram'}>{sources.map((source) => <option key={source}>{source}</option>)}</select></label>
            <label>Budget from<input name="budgetFrom" type="number" min="0" step="1" defaultValue={editing?.budgetFrom || ''} /></label>
            <label>Budget to<input name="budgetTo" type="number" min="0" step="1" defaultValue={editing?.budgetTo || ''} /></label>
            <label>Currency<select name="currency" defaultValue={editing?.currency || state.company.defaultCurrency}><option>USD</option><option>IQD</option></select></label>
            <label>Assigned agent<select name="assignedTo" defaultValue={editing?.assignedTo || state.employees[0]?.id}>{state.employees.filter((employee) => employee.status === 'Active').map((employee) => <option key={employee.id} value={employee.id}>{employee.name} — {employee.title}</option>)}</select></label>
            <label>Status<select name="status" defaultValue={editing?.status || 'Active'}><option>Active</option><option>Inactive</option><option>Do not contact</option></select></label>
            <label>Status reason<input name="statusReason" defaultValue={editing?.statusReason} placeholder="Required for inactive / do not contact" /></label>
            <label className="span-2">Notes<textarea name="notes" rows={4} defaultValue={editing?.notes} /></label>
          </div>
          <div className="modal-actions"><button type="button" className="btn ghost" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn">{editing ? 'Save Changes' : 'Create Contact'}</button></div>
        </form>
      </Modal>}

      {viewing && <Modal title={viewing.name} onClose={() => setViewing(null)} wide>
        <div className="detail-summary"><Status tone={viewing.status === 'Active' ? 'good' : viewing.status === 'Do not contact' ? 'bad' : 'warn'}>{viewing.status}</Status><span>{viewing.types.join(' · ')}</span></div>
        <div className="detail-grid">
          <Detail label="Phone" value={viewing.phone1} /><Detail label="Email" value={viewing.email || '—'} /><Detail label="City" value={viewing.city} /><Detail label="Source" value={viewing.source} />
          <Detail label="Budget" value={viewing.budgetTo ? `${money(viewing.budgetFrom, viewing.currency)} – ${money(viewing.budgetTo, viewing.currency)}` : 'Not specified'} /><Detail label="Assigned agent" value={employeeName(viewing.assignedTo)} />
        </div>
        <section className="detail-section"><h3>Notes</h3><p>{viewing.notes || 'No notes recorded.'}</p></section>
        <section className="detail-section"><h3>Linked activity</h3><div className="mini-stats"><span><strong>{state.deals.filter((deal) => deal.contactId === viewing.id).length}</strong> deals</span><span><strong>{state.meetings.filter((meeting) => meeting.contactId === viewing.id).length}</strong> meetings</span><span><strong>{state.tasks.filter((task) => task.relatedType === 'Contact' && task.relatedId === viewing.id).length}</strong> tasks</span></div></section>
        <div className="modal-actions"><button className="btn secondary" onClick={() => { setViewing(null); openEdit(viewing); }}><Edit3 size={16} />Edit Contact</button></div>
      </Modal>}
    </AppShell>
  );

  function employeeName(id: string) { return state.employees.find((employee) => employee.id === id)?.name || 'Unassigned'; }

  function ContactRow({ contact }: { contact: Contact }) {
    return <tr><td><button className="record-link" onClick={() => setViewing(contact)}>{contact.name}</button><small>{contact.phone1}<br />{contact.email}</small></td><td>{contact.types.map((type) => <Status key={type}>{type}</Status>)}</td><td>{contact.city}<small>{contact.source}</small></td><td>{contact.budgetTo ? <>{money(contact.budgetFrom, contact.currency)}<small>to {money(contact.budgetTo, contact.currency)}</small></> : '—'}</td><td>{employeeName(contact.assignedTo)}</td><td><Status tone={contact.status === 'Active' ? 'good' : contact.status === 'Do not contact' ? 'bad' : 'warn'}>{contact.status}</Status>{contact.statusReason && <small>{contact.statusReason}</small>}</td><td><button className="icon-btn row-action" aria-label={`Edit ${contact.name}`} onClick={() => openEdit(contact)}><Edit3 size={17} /></button></td></tr>;
  }

  function ContactCard({ contact }: { contact: Contact }) {
    return <article className="mobile-record-card"><div className="mobile-card-head"><div><strong>{contact.name}</strong><span>{contact.types.join(' · ')}</span></div><Status tone={contact.status === 'Active' ? 'good' : contact.status === 'Do not contact' ? 'bad' : 'warn'}>{contact.status}</Status></div><div className="mobile-card-lines"><span><Phone size={15} />{contact.phone1}</span>{contact.email && <span><Mail size={15} />{contact.email}</span>}<span>{contact.city} · {contact.source}</span></div><div className="mobile-card-actions"><button className="btn ghost small" onClick={() => setViewing(contact)}><Eye size={16} />View</button><button className="btn secondary small" onClick={() => openEdit(contact)}><Edit3 size={16} />Edit</button></div></article>;
  }
}

function Detail({ label, value }: { label: string; value: string }) { return <div><small>{label}</small><strong>{value}</strong></div>; }
