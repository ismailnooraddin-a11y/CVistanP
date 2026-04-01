import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return crypto.randomUUID();
}

export const MONTHS = [
  { value: 1, labelEn: 'January', labelAr: 'يناير' },
  { value: 2, labelEn: 'February', labelAr: 'فبراير' },
  { value: 3, labelEn: 'March', labelAr: 'مارس' },
  { value: 4, labelEn: 'April', labelAr: 'أبريل' },
  { value: 5, labelEn: 'May', labelAr: 'مايو' },
  { value: 6, labelEn: 'June', labelAr: 'يونيو' },
  { value: 7, labelEn: 'July', labelAr: 'يوليو' },
  { value: 8, labelEn: 'August', labelAr: 'أغسطس' },
  { value: 9, labelEn: 'September', labelAr: 'سبتمبر' },
  { value: 10, labelEn: 'October', labelAr: 'أكتوبر' },
  { value: 11, labelEn: 'November', labelAr: 'نوفمبر' },
  { value: 12, labelEn: 'December', labelAr: 'ديسمبر' },
];

export function getYearRange(past = 50, future = 5): number[] {
  const current = new Date().getFullYear();
  const years: number[] = [];
  for (let y = current + future; y >= current - past; y--) {
    years.push(y);
  }
  return years;
}

export function formatDate(month: number | null | undefined, year: number | null | undefined, lang: 'en' | 'ar'): string {
  if (!year) return '';
  const m = MONTHS.find((m) => m.value === month);
  const monthStr = m ? (lang === 'ar' ? m.labelAr : m.labelEn) : '';
  return monthStr ? `${monthStr} ${year}` : `${year}`;
}

export function sortByDate<T extends { startYear: number; startMonth: number; isCurrent?: boolean }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1;
    if (!a.isCurrent && b.isCurrent) return 1;
    if (b.startYear !== a.startYear) return b.startYear - a.startYear;
    return b.startMonth - a.startMonth;
  });
}

export function sortEducationByDate<T extends { graduationYear?: number | null; graduationMonth?: number | null }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => {
    const ay = a.graduationYear || 0;
    const by = b.graduationYear || 0;
    if (by !== ay) return by - ay;
    return (b.graduationMonth || 0) - (a.graduationMonth || 0);
  });
}
