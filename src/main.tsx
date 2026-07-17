import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Building2, Users, Network, CalendarDays, ClipboardCheck, ShieldCheck,
  Search, Bell, ChevronDown, Plus, MapPin, Phone, Mail, Briefcase,
  UserRound, Clock3, CheckCircle2, XCircle, MoreHorizontal, Filter,
  Download, ChevronRight, Menu, X, Home, FileText, Settings, Palmtree,
  UserPlus, Eye, ArrowUpRight, CircleDollarSign
} from 'lucide-react';
import './styles.css';

type NavKey = 'overview' | 'employees' | 'orgchart' | 'branches' | 'leave' | 'calendar' | 'roles';

type Employee = {
  id: number;
  name: string;
  title: string;
  department: string;
  branch: string;
  city: string;
  manager: string;
  email: string;
  phone: string;
  startDate: string;
  contractType: string;
  employmentType: string;
  status: 'Active' | 'On leave' | 'Probation';
  initials: string;
};

type LeaveRequest = {
  id: number;
  employee: string;
  type: string;
  from: string;
  to: string;
  days: number;
  approver: string;
  status: 'Pending' | 'Approved' | 'Rejected';
};

const employees: Employee[] = [
  { id: 1, name: 'Dilan Kareem', title: 'Managing Director', department: 'Executive', branch: 'Erbil HQ', city: 'Erbil', manager: '—', email: 'dilan@estateflow.demo', phone: '+964 750 101 2001', startDate: '2021-02-14', contractType: 'Permanent', employmentType: 'Full-time', status: 'Active', initials: 'DK' },
  { id: 2, name: 'Renas Ahmed', title: 'Sales Director', department: 'Sales', branch: 'Erbil HQ', city: 'Erbil', manager: 'Dilan Kareem', email: 'renas@estateflow.demo', phone: '+964 750 101 2002', startDate: '2021-05-02', contractType: 'Permanent', employmentType: 'Full-time', status: 'Active', initials: 'RA' },
  { id: 3, name: 'Shirin Omar', title: 'Finance Manager', department: 'Finance', branch: 'Erbil HQ', city: 'Erbil', manager: 'Dilan Kareem', email: 'shirin@estateflow.demo', phone: '+964 750 101 2003', startDate: '2022-01-10', contractType: 'Permanent', employmentType: 'Full-time', status: 'On leave', initials: 'SO' },
  { id: 4, name: 'Ari Hassan', title: 'Branch Manager', department: 'Sales', branch: 'Sulaymaniyah', city: 'Sulaymaniyah', manager: 'Renas Ahmed', email: 'ari@estateflow.demo', phone: '+964 770 220 1004', startDate: '2022-09-18', contractType: 'Permanent', employmentType: 'Full-time', status: 'Active', initials: 'AH' },
  { id: 5, name: 'Narin Jalal', title: 'Senior Sales Agent', department: 'Sales', branch: 'Erbil HQ', city: 'Erbil', manager: 'Renas Ahmed', email: 'narin@estateflow.demo', phone: '+964 750 101 2005', startDate: '2023-03-01', contractType: 'Permanent', employmentType: 'Full-time', status: 'Active', initials: 'NJ' },
  { id: 6, name: 'Baran Ali', title: 'Sales Agent', department: 'Sales', branch: 'Erbil HQ', city: 'Erbil', manager: 'Narin Jalal', email: 'baran@estateflow.demo', phone: '+964 750 101 2006', startDate: '2024-06-11', contractType: 'Fixed-term', employmentType: 'Full-time', status: 'Probation', initials: 'BA' },
  { id: 7, name: 'Lana Soran', title: 'Legal Officer', department: 'Legal', branch: 'Erbil HQ', city: 'Erbil', manager: 'Dilan Kareem', email: 'lana@estateflow.demo', phone: '+964 750 101 2007', startDate: '2023-11-05', contractType: 'Permanent', employmentType: 'Full-time', status: 'Active', initials: 'LS' },
  { id: 8, name: 'Hiwa Kamal', title: 'Marketing Specialist', department: 'Marketing', branch: 'Duhok', city: 'Duhok', manager: 'Dilan Kareem', email: 'hiwa@estateflow.demo', phone: '+964 750 101 2008', startDate: '2024-02-20', contractType: 'Fixed-term', employmentType: 'Full-time', status: 'Active', initials: 'HK' }
];

