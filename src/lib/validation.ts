export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateRequired(values: Record<string, unknown>, fields: string[]): ValidationResult {
  const errors: Record<string, string> = {};
  for (const field of fields) {
    const value = values[field];
    if (value === undefined || value === null || String(value).trim() === "") {
      errors[field] = "This field is required.";
    }
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isPhone(value: string): boolean {
  return /^\+?[0-9\s()-]{7,20}$/.test(value.trim());
}

export function daysBetween(startDate: string, endDate: string): number {
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return 0;
  return Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
}
