'use client';

import { useMemo, useState } from 'react';
import AppShell from '@/components/AppShell';
import { Modal, PageHeader, Status } from '@/components/UI';

type Meeting = {
  id: number;
  contact: string;
  property: string;
  agent: string;
  type: string;
  date: string;
  hour: string;
  minute: string;
  duration: number;
  locationType: string;
  location: string;
  reminder: boolean;
  status: string;
};

const seed: Meeting[] = [
  { id: 1, contact: 'Ari Hassan', property: 'Empire Pearl 2BR Apartment', agent: 'Self', type: 'Property viewing', date: '2026-07-29', hour: '09', minute: '30', duration: 45, locationType: 'Property', location: 'Empire Pearl', reminder: true, status: 'Scheduled' },
  { id: 2, contact: 'Lana Kareem', property: 'Commercial Shop on 100m Road', agent: 'Roj Ahmed', type: 'Owner meeting', date: '2026-07-30', hour: '11', minute: '00', duration: 60, locationType: 'Office', location: 'Empire Pearl Branch', reminder: true, status: 'Scheduled' },
  { id: 3, contact: 'Omar Salih', property: 'Dream City Villa 14', agent: 'Sara Karim', type: 'Follow-up', date: '2026-07-31', hour: '14', minute: '15', duration: 30, locationType: 'Online', location: 'Google Meet', reminder: false, status: 'Scheduled' },
  { id: 4, contact: 'Dilan Ahmed', property: 'Italian Village Townhouse', agent: 'Self', type: 'Property viewing', date: '2026-07-27', hour: '16', minute: '00', duration: 60, locationType: 'Property', location: 'Italian Village', reminder: true, status: 'Scheduled' },
  { id: 5, contact: 'Shaswar Ali', property: 'English Village House', agent: 'Roj Ahmed', type: 'Valuation visit', date: '2026-07-28', hour: '12', minute: '30', duration: 45, locationType: 'Property', location: 'English Village', reminder: true, status: 'Scheduled' },
  { id: 6, contact: 'Narin Mustafa', property: 'Empire World Office', agent: 'Sara Karim', type: 'Contract signing', date: '2026-07-29', hour: '15', minute: '00', duration: 60, locationType: 'Office', location: 'Dream City Branch', reminder: true, status: 'Scheduled' },
];

const hours = Array.from({ length: 17 }, (_, index) => String(index + 7).padStart(2, '0'));
const minutes = ['00', '15', '30', '45'];
const DAY_START = 7;
const SLOT_HEIGHT = 64;

function isoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function startOfWorkWeek(date: Date) {
  const value = new Date(date);
  const day = value.getDay();
  const distance = day === 0 ? -6 : 1 - day;
  value.setDate(value.getDate() + distance);
  value.setHours(0, 0, 0, 0);
  return value;
}

function addDays(date: Date, amount: number) {
  const value = new Date(date);
  value.setDate(value.getDate() + amount);
  return value;
}

function formatTime(hour: string, minute: string) {
  const value = Number(hour);
  const displayHour = value % 12 || 12;
  return `${displayHour}:${minute} ${value >= 12 ? 'PM' : 'AM'}`;
}

