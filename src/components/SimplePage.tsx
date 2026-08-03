'use client';

import { FormEvent, useState } from 'react';
import { Edit3, FileCheck2, GitBranch, UsersRound } from 'lucide-react';
import AppShell from './AppShell';
import { Modal, PageHeader, Status } from './UI';
import { useDemo } from './DemoProvider';
import { useToast } from './ToastProvider';
import { Branch, Team } from '@/lib/types';
import { uid } from '@/lib/format';

export default function SimplePage({ title, subtitle, kind }: { title: string; subtitle: string; kind: string }) {
  const { state, updateState } = useDemo();
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const action = kind === 'branches' ? 'New Branch' : kind === 'teams' ? 'New Team' : undefined;

  function saveBranch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const record: Branch = { id: editingBranch?.id || uid('branch'), name: String(form.get('name') || '').trim(), city: String(form.get('city') || '').trim(), address: String(form.get('address') || '').trim(), status: String(form.get('status') || 'Active') as Branch['status'] };
    updateState((current) => ({ ...current, branches: editingBranch ? current.branches.map((branch) => branch.id === editingBranch.id ? record : branch) : [...current.branches, record] }));
    setModalOpen(false); showToast(editingBranch ? 'Branch updated.' : 'Branch created.');
  }

  function saveTeam(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const record: Team = { id: editingTeam?.id || uid('team'), name: String(form.get('name') || '').trim(), branchId: String(form.get('branchId') || ''), managerId: String(form.get('managerId') || '') || undefined, status: String(form.get('status') || 'Active') as Team['status'] };
    updateState((current) => ({ ...current, teams: editingTeam ? current.teams.map((team) => team.id === editingTeam.id ? record : team) : [...current.teams, record] }));
    setModalOpen(false); showToast(editingTeam ? 'Team updated.' : 'Team created.');
  }

  return <AppShell><PageHeader title={title} subtitle={subtitle} action={action} onAction={() => { setEditingBranch(null); setEditingTeam(null); setModalOpen(true); }} />
    {kind === 'branches' && <div className="simple-grid">{state.branches.map((branch) => <article className="simple-card" key={branch.id}><div className="simple-card-icon"><GitBranch /></div><h3>{branch.name}</h3><p>{branch.address}</p><div className="simple-card-footer"><Status tone={branch.status === 'Active' ? 'good' : 'neutral'}>{branch.status}</Status><button className="icon-btn bordered" aria-label={`Edit ${branch.name}`} onClick={() => { setEditingBranch(branch); setModalOpen(true); }}><Edit3 size={16} /></button></div></article>)}</div>}
    {kind === 'teams' && <div className="simple-grid">{state.teams.map((team) => <article className="simple-card" key={team.id}><div className="simple-card-icon"><UsersRound /></div><h3>{team.name}</h3><p>{state.employees.filter((employee) => employee.teamId === team.id).length} members · {state.branches.find((branch) => branch.id === team.branchId)?.name}</p><div className="simple-card-footer"><Status tone={team.status === 'Active' ? 'good' : 'neutral'}>{team.status}</Status><button className="icon-btn bordered" aria-label={`Edit ${team.name}`} onClick={() => { setEditingTeam(team); setModalOpen(true); }}><Edit3 size={16} /></button></div></article>)}</div>}
    {kind === 'balances' && <div className="simple-grid">{state.employees.map((employee) => <article className="simple-card" key={employee.id}><h3>{employee.name}</h3><p>{employee.title}</p><div className="mini-stats vertical"><span><strong>{employee.annualLeave}</strong> annual leave days</span><span><strong>{employee.sickLeave}</strong> sick leave days</span></div></article>)}</div>}
    {kind === 'requests' && <div className="panel demo-list"><div className="notice">Leave approval is demonstrated visually now. Persistent requests, calculated balances, and approver permissions will be connected in the backend phase.</div><div className="dash-row"><div><strong>Sara Karim</strong><p>Annual leave · Full day · 12 Aug 2026</p></div><Status tone="warn">Pending</Status></div><div className="dash-row"><div><strong>Roj Ahmed</strong><p>Sick leave · Half day · 30 Jul 2026</p></div><Status tone="good">Approved</Status></div></div>}
    {kind === 'documents' && <div className="simple-grid">{state.employees.map((employee) => <article className="simple-card" key={employee.id}><div className="simple-card-icon"><FileCheck2 /></div><h3>{employee.name}</h3><p>{employee.documentsComplete ? 'All required documents are recorded.' : 'One or more required documents are missing.'}</p><Status tone={employee.documentsComplete ? 'good' : 'warn'}>{employee.documentsComplete ? 'Complete' : 'Action required'}</Status></article>)}</div>}
    {modalOpen && kind === 'branches' && <Modal title={editingBranch ? 'Edit Branch' : 'New Branch'} onClose={() => setModalOpen(false)}><form onSubmit={saveBranch}><label>Branch name *<input name="name" defaultValue={editingBranch?.name} required /></label><label>City *<input name="city" defaultValue={editingBranch?.city || 'Erbil'} required /></label><label>Address *<textarea name="address" rows={3} defaultValue={editingBranch?.address} required /></label><label>Status<select name="status" defaultValue={editingBranch?.status || 'Active'}><option>Active</option><option>Inactive</option></select></label><div className="modal-actions"><button type="button" className="btn ghost" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn">Save Branch</button></div></form></Modal>}
    {modalOpen && kind === 'teams' && <Modal title={editingTeam ? 'Edit Team' : 'New Team'} onClose={() => setModalOpen(false)}><form onSubmit={saveTeam}><label>Team name *<input name="name" defaultValue={editingTeam?.name} required /></label><label>Branch<select name="branchId" defaultValue={editingTeam?.branchId || state.branches[0]?.id}>{state.branches.map((branch) => <option value={branch.id} key={branch.id}>{branch.name}</option>)}</select></label><label>Manager<select name="managerId" defaultValue={editingTeam?.managerId || ''}><option value="">No manager</option>{state.employees.filter((employee) => employee.status === 'Active').map((employee) => <option value={employee.id} key={employee.id}>{employee.name}</option>)}</select></label><label>Status<select name="status" defaultValue={editingTeam?.status || 'Active'}><option>Active</option><option>Inactive</option></select></label><div className="modal-actions"><button type="button" className="btn ghost" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn">Save Team</button></div></form></Modal>}
  </AppShell>;
}