const initialLeaves: LeaveRequest[] = [
  { id: 1, employee: 'Baran Ali', type: 'Annual leave', from: 'Jul 20', to: 'Jul 23', days: 4, approver: 'Narin Jalal', status: 'Pending' },
  { id: 2, employee: 'Shirin Omar', type: 'Sick leave', from: 'Jul 16', to: 'Jul 18', days: 3, approver: 'Dilan Kareem', status: 'Approved' },
  { id: 3, employee: 'Hiwa Kamal', type: 'Annual leave', from: 'Jul 28', to: 'Jul 30', days: 3, approver: 'Dilan Kareem', status: 'Pending' },
  { id: 4, employee: 'Lana Soran', type: 'Personal leave', from: 'Jul 08', to: 'Jul 08', days: 1, approver: 'Dilan Kareem', status: 'Rejected' }
];

const navItems: { key: NavKey; label: string; icon: React.ElementType }[] = [
  { key: 'overview', label: 'Overview', icon: Home },
  { key: 'employees', label: 'Employees', icon: Users },
  { key: 'orgchart', label: 'Organization chart', icon: Network },
  { key: 'branches', label: 'Branches', icon: Building2 },
  { key: 'leave', label: 'Leave management', icon: Palmtree },
  { key: 'calendar', label: 'Team calendar', icon: CalendarDays },
  { key: 'roles', label: 'Roles & permissions', icon: ShieldCheck }
];

function App() {
  const [active, setActive] = useState<NavKey>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [leaves, setLeaves] = useState(initialLeaves);
  const [modal, setModal] = useState<'employee' | 'leave' | null>(null);

  const filteredEmployees = useMemo(() => employees.filter(e => [e.name, e.title, e.department, e.branch, e.city].join(' ').toLowerCase().includes(query.toLowerCase())), [query]);

  const approve = (id: number, status: 'Approved' | 'Rejected') => setLeaves(v => v.map(r => r.id === id ? { ...r, status } : r));

  return <div className="app-shell">
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Building2 size={20}/></div><div><strong>EstateFlow</strong><span>Organization & People</span></div></div>
      <button className="mobile-close" onClick={() => setSidebarOpen(false)}><X size={20}/></button>
      <nav>{navItems.map(item => <button key={item.key} className={active === item.key ? 'active' : ''} onClick={() => { setActive(item.key); setSidebarOpen(false); }}><item.icon size={18}/><span>{item.label}</span></button>)}</nav>
      <div className="sidebar-footer"><div className="company-chip"><div className="avatar purple">NP</div><div><strong>Northline Properties</strong><span>Professional plan</span></div><ChevronRight size={16}/></div></div>
    </aside>

    <main className="main">
      <header className="topbar">
        <button className="icon-btn mobile-menu" onClick={() => setSidebarOpen(true)}><Menu size={21}/></button>
        <div className="search"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search employees, branches, teams..."/><kbd>⌘ K</kbd></div>
        <div className="top-actions"><button className="icon-btn"><Bell size={19}/><span className="dot"></span></button><button className="profile"><div className="avatar">IN</div><div><strong>Ismail Noor</strong><span>Platform owner</span></div><ChevronDown size={16}/></button></div>
      </header>

      <section className="content">
        {active === 'overview' && <Overview leaves={leaves} onNavigate={setActive}/>} 
        {active === 'employees' && <Employees data={filteredEmployees} onAdd={() => setModal('employee')}/>} 
        {active === 'orgchart' && <OrgChart/>}
        {active === 'branches' && <Branches/>}
        {active === 'leave' && <LeaveManagement leaves={leaves} onAdd={() => setModal('leave')} approve={approve}/>} 
        {active === 'calendar' && <TeamCalendar/>}
        {active === 'roles' && <Roles/>}
      </section>
    </main>

    {modal === 'employee' && <Modal title="Add employee" onClose={() => setModal(null)}><EmployeeForm close={() => setModal(null)}/></Modal>}
    {modal === 'leave' && <Modal title="Request leave" onClose={() => setModal(null)}><LeaveForm close={() => setModal(null)} add={(r) => setLeaves(v => [{...r,id: Date.now(), status:'Pending'}, ...v])}/></Modal>}
  </div>;
}

