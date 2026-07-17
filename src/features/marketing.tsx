"use client";

import {
  ArrowUpRight,
  Bot,
  CheckCircle2,
  CircleDollarSign,
  Eye,
  Globe2,
  Mail,
  Megaphone,
  MoreHorizontal,
  MousePointerClick,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Rocket,
  Send,
  Share2,
  Sparkles,
  Target,
  Workflow
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { useWorkspace } from "@/store/workspace-store";
import { Badge, Button, Card, CardHeader, PageHeader, Progress, StatCard } from "@/components/ui";

export function CampaignsPage() {
  const { tenant } = useWorkspace();
  const spend = tenant.campaigns.reduce((sum, item) => sum + item.spend, 0);
  const leads = tenant.campaigns.reduce((sum, item) => sum + item.leads, 0);
  const conversions = tenant.campaigns.reduce((sum, item) => sum + item.conversions, 0);
  return <div className="page-stack"><PageHeader eyebrow="Growth engine" title="Marketing campaigns" description="Connect campaign spend to leads, viewings, reservations, and closed revenue." actions={<Button><Plus size={17} /> New campaign</Button>} />
    <div className="metrics-grid metrics-grid--4"><StatCard label="Active spend" value={formatCurrency(spend)} change={4.8} icon={<CircleDollarSign size={21} />} tone="brand" detail="current campaigns" /><StatCard label="Marketing leads" value={leads} change={18.2} icon={<Target size={21} />} tone="green" detail="attributed enquiries" /><StatCard label="Cost per lead" value={formatCurrency(leads ? spend / leads : 0)} change={-7.1} icon={<MousePointerClick size={21} />} tone="blue" detail="blended CPL" /><StatCard label="Conversions" value={conversions} change={12.5} icon={<Rocket size={21} />} tone="amber" detail="closed or reserved" /></div>
    <div className="campaign-grid">{tenant.campaigns.map((campaign, index) => { const spendPercent = campaign.budget ? (campaign.spend / campaign.budget) * 100 : 0; const conversion = campaign.leads ? (campaign.conversions / campaign.leads) * 100 : 0; return <Card className="campaign-card" key={campaign.id}><div className="campaign-card__header"><span className={`campaign-channel campaign-channel--${index}`}><Megaphone size={20} /></span><div><Badge tone={campaign.status === "active" ? "success" : campaign.status === "completed" ? "info" : "warning"}>{campaign.status}</Badge><h3>{campaign.name}</h3><p>{campaign.channel} · {formatDate(campaign.startsAt)} – {formatDate(campaign.endsAt)}</p></div><button className="icon-button icon-button--small"><MoreHorizontal size={17} /></button></div><div className="campaign-card__numbers"><span><small>Spend</small><strong>{formatCurrency(campaign.spend)}</strong></span><span><small>Leads</small><strong>{campaign.leads}</strong></span><span><small>Conversions</small><strong>{campaign.conversions}</strong></span><span><small>Conv. rate</small><strong>{conversion.toFixed(1)}%</strong></span></div><Progress value={spendPercent} label={`${Math.round(spendPercent)}% of ${formatCurrency(campaign.budget)} budget`} /><div className="campaign-card__footer"><span><Eye size={14} /> Live attribution</span><Button variant="secondary" size="sm">Open report <ArrowUpRight size={14} /></Button></div></Card>; })}</div>
  </div>;
}

export function PortalsPage() {
  const portals = [
    { name: "Agency Website", type: "Owned channel", listings: 6, leads: 34, status: "connected", sync: "Live" },
    { name: "Property Finder", type: "Property portal", listings: 5, leads: 21, status: "connected", sync: "12 min ago" },
    { name: "Bayut", type: "Property portal", listings: 5, leads: 18, status: "connected", sync: "14 min ago" },
    { name: "Facebook Marketplace", type: "Social marketplace", listings: 4, leads: 11, status: "manual", sync: "Yesterday" },
    { name: "OpenSooq", type: "Classified portal", listings: 0, leads: 0, status: "available", sync: "Not connected" }
  ];
  return <div className="page-stack"><PageHeader eyebrow="Listing distribution" title="Property portals" description="Connect, synchronize, monitor, and troubleshoot every listing destination." actions={<Button><Plus size={17} /> Connect portal</Button>} /><div className="portal-grid">{portals.map((portal, index) => <Card className="portal-card" key={portal.name}><div className={`portal-card__logo portal-card__logo--${index}`}><Globe2 size={28} /></div><div className="portal-card__head"><div><h3>{portal.name}</h3><p>{portal.type}</p></div><Badge tone={portal.status === "connected" ? "success" : portal.status === "manual" ? "warning" : "neutral"} dot>{portal.status}</Badge></div><div className="portal-card__stats"><span><strong>{portal.listings}</strong><small>Listings</small></span><span><strong>{portal.leads}</strong><small>Leads</small></span></div><div className="portal-card__sync"><RefreshCw size={14} /><span>Last sync: {portal.sync}</span></div><Button variant={portal.status === "available" ? "primary" : "secondary"} size="sm">{portal.status === "available" ? "Connect" : "Manage connection"}</Button></Card>)}</div></div>;
}

export function SocialPage() {
  const posts = [
    { property: "Contemporary Villa with Garden", channel: "Instagram + Facebook", date: "2026-07-18T11:00:00Z", status: "scheduled", reach: "—" },
    { property: "Skyline Apartment", channel: "Instagram", date: "2026-07-17T16:00:00Z", status: "scheduled", reach: "—" },
    { property: "Executive Office Floor", channel: "LinkedIn", date: "2026-07-16T09:00:00Z", status: "published", reach: "8,420" },
    { property: "Goizha View Residence", channel: "Facebook", date: "2026-07-15T18:30:00Z", status: "published", reach: "12,880" }
  ];
  return <div className="page-stack"><PageHeader eyebrow="Content distribution" title="Social publishing" description="Create, approve, schedule, and measure property content across social channels." actions={<><Button variant="secondary"><Sparkles size={17} /> Generate content</Button><Button><Plus size={17} /> Create post</Button></>} /><div className="social-layout"><Card><CardHeader title="Content calendar" description="Scheduled and published property content" /><div className="social-calendar"><div className="social-calendar__days">{["Mon 13", "Tue 14", "Wed 15", "Thu 16", "Fri 17", "Sat 18", "Sun 19"].map((day) => <span key={day}>{day}</span>)}</div><div className="social-calendar__grid">{posts.map((post, index) => <article className={`social-post social-post--${index}`} style={{ gridColumn: Math.min(7, index + 3) }} key={post.property}><span><Share2 size={14} /> {post.channel}</span><strong>{post.property}</strong><small>{new Date(post.date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })}</small></article>)}</div></div></Card><Card><CardHeader title="Publishing queue" description="Next scheduled posts" /><div className="publishing-list">{posts.map((post) => <div className="publishing-row" key={post.property}><span className="publishing-row__thumb"><Megaphone size={18} /></span><div><strong>{post.property}</strong><small>{post.channel} · {formatDate(post.date)}</small></div><Badge tone={post.status === "published" ? "success" : "warning"}>{post.status}</Badge><button className="icon-button icon-button--small">{post.status === "published" ? <Eye size={16} /> : <MoreHorizontal size={16} />}</button></div>)}</div></Card></div></div>;
}

