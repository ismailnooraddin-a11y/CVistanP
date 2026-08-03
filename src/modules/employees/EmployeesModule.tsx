'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Edit3, Eye, FileSpreadsheet, Mail, Phone, UserRoundCog } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { Empty, FilterButton, Modal, PageHeader, SearchBar, Status } from '@/components/UI';
import { useDemo } from '@/components/DemoProvider';
import { useToast } from '@/components/ToastProvider';
import { Employee } from '@/lib/types';
import { exportXlsx } from '@/lib/xlsx';
import { localDate, todayInput, uid } from '@/lib/format';

export default function EmployeesModule() {
  const { state, updateState } = useDemo();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [viewing, setViewing] = useState<Employee | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return state.employees.filter((employee) => {
      const text = [employee.employeeNumber, employee.name, employee.title, employee.phone, employee.email, branchName(employee.branchId), teamName(employee.teamId), managerName(employee.managerId)].join(' ').toLowerCase();
      return (!query || text.includes(query)) && (statusFilter === 'All' || employee.status === statusFilter) && (branchFilter === 'All' || employee.branchId === branchFilter);
    });
  }, [branchFilter, search, state.employees, statusFilter]);

  function nextNumber() {
    const max = state.employees.reduce((highest, employee) => Math.max(highest, Number(employee.employeeNumber.match(/(\d+)$/)?.[1] || 0)), 0);
    return `EF-${String(max + 1).padStart(3, '0')}`;
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || '').trim().toLowerCase();
    const phone = String(form.get('phone') || '').trim();
    const managerId = String(form.get('managerId') || '');
    const duplicate = state.employees.find((employee) => employee.id !== editing?.id && (employee.email.toLowerCase() === email || employee.phone === phone));
    if (duplicate) { setError(`The email or phone is already assigned to ${duplicate.name}.`); return; }
    if (managerId && managerId === editing?.id) { setError('An employee cannot be their own line manager.'); return; }
    const record: Employee = {
      id: editing?.id || uid('emp'),
      employeeNumber: editing?.employeeNumber || nextNumber(),
      name: String(form.get('name') || '').trim(),
      title: String(form.get('title') || '').trim(),
      teamId: String(form.get('teamId') || ''),
      branchId: String(form.get('branchId') || ''),
      managerId: managerId || undefined,
      contractType: String(form.get('contractType') || 'Permanent') as Employee['contractType'],
      status: String(form.get('status') || 'Active') as Employee['status'],
      startDate: String(form.get('startDate') || ''),
      phone,
      email,
      annualLeave: Number(form.get('annualLeave') || 0),
      sickLeave: Number(form.get('sickLeave') || 0),
      documentsComplete: form.get('documentsComplete') === 'on',
    };
    updateState((current) => ({ ...current, employees: editing ? current.employees.map((employee) => employee.id === editing.id ? record : employee) : [record, ...current.employees] }));
    setModalOpen(false); showToast(editing ? 'Employee updated.' : 'Employee added.');
  }

  function doExport(scope: 'filtered' | 'all' | 'selected') {
    const rows = scope === 'all' ? state.employees : scope === 'selected' ? state.employees.filter((employee) => selected.has(employee.id)) : filtered;
    if (!rows.length) { showToast('There are no employee records in the selected export scope.', 'error'); return; }
    exportXlsx(`EstateFlow-Employees-${todayInput()}`, state.company.legalName, [
      { name: 'Employees', headers: ['Employee ID', 'Full Name', 'Job Title', 'Team', 'Branch', 'Line Manager', 'Contract Type', 'Employment Status', 'Start Date', 'Phone', 'Email', 'Documents Complete'], rows: rows.map((employee) => [employee.employeeNumber, employee.name, employee.title, teamName(employee.teamId), branchName(employee.branchId), managerName(employee.managerId), employee.contractType, employee.status, employee.startDate, employee.phone, employee.email, employee.documentsComplete ? 'Yes' : 'No']) },
      { name: 'Leave Balances', headers: ['Employee ID', 'Full Name', 'Annual Leave Days', 'Sick Leave Days', 'Employment Status'], rows: rows.map((employee) => [employee.employeeNumber, employee.name, employee.annualLeave, employee.sickLeave, employee.status]) },
    ]);
    setExportOpen(false); showToast(`${rows.length} employee record${rows.length === 1 ? '' : 's'} exported to Excel.`);
  }

  function toggleSelected(id: string) { setSelected((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; }); }

  return (
    <AppShell>
      <PageHeader title="Employees" subtitle="Organization structure, employment details, reporting lines, and permitted HR export" action="Add Employee" onAction={() => { setEditing(null); setError(''); setModalOpen(true); }} secondaryAction="Export Excel" onSecondaryAction={() => setExportOpen(true)} />
      <div className="toolbar"><SearchBar value={search} onChange={setSearch} placeholder="Search employee, title, team, branch, phone, or email" /><FilterButton open={filtersOpen} onClick={() => setFiltersOpen((open) => !open)} /></div>
      {filtersOpen && <div className="filters"><label>Status<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All</option><option>Active</option><option>On hold</option><option>Inactive</option></select></label><label>Branch<select value={branchFilter} onChange={(event) => setBranchFilter(event.target.value)}><option value="All">All</option>{state.branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></label><button className="btn ghost filter-reset" onClick={() => { setStatusFilter('All'); setBranchFilter('All'); setSearch(''); }}>Clear filters</button></div>}
      <div className="selection-strip"><label className="check-line"><input type="checkbox" checked={filtered.length > 0 && filtered.every((employee) => selected.has(employee.id))} onChange={(event) => setSelected(event.target.checked ? new Set([...selected, ...filtered.map((employee) => employee.id)]) : new Set([...selected].filter((id) => !filtered.some((employee) => employee.id === id))))} />Select filtered employees</label><span>{selected.size} selected</span>{selected.size > 0 && <button className="text-link" onClick={() => setSelected(new Set())}>Clear selection</button>}</div>
      <div className="table-wrap employees-desktop">{filtered.length ? <table className="data-table employee-table"><thead><tr><th aria-label="Select" /><th>Employee</th><th>Role / Team</th><th>Branch / Manager</th><th>Contract</th><th>Leave</th><th>Status</th><th aria-label="Actions" /></tr></thead><tbody>{filtered.map((employee) => <tr key={employee.id}><td><input type="checkbox" aria-label={`Select ${employee.name}`} checked={selected.has(employee.id)} onChange={() => toggleSelected(employee.id)} /></td><td><button className="record-link" onClick={() => setViewing(employee)}>{employee.name}</button><small>{employee.employeeNumber}<br />{employee.email}</small></td><td>{employee.title}<small>{teamName(employee.teamId)}</small></td><td>{branchName(employee.branchId)}<small>Manager: {managerName(employee.managerId)}</small></td><td>{employee.contractType}<small>Started {localDate(employee.startDate)}</small></td><td>{employee.annualLeave} annual<small>{employee.sickLeave} sick</small></td><td><Status tone={employee.status === 'Active' ? 'good' : employee.status === 'On hold' ? 'warn' : 'bad'}>{employee.status}</Status><small>{employee.documentsComplete ? 'Documents complete' : 'Documents incomplete'}</small></td><td><button className="icon-btn row-action" aria-label={`Edit ${employee.name}`} onClick={() => { setEditing(employee); setError(''); setModalOpen(true); }}><Edit3 size={17} /></button></td></tr>)}</tbody></table> : <Empty title="No employees found" body="Change the filters or add a new employee." />}</div>
      <div className="mobile-record-list employees-mobile">{filtered.map((employee) => <article className={`mobile-record-card ${selected.has(employee.id) ? 'selected-card' : ''}`} key={employee.id}><div className="mobile-card-head"><label className="check-line"><input type="checkbox" checked={selected.has(employee.id)} onChange={() => toggleSelected(employee.id)} /><span><strong>{employee.name}</strong><small>{employee.employeeNumber}</small></span></label><Status tone={employee.status === 'Active' ? 'good' : employee.status === 'On hold' ? 'warn' : 'bad'}>{employee.status}</Status></div><div className="mobile-card-lines"><span><UserRoundCog size={15} />{employee.title} · {teamName(employee.teamId)}</span><span><Phone size={15} />{employee.phone}</span><span><Mail size={15} />{employee.email}</span><span>{branchName(employee.branchId)} · Manager: {managerName(employee.managerId)}</span></div><div className="mobile-card-actions"><button className="btn ghost small" onClick={() => setViewing(employee)}><Eye size={16} />View</button><button className="btn secondary small" onClick={() => { setEditing(employee); setError(''); setModalOpen(true); }}><Edit3 size={16} />Edit</button></div></article>)}{!filtered.length && <Empty title="No employees found" body="Change the filters or add a new employee." />}</div>

      {modalOpen && <Modal title={editing ? `Edit ${editing.name}` : 'Add Employee'} onClose={() => setModalOpen(false)} wide>
        <form onSubmit={save} key={editing?.id || 'new-employee'}>{error && <div className="error-box">{error}</div>}<div className="form-grid top-gap"><label>Full name *<input name="name" defaultValue={editing?.name} required /></label><label>Job title *<input name="title" defaultValue={editing?.title} required /></label><label>Branch *<select name="branchId" defaultValue={editing?.branchId || state.branches[0]?.id}>{state.branches.map((branch) => <option value={branch.id} key={branch.id}>{branch.name}</option>)}</select></label><label>Team *<select name="teamId" defaultValue={editing?.teamId || state.teams[0]?.id}>{state.teams.map((team) => <option value={team.id} key={team.id}>{team.name}</option>)}</select></label><label>Line manager<select name="managerId" defaultValue={editing?.managerId || ''}><option value="">No line manager</option>{state.employees.filter((employee) => employee.id !== editing?.id && employee.status === 'Active').map((employee) => <option value={employee.id} key={employee.id}>{employee.name} — {employee.title}</option>)}</select></label><label>Contract type<select name="contractType" defaultValue={editing?.contractType || 'Permanent'}><option>Permanent</option><option>Temporary</option><option>Part-time</option><option>Contractor</option></select></label><label>Status<select name="status" defaultValue={editing?.status || 'Active'}><option>Active</option><option>On hold</option><option>Inactive</option></select></label><label>Start date *<input name="startDate" type="date" max={todayInput()} defaultValue={editing?.startDate} required /></label><label>Phone *<input name="phone" defaultValue={editing?.phone} required /></label><label>Email *<input name="email" type="email" defaultValue={editing?.email} required /></label><label>Annual leave days<input name="annualLeave" type="number" min="0" step="0.5" defaultValue={editing?.annualLeave ?? 20} /></label><label>Sick leave days<input name="sickLeave" type="number" min="0" step="0.5" defaultValue={editing?.sickLeave ?? 10} /></label><label className="span-2 check-line"><input name="documentsComplete" type="checkbox" defaultChecked={editing?.documentsComplete} />Required employee documents are complete</label></div><div className="modal-actions"><button type="button" className="btn ghost" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn">{editing ? 'Save Changes' : 'Add Employee'}</button></div></form>
      </Modal>}

      {viewing && <Modal title={viewing.name} onClose={() => setViewing(null)} wide><div className="detail-summary"><Status tone={viewing.status === 'Active' ? 'good' : viewing.status === 'On hold' ? 'warn' : 'bad'}>{viewing.status}</Status><span>{viewing.employeeNumber}</span></div><div className="detail-grid"><Detail label="Job title" value={viewing.title} /><Detail label="Team" value={teamName(viewing.teamId)} /><Detail label="Branch" value={branchName(viewing.branchId)} /><Detail label="Line manager" value={managerName(viewing.managerId)} /><Detail label="Contract" value={viewing.contractType} /><Detail label="Start date" value={localDate(viewing.startDate)} /><Detail label="Phone" value={viewing.phone} /><Detail label="Email" value={viewing.email} /></div><section className="detail-section"><h3>Leave and documents</h3><div className="mini-stats"><span><strong>{viewing.annualLeave}</strong> annual days</span><span><strong>{viewing.sickLeave}</strong> sick days</span><span><strong>{viewing.documentsComplete ? 'Complete' : 'Incomplete'}</strong> documents</span></div></section><div className="modal-actions"><button className="btn" onClick={() => { setViewing(null); setEditing(viewing); setError(''); setModalOpen(true); }}><Edit3 size={16} />Edit Employee</button></div></Modal>}

      {exportOpen && <Modal title="Export Employees to Excel" onClose={() => setExportOpen(false)}><p className="modal-copy">Only users with HR or Super Admin permissions should receive full employee exports. The frontend demo generates Employees and Leave Balances sheets.</p><div className="export-options"><button onClick={() => doExport('filtered')}><FileSpreadsheet /><span><strong>Filtered results</strong><small>{filtered.length} current result{filtered.length === 1 ? '' : 's'}</small></span></button><button onClick={() => doExport('all')}><FileSpreadsheet /><span><strong>All permitted employees</strong><small>{state.employees.length} total record{state.employees.length === 1 ? '' : 's'}</small></span></button><button disabled={!selected.size} onClick={() => doExport('selected')}><FileSpreadsheet /><span><strong>Selected employees</strong><small>{selected.size || 'No'} selected record{selected.size === 1 ? '' : 's'}</small></span></button></div></Modal>}
    </AppShell>
  );

  function branchName(id: string) { return state.branches.find((branch) => branch.id === id)?.name || 'Unknown branch'; }
  function teamName(id: string) { return state.teams.find((team) => team.id === id)?.name || 'No team'; }
  function managerName(id?: string) { return id ? state.employees.find((employee) => employee.id === id)?.name || 'Unknown manager' : 'No manager'; }
}

function Detail({ label, value }: { label: string; value: string }) { return <div><small>{label}</small><strong>{value}</strong></div>; }