function PageHeader({eyebrow,title,subtitle,action}:{eyebrow:string,title:string,subtitle:string,action?:React.ReactNode}){
  return <div className="page-header"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>
}

function Overview({leaves,onNavigate}:{leaves:LeaveRequest[],onNavigate:(n:NavKey)=>void}){
  const cards = [
    ['Total employees','48','+4 this quarter',Users],['Active branches','4','Across 3 cities',Building2],['Pending leave','6','Needs manager review',ClipboardCheck],['On leave today','3','2 sales, 1 finance',Palmtree]
  ] as const;
  return <>
    <PageHeader eyebrow="Workspace" title="Organization overview" subtitle="A live view of your people, branches, structure, and availability." action={<button className="primary-btn" onClick={()=>onNavigate('employees')}><UserPlus size={18}/>Add employee</button>}/>
    <div className="metrics-grid">{cards.map(([a,b,c,Icon])=><div className="metric-card" key={a}><div className="metric-icon"><Icon size={20}/></div><span>{a}</span><strong>{b}</strong><small>{c}</small></div>)}</div>
    <div className="two-col">
      <div className="panel"><div className="panel-head"><div><h3>Team availability</h3><p>Today across all branches</p></div><button className="link-btn" onClick={()=>onNavigate('calendar')}>View calendar <ArrowUpRight size={15}/></button></div><div className="availability"><div className="ring">88%<span>available</span></div><div className="legend"><p><i className="green"></i>42 working</p><p><i className="amber"></i>3 on leave</p><p><i className="gray"></i>3 off shift</p></div></div></div>
      <div className="panel"><div className="panel-head"><div><h3>Branch headcount</h3><p>Employees by location</p></div><button className="link-btn" onClick={()=>onNavigate('branches')}>View branches <ArrowUpRight size={15}/></button></div><div className="bars">{[['Erbil HQ',26,54],['Sulaymaniyah',11,23],['Duhok',7,15],['Kirkuk',4,8]].map(([n,v,w])=><div className="bar-row" key={String(n)}><div><strong>{n}</strong><span>{v} employees</span></div><div className="bar"><i style={{width:`${w}%`}}></i></div></div>)}</div></div>
    </div>
    <div className="panel table-panel"><div className="panel-head"><div><h3>Leave requests needing attention</h3><p>Newest requests from your team</p></div><button className="secondary-btn" onClick={()=>onNavigate('leave')}>Open leave management</button></div><LeaveTable leaves={leaves.filter(l=>l.status==='Pending').slice(0,3)} compact/></div>
  </>
}

