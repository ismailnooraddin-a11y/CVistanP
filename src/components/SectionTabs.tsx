import Link from "next/link";

export default function SectionTabs({ items, current }: { items: { label: string; href: string }[]; current: string }) {
  return (
    <div className="section-tabs">
      {items.map((item) => <Link className={current === item.href ? "tab active" : "tab"} href={item.href} key={item.href}>{item.label}</Link>)}
    </div>
  );
}
