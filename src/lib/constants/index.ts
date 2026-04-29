// App-wide constants
export const MAX_DRAFT_CVS = 3;
export const GUEST_SESSION_EXPIRY_DAYS = 7;
export const AUTO_SAVE_DEBOUNCE_MS = 30000; // 30 seconds
export const PDF_PAGE_WIDTH_MM = 210;
export const PDF_PAGE_HEIGHT_MM = 297;
export const MAX_FILE_SIZE_MB = 5;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// API Paths
export const API_PATHS = {
  GUEST_SESSION: '/api/guest-session',
  RESUME: '/api/resume',
  RESUME_BY_ID: (id: string) => `/api/resume/${id}`,
  SEND_EMAIL: (id: string) => `/api/resume/${id}/send-email`,
  GENERATE: (id: string) => `/api/resume/${id}/generate`,
  AUTH_CONVERT: '/api/auth/convert-guest',
} as const;

// UI Constants
export const TEMPLATE_FAMILIES = ['classic', 'balanced', 'visual'] as const;
export const CONTENT_MODES = ['compact', 'standard', 'dense'] as const;
export const PROFICIENCY_LEVELS = ['beginner', 'intermediate', 'fluent', 'native'] as const;

// Month names (1-indexed, matching getMonth() + 1)
export const EN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

export const AR_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
] as const;

export const getMonthName = (month: number, lang: 'en' | 'ar'): string => {
  const index = month - 1; // Convert 1-indexed to 0-indexed
  if (index < 0 || index > 11) return '';
  return lang === 'ar' ? AR_MONTHS[index] : EN_MONTHS[index];
};

// Storage Keys
export const STORAGE_KEYS = {
  BUILDER_STATE: 'cvistan-builder',
  LANGUAGE: 'cvistan-language',
} as const;