function Employees({data,onAdd}:{data:Employee[],onAdd:()=>void}){
  return <><PageHeader eyebrow="People" title="Employees" subtitle="Manage employee profiles, contracts, reporting lines, and branch assignments." action={<button className="primary-btn" onClick={onAdd}><Plus size={18}/>Add employee</button>}/>
  <div className="toolbar"><div className="filters"><button className="secondary-btn"><Filter size={16}/>All branches</button><button className="secondary-btn"><Briefcase size={16}/>All departments</button><button className="secondary-btn">Status: Active</button></div><button className="secondary-btn"><Download size={16}/>Export</button></div>
  <div className="panel table-panel"><div className="table-wrap"><table><thead><tr><th>Employee</th><th>Role</th><th>Branch</th><th>Manager</th><th>Contract</th><th>Status</th><th></th></tr></thead><tbody>{data.map(e=><tr key={e.id}><td><div className="person"><div className="avatar soft">{e.initials}</div><div><strong>{e.name}</strong><span>{e.email}</span></div></div></td><td><strong>{e.title}</strong><span>{e.department}</span></td><td><strong>{e.branch}</strong><span>{e.city}</span></td><td>{e.manager}</td><td><strong>{e.contractType}</strong><span>Since {e.startDate}</span></td><td><Status value={e.status}/></td><td><button className="icon-btn"><MoreHorizontal size={18}/></button></td></tr>)}</tbody></table></div></div></>
}

function OrgChart(){
  return <><PageHeader eyebrow="Structure" title="Organization chart" subtitle="Explore reporting lines across teams, departments, branches, and cities." action={<div className="button-group"><button className="secondary-btn"><Filter size={16}/>Erbil HQ</button><button className="secondary-btn"><Download size={16}/>Export chart</button></div>}/>
  <div className="org-toolbar"><span>Company-wide view</span><div><button className="secondary-btn">−</button><button className="secondary-btn">100%</button><button className="secondary-btn">+</button></div></div>
  <div className="org-canvas"><OrgNode person={employees[0]} top/>
    <div className="connector vertical"></div><div className="org-row">
      <OrgBranch person={employees[1]} children={[employees[4],employees[5]]}/>
      <OrgBranch person={employees[2]} children={[]}/>
      <OrgBranch person={employees[6]} children={[]}/>
      <OrgBranch person={employees[7]} children={[]}/>
    </div>
  </div></>
}
function OrgNode({person,top=false}:{person:Employee,top?:boolean}){return <div className={`org-node ${top?'top':''}`}><div className="avatar large">{person.initials}</div><div><strong>{person.name}</strong><span>{person.title}</span><small><MapPin size={12}/>{person.branch}</small></div><button><MoreHorizontal size={16}/></button></div>}
function OrgBranch({person,children}:{person:Employee,children:Employee[]}){return <div className="org-branch"><OrgNode person={person}/>{children.length>0&&<><div className="connector small"></div><div className="org-children">{children.map(c=><OrgNode key={c.id} person={c}/>)}</div></>}</div>}

function Branches(){const branchData=[['Erbil Headquarters','Erbil','26','Renas Ahmed','128 properties'],['Sulaymaniyah Branch','Sulaymaniyah','11','Ari Hassan','54 properties'],['Duhok Branch','Duhok','7','Hiwa Kamal','31 properties'],['Kirkuk Office','Kirkuk','4','Dilan Kareem','18 properties']]; return <><PageHeader eyebrow="Locations" title="Branches" subtitle="Manage your offices, teams, branch managers, and city coverage." action={<button className="primary-btn"><Plus size={18}/>Add branch</button>}/><div className="branch-grid">{branchData.map((b,i)=><div className="branch-card" key={b[0]}><div className="branch-cover"><Building2 size={34}/><span className="status-badge active">Active</span></div><div className="branch-body"><h3>{b[0]}</h3><p><MapPin size={15}/>{b[1]}, Iraq</p><div className="branch-stats"><div><strong>{b[2]}</strong><span>Employees</span></div><div><strong>{b[4].split(' ')[0]}</strong><span>Properties</span></div></div><div className="manager"><div className="avatar soft">{b[3].split(' ').map(x=>x[0]).join('')}</div><div><span>Branch manager</span><strong>{b[3]}</strong></div></div><button className="secondary-btn wide">Open branch <ChevronRight size={16}/></button></div></div>)}</div></>}

