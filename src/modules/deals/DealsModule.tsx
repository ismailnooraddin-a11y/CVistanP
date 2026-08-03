'use client';

import { FormEvent, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Clock3, History, Plus } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { Modal, PageHeader, SearchBar, Status } from '@/components/UI';
import { useDemo } from '@/components/DemoProvider';
import { useToast } from '@/components/ToastProvider';
import { DEAL_STAGES, Deal, DealStage } from '@/lib/types';
import { dateInputFrom, localDate, money, todayInput, uid } from '@/lib/format';

export default function DealsModule() {
  const { state, updateState } = useDemo();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Deal | null>(null);
  const [historyDeal, setHistoryDeal] = useState<Deal | null>(null);
  const [lostDeal, setLostDeal] = useState<Deal | null>(null);
  const [error, setError] = useState('');
  const [mobileStage, setMobileStage] = useState<DealStage | 'All'>('All');

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return state.deals.filter((deal) => {
      const text = [contactName(deal.contactId), propertyName(deal.propertyId), employeeName(deal.assignedTo), deal.stage, deal.nextAction].join(' ').toLowerCase();
      return (!query || text.includes(query)) && (mobileStage === 'All' || deal.stage === mobileStage);
    });
  }, [mobileStage, search, state.deals]);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    const valueFrom = Number(form.get('valueFrom') || 0);
    const valueTo = Number(form.get('valueTo') || 0);
    const expectedClose = String(form.get('expectedClose') || '');
    if (valueTo < valueFrom) { setError('Estimated value to must be equal to or greater than estimated value from.'); return; }
    if (expectedClose < todayInput() && !editing) { setError('Expected closing date must be today or a future date.'); return; }
    const now = new Date().toISOString();
    const record: Deal = {
      id: editing?.id || uid('deal'),
      contactId: String(form.get('contactId') || ''),
      propertyId: String(form.get('propertyId') || ''),
      assignedTo: String(form.get('assignedTo') || ''),
      stage: editing?.stage || 'New lead',
      valueFrom,
      valueTo,
      currency: String(form.get('currency') || 'USD') as Deal['currency'],
      expectedClose,
      nextAction: String(form.get('nextAction') || '').trim(),
      lossReason: editing?.lossReason || '',
      createdAt: editing?.createdAt || now,
      updatedAt: now,
      history: editing?.history || [{ at: now, to: 'New lead', note: 'Deal created' }],
    };
    updateState((current) => ({ ...current, deals: editing ? current.deals.map((deal) => deal.id === editing.id ? record : deal) : [record, ...current.deals] }));
    setShowForm(false); showToast(editing ? 'Deal updated.' : 'Deal created in New lead.');
  }

  function requestMove(deal: Deal, direction: -1 | 1) {
    const currentIndex = DEAL_STAGES.indexOf(deal.stage);
    const target = DEAL_STAGES[currentIndex + direction];
    if (!target) return;
    if (deal.stage === 'Closed won' || deal.stage === 'Closed lost') { showToast('Closed deals are locked in the frontend workflow.', 'error'); return; }
    if (target === 'Closed lost') { setLostDeal(deal); return; }
    moveDeal(deal, target, `Moved by Super Admin`);
  }

  function moveDeal(deal: Deal, target: DealStage, note: string) {
    const currentIndex = DEAL_STAGES.indexOf(deal.stage);
    const targetIndex = DEAL_STAGES.indexOf(target);
    if (Math.abs(targetIndex - currentIndex) !== 1 && target !== 'Closed lost') { showToast('Deals can move only one controlled stage at a time.', 'error'); return; }
    const property = state.properties.find((item) => item.id === deal.propertyId);
    if (!property) { showToast('The linked property record cannot be found.', 'error'); return; }
    if (target === 'Reservation' && property.status !== 'Available' && property.reservation?.clientId !== deal.contactId) { showToast('The linked property is not available for this client.', 'error'); return; }
    if (target === 'Contract preparation' && (!property.reservation || property.reservation.clientId !== deal.contactId)) { showToast('A confirmed property reservation for this client is required before contract preparation.', 'error'); return; }
    const now = new Date().toISOString();
    updateState((current) => {
      let properties = current.properties;
      if (target === 'Reservation' && property.status === 'Available') {
        const expiry = new Date(); expiry.setDate(expiry.getDate() + 7);
        properties = properties.map((item) => item.id === property.id ? { ...item, status: 'Reserved', reservation: { clientId: deal.contactId, reservedBy: deal.assignedTo, from: todayInput(), to: dateInputFrom(expiry), depositAmount: 0, status: 'Pending deposit' }, updatedAt: todayInput() } : item);
      }
      if ((target === 'Closed lost' || (deal.stage === 'Reservation' && target === 'Negotiation')) && property.reservation?.clientId === deal.contactId) properties = properties.map((item) => item.id === property.id ? { ...item, status: 'Available', reservation: undefined, updatedAt: todayInput() } : item);
      if (target === 'Closed won') properties = properties.map((item) => item.id === property.id ? { ...item, status: item.purpose === 'Sale' ? 'Sold' : 'Rented', reservation: undefined, updatedAt: todayInput() } : item);
      return {
        ...current,
        properties,
        deals: current.deals.map((item) => item.id === deal.id ? { ...item, stage: target, updatedAt: now, lossReason: target === 'Closed lost' ? note : item.lossReason, history: [...item.history, { at: now, from: item.stage, to: target, note }] } : item),
      };
    });
    showToast(`Deal moved to ${target}.`);
  }

  function confirmLost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lostDeal) return;
    const reason = String(new FormData(event.currentTarget).get('lossReason') || '').trim();
    if (!reason) return;
    moveDeal(lostDeal, 'Closed lost', reason);
    setLostDeal(null);
  }

  return (
    <AppShell>
      <PageHeader title="Deals" subtitle="Controlled sales pipeline with property, reservation, and stage-history rules" action="New Deal" onAction={() => { setEditing(null); setError(''); setShowForm(true); }} />
      <div className="toolbar"><SearchBar value={search} onChange={setSearch} placeholder="Search client, property, agent, stage, or next action" /></div>
      <div className="deal-workflow-note"><strong>Controlled workflow:</strong> deals move one stage at a time. Reservation checks availability, contract preparation requires a client reservation, and closed deals are locked.</div>
      <div className="kanban desktop-kanban">{DEAL_STAGES.map((stage) => <section className="kanban-col" key={stage}><header><strong>{stage}</strong><span>{filtered.filter((deal) => deal.stage === stage).length}</span></header>{filtered.filter((deal) => deal.stage === stage).map((deal) => <DealCard key={deal.id} deal={deal} />)}</section>)}</div>
      <div className="mobile-deals"><label>Pipeline stage<select value={mobileStage} onChange={(event) => setMobileStage(event.target.value as DealStage | 'All')}><option>All</option>{DEAL_STAGES.map((stage) => <option key={stage}>{stage}</option>)}</select></label><div className="mobile-record-list">{filtered.map((deal) => <DealCard key={deal.id} deal={deal} mobile />)}</div></div>

      {showForm && <Modal title={editing ? 'Edit Deal' : 'New Deal'} onClose={() => setShowForm(false)} wide><form onSubmit={save} key={editing?.id || 'new-deal'}>{error && <div className="error-box">{error}</div>}<div className="form-grid top-gap"><label>Contact *<select name="contactId" defaultValue={editing?.contactId} required>{state.contacts.filter((contact) => contact.status === 'Active').map((contact) => <option key={contact.id} value={contact.id}>{contact.name}</option>)}</select></label><label>Property *<select name="propertyId" defaultValue={editing?.propertyId} required>{state.properties.filter((property) => property.status === 'Available' || property.id === editing?.propertyId).map((property) => <option key={property.id} value={property.id}>{property.reference} — {property.title}</option>)}</select></label><label>Assigned agent<select name="assignedTo" defaultValue={editing?.assignedTo || state.employees[0]?.id}>{state.employees.filter((employee) => employee.status === 'Active').map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}</select></label><label>Currency<select name="currency" defaultValue={editing?.currency || state.company.defaultCurrency}><option>USD</option><option>IQD</option></select></label><label>Estimated value from *<input name="valueFrom" type="number" min="0" defaultValue={editing?.valueFrom} required /></label><label>Estimated value to *<input name="valueTo" type="number" min="0" defaultValue={editing?.valueTo} required /></label><label>Expected closing date *<input name="expectedClose" type="date" min={editing ? undefined : todayInput()} defaultValue={editing?.expectedClose} required /></label><label className="span-2">Next action<textarea name="nextAction" rows={3} defaultValue={editing?.nextAction} placeholder="The next concrete action, owner, and timing" /></label></div><div className="modal-actions"><button type="button" className="btn ghost" onClick={() => setShowForm(false)}>Cancel</button><button className="btn">{editing ? 'Save Changes' : 'Create Deal'}</button></div></form></Modal>}

      {historyDeal && <Modal title={`Deal history · ${contactName(historyDeal.contactId)}`} onClose={() => setHistoryDeal(null)} wide><div className="timeline">{historyDeal.history.slice().reverse().map((entry, index) => <div className="timeline-row" key={`${entry.at}-${index}`}><span className="timeline-dot" /><div><strong>{entry.from ? `${entry.from} → ${entry.to}` : entry.to}</strong><p>{entry.note}</p><small>{new Date(entry.at).toLocaleString('en-GB')}</small></div></div>)}</div></Modal>}

      {lostDeal && <Modal title="Close deal as lost" onClose={() => setLostDeal(null)}><form onSubmit={confirmLost}><p className="modal-copy">A specific loss reason is required so management can understand and improve conversion performance.</p><label>Loss reason *<textarea name="lossReason" rows={4} required placeholder="For example: price disagreement, financing rejected, chose another property..." /></label><div className="modal-actions"><button type="button" className="btn ghost" onClick={() => setLostDeal(null)}>Cancel</button><button className="btn danger">Close as Lost</button></div></form></Modal>}
    </AppShell>
  );

  function contactName(id: string) { return state.contacts.find((contact) => contact.id === id)?.name || 'Unknown contact'; }
  function propertyName(id: string) { return state.properties.find((property) => property.id === id)?.title || 'Unknown property'; }
  function employeeName(id: string) { return state.employees.find((employee) => employee.id === id)?.name || 'Unassigned'; }

  function DealCard({ deal, mobile = false }: { deal: Deal; mobile?: boolean }) {
    const index = DEAL_STAGES.indexOf(deal.stage);
    return <article className={mobile ? 'mobile-record-card deal-card mobile' : 'deal-card'}><div className="deal-card-head"><Status tone={deal.stage === 'Closed won' ? 'good' : deal.stage === 'Closed lost' ? 'bad' : deal.stage === 'Reservation' ? 'warn' : 'info'}>{deal.stage}</Status><button className="icon-btn" aria-label="View stage history" onClick={() => setHistoryDeal(deal)}><History size={17} /></button></div><h3>{contactName(deal.contactId)}</h3><p>{propertyName(deal.propertyId)}</p><strong>{money(deal.valueFrom, deal.currency)} – {money(deal.valueTo, deal.currency)}</strong><div className="deal-meta"><span><Clock3 size={14} />Close {localDate(deal.expectedClose)}</span><span>{employeeName(deal.assignedTo)}</span></div>{deal.nextAction && <div className="next-action"><small>Next action</small><span>{deal.nextAction}</span></div>}<div className="deal-footer"><div className="deal-card-links"><button className="text-link" onClick={() => { setEditing(deal); setError(''); setShowForm(true); }}>Edit</button>{!deal.stage.startsWith('Closed') && <button className="text-link danger-text" onClick={() => setLostDeal(deal)}>Close lost</button>}</div><div className="stage-arrows"><button aria-label="Move to previous stage" disabled={index === 0 || deal.stage.startsWith('Closed')} onClick={() => requestMove(deal, -1)}><ArrowLeft size={16} /></button><button aria-label="Move to next stage" disabled={index >= DEAL_STAGES.length - 1 || deal.stage.startsWith('Closed')} onClick={() => requestMove(deal, 1)}><ArrowRight size={16} /></button></div></div>{mobile && <button className="btn secondary small wide" disabled={deal.stage.startsWith('Closed')} onClick={() => requestMove(deal, 1)}><Plus size={15} />Advance one stage</button>}</article>;
  }
}
