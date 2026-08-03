'use client';

import { useEffect, useId, useRef } from 'react';
import { X, Search, Plus, SlidersHorizontal, Download } from 'lucide-react';

export function PageHeader({
  title,
  subtitle,
  action,
  onAction,
  secondaryAction,
  onSecondaryAction,
}: {
  title: string;
  subtitle?: string;
  action?: string;
  onAction?: () => void;
  secondaryAction?: string;
  onSecondaryAction?: () => void;
}) {
  return (
    <div className="page-head">
      <div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
      {(action || secondaryAction) && (
        <div className="page-actions">
          {secondaryAction && <button className="btn secondary" onClick={onSecondaryAction}><Download size={17} />{secondaryAction}</button>}
          {action && <button className="btn" onClick={onAction}><Plus size={18} />{action}</button>}
        </div>
      )}
    </div>
  );
}

export function Modal({ title, onClose, children, wide = false, extraWide = false }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean; extraWide?: boolean }) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>('button, input, select, textarea, [tabindex]:not([tabindex="-1"])')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    document.body.classList.add('modal-open');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('modal-open');
      previous?.focus();
    };
  }, [onClose]);
  return (
    <div className="overlay" onMouseDown={onClose}>
      <div ref={dialogRef} className={`modal ${wide ? 'wide' : ''} ${extraWide ? 'extra-wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-head"><h2 id={titleId}>{title}</h2><button className="icon-btn" aria-label="Close dialog" onClick={onClose}><X /></button></div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({ title, body, confirmLabel = 'Confirm', tone = 'normal', onConfirm, onClose }: { title: string; body: string; confirmLabel?: string; tone?: 'normal' | 'danger'; onConfirm: () => void; onClose: () => void }) {
  return (
    <Modal title={title} onClose={onClose}>
      <p className="modal-copy">{body}</p>
      <div className="modal-actions"><button className="btn ghost" onClick={onClose}>Cancel</button><button className={`btn ${tone === 'danger' ? 'danger' : ''}`} onClick={onConfirm}>{confirmLabel}</button></div>
    </Modal>
  );
}

export function SearchBar({ value, onChange, placeholder = 'Search...' }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <div className="search"><Search size={18} /><input aria-label={placeholder} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></div>;
}

export function FilterButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return <button className={`btn secondary ${open ? 'selected' : ''}`} onClick={onClick}><SlidersHorizontal size={17} />Filters</button>;
}

export function Empty({ title, body }: { title: string; body: string }) {
  return <div className="empty"><h3>{title}</h3><p>{body}</p></div>;
}

export function Status({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'good' | 'warn' | 'bad' | 'neutral' | 'info' }) {
  return <span className={`status ${tone}`}>{children}</span>;
}
