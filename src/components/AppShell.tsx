'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, ChevronDown, ShieldCheck, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { nav } from '@/lib/navigation';
export default function AppShell({children}:{children:React.ReactNode}){
 const path=usePathname(); const [mobile,setMobile]=useState(false);
 return <div className="app-shell">
  <aside className={mobile?'sidebar open':'sidebar'}>
   <div className="brand"><Building2/><div><strong>EstateFlow</strong><small>Real Estate ERP</small></div><button className="icon-btn mobile-close" onClick={()=>setMobile(false)}><X/></button></div>
   <nav>{nav.map((item:any)=><div key={item.label} className="nav-group">
    {item.href?<Link href={item.href} className={`nav-item ${path===item.href?'active':''} ${item.disabled?'disabled':''}`} onClick={()=>setMobile(false)}><item.icon size={18}/><span>{item.label}</span></Link>:<div className="nav-title"><item.icon size={18}/><span>{item.label}</span></div>}
    {item.children?.map((child:any)=><Link key={child.href} href={child.href} className={`nav-item child ${path===child.href?'active':''}`} onClick={()=>setMobile(false)}><child.icon size={17}/><span>{child.label}</span></Link>)}
   </div>)}</nav>
   <div className="profile"><div><strong>Ismail Nooraddin</strong><small>ismail@example.com</small></div><LogOut size={18}/></div>
  </aside>
  <section className="workspace">
   <header className="topbar"><button className="icon-btn mobile-menu" onClick={()=>setMobile(true)}><Menu/></button><button className="branch-select"><GitBranchIcon/> Empire Pearl <ChevronDown size={16}/></button><span className="role"><ShieldCheck size={15}/> Super Admin</span></header>
   <main className="content">{children}</main>
  </section>
 </div>
}
function GitBranchIcon(){return <span className="branch-dot">⌘</span>}