function LeaveManagement({leaves,onAdd,approve}:{leaves:LeaveRequest[],onAdd:()=>void,approve:(id:number,s:'Approved'|'Rejected')=>void}){return <><PageHeader eyebrow="People operations" title="Leave management" subtitle="Review requests, monitor balances, and maintain team coverage." action={<button className="primary-btn" onClick={onAdd}><Plus size={18}/>Request leave</button>}/><div className="metrics-grid three"><div className="metric-card"><div className="metric-icon"><Clock3 size={20}/></div><span>Pending approval</span><strong>{leaves.filter(x=>x.status==='Pending').length}</strong><small>Across 3 branches</small></div><div className="metric-card"><div className="metric-icon"><CheckCircle2 size={20}/></div><span>Approved this month</span><strong>14</strong><small>38 total leave days</small></div><div className="metric-card"><div className="metric-icon"><Palmtree size={20}/></div><span>Average balance</span><strong>18.4</strong><small>Days remaining</small></div></div><div className="panel table-panel"><div className="panel-head"><div><h3>Leave requests</h3><p>Manager and HR approval queue</p></div><div className="button-group"><button className="secondary-btn">All statuses</button><button className="secondary-btn"><Download size={16}/>Export</button></div></div><LeaveTable leaves={leaves} approve={approve}/></div></>}

function LeaveTable({leaves,approve,compact=false}:{leaves:LeaveRequest[],approve?:(id:number,s:'Approved'|'Rejected')=>void,compact?:boolean}){return <div className="table-wrap"><table><thead><tr><th>Employee</th><th>Leave type</th><th>Dates</th><th>Days</th><th>Approver</th><th>Status</th>{!compact&&<th>Actions</th>}</tr></thead><tbody>{leaves.map(r=><tr key={r.id}><td><div className="person"><div className="avatar soft">{r.employee.split(' ').map(x=>x[0]).join('')}</div><strong>{r.employee}</strong></div></td><td>{r.type}</td><td><strong>{r.from} — {r.to}</strong></td><td>{r.days}</td><td>{r.approver}</td><td><Status value={r.status}/></td>{!compact&&<td>{r.status==='Pending'?<div className="row-actions"><button className="approve" onClick={()=>approve?.(r.id,'Approved')}><CheckCircle2 size={17}/></button><button className="reject" onClick={()=>approve?.(r.id,'Rejected')}><XCircle size={17}/></button></div>:<button className="icon-btn"><Eye size={17}/></button>}</td>}</tr>)}</tbody></table></div>}

function TeamCalendar(){const days=Array.from({length:31},(_,i)=>i+1); return <><PageHeader eyebrow="Availability" title="Team calendar" subtitle="See leave, holidays, travel, and coverage across your organization." action={<button className="primary-btn"><Plus size={18}/>Add event</button>}/><div className="calendar-toolbar"><div><button className="secondary-btn">‹</button><strong>July 2026</strong><button className="secondary-btn">›</button></div><div className="button-group"><button className="secondary-btn">All branches</button><button className="secondary-btn">Month</button></div></div><div className="calendar panel"><div className="weekdays">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=><span key={d}>{d}</span>)}</div><div className="calendar-grid">{Array.from({length:3}).map((_,i)=><div className="day muted" key={`m${i}`}></div>)}{days.map(d=><div className={`day ${d===17?'today':''}`} key={d}><span>{d}</span>{d===16&&<b className="event amber">Shirin — Sick</b>}{d===20&&<b className="event blue">Baran — Annual</b>}{d===28&&<b className="event purple">Hiwa — Annual</b>}{d===14&&<b className="event green">Erbil holiday</b>}</div>)}</div></div></>}

