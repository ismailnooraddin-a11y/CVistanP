"use client";

import { X, Search, TrendingDown, TrendingUp } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes
} from "react";
import { initials } from "@/lib/format";

export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg" | "icon";
}) {
  return (
    <button className={cn("button", `button--${variant}`, `button--${size}`, className)} {...props}>
      {children}
    </button>
  );
}

export function Card({ children, className, interactive = false }: { children: ReactNode; className?: string; interactive?: boolean }) {
  return <section className={cn("card", interactive && "card--interactive", className)}>{children}</section>;
}

export function CardHeader({
  title,
  description,
  action
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="card__header">
      <div>
        <h2 className="card__title">{title}</h2>
        {description ? <p className="card__description">{description}</p> : null}
      </div>
      {action ? <div className="card__action">{action}</div> : null}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
  dot = false
}: {
  children: ReactNode;
  tone?: "neutral" | "info" | "success" | "warning" | "danger" | "purple";
  dot?: boolean;
}) {
  return (
    <span className={cn("badge", `badge--${tone}`)}>
      {dot ? <span className="badge__dot" /> : null}
      {children}
    </span>
  );
}

export function Avatar({ name, size = "md", status }: { name: string; size?: "sm" | "md" | "lg" | "xl"; status?: string }) {
  return (
    <span className={cn("avatar", `avatar--${size}`)} aria-label={name} title={name}>
      {initials(name)}
      {status ? <span className={cn("avatar__status", `avatar__status--${status}`)} /> : null}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div className="page-header__copy">
        {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {actions ? <div className="page-header__actions">{actions}</div> : null}
    </header>
  );
}

export function StatCard({
  label,
  value,
  change,
  icon,
  detail,
  tone = "brand"
}: {
  label: string;
  value: ReactNode;
  change?: number;
  icon: ReactNode;
  detail?: string;
  tone?: "brand" | "green" | "amber" | "rose" | "blue";
}) {
  return (
    <Card className="stat-card">
      <div className={cn("stat-card__icon", `stat-card__icon--${tone}`)}>{icon}</div>
      <div className="stat-card__content">
        <span className="stat-card__label">{label}</span>
        <strong className="stat-card__value">{value}</strong>
        <div className="stat-card__meta">
          {typeof change === "number" ? (
            <span className={cn("trend", change >= 0 ? "trend--up" : "trend--down")}>
              {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {Math.abs(change)}%
            </span>
          ) : null}
          {detail ? <span>{detail}</span> : null}
        </div>
      </div>
    </Card>
  );
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md"
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  useEffect(() => {
    if (!open) return;
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", listener);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", listener);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className={cn("modal", `modal--${size}`)} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal__header">
          <div>
            <h2 id="modal-title">{title}</h2>
            {description ? <p>{description}</p> : null}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close dialog">
            <X size={19} />
          </Button>
        </div>
        <div className="modal__body">{children}</div>
        {footer ? <div className="modal__footer">{footer}</div> : null}
      </div>
    </div>
  );
}

export function Input({ label, hint, error, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string; error?: string }) {
  return (
    <label className={cn("field", className)}>
      {label ? <span className="field__label">{label}</span> : null}
      <input className={cn("input", error && "input--error")} {...props} />
      {error ? <span className="field__error">{error}</span> : hint ? <span className="field__hint">{hint}</span> : null}
    </label>
  );
}

export function Select({ label, children, className, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label?: string; children: ReactNode }) {
  return (
    <label className={cn("field", className)}>
      {label ? <span className="field__label">{label}</span> : null}
      <select className="select" {...props}>
        {children}
      </select>
    </label>
  );
}

export function Textarea({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <label className="field">
      {label ? <span className="field__label">{label}</span> : null}
      <textarea className="textarea" {...props} />
    </label>
  );
}

export function SearchInput({ value, onChange, placeholder = "Search..." }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="search-input">
      <Search size={17} />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-label={placeholder} />
      {value ? (
        <button type="button" onClick={() => onChange("")} aria-label="Clear search">
          <X size={15} />
        </button>
      ) : null}
    </label>
  );
}

export function Tabs({
  items,
  active,
  onChange
}: {
  items: Array<{ id: string; label: string; count?: number }>;
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="tabs" role="tablist">
      {items.map((item) => (
        <button
          type="button"
          role="tab"
          aria-selected={active === item.id}
          className={cn("tabs__item", active === item.id && "tabs__item--active")}
          key={item.id}
          onClick={() => onChange(item.id)}
        >
          {item.label}
          {typeof item.count === "number" ? <span>{item.count}</span> : null}
        </button>
      ))}
    </div>
  );
}

export function Progress({ value, label }: { value: number; label?: string }) {
  return (
    <div className="progress-wrap">
      <div className="progress" aria-label={label} aria-valuenow={value} role="progressbar">
        <span style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
      {label ? <span className="progress__label">{label}</span> : null}
    </div>
  );
}

export function EmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}

interface ToastItem {
  id: number;
  title: string;
  message?: string;
  tone: "success" | "info" | "warning" | "danger";
}

const ToastContext = createContext<{ toast: (item: Omit<ToastItem, "id">) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toast = useCallback((item: Omit<ToastItem, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { ...item, id }]);
    window.setTimeout(() => setToasts((current) => current.filter((toastItem) => toastItem.id !== id)), 4200);
  }, []);
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {toasts.map((item) => (
          <div className={cn("toast", `toast--${item.tone}`)} key={item.id}>
            <div>
              <strong>{item.title}</strong>
              {item.message ? <p>{item.message}</p> : null}
            </div>
            <button onClick={() => setToasts((current) => current.filter((toastItem) => toastItem.id !== item.id))} aria-label="Dismiss notification">
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used inside ToastProvider");
  return value.toast;
}
