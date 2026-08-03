'use client';

import Link from 'next/link';
import { AlertTriangle, CalendarDays, CheckCircle2, Clock3, FileText, Handshake, Home, ListTodo, UsersRound } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { PageHeader, Status } from '@/components/UI';
import { useDemo } from '@/components/DemoProvider';
import { dateInputFrom, isOverdue, localDate, localDateTimeInput, money, todayInput } from '@/lib/format';

export default function Page() {
  const { state, activeBranchId } = useDemo();
  const activeContacts = state.contacts.filter((contact) => contact.status === 'Active').length;
  const branchProperties = state.properties.filter((property) => property.branchId === activeBranchId);
  const branchPropertyIds = new Set(branchProperties.map((property) => property.id));
  const availableProperties = branchProperties.filter((property) => property.status === 'Available').length;
  const openDeals = state.deals.filter((deal) => !deal.stage.startsWith('Closed') && branchPropertyIds.has(deal.propertyId));
  const todayMeetings = state.meetings.filter((meeting) => meeting.date === todayInput() && meeting.status === 'Scheduled' && (!meeting.propertyId || branchPropertyIds.has(meeting.propertyId)));
  const overdueTasks = state.tasks.filter((task) => !['Completed', 'Cancelled'].includes(task.status) && isOverdue(task.dueDate, task.dueTime || '23:59'));
  const expiringReservations = branchProperties.filter((property) => property.reservation && property.reservation.to <= addDays(3));
  const upcomingMeetings = state.meetings.filter((meeting) => meeting.status === 'Scheduled' && (!meeting.propertyId || branchPropertyIds.has(meeting.propertyId)) && `${meeting.date}T${meeting.time}` >= localDateTimeInput()).sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)).slice(0, 4);
  const activeValue = openDeals.filter((deal) => deal.currency === state.company.defaultCurrency).reduce((sum, deal) => sum + deal.valueTo, 0);

  return (
    <AppShell>
      <PageHeader title="Company Overview" subtitle={`${state.branches.find((branch) => branch.id === activeBranchId)?.name || 'Main branch'} · Live from the shared frontend demo data`} />
      <div className="metrics">
        <article><span><UsersRound size={18} />Active contacts</span><strong>{activeContacts}</strong><small>{state.contacts.length} total records</small></article>
        <article><span><Home size={18} />Available properties</span><strong>{availableProperties}</strong><small>{branchProperties.filter((property) => property.status === 'Reserved').length} currently reserved</small></article>
        <article><span><Handshake size={18} />Open deals</span><strong>{openDeals.length}</strong><small>{money(activeValue, state.company.defaultCurrency)} maximum pipeline value</small></article>
        <article><span><CalendarDays size={18} />Meetings today</span><strong>{todayMeetings.length}</strong><small>{upcomingMeetings[0] ? `Next ${localDate(upcomingMeetings[0].date)} at ${formatTime(upcomingMeetings[0].time)}` : 'No upcoming meetings'}</small></article>
      </div>

      <div className="attention-grid">
        <Link href="/tasks" className={`attention-card ${overdueTasks.length ? 'danger' : 'good'}`}><span>{overdueTasks.length ? <AlertTriangle /> : <CheckCircle2 />}</span><div><strong>{overdueTasks.length} overdue task{overdueTasks.length === 1 ? '' : 's'}</strong><small>{overdueTasks.length ? 'Requires immediate follow-up' : 'No overdue work'}</small></div></Link>
        <Link href="/properties" className={`attention-card ${expiringReservations.length ? 'warn' : 'good'}`}><span><Clock3 /></span><div><strong>{expiringReservations.length} reservation{expiringReservations.length === 1 ? '' : 's'} expiring soon</strong><small>Within the next three days</small></div></Link>
        <Link href="/contracts" className="attention-card"><span><FileText /></span><div><strong>Contract builder ready</strong><small>Dynamic variables, approved clauses, Word, and PDF</small></div></Link>
      </div>

      <div className="dash-grid">
        <section className="panel dashboard-panel"><div className="section-head"><div><h2>Upcoming meetings</h2><p>What the team needs to prepare next.</p></div><Link href="/meetings" className="text-link">View calendar</Link></div>{upcomingMeetings.map((meeting) => <div className="dash-row" key={meeting.id}><div><strong>{contactName(meeting.contactId)}</strong><p>{propertyName(meeting.propertyId)} · {localDate(meeting.date)} at {formatTime(meeting.time)}</p></div><Status tone="info">{meeting.type}</Status></div>)}{!upcomingMeetings.length && <p className="muted-copy">No upcoming meetings.</p>}</section>
        <section className="panel dashboard-panel"><div className="section-head"><div><h2>Deals requiring action</h2><p>Open deals ordered by expected close date.</p></div><Link href="/deals" className="text-link">Open pipeline</Link></div>{openDeals.slice().sort((a, b) => a.expectedClose.localeCompare(b.expectedClose)).slice(0, 4).map((deal) => <div className="dash-row" key={deal.id}><div><strong>{contactName(deal.contactId)} — {propertyName(deal.propertyId)}</strong><p>{deal.nextAction || 'No next action recorded'} · Close {localDate(deal.expectedClose)}</p></div><Status tone={deal.stage === 'Reservation' ? 'warn' : 'info'}>{deal.stage}</Status></div>)}</section>
      </div>

      <section className="panel dashboard-panel top-gap"><div className="section-head"><div><h2>Frontend readiness</h2><p>The demo intentionally shows what is complete now and what belongs to the backend phase.</p></div></div><div className="readiness-grid"><div><CheckCircle2 /><strong>Shared local data</strong><span>Records remain after refresh and update linked dashboards.</span></div><div><CheckCircle2 /><strong>Responsive workflows</strong><span>Desktop and mobile experiences are designed separately where needed.</span></div><div><CheckCircle2 /><strong>Real file exports</strong><span>Contracts export to DOCX/PDF; employees and properties export to XLSX.</span></div><div><ListTodo /><strong>Backend phase later</strong><span>Authentication, permanent database, WhatsApp, approvals, finance, and audit enforcement.</span></div></div></section>
    </AppShell>
  );

  function contactName(id: string) { return state.contacts.find((contact) => contact.id === id)?.name || 'Unknown contact'; }
  function propertyName(id: string) { return state.properties.find((property) => property.id === id)?.title || 'No property'; }
}

function addDays(days: number) { const date = new Date(); date.setDate(date.getDate() + days); return dateInputFrom(date); }
function formatTime(value: string) { return new Date(`2000-01-01T${value}:00`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); }
