'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Edit3, ListTodo } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { Empty, Modal, PageHeader, SearchBar, Status } from '@/components/UI';
import { useDemo } from '@/components/DemoProvider';
import { useToast } from '@/components/ToastProvider';
import { Task } from '@/lib/types';
import { isOverdue, localDate, todayInput, uid } from '@/lib/format';

const statuses: Task['status'][] = ['Not started', 'In progress', 'Waiting', 'Completed', 'Cancelled'];

export default function TasksModule() {
  const { state, updateState } = useDemo();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<'All' | Task['status']>('All');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const list = useMemo(() => {
    const query = search.trim().toLowerCase();
    return state.tasks.filter((task) => {
      const text = [task.title, employeeName(task.assigneeId), employeeName(task.assignedById), relatedName(task), task.notes, task.priority, task.status].join(' ').toLowerCase();
      return (filter === 'All' || task.status === filter) && (!query || text.includes(query));
    }).sort((a, b) => `${a.dueDate}T${a.dueTime || '23:59'}`.localeCompare(`${b.dueDate}T${b.dueTime || '23:59'}`));
  }, [filter, search, state.tasks]);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const status = String(form.get('status') || 'Not started') as Task['status'];
    const record: Task = {
      id: editing?.id || uid('task'),
      title: String(form.get('title') || '').trim(),
      assigneeId: String(form.get('assigneeId') || ''),
      assignedById: editing?.assignedById || state.employees[0]?.id || '',
      dueDate: String(form.get('dueDate') || ''),
      dueTime: String(form.get('dueTime') || ''),
      priority: String(form.get('priority') || 'Normal') as Task['priority'],
      status,
      relatedType: String(form.get('relatedType') || 'General') as Task['relatedType'],
      relatedId: String(form.get('relatedId') || ''),
      notes: String(form.get('notes') || '').trim(),
      reminder: form.get('reminder') === 'on',
      completedAt: status === 'Completed' ? editing?.completedAt || new Date().toISOString() : '',
    };
    updateState((current) => ({ ...current, tasks: editing ? current.tasks.map((task) => task.id === editing.id ? record : task) : [record, ...current.tasks] }));
    setModalOpen(false); showToast(editing ? 'Task updated.' : 'Task created.');
  }

  function updateStatus(task: Task, status: Task['status']) {
    updateState((current) => ({ ...current, tasks: current.tasks.map((item) => item.id === task.id ? { ...item, status, completedAt: status === 'Completed' ? new Date().toISOString() : '' } : item) }));
    showToast(`Task marked ${status.toLowerCase()}.`);
  }

  return (
    <AppShell>
      <PageHeader title="Tasks" subtitle="Assigned work, follow-ups, deadlines, priorities, and reminder simulation" action="New Task" onAction={() => { setEditing(null); setModalOpen(true); }} />
      <div className="toolbar"><SearchBar value={search} onChange={setSearch} placeholder="Search task, person, linked record, status, or notes" /></div>
      <div className="task-tabs">{(['All', ...statuses] as const).map((status) => <button className={filter === status ? 'active' : ''} onClick={() => setFilter(status)} key={status}>{status}<span>{status === 'All' ? state.tasks.length : state.tasks.filter((task) => task.status === status).length}</span></button>)}</div>
      <div className="task-board"><div className="task-list-head"><span>Task</span><span>Assigned to</span><span>Due</span><span>Priority</span><span>Status</span><span aria-label="Actions" /></div>{list.map((task) => <TaskRow key={task.id} task={task} />)}{!list.length && <Empty title="No tasks found" body="Change the filter or create a task." />}</div>

      {modalOpen && <Modal title={editing ? 'Edit Task' : 'Create Task'} onClose={() => setModalOpen(false)} wide><form onSubmit={save} key={editing?.id || 'new-task'}><div className="form-grid"><label className="span-2">Task title *<input name="title" defaultValue={editing?.title} required /></label><label>Assign to *<select name="assigneeId" defaultValue={editing?.assigneeId || state.employees[0]?.id}>{state.employees.filter((employee) => employee.status === 'Active').map((employee) => <option value={employee.id} key={employee.id}>{employee.name} — {employee.title}</option>)}</select></label><label>Priority<select name="priority" defaultValue={editing?.priority || 'Normal'}><option>Normal</option><option>Low</option><option>High</option><option>Urgent</option></select></label><label>Due date *<input name="dueDate" type="date" min={editing ? undefined : todayInput()} defaultValue={editing?.dueDate} required /></label><label>Due time<input name="dueTime" type="time" step="900" defaultValue={editing?.dueTime} /></label><label>Status<select name="status" defaultValue={editing?.status || 'Not started'}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label><label>Related record type<select name="relatedType" defaultValue={editing?.relatedType || 'General'}><option>General</option><option>Contact</option><option>Property</option><option>Deal</option></select></label><label className="span-2">Related record<select name="relatedId" defaultValue={editing?.relatedId || ''}><option value="">No linked record</option><optgroup label="Contacts">{state.contacts.map((contact) => <option value={contact.id} key={contact.id}>{contact.name}</option>)}</optgroup><optgroup label="Properties">{state.properties.map((property) => <option value={property.id} key={property.id}>{property.reference} — {property.title}</option>)}</optgroup><optgroup label="Deals">{state.deals.map((deal) => <option value={deal.id} key={deal.id}>{contactName(deal.contactId)} — {propertyName(deal.propertyId)}</option>)}</optgroup></select></label><label className="span-2">Notes<textarea name="notes" rows={3} defaultValue={editing?.notes} /></label><label className="span-2 check-line"><input name="reminder" type="checkbox" defaultChecked={editing?.reminder ?? true} />Simulate an in-app reminder 30 minutes before</label></div><div className="modal-actions"><button type="button" className="btn ghost" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn">{editing ? 'Save Changes' : 'Create Task'}</button></div></form></Modal>}
    </AppShell>
  );

  function employeeName(id: string) { return state.employees.find((employee) => employee.id === id)?.name || 'Unknown employee'; }
  function contactName(id: string) { return state.contacts.find((contact) => contact.id === id)?.name || 'Unknown contact'; }
  function propertyName(id: string) { return state.properties.find((property) => property.id === id)?.title || 'Unknown property'; }
  function relatedName(task: Task) {
    if (!task.relatedId) return 'No linked record';
    if (task.relatedType === 'Contact') return contactName(task.relatedId);
    if (task.relatedType === 'Property') return propertyName(task.relatedId);
    if (task.relatedType === 'Deal') { const deal = state.deals.find((item) => item.id === task.relatedId); return deal ? `${contactName(deal.contactId)} · ${propertyName(deal.propertyId)}` : 'Unknown deal'; }
    return 'General';
  }

  function TaskRow({ task }: { task: Task }) {
    const overdue = !['Completed', 'Cancelled'].includes(task.status) && isOverdue(task.dueDate, task.dueTime || '23:59');
    return <article className={`task-row ${overdue ? 'overdue' : ''}`}><div data-label="Task"><strong>{task.title}</strong><small>{relatedName(task)}</small><small>Assigned by {employeeName(task.assignedById)}</small></div><span data-label="Assigned to">{employeeName(task.assigneeId)}</span><span data-label="Due">{localDate(task.dueDate)}<small>{task.dueTime || 'No time'}{overdue ? ' · Overdue' : ''}</small></span><span data-label="Priority"><Status tone={task.priority === 'Urgent' ? 'bad' : task.priority === 'High' ? 'warn' : task.priority === 'Low' ? 'neutral' : 'info'}>{task.priority}</Status></span><span data-label="Status"><select value={task.status} onChange={(event) => updateStatus(task, event.target.value as Task['status'])}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></span><span className="task-actions"><button className="icon-btn bordered" aria-label={`Edit ${task.title}`} onClick={() => { setEditing(task); setModalOpen(true); }}><Edit3 size={16} /></button></span></article>;
  }
}
