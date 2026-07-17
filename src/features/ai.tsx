"use client";

import {
  ArrowUp,
  Bot,
  BrainCircuit,
  Building2,
  FileSearch,
  Lightbulb,
  MessageSquareText,
  Search,
  Send,
  Sparkles,
  TrendingUp,
  UserRoundSearch,
  WandSparkles
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { formatCurrency } from "@/lib/format";
import { useWorkspace } from "@/store/workspace-store";
import { Badge, Button, Card, PageHeader, cn } from "@/components/ui";

interface AiMessage { id: number; role: "assistant" | "user"; content: string; cards?: Array<{ title: string; subtitle: string; value: string }> }

export function AiPage() {
  const { tenant, currentTenant } = useWorkspace();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AiMessage[]>([
    { id: 1, role: "assistant", content: `Good afternoon. I can analyze ${currentTenant.name}'s permitted CRM, property, finance, and people data. What would you like to understand?` }
  ]);
  const prompts = ["Find properties for a $200k buyer", "Explain this month’s sales trend", "Which leads need attention?", "Summarize team availability"];
  const answer = (question: string, id: number): AiMessage => {
    const lower = question.toLowerCase();
    if (lower.includes("property") || lower.includes("200")) {
      const matches = tenant.properties.filter((property) => property.status === "available" && property.price <= 220000).slice(0, 3);
      return { id, role: "assistant", content: `I found ${matches.length} available matches within or near the requested budget. I prioritized live availability and residential fit.`, cards: matches.map((property) => ({ title: property.title, subtitle: `${property.area}, ${property.city} · ${property.bedrooms} beds · ${property.sizeSqm} m²`, value: formatCurrency(property.price) })) };
    }
    if (lower.includes("lead") || lower.includes("attention")) {
      const hot = tenant.leads.filter((lead) => lead.score >= 85 && !["won", "lost"].includes(lead.stage)).slice(0, 3);
      return { id, role: "assistant", content: `${hot.length} high-intent leads need attention. Ahmed Salih has the strongest immediate signal because he requested a viewing and has a score above 90.`, cards: hot.map((lead) => ({ title: lead.name, subtitle: `${lead.stage} · ${lead.interest}`, value: `${lead.score} score` })) };
    }
    if (lower.includes("team") || lower.includes("leave") || lower.includes("availability")) {
      const active = tenant.employees.filter((employee) => employee.status === "active").length;
      const away = tenant.employees.filter((employee) => employee.status === "on-leave").length;
      return { id, role: "assistant", content: `${active} employees are active and ${away} are currently on leave. Two leave requests are pending, so the sales managers should review coverage before approval.` };
    }
    return { id, role: "assistant", content: "The strongest current signal is improving lead quality: referral and website enquiries are converting better than paid social. I would prioritize hot-lead follow-up, resolve the overdue invoice, and extend or convert the retail reservation before expiry." };
  };
  const appendQuestion = (question: string) => {
    setMessages((current) => {
      const nextId = current.reduce((maximum, message) => Math.max(maximum, message.id), 0) + 1;
      return [...current, { id: nextId, role: "user", content: question }, answer(question, nextId + 1)];
    });
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const question = input.trim();
    if (!question) return;
    appendQuestion(question);
    setInput("");
  };
  const contextStats = useMemo(() => [
    { label: "Records in context", value: tenant.leads.length + tenant.properties.length + tenant.customers.length + tenant.contracts.length, icon: <BrainCircuit size={18} /> },
    { label: "Permission scope", value: "Workspace", icon: <FileSearch size={18} /> },
    { label: "Data mode", value: "Demo-safe", icon: <Sparkles size={18} /> }
  ], [tenant]);
  return <div className="page-stack page-stack--ai"><PageHeader eyebrow="Enterprise add-on" title="EstateFlow AI Copilot" description="Ask questions, find records, generate content, summarize activity, and recommend next actions with permission-aware context." actions={<Badge tone="purple"><Sparkles size={13} /> Enterprise AI</Badge>} />
    <div className="ai-layout"><Card className="ai-chat"><div className="ai-chat__header"><div className="ai-orb"><Sparkles size={24} /></div><div><strong>EstateFlow Copilot</strong><span><i /> Ready · grounded in workspace data</span></div><Badge tone="success">Permission aware</Badge></div><div className="ai-message-list">{messages.map((message) => <div className={cn("ai-message", message.role === "user" && "ai-message--user")} key={message.id}>{message.role === "assistant" ? <span className="ai-message__avatar"><Bot size={19} /></span> : null}<div className="ai-message__bubble"><p>{message.content}</p>{message.cards ? <div className="ai-result-cards">{message.cards.map((card) => <button key={card.title}><span><strong>{card.title}</strong><small>{card.subtitle}</small></span><b>{card.value}</b></button>)}</div> : null}</div></div>)}</div><div className="ai-suggestions">{prompts.map((prompt) => <button key={prompt} onClick={() => appendQuestion(prompt)}><Sparkles size={14} /> {prompt}</button>)}</div><form className="ai-composer" onSubmit={submit}><div><WandSparkles size={20} /><textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about leads, properties, revenue, customers, or your team..." rows={2} /><Button type="submit" size="icon"><ArrowUp size={18} /></Button></div><small>AI responses in this demo are deterministic. Connect a secured model gateway for production use.</small></form></Card>
    <aside className="ai-sidebar"><Card><div className="ai-sidebar__heading"><Lightbulb size={19} /><div><strong>Suggested actions</strong><span>Based on current signals</span></div></div><div className="ai-action-list"><button><span><UserRoundSearch size={17} /></span><div><strong>Prioritize Ahmed Salih</strong><p>High score and requested same-day viewing.</p></div></button><button><span><TrendingUp size={17} /></span><div><strong>Shift budget to referrals</strong><p>Referral conversion is above paid social.</p></div></button><button><span><Building2 size={17} /></span><div><strong>Refresh office listing</strong><p>Office inventory is aging beyond target.</p></div></button></div></Card><Card><div className="ai-sidebar__heading"><BrainCircuit size={19} /><div><strong>AI context</strong><span>Current secure scope</span></div></div><div className="ai-context-list">{contextStats.map((item) => <div key={item.label}><span>{item.icon}</span><div><small>{item.label}</small><strong>{item.value}</strong></div></div>)}</div></Card><Card className="ai-usage"><div><span>Monthly AI credits</span><strong>7,420 / 10,000</strong></div><div className="progress"><span style={{ width: "74.2%" }} /></div><small>Resets on 1 August 2026</small></Card></aside></div>
  </div>;
}
