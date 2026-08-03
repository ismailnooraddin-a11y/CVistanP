import { Currency } from './types';

function localParts(date: Date) {
  return {
    year: date.getFullYear(),
    month: String(date.getMonth() + 1).padStart(2, '0'),
    day: String(date.getDate()).padStart(2, '0'),
    hour: String(date.getHours()).padStart(2, '0'),
    minute: String(date.getMinutes()).padStart(2, '0'),
  };
}

export const localDate = (value: string) => {
  if (!value) return '—';
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const money = (value: number, currency: Currency = 'USD') => {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: currency === 'IQD' ? 0 : 2 }).format(value);
};

export const todayInput = () => {
  const parts = localParts(new Date());
  return `${parts.year}-${parts.month}-${parts.day}`;
};

export const localDateTimeInput = () => {
  const parts = localParts(new Date());
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
};

export const dateInputFrom = (date: Date) => {
  const parts = localParts(date);
  return `${parts.year}-${parts.month}-${parts.day}`;
};

export const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const normalizePhone = (value: string) => value.replace(/[^+\d]/g, '').replace(/(?!^)\+/g, '');

export const isOverdue = (date: string, time = '23:59') => new Date(`${date}T${time}:00`).getTime() < Date.now();

export const fileSafe = (value: string) => value.trim().replace(/[^a-zA-Z0-9-_]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'export';