function Roles(){const rows=[['Owner','Full workspace access','2 users'],['Branch Manager','Manage branch people, leave, and reports','4 users'],['HR Administrator','Manage employees, documents, leave, and policies','2 users'],['Team Leader','View team and approve first-level leave','6 users'],['Employee','Self-service profile and leave access','34 users']]; return <><PageHeader eyebrow="Access control" title="Roles & permissions" subtitle="Separate job titles, reporting lines, and system access." action={<button className="primary-btn"><Plus size={18}/>Create role</button>}/><div className="notice"><ShieldCheck size={22}/><div><strong>Permissions are independent from job titles</strong><p>A Sales Manager does not automatically receive administrator access. Assign system permissions explicitly.</p></div></div><div className="panel table-panel"><div className="table-wrap"><table><thead><tr><th>Role</th><th>Description</th><th>Assigned users</th><th>Access level</th><th></th></tr></thead><tbody>{rows.map((r,i)=><tr key={r[0]}><td><div className="person"><div className="role-icon"><ShieldCheck size={17}/></div><strong>{r[0]}</strong></div></td><td>{r[1]}</td><td>{r[2]}</td><td><span className="status-badge active">{i===0?'Full':i<3?'Advanced':'Standard'}</span></td><td><button className="icon-btn"><MoreHorizontal size={18}/></button></td></tr>)}</tbody></table></div></div></>}

function Status({value}:{value:string}){const cls=value==='Approved'||value==='Active'?'active':value==='Rejected'?'danger':value==='Pending'||value==='Probation'?'pending':'leave'; return <span className={`status-badge ${cls}`}>{value}</span>}

function Modal({title,onClose,children}:{title:string,onClose:()=>void,children:React.ReactNode}){return <div className="modal-backdrop"><div className="modal"><div className="modal-head"><div><span className="eyebrow">EstateFlow</span><h2>{title}</h2></div><button className="icon-btn" onClick={onClose}><X size={20}/></button></div>{children}</div></div>}
function EmployeeForm({close}:{close:()=>void}){return <form onSubmit={e=>{e.preventDefault();close();}} className="form"><div className="form-grid"><label>Full name<input required placeholder="Employee full name"/></label><label>Work email<input type="email" required placeholder="name@company.com"/></label><label>Job title<input required placeholder="Sales Agent"/></label><label>Department<select><option>Sales</option><option>Finance</option><option>Marketing</option><option>Legal</option></select></label><label>Branch<select><option>Erbil HQ</option><option>Sulaymaniyah</option><option>Duhok</option></select></label><label>Manager<select>{employees.map(e=><option key={e.id}>{e.name}</option>)}</select></label><label>Start date<input type="date"/></label><label>Contract type<select><option>Permanent</option><option>Fixed-term</option><option>Consultant</option></select></label></div><div className="modal-actions"><button type="button" className="secondary-btn" onClick={close}>Cancel</button><button className="primary-btn">Create employee</button></div></form>}
function LeaveForm({close,add}:{close:()=>void,add:(r:Omit<LeaveRequest,'id'|'status'>)=>void}){const [employee,setEmployee]=useState('Baran Ali'); const [type,setType]=useState('Annual leave'); return <form onSubmit={e=>{e.preventDefault();add({employee,type,from:'Aug 03',to:'Aug 05',days:3,approver:'Narin Jalal'});close();}} className="form"><div className="form-grid"><label>Employee<select value={employee} onChange={e=>setEmployee(e.target.value)}>{employees.map(e=><option key={e.id}>{e.name}</option>)}</select></label><label>Leave type<select value={type} onChange={e=>setType(e.target.value)}><option>Annual leave</option><option>Sick leave</option><option>Personal leave</option></select></label><label>Start date<input required type="date"/></label><label>End date<input required type="date"/></label><label className="full">Reason<textarea placeholder="Optional note for the approver"></textarea></label></div><div className="modal-actions"><button type="button" className="secondary-btn" onClick={close}>Cancel</button><button className="primary-btn">Submit request</button></div></form>}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
