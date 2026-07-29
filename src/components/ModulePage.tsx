import AppShell from "./AppShell";
import SectionTabs from "./SectionTabs";

export default function ModulePage({ title, subtitle, tabs, current, children }: { title: string; subtitle: string; tabs?: { label: string; href: string }[]; current?: string; children: React.ReactNode }) {
  return (
    <AppShell>
      <div className="page-heading"><div><h1>{title}</h1><p>{subtitle}</p></div><button className="primary-button small" type="button">+ Add New</button></div>
      {tabs && current ? <SectionTabs items={tabs} current={current} /> : null}
      {children}
    </AppShell>
  );
}
