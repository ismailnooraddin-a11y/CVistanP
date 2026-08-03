'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, ShieldCheck, LogOut, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { nav } from '@/lib/navigation';
import { useDemo } from './DemoProvider';
import { useToast } from './ToastProvider';

type NavItem = (typeof nav)[number];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [mobile, setMobile] = useState(false);
  const { state, activeBranchId, setActiveBranchId } = useDemo();
  const { showToast } = useToast();
  const activeBranch = state.branches.find((branch) => branch.id === activeBranchId) || state.branches[0];

  useEffect(() => setMobile(false), [path]);
  useEffect(() => {
    document.body.classList.toggle('nav-open', mobile);
    return () => document.body.classList.remove('nav-open');
  }, [mobile]);

  return (
    <div className="app-shell">
      {mobile && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setMobile(false)} />}
      <aside className={mobile ? 'sidebar open' : 'sidebar'} aria-label="Primary navigation">
        <div className="brand">
          <BrandMark />
          <div className="brand-copy"><strong>{state.company.tradingName || 'EstateFlow'}</strong><small>Real Estate ERP</small></div>
          <button className="icon-btn mobile-close" aria-label="Close navigation" onClick={() => setMobile(false)}><X /></button>
        </div>
        <nav>{nav.map((item) => <NavigationItem key={item.label} item={item} path={path} />)}</nav>
        <div className="profile">
          <div><strong>Ismail Nooraddin</strong><small>ismail@example.com</small></div>
          <button className="icon-btn" aria-label="Sign out" onClick={() => showToast('Demo sign-out will be connected with authentication.', 'info')}><LogOut size={18} /></button>
        </div>
      </aside>
      <section className="workspace">
        <header className="topbar">
          <button className="icon-btn mobile-menu" aria-label="Open navigation" onClick={() => setMobile(true)}><Menu /></button>
          <label className="branch-select"><span className="branch-dot">⌘</span><span className="sr-only">Active branch</span><select aria-label="Active branch" value={activeBranch?.id || ''} onChange={(event) => setActiveBranchId(event.target.value)}>{state.branches.filter((branch) => branch.status === 'Active').map((branch) => <option value={branch.id} key={branch.id}>{branch.name}</option>)}</select></label>
          <span className="role"><ShieldCheck size={15} />Super Admin</span>
        </header>
        <main className="content">{children}</main>
      </section>
    </div>
  );

  function BrandMark() {
    if (state.company.logoDataUrl) return <img className="brand-logo" src={state.company.logoDataUrl} alt={`${state.company.tradingName} logo`} />;
    return <span className="brand-fallback"><Building2 /></span>;
  }
}

function NavigationItem({ item, path }: { item: NavItem; path: string }) {
  const isActive = 'href' in item && item.href && item.href !== '#' && (path === item.href || path.startsWith(`${item.href}/`));
  if ('href' in item && item.href) {
    if (item.disabled) return <div className="nav-item disabled"><item.icon size={18} /><span>{item.label}</span>{'badge' in item && item.badge && <small className="nav-badge">{item.badge}</small>}</div>;
    return <Link href={item.href} className={`nav-item ${isActive ? 'active' : ''}`}><item.icon size={18} /><span>{item.label}</span></Link>;
  }
  return (
    <div className="nav-group">
      <div className="nav-title"><item.icon size={18} /><span>{item.label}</span></div>
      {'children' in item && item.children?.map((child) => {
        const childActive = path === child.href || path.startsWith(`${child.href}/`);
        return <Link key={child.href} href={child.href} className={`nav-item child ${childActive ? 'active' : ''}`}><child.icon size={17} /><span>{child.label}</span></Link>;
      })}
    </div>
  );
}
