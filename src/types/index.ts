// ─── Resume Data Types ───

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  dateOfBirth?: string | null;
  photoUrl?: string | null;
  summary?: string;
}

export interface SocialLink {
  id: string;
  type: 'linkedin' | 'github' | 'portfolio' | 'twitter' | 'instagram' | 'behance';
  url: string;
  enabled: boolean;
}

export interface ExperienceBullet {
  id: string;
  text: string;
  sortOrder: number;
}

export interface ExperienceEntry {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  startMonth: number;
  startYear: number;
  endMonth?: number | null;
  endYear?: number | null;
  isCurrent: boolean;
  bullets: ExperienceBullet[];
  sortOrder: number;
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  graduationMonth?: number | null;
  graduationYear?: number | null;
  gpa?: string;
  thesisProject?: string;
  sortOrder: number;
}

export interface SkillEntry {
  id: string;
  name: string;
  sortOrder: number;
}

export interface LanguageEntry {
  id: string;
  name: string;
  proficiency: 'beginner' | 'intermediate' | 'fluent' | 'native';
  sortOrder: number;
}

export interface VolunteerEntry {
  id: string;
  title: string;
  organization: string;
  category: 'volunteer' | 'club' | 'competition' | 'student-org' | 'community' | 'other';
  location?: string;
  startMonth?: number | null;
  startYear?: number | null;
  endMonth?: number | null;
  endYear?: number | null;
  isCurrent: boolean;
  description: string;
  sortOrder: number;
}

export interface CertificationEntry {
  id: string;
  name: string;
  organization: string;
  issueMonth?: number | null;
  issueYear?: number | null;
  expiryMonth?: number | null;
  expiryYear?: number | null;
  noExpiry: boolean;
  trainingMode?: 'online' | 'in-person' | null;
  credentialId?: string;
  sortOrder: number;
}

export type TemplateSlug = 'classic-ats' | 'balanced-modern' | 'visual-elegant';
export type TemplateFamily = 'classic' | 'balanced' | 'visual';
export type ContentMode = 'compact' | 'standard' | 'dense';
export type AppLanguage = 'en' | 'ar';

export interface TemplateConfig {
  slug: TemplateSlug;
  displayName: string;
  family: TemplateFamily;
  supportsPhoto: boolean;
  preferredContentLength: 'short' | 'medium' | 'long';
  pageMargins: { top: number; right: number; bottom: number; left: number };
  fontFamilies: { heading: string; body: string };
  fontSizes: { name: number; heading: number; subheading: number; body: number; small: number };
  headingStyle: 'uppercase' | 'capitalize' | 'normal';
  sidebarWidth: number | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  compactThreshold: number;
  denseThreshold: number;
  sectionOrder: string[];
  rtlSupport: boolean;
  atsFriendly: boolean;
}

export interface ResumeData {
  id?: string;
  language: AppLanguage;
  title: string;
  selectedTemplate: TemplateSlug;
  status: 'draft' | 'finalized';
  personalInfo: PersonalInfo;
  links: SocialLink[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillEntry[];
  languages: LanguageEntry[];
  volunteer: VolunteerEntry[];
  certifications: CertificationEntry[];
}

// ─── Builder State ───

export type BuilderStep =
  | 'personal-info'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'volunteer'
  | 'certifications'
  | 'template'
  | 'finalize';

export const BUILDER_STEPS: { key: BuilderStep; titleEn: string; titleAr: string; number: number }[] = [
  { key: 'personal-info', titleEn: 'Personal Info', titleAr: 'المعلومات الشخصية', number: 1 },
  { key: 'summary', titleEn: 'Summary', titleAr: 'الملخص المهني', number: 2 },
  { key: 'experience', titleEn: 'Experience', titleAr: 'الخبرة', number: 3 },
  { key: 'education', titleEn: 'Education', titleAr: 'التعليم', number: 4 },
  { key: 'skills', titleEn: 'Skills', titleAr: 'المهارات', number: 5 },
  { key: 'languages', titleEn: 'Languages', titleAr: 'اللغات', number: 6 },
  { key: 'volunteer', titleEn: 'Volunteer & Activities', titleAr: 'التطوع والأنشطة', number: 7 },
  { key: 'certifications', titleEn: 'Certifications', titleAr: 'الشهادات', number: 8 },
  { key: 'template', titleEn: 'Template', titleAr: 'القالب', number: 9 },
  { key: 'finalize', titleEn: 'Finalize', titleAr: 'المراجعة النهائية', number: 10 },
];

// ─── Delivery ───

export interface DeliveryOptions {
  download: boolean;
  email?: string;
  telegram?: { chatId: string; username: string };
}

// ─── Database row types ───

export interface DbResume {
  id: string;
  user_id: string | null;
  guest_session_id: string | null;
  language: string;
  title: string;
  selected_template: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DbGuestSession {
  id: string;
  session_token: string;
  language: string;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
}
