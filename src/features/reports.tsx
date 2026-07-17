"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  CalendarRange,
  CircleDollarSign,
  Download,
  Filter,
  Gauge,
  LineChart,
  PieChart,
  Target,
  Trophy,
  UsersRound
} from "lucide-react";
import { useMemo } from "react";
import { averagePropertyPrice, leadConversionRate, leadStageCounts } from "@/lib/analytics";
import { formatCurrency } from "@/lib/format";
import { useWorkspace } from "@/store/workspace-store";
import { Avatar, Badge, Button, Card, CardHeader, PageHeader, Progress, StatCard } from "@/components/ui";

function BarSeries({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  return <div className="bar-series">{values.map((value, index) => <div className="bar-series__column" key={`${value}-${index}`}><span style={{ height: `${(value / max) * 100}%` }} /><small>{["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"][index]}</small></div>)}</div>;
}

export function ReportsPage() {
  const { tenant } = useWorkspace();
  const stages = useMemo(() => leadStageCounts(tenant.leads), [tenant.leads]);
  const conversion = leadConversionRate(tenant.leads);
  const agents = tenant.employees.filter((employee) => employee.jobTitle.toLowerCase().includes("consultant") || employee.jobTitle.toLowerCase().includes("manager")).slice(0, 5);
  return <div className="page-stack"><PageHeader eyebrow="Business intelligence" title="Reports & analytics" description="Measure sales, inventory, finance, marketing, agents, and branches from a shared source of truth." actions={<><Button variant="secondary"><CalendarRange size={17} /> 01 Jul – 17 Jul</Button><Button><Download size={17} /> Export report</Button></>} />
    <div className="report-filter-bar"><span><Filter size={16} /> Report filters</span><button>All branches</button><button>All agents</button><button>All property types</button><button>USD</button><Badge tone="success">Live data</Badge></div>
    <div className="metrics-grid metrics-grid--4"><StatCard label="Gross transaction value" value={formatCurrency(112000 + 50400)} change={18.4} icon={<CircleDollarSign size={21} />} tone="brand" detail="signed and reserved" /><StatCard label="Lead conversion" value={`${conversion}%`} change={3.4} icon={<Target size={21} />} tone="green" detail="lead to won" /><StatCard label="Average property price" value={formatCurrency(averagePropertyPrice(tenant.properties))} change={5.8} icon={<Building2 size={21} />} tone="blue" detail="current portfolio" /><StatCard label="Sales cycle" value="23 days" change={-12} icon={<Gauge size={21} />} tone="amber" detail="lead to contract" /></div>
    <div className="dashboard-grid dashboard-grid--wide"><Card><CardHeader title="Revenue & forecast" description="Actual closed revenue with projected trajectory" action={<div className="chart-legend"><span><i className="legend-in" /> Actual</span><span><i className="legend-out" /> Forecast</span></div>} /><div className="report-chart-summary"><div><small>Year-to-date revenue</small><strong>$1.28M</strong><span className="trend trend--up"><ArrowUpRight size={14} /> 22.6%</span></div><div><small>Projected year-end</small><strong>$2.14M</strong><span>84% confidence</span></div></div><BarSeries values={[38, 48, 44, 62, 58, 73, 67, 82, 91, 86, 104, 118]} /></Card><Card><CardHeader title="Lead source quality" description="Conversion by acquisition channel" /><div className="source-quality">{[
      ["Referral", 28, 42], ["Website", 19, 31], ["Google Ads", 16, 26], ["Meta Ads", 12, 35], ["WhatsApp", 10, 18]
    ].map(([source, conversionRate, volume], index) => <div className="source-quality__row" key={String(source)}><span className={`source-quality__rank source-quality__rank--${index}`}>{index + 1}</span><div><strong>{source}</strong><Progress value={Number(conversionRate) * 2.8} /></div><span><strong>{conversionRate}%</strong><small>{volume} leads</small></span></div>)}</div></Card></div>
    <div className="dashboard-grid dashboard-grid--thirds"><Card><CardHeader title="Pipeline health" description="Opportunity distribution" /><div className="pipeline-report">{Object.entries(stages).filter(([stage]) => !["lost"].includes(stage)).map(([stage, count], index) => <div key={stage}><span><i className={`stage-dot stage-dot--${stage}`} />{stage}</span><strong>{count}</strong><small>{Math.round((count / Math.max(1, tenant.leads.length)) * 100)}%</small></div>)}</div></Card><Card><CardHeader title="Inventory mix" description="Available portfolio by property type" /><div className="donut-wrap donut-wrap--vertical"><div className="donut donut--inventory"><div><strong>{tenant.properties.length}</strong><span>properties</span></div></div><div className="donut-legend">{["apartment", "villa", "office", "retail", "land"].map((type, index) => <div key={type}><i className={`dot-type-${index}`} /><span className="capitalize">{type}</span><strong>{tenant.properties.filter((item) => item.type === type).length}</strong></div>)}</div></div></Card><Card><CardHeader title="Performance signals" description="Automated trend detection" /><div className="signal-list"><div className="signal signal--positive"><ArrowUpRight size={18} /><div><strong>Dream City demand is rising</strong><p>Qualified enquiries increased 26% over the previous period.</p></div></div><div className="signal signal--positive"><ArrowUpRight size={18} /><div><strong>Referral quality improved</strong><p>Referral conversion is 1.8x higher than paid social.</p></div></div><div className="signal signal--negative"><ArrowDownRight size={18} /><div><strong>Office inventory is aging</strong><p>Average days on market increased to 48 days.</p></div></div></div></Card></div>
    <Card><CardHeader title="Agent performance" description="Activity, conversion, and closed value" action={<Button variant="secondary">Open leaderboard</Button>} /><div className="agent-report-grid">{agents.map((agent, index) => <div className="agent-report-card" key={agent.id}><span className={`agent-report-card__rank agent-report-card__rank--${index}`}>{index === 0 ? <Trophy size={17} /> : index + 1}</span><Avatar name={`${agent.firstName} ${agent.lastName}`} size="lg" status="online" /><div><strong>{agent.firstName} {agent.lastName}</strong><small>{agent.jobTitle}</small></div><dl><div><dt>Leads</dt><dd>{24 - index * 3}</dd></div><div><dt>Conversion</dt><dd>{28 - index * 2}%</dd></div><div><dt>Closed value</dt><dd>{formatCurrency(422000 - index * 72000)}</dd></div></dl></div>)}</div></Card>
  </div>;
}
