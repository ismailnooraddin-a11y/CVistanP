"use client";

import {
  BadgeDollarSign,
  Banknote,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  Download,
  FileText,
  Filter,
  Landmark,
  MoreHorizontal,
  Plus,
  ReceiptText,
  TrendingUp,
  WalletCards
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import { useWorkspace } from "@/store/workspace-store";
import { Avatar, Badge, Button, Card, CardHeader, Input, Modal, PageHeader, Progress, SearchInput, Select, StatCard, cn, useToast } from "@/components/ui";

const invoiceTone = {
  draft: "neutral",
  sent: "info",
  partial: "warning",
  paid: "success",
  overdue: "danger"
} as const;

function CashflowChart() {
  const inflow = [38, 48, 45, 62, 58, 76, 82, 71, 94, 88, 102, 116];
  const outflow = [22, 26, 25, 34, 32, 41, 39, 44, 47, 43, 49, 51];
  const line = (values: number[]) => values.map((value, index) => `${(index / (values.length - 1)) * 100},${115 - value}`).join(" ");
  return <div className="cashflow-chart"><svg viewBox="0 0 100 120" preserveAspectRatio="none"><line x1="0" x2="100" y1="30" y2="30" className="chart-gridline" /><line x1="0" x2="100" y1="60" y2="60" className="chart-gridline" /><line x1="0" x2="100" y1="90" y2="90" className="chart-gridline" /><polyline points={line(inflow)} className="cashflow-line cashflow-line--in" fill="none" vectorEffect="non-scaling-stroke" /><polyline points={line(outflow)} className="cashflow-line cashflow-line--out" fill="none" vectorEffect="non-scaling-stroke" /></svg><div className="chart-axis"><span>Aug</span><span>Oct</span><span>Dec</span><span>Feb</span><span>Apr</span><span>Jun</span><span>Jul</span></div></div>;
}

export function FinanceOverviewPage() {
  const { tenant } = useWorkspace();
  const collected = tenant.payments.reduce((sum, item) => sum + item.amount, 0);
  const outstanding = tenant.invoices.filter((item) => item.status !== "paid").reduce((sum, item) => sum + item.amount, 0);
  return <div className="page-stack"><PageHeader eyebrow="Financial operations" title="Finance overview" description="Monitor collections, receivables, commissions, expenses, and operational cash movement." actions={<><Button variant="secondary"><Download size={17} /> Export report</Button><Button><Plus size={17} /> Record transaction</Button></>} />
    <div className="metrics-grid metrics-grid--4"><StatCard label="Collected this month" value={formatCurrency(collected)} change={18.4} icon={<CircleDollarSign size={21} />} tone="green" detail="confirmed payments" /><StatCard label="Outstanding" value={formatCurrency(outstanding)} change={-4.2} icon={<CalendarClock size={21} />} tone="amber" detail="open receivables" /><StatCard label="Commission liability" value={formatCurrency(tenant.commissions.filter((item) => item.status !== "paid").reduce((sum, item) => sum + item.amount, 0))} icon={<BadgeDollarSign size={21} />} tone="brand" detail="pending and approved" /><StatCard label="Collection rate" value="84.7%" change={5.1} icon={<TrendingUp size={21} />} tone="blue" detail="rolling 90 days" /></div>
    <div className="dashboard-grid dashboard-grid--wide"><Card><CardHeader title="Cash movement" description="Collections and operating outflow" action={<div className="chart-legend"><span><i className="legend-in" /> Inflow</span><span><i className="legend-out" /> Outflow</span></div>} /><div className="finance-summary"><div><span>Net cash position</span><strong>$96,240</strong><Badge tone="success">+14.8%</Badge></div><div><small>Average monthly inflow</small><strong>$42,180</strong></div></div><CashflowChart /></Card><Card><CardHeader title="Receivables health" description="Invoice status distribution" /><div className="donut-wrap"><div className="donut donut--finance"><div><strong>84.7%</strong><span>collected</span></div></div><div className="donut-legend"><div><i className="dot-success" /><span>Paid</span><strong>{formatCurrency(tenant.invoices.filter((item) => item.status === "paid").reduce((sum, item) => sum + item.amount, 0))}</strong></div><div><i className="dot-info" /><span>Open</span><strong>{formatCurrency(tenant.invoices.filter((item) => ["sent", "partial"].includes(item.status)).reduce((sum, item) => sum + item.amount, 0))}</strong></div><div><i className="dot-danger" /><span>Overdue</span><strong>{formatCurrency(tenant.invoices.filter((item) => item.status === "overdue").reduce((sum, item) => sum + item.amount, 0))}</strong></div></div></div></Card></div>
    <div className="dashboard-grid dashboard-grid--halves"><Card><CardHeader title="Recent payments" description="Latest verified transactions" action={<Button variant="ghost" size="sm">View all</Button>} /><div className="transaction-list">{tenant.payments.map((payment) => { const invoice = tenant.invoices.find((item) => item.id === payment.invoiceId); return <div className="transaction-row" key={payment.id}><span className="transaction-row__icon"><Banknote size={18} /></span><div><strong>{invoice?.customerName ?? "Customer"}</strong><small>{invoice?.reference} · {payment.method}</small></div><span><strong>{formatCurrency(payment.amount)}</strong><small>{formatDate(payment.paidAt)}</small></span></div>; })}</div></Card><Card><CardHeader title="Finance actions" description="Workflow shortcuts" /><div className="quick-action-grid"><button><ReceiptText size={21} /><strong>Create invoice</strong><span>Bill a customer or owner</span></button><button><CreditCard size={21} /><strong>Record payment</strong><span>Apply money to an invoice</span></button><button><WalletCards size={21} /><strong>Add expense</strong><span>Capture operating spend</span></button><button><BadgeDollarSign size={21} /><strong>Run commissions</strong><span>Review agent earnings</span></button></div></Card></div>
  </div>;
}

function InvoiceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addInvoice, can } = useWorkspace();
  const toast = useToast();
  const [form, setForm] = useState({ customerName: "", amount: "", dueDate: "2026-07-31", currency: "USD" });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!can("manage:finance")) { toast({ title: "Permission denied", message: "This role cannot create invoices.", tone: "danger" }); return; }
    if (!form.customerName || !form.amount || !form.dueDate) { toast({ title: "Missing information", message: "Customer, amount, and due date are required.", tone: "warning" }); return; }
    addInvoice({ customerName: form.customerName, amount: Number(form.amount), dueDate: form.dueDate, currency: form.currency as "USD" | "IQD" });
    toast({ title: "Invoice draft created", message: "Review the invoice before sending it to the customer.", tone: "success" });
    onClose();
  };
  return <Modal open={open} onClose={onClose} title="Create invoice" description="Create an auditable customer or owner receivable." footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" form="invoice-form"><ReceiptText size={17} /> Create invoice</Button></>}><form id="invoice-form" className="form-grid" onSubmit={submit}><Input label="Customer / company" value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} placeholder="Customer name" className="form-grid__full" /><Input label="Amount" type="number" min="0" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} /><Select label="Currency" value={form.currency} onChange={(event) => setForm({ ...form, currency: event.target.value })}><option>USD</option><option>IQD</option></Select><Input label="Due date" type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} /><Select label="Payment terms"><option>Due on receipt</option><option>Net 7 days</option><option>Net 14 days</option><option>Net 30 days</option></Select></form></Modal>;
}

