import { z } from 'zod';

export const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  email: z.string().email('Invalid email').or(z.string().length(0)),
  phone: z.string().min(1, 'Phone number is required'),
  location: z.string().min(1, 'Location is required'),
  dateOfBirth: z.string().nullable().optional(),
  photoUrl: z.string().nullable().optional(),
  summary: z.string().optional(),
});

export const experienceSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().optional(),
  startMonth: z.number().min(1).max(12),
  startYear: z.number().min(1950).max(2035),
  endMonth: z.number().min(1).max(12).nullable(),
  endYear: z.number().min(1950).max(2035).nullable(),
  isCurrent: z.boolean(),
});

export const educationSchema = z.object({
  degree: z.string().min(1, 'Degree is required'),
  institution: z.string().min(1, 'Institution is required'),
  location: z.string().optional(),
  graduationMonth: z.number().nullable(),
  graduationYear: z.number().nullable(),
});

export const certificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required'),
  organization: z.string().min(1, 'Organization is required'),
});

export const emailDeliverySchema = z.object({
  email: z.string().email('Valid email is required'),
});

export const urlSchema = z.string().url('Invalid URL');

export function validateForExport(data: {
  personalInfo: { fullName: string; jobTitle: string; phone: string };
  selectedTemplate: string;
}): string[] {
  const errors: string[] = [];
  if (!data.personalInfo.fullName) errors.push('Full name is required');
  if (!data.personalInfo.jobTitle) errors.push('Job title is required');
  if (!data.personalInfo.phone) errors.push('Phone number is required');
  if (!data.selectedTemplate) errors.push('Template selection is required');
  return errors;
}
