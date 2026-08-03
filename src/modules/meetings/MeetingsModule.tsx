'use client';

import { FormEvent, useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Edit3, MapPin, MessageCircle, Video } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { Empty, Modal, PageHeader, Status } from '@/components/UI';
import { useDemo } from '@/components/DemoProvider';
import { useToast } from '@/components/ToastProvider';
import { Meeting } from '@/lib/types';
import { dateInputFrom, localDate, localDateTimeInput, todayInput, uid } from '@/lib/format';

const meetingTypes = ['Property viewing', 'Office meeting', 'Owner meeting', 'Contract signing', 'Follow-up', 'Valuation visit', 'Other'];
const times = Array.from({ length: 65 }, (_, index) => {
  const total = 7 * 60 + index * 15;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
});

function startOfWeek(value: Date) {
  const date = new Date(value);
  const day = date.getDay();
  const difference = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + difference);
  date.setHours(12, 0, 0, 0);
  return date;
}

function dateKey(value: Date) { return dateInputFrom(value); }
function addDays(value: Date, days: number) { const date = new Date(value); date.setDate(date.getDate() + days); return date; }
function minutes(value: string) { const [hour, minute] = value.split(':').map(Number); return hour * 60 + minute; }
function formatTime(value: string) { return new Date(`2000-01-01T${value}:00`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); }