export function InvoicesPage() {
  const { tenant, markInvoicePaid, can } = useWorkspace();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const invoices = tenant.invoices.filter((item) => `${item.reference} ${item.customerName}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="page-stack"><PageHeader eyebrow="Accounts receivable" title="Invoices" description="Create, send, track, and reconcile customer and owner billing." actions={<Button onClick={() => setModalOpen(true)}><Plus size={17} /> Create invoice</Button>} /><Card className="toolbar-card"><div className="module-toolbar"><SearchInput value={search} onChange={setSearch} placeholder="Search invoices and customers..." /><div className="module-toolbar__actions"><Button variant="secondary"><Filter size={16} /> Filters</Button><Button variant="secondary"><Download size={16} /> Export</Button></div></div></Card><Card className="table-card"><div className="data-table-wrap"><table className="data-table"><thead><tr><th>Invoice</th><th>Customer</th><th>Created</th><th>Due date</th><th>Amount</th><th>Status</th><th>Action</th><th /></tr></thead><tbody>{invoices.map((invoice) => <tr key={invoice.id}><td><div className="document-cell"><span className="document-cell__icon"><ReceiptText size={18} /></span><strong>{invoice.reference}</strong></div></td><td>{invoice.customerName}</td><td>{formatDate(invoice.createdAt)}</td><td>{formatDate(invoice.dueDate)}</td><td><strong>{formatCurrency(invoice.amount, invoice.currency)}</strong></td><td><Badge tone={invoiceTone[invoice.status]}>{invoice.status}</Badge></td><td>{invoice.status !== "paid" ? <Button variant="ghost" size="sm" onClick={() => { if (!can("manage:finance")) { toast({ title: "Permission denied", tone: "danger" }); return; } markInvoicePaid(invoice.id); toast({ title: "Payment recorded", message: `${invoice.reference} is now paid.`, tone: "success" }); }}><CheckCircle2 size={15} /> Mark paid</Button> : <span className="success-text"><CheckCircle2 size={15} /> Reconciled</span>}</td><td><button className="icon-button icon-button--small"><MoreHorizontal size={16} /></button></td></tr>)}</tbody></table></div></Card><InvoiceModal open={modalOpen} onClose={() => setModalOpen(false)} /></div>;
}

export function PaymentsPage() {
  const { tenant } = useWorkspace();
  return <div className="page-stack"><PageHeader eyebrow="Cash application" title="Payments" description="Record, verify, allocate, refund, and reconcile every customer payment." actions={<Button><Plus size={17} /> Record payment</Button>} /><div className="metrics-grid metrics-grid--4 metrics-grid--compact"><StatCard label="Payments this month" value={tenant.payments.length} icon={<CreditCard size={20} />} tone="brand" detail="verified receipts" /><StatCard label="Total collected" value={formatCurrency(tenant.payments.reduce((sum, item) => sum + item.amount, 0))} icon={<CircleDollarSign size={20} />} tone="green" detail="all methods" /><StatCard label="Bank transfers" value={tenant.payments.filter((item) => item.method === "bank").length} icon={<Landmark size={20} />} tone="blue" detail="auto-reconciliation ready" /><StatCard label="Unallocated" value="$0" icon={<WalletCards size={20} />} tone="amber" detail="all payments matched" /></div><Card className="table-card"><CardHeader title="Payment register" description="Verified money movement" action={<Button variant="secondary"><Download size={16} /> Export</Button>} /><div className="data-table-wrap"><table className="data-table"><thead><tr><th>Payment</th><th>Invoice</th><th>Customer</th><th>Method</th><th>Reference</th><th>Paid at</th><th>Amount</th><th>Status</th></tr></thead><tbody>{tenant.payments.map((payment) => { const invoice = tenant.invoices.find((item) => item.id === payment.invoiceId); return <tr key={payment.id}><td><strong>{payment.id.toUpperCase()}</strong></td><td>{invoice?.reference}</td><td>{invoice?.customerName}</td><td><Badge tone="info">{payment.method}</Badge></td><td>{payment.reference}</td><td>{formatDateTime(payment.paidAt)}</td><td><strong>{formatCurrency(payment.amount)}</strong></td><td><Badge tone="success"><CheckCircle2 size={12} /> Verified</Badge></td></tr>; })}</tbody></table></div></Card></div>;
}

export function InstallmentsPage() {
  const schedules = [
    { customer: "Aram Hussein", property: "Family Apartment near Park", total: 112000, paid: 67200, next: 11200, due: "2026-08-01", progress: 60 },
    { customer: "Dilan Karim", property: "Prime Retail Corner", total: 50400, paid: 5000, next: 4200, due: "2026-08-16", progress: 10 },
    { customer: "Rebin Mustafa", property: "Contemporary Villa", total: 385000, paid: 77000, next: 38500, due: "2026-09-01", progress: 20 }
  ];
  return <div className="page-stack"><PageHeader eyebrow="Payment schedules" title="Installments" description="Manage structured payment plans, due dates, collections, and customer reminders." actions={<Button><Plus size={17} /> Create schedule</Button>} /><div className="installment-grid">{schedules.map((schedule) => <Card className="installment-card" key={schedule.customer}><div className="installment-card__top"><div className="person-cell"><Avatar name={schedule.customer} size="md" /><span><strong>{schedule.customer}</strong><small>{schedule.property}</small></span></div><button className="icon-button icon-button--small"><MoreHorizontal size={16} /></button></div><div className="installment-card__amounts"><span><small>Contract total</small><strong>{formatCurrency(schedule.total)}</strong></span><span><small>Collected</small><strong>{formatCurrency(schedule.paid)}</strong></span></div><Progress value={schedule.progress} label={`${schedule.progress}% collected`} /><div className="installment-card__next"><CalendarClock size={18} /><div><small>Next installment</small><strong>{formatCurrency(schedule.next)} · {formatDate(schedule.due)}</strong></div><Button variant="secondary" size="sm">Send reminder</Button></div></Card>)}</div></div>;
}

export function ExpensesPage() {
  const expenses = [
    { ref: "EXP-2048", vendor: "Meta Platforms", category: "Marketing", branch: "Erbil HQ", amount: 2830, date: "2026-07-16", status: "approved" },
    { ref: "EXP-2047", vendor: "CoolAir Services", category: "Maintenance", branch: "Dream City", amount: 450, date: "2026-07-15", status: "pending" },
    { ref: "EXP-2046", vendor: "Office Line", category: "Office supplies", branch: "Erbil HQ", amount: 318, date: "2026-07-14", status: "paid" },
    { ref: "EXP-2045", vendor: "FastNet", category: "Utilities", branch: "Sulaymaniyah", amount: 220, date: "2026-07-12", status: "paid" }
  ];
  return <div className="page-stack"><PageHeader eyebrow="Operating spend" title="Expenses" description="Capture, approve, categorize, and allocate agency expenses by branch and department." actions={<Button><Plus size={17} /> Add expense</Button>} /><Card className="table-card"><CardHeader title="Expense register" description="Operational and property-related spend" action={<Button variant="secondary"><Filter size={16} /> Filter</Button>} /><div className="data-table-wrap"><table className="data-table"><thead><tr><th>Expense</th><th>Vendor</th><th>Category</th><th>Branch</th><th>Date</th><th>Amount</th><th>Status</th><th /></tr></thead><tbody>{expenses.map((expense) => <tr key={expense.ref}><td><strong>{expense.ref}</strong></td><td>{expense.vendor}</td><td>{expense.category}</td><td>{expense.branch}</td><td>{formatDate(expense.date)}</td><td><strong>{formatCurrency(expense.amount)}</strong></td><td><Badge tone={expense.status === "paid" ? "success" : expense.status === "approved" ? "info" : "warning"}>{expense.status}</Badge></td><td><button className="icon-button icon-button--small"><MoreHorizontal size={16} /></button></td></tr>)}</tbody></table></div></Card></div>;
}

export function CommissionsPage() {
  const { tenant } = useWorkspace();
  const total = tenant.commissions.reduce((sum, item) => sum + item.amount, 0);
  return <div className="page-stack"><PageHeader eyebrow="Agent compensation" title="Commissions" description="Calculate, approve, and pay commissions using transparent, auditable rules." actions={<><Button variant="secondary">Commission rules</Button><Button><BadgeDollarSign size={17} /> Run commission batch</Button></>} /><div className="metrics-grid metrics-grid--4 metrics-grid--compact"><StatCard label="Earned this month" value={formatCurrency(total)} change={8.1} icon={<BadgeDollarSign size={20} />} tone="brand" detail="gross commission" /><StatCard label="Pending approval" value={formatCurrency(tenant.commissions.filter((item) => item.status === "pending").reduce((sum, item) => sum + item.amount, 0))} icon={<CalendarClock size={20} />} tone="amber" detail="manager review" /><StatCard label="Approved" value={formatCurrency(tenant.commissions.filter((item) => item.status === "approved").reduce((sum, item) => sum + item.amount, 0))} icon={<CheckCircle2 size={20} />} tone="green" detail="ready for payroll" /><StatCard label="Average rate" value="1.8%" icon={<TrendingUp size={20} />} tone="blue" detail="of transaction value" /></div><Card className="table-card"><CardHeader title="Commission ledger" description="Earnings generated by closed and reserved deals" /><div className="data-table-wrap"><table className="data-table"><thead><tr><th>Agent</th><th>Contract</th><th>Customer</th><th>Earned date</th><th>Amount</th><th>Status</th><th>Approval</th><th /></tr></thead><tbody>{tenant.commissions.map((commission) => { const employee = tenant.employees.find((item) => item.id === commission.employeeId); const contract = tenant.contracts.find((item) => item.id === commission.contractId); return <tr key={commission.id}><td><div className="person-cell"><Avatar name={employee ? `${employee.firstName} ${employee.lastName}` : "Agent"} size="sm" /><span><strong>{employee?.firstName} {employee?.lastName}</strong><small>{employee?.jobTitle}</small></span></div></td><td>{contract?.reference}</td><td>{contract?.customerName}</td><td>{formatDate(commission.earnedAt)}</td><td><strong>{formatCurrency(commission.amount)}</strong></td><td><Badge tone={commission.status === "approved" ? "success" : commission.status === "pending" ? "warning" : "info"}>{commission.status}</Badge></td><td>{commission.status === "pending" ? <Button variant="ghost" size="sm">Approve</Button> : <span className="success-text"><CheckCircle2 size={15} /> Approved</span>}</td><td><button className="icon-button icon-button--small"><MoreHorizontal size={16} /></button></td></tr>; })}</tbody></table></div></Card></div>;
}