export default function MeetingsModule() {
  const [rows, setRows] = useState(seed);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<Meeting | null>(null);
  const [locationType, setLocationType] = useState('Office');
  const [weekStart, setWeekStart] = useState(() => startOfWorkWeek(new Date('2026-07-29T12:00:00')));

  const days = useMemo(() => Array.from({ length: 5 }, (_, index) => addDays(weekStart, index)), [weekStart]);
  const visibleMeetings = rows.filter((row) => days.some((day) => isoDate(day) === row.date));

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const row: Meeting = {
      id: editing?.id || Date.now(),
      contact: String(form.get('contact')),
      property: String(form.get('property')),
      agent: String(form.get('agent')),
      type: String(form.get('type')),
      date: String(form.get('date')),
      hour: String(form.get('hour')),
      minute: String(form.get('minute')),
      duration: Number(form.get('duration')),
      locationType: String(form.get('locationType')),
      location: String(form.get('location')),
      reminder: form.get('reminder') === 'on',
      status: editing?.status || 'Scheduled',
    };
    setRows(editing ? rows.map((item) => item.id === editing.id ? row : item) : [row, ...rows]);
    setShow(false);
    setEditing(null);
  }

  function cancelMeeting(id: number) {
    const reason = prompt('Reason for cancellation:');
    if (!reason) return;
    setRows(rows.map((row) => row.id === id ? { ...row, status: 'Cancelled' } : row));
  }

  function openEdit(row: Meeting) {
    setEditing(row);
    setLocationType(row.locationType);
    setShow(true);
  }

  function openNew(date?: string, hour = '09') {
    setEditing(null);
    setLocationType('Office');
    setShow(true);
    window.setTimeout(() => {
      const form = document.querySelector<HTMLFormElement>('.meeting-modal-form');
      const dateInput = form?.elements.namedItem('date') as HTMLInputElement | null;
      const hourInput = form?.elements.namedItem('hour') as HTMLSelectElement | null;
      if (dateInput && date) dateInput.value = date;
      if (hourInput) hourInput.value = hour;
    }, 0);
  }

  const weekLabel = `${days[0].toLocaleDateString('en', { month: 'short', day: 'numeric' })} - ${days[4].toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  return (
    <AppShell>
      <PageHeader title="Meetings" subtitle="Weekly calendar for viewings, client meetings and follow-ups" action="New Meeting" onAction={() => openNew()} />

      <section className="calendar-shell">
        <header className="calendar-toolbar">
          <button className="calendar-today" onClick={() => setWeekStart(startOfWorkWeek(new Date('2026-07-29T12:00:00')))}>Today</button>
          <button className="calendar-nav" aria-label="Previous week" onClick={() => setWeekStart(addDays(weekStart, -7))}>‹</button>
          <button className="calendar-nav" aria-label="Next week" onClick={() => setWeekStart(addDays(weekStart, 7))}>›</button>
          <strong>{weekLabel}</strong>
          <span className="calendar-hint">Click an empty time slot to schedule</span>
        </header>

        <div className="calendar-scroll">
          <div className="calendar-grid" style={{ '--slot-height': `${SLOT_HEIGHT}px` } as React.CSSProperties}>
            <div className="calendar-corner">Time</div>
            {days.map((day) => {
              const selected = isoDate(day) === '2026-07-29';
              return (
                <div className={`calendar-day-head${selected ? ' selected' : ''}`} key={isoDate(day)}>
                  <span>{day.toLocaleDateString('en', { weekday: 'short' })}</span>
                  <strong>{day.getDate()}</strong>
                </div>
              );
            })}

            <div className="calendar-time-column">
              {hours.map((hour) => <div className="calendar-time" key={hour}>{formatTime(hour, '00')}</div>)}
            </div>

            {days.map((day) => {
              const date = isoDate(day);
              const dayMeetings = visibleMeetings.filter((meeting) => meeting.date === date && meeting.status !== 'Cancelled');
              return (
                <div className="calendar-day-column" key={date}>
                  {hours.map((hour) => (
                    <button className="calendar-slot" key={hour} onClick={() => openNew(date, hour)} aria-label={`Schedule meeting on ${date} at ${hour}:00`} />
                  ))}
                  {dayMeetings.map((meeting) => {
                    const startMinutes = (Number(meeting.hour) - DAY_START) * 60 + Number(meeting.minute);
                    const top = (startMinutes / 60) * SLOT_HEIGHT;
                    const height = Math.max(34, (meeting.duration / 60) * SLOT_HEIGHT);
                    return (
                      <button
                        className={`calendar-event ${meeting.locationType.toLowerCase()}`}
                        key={meeting.id}
                        style={{ top, height }}
                        onClick={() => openEdit(meeting)}
                        title={`${meeting.contact} - ${meeting.property}`}
                      >
                        <strong>{formatTime(meeting.hour, meeting.minute)} · {meeting.contact}</strong>
                        <span>{meeting.type}</span>
                        {height > 48 && <small>{meeting.property}</small>}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="calendar-legend">
        <span><i className="legend-dot property" />Property</span>
        <span><i className="legend-dot office" />Office</span>
        <span><i className="legend-dot online" />Online</span>
        <span>WhatsApp reminder defaults to 30 minutes before and can be disabled.</span>
      </div>

      <section className="upcoming-meetings">
        <h2>Upcoming meetings</h2>
        <div className="meeting-list compact">
          {rows.filter((row) => row.status !== 'Cancelled').slice(0, 5).map((row) => (
            <article className="meeting-card" key={row.id}>
              <div className="date-tile"><strong>{new Date(`${row.date}T00:00:00`).toLocaleDateString('en', { day: '2-digit' })}</strong><span>{new Date(`${row.date}T00:00:00`).toLocaleDateString('en', { month: 'short' })}</span></div>
              <div><small>{row.type}</small><h3>{row.contact}</h3><p>{row.property}</p><p>{formatTime(row.hour, row.minute)} · {row.duration} minutes · {row.locationType}: {row.location}</p></div>
              <div className="meeting-actions"><Status tone="good">{row.status}</Status><small>{row.reminder ? 'WhatsApp reminder: 30 min before' : 'Reminder disabled'}</small><div><button className="text-link" onClick={() => openEdit(row)}>Edit</button><button className="text-danger" onClick={() => cancelMeeting(row.id)}>Cancel</button></div></div>
            </article>
          ))}
        </div>
      </section>

      {show && (
        <Modal title={editing ? 'Edit Meeting' : 'Schedule Meeting'} onClose={() => { setShow(false); setEditing(null); }} wide>
          <form className="meeting-modal-form" onSubmit={save}>
            <div className="form-grid">
              <label>Contact *<select name="contact" defaultValue={editing?.contact}><option>Ari Hassan</option><option>Lana Kareem</option><option>Omar Salih</option><option>Dilan Ahmed</option><option>Shaswar Ali</option><option>Narin Mustafa</option></select></label>
              <label>Property<select name="property" defaultValue={editing?.property}><option>Empire Pearl 2BR Apartment</option><option>Commercial Shop on 100m Road</option><option>Dream City Villa 14</option><option>Italian Village Townhouse</option><option>English Village House</option><option>Empire World Office</option></select></label>
              <label>Meeting type<select name="type" defaultValue={editing?.type}>{['Property viewing', 'Office meeting', 'Owner meeting', 'Contract signing', 'Follow-up', 'Valuation visit', 'Other'].map((value) => <option key={value}>{value}</option>)}</select></label>
              <label>Assigned agent<select name="agent" defaultValue={editing?.agent}><option>Self</option><option>Roj Ahmed</option><option>Sara Karim</option></select></label>
              <label>Date *<input name="date" type="date" min={new Date().toISOString().slice(0, 10)} defaultValue={editing?.date} required /></label>
              <label>Start time<div className="time-grid"><select name="hour" defaultValue={editing?.hour || '09'}>{hours.map((hour) => <option key={hour} value={hour}>{Number(hour) > 12 ? Number(hour) - 12 : Number(hour)} {Number(hour) >= 12 ? 'PM' : 'AM'}</option>)}</select><select name="minute" defaultValue={editing?.minute || '00'}>{minutes.map((minute) => <option key={minute}>{minute}</option>)}</select></div></label>
              <label>Duration<select name="duration" defaultValue={editing?.duration || 45}>{[15, 30, 45, 60, 90, 120].map((value) => <option key={value} value={value}>{value} minutes</option>)}</select></label>
              <label>Location type<select name="locationType" value={locationType} onChange={(event) => setLocationType(event.target.value)}><option>Office</option><option>Property</option><option>Online</option><option>Other</option></select></label>
              <label className="span-2">{locationType === 'Office' ? 'Office / branch' : locationType === 'Property' ? 'Property location' : locationType === 'Online' ? 'Meeting link' : 'Location details'}<input name="location" defaultValue={editing?.location} required /></label>
              <label className="span-2 check-line"><input name="reminder" type="checkbox" defaultChecked={editing?.reminder ?? true} />Send agent a WhatsApp reminder 30 minutes before</label>
              <label className="span-2">Notes<textarea rows={3} /></label>
            </div>
            <div className="modal-actions"><button type="button" className="btn ghost" onClick={() => setShow(false)}>Cancel</button><button className="btn">{editing ? 'Save Changes' : 'Schedule Meeting'}</button></div>
          </form>
        </Modal>
      )}
    </AppShell>
  );
}
