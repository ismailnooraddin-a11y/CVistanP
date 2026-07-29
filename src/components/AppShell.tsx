"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, ChevronDown, LogOut, ShieldCheck } from "lucide-react";
import { navigation } from "@/lib/navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Building2 size={28} />
          <div><strong>EstateFlow</strong><span>Real Estate ERP</span></div>
        </div>
        <nav>
          {navigation.map((item) => {
            const active = pathname === item.href || (item.href.startsWith("/organization") && pathname.startsWith("/organization")) || (item.href.startsWith("/hr") && pathname.startsWith("/hr"));
            const Icon = item.icon;
            return (
              <Link className={active ? "nav-item active" : "nav-item"} href={item.href} key={item.label}>
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-user">
          <div><strong>Ismail Nooraddin</strong><span>Super Admin</span></div>
          <LogOut size={18} />
        </div>
      </aside>
      <section className="workspace">
        <header className="topbar">
          <button className="branch-selector" type="button">Dream City Branch <ChevronDown size={16} /></button>
          <div className="admin-pill"><ShieldCheck size={16} /> Super Admin</div>
        </header>
        <main className="content">{children}</main>
      </section>
    </div>
  );
}
