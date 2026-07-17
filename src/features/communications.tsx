"use client";

import {
  Archive,
  AtSign,
  CheckCheck,
  Clock3,
  FileText,
  Headphones,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  PhoneCall,
  Plus,
  Search,
  Send,
  Smile,
  Sparkles,
  Star,
  UsersRound
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { formatDateTime, relativeDate } from "@/lib/format";
import { useWorkspace } from "@/store/workspace-store";
import { Avatar, Badge, Button, Card, CardHeader, PageHeader, SearchInput, StatCard, Tabs, cn, useToast } from "@/components/ui";

export function InboxPage() {
  const { tenant, sendMessage, can } = useWorkspace();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(tenant.conversations[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const conversations = tenant.conversations.filter((item) => `${item.customerName} ${item.lastMessage}`.toLowerCase().includes(search.toLowerCase()));
  const selected = tenant.conversations.find((item) => item.id === selectedId) ?? conversations[0];
  const messages = tenant.messages.filter((item) => item.conversationId === selected?.id);
  const assignee = tenant.employees.find((item) => item.id === selected?.assignedTo);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!selected || !message.trim()) return;
    if (!can("manage:communications")) {
      toast({ title: "Permission denied", message: "This role cannot send messages.", tone: "danger" });
      return;
    }
    sendMessage(selected.id, message);
    setMessage("");
    toast({ title: "Message sent", message: `Delivered through ${selected.channel}.`, tone: "success" });
  };

  return (
    <div className="page-stack page-stack--full-height">
      <PageHeader eyebrow="Communications" title="Unified inbox" description="Handle WhatsApp, email, and SMS conversations with complete customer context." actions={<><Button variant="secondary"><UsersRound size={17} /> Team inbox</Button><Button><Plus size={17} /> New conversation</Button></>} />
      <Card className="inbox-shell">
        <aside className="inbox-sidebar">
          <div className="inbox-sidebar__header"><strong>Conversations</strong><button className="icon-button icon-button--small"><MoreHorizontal size={17} /></button></div>
          <div className="inbox-sidebar__search"><SearchInput value={search} onChange={setSearch} placeholder="Search conversations" /></div>
          <Tabs active="all" onChange={() => undefined} items={[{ id: "all", label: "All", count: conversations.length }, { id: "unread", label: "Unread", count: conversations.filter((item) => item.unread > 0).length }]} />
          <div className="conversation-list">
            {conversations.map((conversation) => (
              <button type="button" className={cn("conversation-item", selected?.id === conversation.id && "conversation-item--active")} key={conversation.id} onClick={() => setSelectedId(conversation.id)}>
                <Avatar name={conversation.customerName} size="md" status={conversation.unread ? "online" : undefined} />
                <span className="conversation-item__content"><span><strong>{conversation.customerName}</strong><time>{relativeDate(conversation.updatedAt)}</time></span><p>{conversation.lastMessage}</p><small><i className={`channel-dot channel-dot--${conversation.channel}`} />{conversation.channel}{conversation.unread ? <b>{conversation.unread}</b> : null}</small></span>
              </button>
            ))}
          </div>
        </aside>
        {selected ? <section className="chat-panel">
          <header className="chat-panel__header">
            <div className="chat-person"><Avatar name={selected.customerName} size="md" status="online" /><div><strong>{selected.customerName}</strong><span><i /> Online · {selected.channel}</span></div></div>
            <div className="chat-panel__actions"><button className="icon-button"><PhoneCall size={18} /></button><button className="icon-button"><Star size={18} /></button><button className="icon-button"><MoreHorizontal size={18} /></button></div>
          </header>
          <div className="chat-context-bar"><span><Sparkles size={15} /> AI summary: Interested in a Dream City villa; requested an afternoon viewing and financing details.</span><button>Open lead</button></div>
          <div className="message-thread">
            <div className="thread-date">Today</div>
            {messages.map((item) => <div className={cn("message-row", item.direction === "outbound" && "message-row--outbound")} key={item.id}><Avatar name={item.senderName} size="sm" /><div className="message-bubble"><p>{item.body}</p><span>{new Date(item.sentAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}{item.direction === "outbound" ? <CheckCheck size={14} /> : null}</span></div></div>)}
          </div>
          <form className="message-composer" onSubmit={submit}><div className="message-composer__tools"><button type="button"><Paperclip size={18} /></button><button type="button"><Smile size={18} /></button><button type="button" className="ai-write"><Sparkles size={16} /> Suggest reply</button></div><div className="message-composer__input"><textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder={`Message ${selected.customerName}`} rows={2} /><Button type="submit" size="icon" aria-label="Send message"><Send size={18} /></Button></div><small>Enter to send · Shift + Enter for a new line</small></form>
        </section> : null}
        {selected ? <aside className="inbox-context">
          <div className="inbox-context__profile"><Avatar name={selected.customerName} size="xl" status="online" /><h3>{selected.customerName}</h3><p>Prospective buyer</p><div className="inline-actions"><button className="icon-button"><PhoneCall size={17} /></button><button className="icon-button"><Mail size={17} /></button><button className="icon-button"><AtSign size={17} /></button></div></div>
          <div className="context-section"><span>Assigned to</span><div className="mini-person"><Avatar name={assignee ? `${assignee.firstName} ${assignee.lastName}` : "Unassigned"} size="sm" /><strong>{assignee ? `${assignee.firstName} ${assignee.lastName}` : "Unassigned"}</strong></div></div>
          <div className="context-section"><span>Lead details</span><dl><div><dt>Status</dt><dd><Badge tone="purple">New lead</Badge></dd></div><div><dt>Budget</dt><dd>$260,000</dd></div><div><dt>Interest</dt><dd>Dream City villa</dd></div><div><dt>Source</dt><dd>Meta Ads</dd></div></dl></div>
          <div className="context-section"><span>Shared files</span><div className="file-row"><FileText size={18} /><div><strong>Villa brochure.pdf</strong><small>4.2 MB</small></div></div></div>
        </aside> : null}
      </Card>
    </div>
  );
}

export function EmailPage() {
  const emails = [
    { from: "Dilan Karim", subject: "Re: Revised reservation terms", preview: "Thank you. Please adjust the expiry date before I sign...", time: "08:50", unread: true, tag: "Deal" },
    { from: "Aso Property Holdings", subject: "New listing mandate documents", preview: "Attached are the ownership documents for the Gulan office...", time: "Yesterday", unread: false, tag: "Owner" },
    { from: "North Bank Iraq", subject: "Mortgage pre-approval confirmation", preview: "We confirm that the applicant has received preliminary approval...", time: "16 Jul", unread: false, tag: "Finance" },
    { from: "Property Finder", subject: "Weekly listing performance", preview: "Your listings generated 1,842 views and 37 enquiries this week...", time: "15 Jul", unread: false, tag: "Portal" }
  ];
  return <div className="page-stack"><PageHeader eyebrow="Communications" title="Email workspace" description="Manage customer email, shared mailboxes, templates, and property correspondence." actions={<Button><Mail size={17} /> Compose</Button>} /><div className="email-layout"><Card className="email-folders"><Button className="email-compose"><Plus size={16} /> Compose</Button>{["Inbox", "Starred", "Sent", "Drafts", "Archived"].map((folder, index) => <button className={cn("email-folder", index === 0 && "email-folder--active")} key={folder}>{index === 0 ? <Mail size={17} /> : index === 1 ? <Star size={17} /> : index === 4 ? <Archive size={17} /> : <FileText size={17} />}<span>{folder}</span>{index === 0 ? <b>3</b> : null}</button>)}</Card><Card className="email-list-card"><div className="email-toolbar"><Search size={17} /><input placeholder="Search email" /><button className="icon-button icon-button--small"><MoreHorizontal size={17} /></button></div><div className="email-list">{emails.map((email) => <article className={cn("email-row", email.unread && "email-row--unread")} key={email.subject}><button><Star size={16} /></button><Avatar name={email.from} size="sm" /><div className="email-row__copy"><div><strong>{email.from}</strong><Badge tone="neutral">{email.tag}</Badge><time>{email.time}</time></div><h3>{email.subject}</h3><p>{email.preview}</p></div></article>)}</div></Card></div></div>;
}

export function CallsPage() {
  const calls = [
    { name: "Ahmed Salih", type: "Inbound", duration: "04:18", time: "Today, 10:42", agent: "Sara Kareem", outcome: "Viewing scheduled" },
    { name: "Shirin Omar", type: "Outbound", duration: "02:51", time: "Today, 09:18", agent: "Diyar Omer", outcome: "Follow-up" },
    { name: "Dilan Karim", type: "Inbound", duration: "06:02", time: "Yesterday, 16:05", agent: "Sara Kareem", outcome: "Proposal requested" },
    { name: "Lavin Hamad", type: "Missed", duration: "—", time: "Yesterday, 13:21", agent: "Unassigned", outcome: "Callback due" }
  ];
  return <div className="page-stack"><PageHeader eyebrow="Communications" title="Call activity" description="Track call history, outcomes, recordings, and follow-up commitments." actions={<Button><PhoneCall size={17} /> Start call</Button>} /><div className="metrics-grid metrics-grid--4 metrics-grid--compact"><StatCard label="Calls today" value="18" change={12} icon={<PhoneCall size={20} />} tone="brand" detail="1h 24m total" /><StatCard label="Answer rate" value="91%" change={4} icon={<Headphones size={20} />} tone="green" detail="inbound calls" /><StatCard label="Avg. duration" value="4m 08s" icon={<Clock3 size={20} />} tone="blue" detail="connected calls" /><StatCard label="Follow-ups created" value="9" change={8} icon={<CheckCheck size={20} />} tone="amber" detail="from call outcomes" /></div><Card className="table-card"><CardHeader title="Call register" description="Connected telephony activity" /><div className="data-table-wrap"><table className="data-table"><thead><tr><th>Contact</th><th>Direction</th><th>Time</th><th>Duration</th><th>Agent</th><th>Outcome</th><th>Recording</th><th /></tr></thead><tbody>{calls.map((call) => <tr key={`${call.name}-${call.time}`}><td><div className="person-cell"><Avatar name={call.name} size="sm" /><strong>{call.name}</strong></div></td><td><Badge tone={call.type === "Missed" ? "danger" : call.type === "Inbound" ? "success" : "info"}>{call.type}</Badge></td><td>{call.time}</td><td>{call.duration}</td><td>{call.agent}</td><td>{call.outcome}</td><td>{call.duration !== "—" ? <Button variant="ghost" size="sm">Play</Button> : "—"}</td><td><button className="icon-button icon-button--small"><MoreHorizontal size={16} /></button></td></tr>)}</tbody></table></div></Card></div>;
}

export function TemplatesPage() {
  const templates = [
    { title: "New lead welcome", channel: "WhatsApp", category: "Sales", body: "Hello {{first_name}}, thank you for contacting {{company_name}}...", usage: 128 },
    { title: "Viewing confirmation", channel: "WhatsApp", category: "Operations", body: "Your viewing for {{property_title}} is confirmed for {{date_time}}...", usage: 94 },
    { title: "Property shortlist", channel: "Email", category: "Sales", body: "We selected the following properties based on your requirements...", usage: 61 },
    { title: "Payment reminder", channel: "Email", category: "Finance", body: "This is a friendly reminder that invoice {{invoice_reference}}...", usage: 22 }
  ];
  return <div className="page-stack"><PageHeader eyebrow="Communications" title="Message templates" description="Create approved, reusable communication for consistent customer experiences." actions={<Button><Plus size={17} /> New template</Button>} /><div className="template-grid">{templates.map((template) => <Card interactive className="template-card" key={template.title}><div className="template-card__top"><span className={`template-channel template-channel--${template.channel.toLowerCase()}`}>{template.channel === "Email" ? <Mail size={18} /> : <MessageCircle size={18} />}</span><Badge tone="neutral">{template.category}</Badge><button className="icon-button icon-button--small"><MoreHorizontal size={16} /></button></div><h3>{template.title}</h3><p>{template.body}</p><div className="template-card__footer"><span>Used {template.usage} times</span><Button variant="secondary" size="sm">Edit</Button></div></Card>)}</div></div>;
}