export default function MeetingsModule() {
  const { state, updateState } = useDemo();
  const { showToast } = useToast();
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Meeting | null>(null);
  const [cancelMeeting, setCancelMeeting] = useState<Meeting | null>(null);
  const [error, setError] = useState('');
  const [locationType, setLocationType] = useState<Meeting['locationType']>('Property');
  const [newDate, setNewDate] = useState(todayInput());

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)), [weekStart]);
  const activeMeetings = useMemo(() => state.meetings.filter((meeting) => meeting.status !== 'Cancelled').slice().sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)), [state.meetings]);
  const upcoming = activeMeetings.filter((meeting) => `${meeting.date}T${meeting.time}` >= localDateTimeInput()).slice(0, 8);

  function openNew(date = todayInput()) { setEditing(null); setError(''); setLocationType('Property'); setNewDate(date); setModalOpen(true); }
  function openEdit(meeting: Meeting) { setEditing(meeting); setError(''); setLocationType(meeting.locationType); setModalOpen(true); }

  function hasConflict(candidate: Meeting) {
    const start = minutes(candidate.time);
    const end = start + candidate.duration;
    return state.meetings.find((meeting) => {
      if (meeting.id === candidate.id || meeting.status === 'Cancelled' || meeting.date !== candidate.date) return false;
      const otherStart = minutes(meeting.time);
      const otherEnd = otherStart + meeting.duration;
      const overlaps = start < otherEnd && end > otherStart;
      return overlaps && (meeting.agentId === candidate.agentId || (candidate.propertyId && meeting.propertyId === candidate.propertyId));
    });
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    const candidate: Meeting = {
      id: editing?.id || uid('meeting'),
      contactId: String(form.get('contactId') || ''),
      propertyId: String(form.get('propertyId') || ''),
      type: String(form.get('type') || ''),
      agentId: String(form.get('agentId') || ''),
      date: String(form.get('date') || ''),
      time: String(form.get('time') || ''),
      duration: Number(form.get('duration') || 45),
      locationType,
      location: String(form.get('location') || '').trim(),
      reminder: form.get('reminder') === 'on',
      notes: String(form.get('notes') || '').trim(),
      status: editing?.status || 'Scheduled',
      cancelReason: editing?.cancelReason || '',
    };
    if (`${candidate.date}T${candidate.time}` < localDateTimeInput() && !editing) { setError('New meetings must be scheduled for a future date and time.'); return; }
    const conflict = hasConflict(candidate);
    if (conflict) { setError(`Conflict detected with ${contactName(conflict.contactId)} at ${formatTime(conflict.time)}. The same ${conflict.agentId === candidate.agentId ? 'agent' : 'property'} is already booked.`); return; }
    updateState((current) => ({ ...current, meetings: editing ? current.meetings.map((meeting) => meeting.id === editing.id ? candidate : meeting) : [...current.meetings, candidate] }));
    setModalOpen(false); showToast(editing ? 'Meeting updated.' : 'Meeting scheduled.');
  }

  function confirmCancel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cancelMeeting) return;
    const reason = String(new FormData(event.currentTarget).get('reason') || '').trim();
    if (!reason) return;
    updateState((current) => ({ ...current, meetings: current.meetings.map((meeting) => meeting.id === cancelMeeting.id ? { ...meeting, status: 'Cancelled', cancelReason: reason } : meeting) }));
    setCancelMeeting(null); showToast('Meeting cancelled and reason recorded.', 'info');
  }

  function updateStatus(meeting: Meeting, status: Meeting['status']) {
    updateState((current) => ({ ...current, meetings: current.meetings.map((item) => item.id === meeting.id ? { ...item, status } : item) }));
    showToast(`Meeting marked ${status.toLowerCase()}.`);
  }

  return (
    <AppShell>
      <PageHeader title="Meetings" subtitle="Conflict-aware scheduling for viewings, office meetings, online calls, and follow-ups" action="Schedule Meeting" onAction={() => openNew()} />
      <div className="calendar-toolbar"><div><button className="icon-btn bordered" aria-label="Previous week" onClick={() => setWeekStart(addDays(weekStart, -7))}><ChevronLeft /></button><button className="btn secondary" onClick={() => setWeekStart(startOfWeek(new Date()))}>Current week</button><button className="icon-btn bordered" aria-label="Next week" onClick={() => setWeekStart(addDays(weekStart, 7))}><ChevronRight /></button></div><strong>{weekStart.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} – {addDays(weekStart, 6).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</strong></div>
      <section className="week-calendar desktop-calendar">{weekDays.map((day) => { const key = dateKey(day); const meetings = activeMeetings.filter((meeting) => meeting.date === key); return <div className={`calendar-day ${key === todayInput() ? 'today' : ''}`} key={key}><button className="calendar-day-head" onClick={() => openNew(key)}><span>{day.toLocaleDateString('en-US', { weekday: 'short' })}</span><strong>{day.getDate()}</strong></button><div className="calendar-day-body">{meetings.map((meeting) => <button className={`calendar-event ${meeting.locationType.toLowerCase()}`} key={meeting.id} onClick={() => openEdit(meeting)}><strong>{formatTime(meeting.time)}</strong><span>{contactName(meeting.contactId)}</span><small>{meeting.type}</small></button>)}{!meetings.length && <button className="calendar-empty-slot" onClick={() => openNew(key)}>+ Add meeting</button>}</div></div>; })}</section>

      <section className="upcoming-section"><div className="section-head"><div><h2>Upcoming meetings</h2><p>Chronological agenda with status, location, reminder, and actions.</p></div></div>{upcoming.length ? <div className="meeting-list">{upcoming.map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} />)}</div> : <div className="panel"><Empty title="No upcoming meetings" body="Schedule a meeting to add it to the agenda." /></div>}</section>

      {modalOpen && <Modal title={editing ? 'Edit Meeting' : 'Schedule Meeting'} onClose={() => setModalOpen(false)} wide>
        <form onSubmit={save} key={editing?.id || 'new-meeting'}>{error && <div className="error-box">{error}</div>}<div className="form-grid top-gap"><label>Contact *<select name="contactId" defaultValue={editing?.contactId} required>{state.contacts.filter((contact) => contact.status === 'Active').map((contact) => <option value={contact.id} key={contact.id}>{contact.name}</option>)}</select></label><label>Property<select name="propertyId" defaultValue={editing?.propertyId}><option value="">No linked property</option>{state.properties.filter((property) => ['Available', 'Reserved'].includes(property.status) || property.id === editing?.propertyId).map((property) => <option value={property.id} key={property.id}>{property.reference} — {property.title}</option>)}</select></label><label>Meeting type<select name="type" defaultValue={editing?.type || 'Property viewing'}>{meetingTypes.map((type) => <option key={type}>{type}</option>)}</select></label><label>Assigned agent *<select name="agentId" defaultValue={editing?.agentId || state.employees[0]?.id}>{state.employees.filter((employee) => employee.status === 'Active').map((employee) => <option value={employee.id} key={employee.id}>{employee.name}</option>)}</select></label><label>Date *<input name="date" type="date" min={editing ? undefined : todayInput()} defaultValue={editing?.date || newDate} required /></label><label>Start time *<select name="time" defaultValue={editing?.time || '09:00'}>{times.map((time) => <option value={time} key={time}>{formatTime(time)}</option>)}</select></label><label>Duration<select name="duration" defaultValue={editing?.duration || 45}>{[15, 30, 45, 60, 90, 120].map((duration) => <option value={duration} key={duration}>{duration} minutes</option>)}</select></label><label>Location type<select value={locationType} onChange={(event) => setLocationType(event.target.value as Meeting['locationType'])}><option>Office</option><option>Property</option><option>Online</option><option>Other</option></select></label><label className="span-2">{locationType === 'Online' ? 'Meeting link' : locationType === 'Office' ? 'Office / room' : locationType === 'Property' ? 'Meeting point' : 'Location details'} *<input name="location" defaultValue={editing?.location} required /></label><label className="span-2 check-line"><input name="reminder" type="checkbox" defaultChecked={editing?.reminder ?? true} />Simulate an in-app and WhatsApp reminder 30 minutes before</label><label className="span-2">Notes<textarea name="notes" rows={3} defaultValue={editing?.notes} /></label></div><div className="modal-actions"><button type="button" className="btn ghost" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn">{editing ? 'Save Changes' : 'Schedule Meeting'}</button></div></form>
      </Modal>}

      {cancelMeeting && <Modal title="Cancel meeting" onClose={() => setCancelMeeting(null)}><form onSubmit={confirmCancel}><p className="modal-copy">The cancellation reason is retained in the frontend record and will later be part of the audit history.</p><label>Cancellation reason *<textarea name="reason" rows={4} required /></label><div className="modal-actions"><button type="button" className="btn ghost" onClick={() => setCancelMeeting(null)}>Keep meeting</button><button className="btn danger">Cancel Meeting</button></div></form></Modal>}
    </AppShell>
  );

  function contactName(id: string) { return state.contacts.find((contact) => contact.id === id)?.name || 'Unknown contact'; }
  function propertyName(id: string) { return id ? state.properties.find((property) => property.id === id)?.title || 'Unknown property' : 'No linked property'; }
  function employeeName(id: string) { return state.employees.find((employee) => employee.id === id)?.name || 'Unassigned'; }

  function MeetingCard({ meeting }: { meeting: Meeting }) {
    const LocationIcon = meeting.locationType === 'Online' ? Video : MapPin;
    return <article className="meeting-card"><div className="date-tile"><strong>{new Date(`${meeting.date}T12:00:00`).getDate()}</strong><span>{new Date(`${meeting.date}T12:00:00`).toLocaleDateString('en-US', { month: 'short' })}</span></div><div className="meeting-main"><div className="meeting-title-row"><small>{meeting.type}</small><Status tone={meeting.status === 'Scheduled' ? 'info' : meeting.status === 'Completed' ? 'good' : meeting.status === 'No-show' ? 'bad' : 'neutral'}>{meeting.status}</Status></div><h3>{contactName(meeting.contactId)}</h3><p>{propertyName(meeting.propertyId)}</p><div className="meeting-meta"><span><Clock3 size={15} />{formatTime(meeting.time)} · {meeting.duration} min</span><span><LocationIcon size={15} />{meeting.locationType}: {meeting.location}</span><span><MessageCircle size={15} />{meeting.reminder ? 'Reminder on' : 'Reminder off'}</span></div>{meeting.notes && <p className="meeting-notes">{meeting.notes}</p>}</div><div className="meeting-actions"><span>{employeeName(meeting.agentId)}</span><button className="btn secondary small" onClick={() => openEdit(meeting)}><Edit3 size={15} />Edit</button><select aria-label={`Update status for ${contactName(meeting.contactId)}`} value={meeting.status} onChange={(event) => { const status = event.target.value as Meeting['status']; if (status === 'Cancelled') setCancelMeeting(meeting); else updateStatus(meeting, status); }}><option>Scheduled</option><option>Completed</option><option>No-show</option><option>Cancelled</option></select></div></article>;
  }
}
