import { TemplateConfig, TemplateSlug } from '@/types';

export const templates: Record<TemplateSlug, TemplateConfig> = {
  'classic-ats': {
    slug: 'classic-ats',
    displayName: 'Classic ATS',
    family: 'classic',
    supportsPhoto: false,
    preferredContentLength: 'long',
    pageMargins: { top: 48, right: 48, bottom: 48, left: 48 },
    fontFamilies: { heading: 'Georgia, serif', body: 'Arial, sans-serif' },
    fontSizes: { name: 24, heading: 14, subheading: 12, body: 10, small: 9 },
    headingStyle: 'uppercase',
    sidebarWidth: null,
    primaryColor: '#1a1a1a',
    secondaryColor: '#444444',
    accentColor: '#0056b3',
    compactThreshold: 3,
    denseThreshold: 8,
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'certifications', 'languages'],
    rtlSupport: true,
    atsFriendly: true,
  },
  'balanced-modern': {
    slug: 'balanced-modern',
    displayName: 'Balanced Modern',
    family: 'balanced',
    supportsPhoto: true,
    preferredContentLength: 'medium',
    pageMargins: { top: 40, right: 40, bottom: 40, left: 40 },
    fontFamilies: { heading: "'Helvetica Neue', Helvetica, sans-serif", body: "'Helvetica Neue', Helvetica, sans-serif" },
    fontSizes: { name: 26, heading: 13, subheading: 11, body: 10, small: 9 },
    headingStyle: 'capitalize',
    sidebarWidth: null,
    primaryColor: '#1e293b',
    secondaryColor: '#475569',
    accentColor: '#0c8eeb',
    compactThreshold: 3,
    denseThreshold: 8,
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'languages', 'certifications'],
    rtlSupport: true,
    atsFriendly: true,
  },
  'visual-elegant': {
    slug: 'visual-elegant',
    displayName: 'Visual Elegant',
    family: 'visual',
    supportsPhoto: true,
    preferredContentLength: 'short',
    pageMargins: { top: 0, right: 0, bottom: 0, left: 0 },
    fontFamilies: { heading: "'Helvetica Neue', Helvetica, sans-serif", body: "'Helvetica Neue', Helvetica, sans-serif" },
    fontSizes: { name: 28, heading: 14, subheading: 11, body: 10, small: 8.5 },
    headingStyle: 'uppercase',
    sidebarWidth: 220,
    primaryColor: '#ffffff',
    secondaryColor: '#e2e8f0',
    accentColor: '#1e293b',
    compactThreshold: 2,
    denseThreshold: 6,
    sectionOrder: ['summary', 'experience', 'education', 'certifications'],
    rtlSupport: true,
    atsFriendly: false,
  },
};

export function getTemplate(slug: TemplateSlug): TemplateConfig {
  return templates[slug] || templates['balanced-modern'];
}

export function getAllTemplates(): TemplateConfig[] {
  return Object.values(templates);
}