export function AutomationPage() {
  const workflows = [
    { name: "New lead response", trigger: "Lead created", steps: 4, runs: 142, success: 98.6, status: "active", icon: <Send size={19} /> },
    { name: "Viewing reminder", trigger: "24 hours before viewing", steps: 3, runs: 86, success: 100, status: "active", icon: <Mail size={19} /> },
    { name: "Cold lead nurturing", trigger: "No activity for 14 days", steps: 7, runs: 61, success: 95.1, status: "active", icon: <Workflow size={19} /> },
    { name: "Owner weekly report", trigger: "Every Monday at 08:00", steps: 5, runs: 18, success: 100, status: "paused", icon: <Bot size={19} /> }
  ];
  return <div className="page-stack"><PageHeader eyebrow="Marketing operations" title="Automation" description="Build reliable customer journeys and internal workflows without repetitive manual work." actions={<Button><Plus size={17} /> New workflow</Button>} /><div className="workflow-list">{workflows.map((workflow, index) => <Card className="workflow-card" key={workflow.name}><div className={`workflow-card__icon workflow-card__icon--${index}`}>{workflow.icon}</div><div className="workflow-card__main"><div><h3>{workflow.name}</h3><Badge tone={workflow.status === "active" ? "success" : "warning"}>{workflow.status}</Badge></div><p><strong>Trigger:</strong> {workflow.trigger}</p><div className="workflow-card__meta"><span>{workflow.steps} steps</span><span>{workflow.runs} runs</span><span>{workflow.success}% successful</span></div></div><div className="workflow-card__actions"><button className="icon-button">{workflow.status === "active" ? <Pause size={17} /> : <Play size={17} />}</button><button className="icon-button"><MoreHorizontal size={17} /></button></div></Card>)}</div></div>;
}
