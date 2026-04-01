import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ResumeData,
  BuilderStep,
  AppLanguage,
  PersonalInfo,
  SocialLink,
  ExperienceEntry,
  EducationEntry,
  SkillEntry,
  LanguageEntry,
  CertificationEntry,
  TemplateSlug,
} from '@/types';
import { generateId } from '@/lib/utils';

interface BuilderState {
  // Meta
  language: AppLanguage;
  currentStep: BuilderStep;
  guestSessionId: string | null;
  resumeId: string | null;
  isSaving: boolean;

  // Resume data
  resume: ResumeData;

  // Actions
  setLanguage: (lang: AppLanguage) => void;
  setCurrentStep: (step: BuilderStep) => void;
  setGuestSession: (id: string) => void;
  setResumeId: (id: string) => void;

  // Personal Info
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;

  // Links
  toggleLink: (type: SocialLink['type']) => void;
  updateLinkUrl: (type: SocialLink['type'], url: string) => void;

  // Experience
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<ExperienceEntry>) => void;
  removeExperience: (id: string) => void;
  addBullet: (experienceId: string) => void;
  updateBullet: (experienceId: string, bulletId: string, text: string) => void;
  removeBullet: (experienceId: string, bulletId: string) => void;

  // Education
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<EducationEntry>) => void;
  removeEducation: (id: string) => void;

  // Skills
  addSkill: (name: string) => void;
  removeSkill: (id: string) => void;

  // Languages
  addLanguageEntry: () => void;
  updateLanguageEntry: (id: string, data: Partial<LanguageEntry>) => void;
  removeLanguageEntry: (id: string) => void;

  // Certifications
  addCertification: () => void;
  updateCertification: (id: string, data: Partial<CertificationEntry>) => void;
  removeCertification: (id: string) => void;

  // Template
  setTemplate: (slug: TemplateSlug) => void;

  // Reset
  resetBuilder: () => void;
}

const defaultResume: ResumeData = {
  language: 'en',
  title: 'My Resume',
  selectedTemplate: 'balanced-modern',
  status: 'draft',
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    dateOfBirth: null,
    photoUrl: null,
    summary: '',
  },
  links: [],
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
};

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set, get) => ({
      language: 'en',
      currentStep: 'personal-info',
      guestSessionId: null,
      resumeId: null,
      isSaving: false,
      resume: { ...defaultResume },

      setLanguage: (lang) =>
        set((s) => ({ language: lang, resume: { ...s.resume, language: lang } })),

      setCurrentStep: (step) => set({ currentStep: step }),
      setGuestSession: (id) => set({ guestSessionId: id }),
      setResumeId: (id) => set({ resumeId: id }),

      updatePersonalInfo: (info) =>
        set((s) => ({
          resume: { ...s.resume, personalInfo: { ...s.resume.personalInfo, ...info } },
        })),

      toggleLink: (type) =>
        set((s) => {
          const existing = s.resume.links.find((l) => l.type === type);
          if (existing) {
            return {
              resume: {
                ...s.resume,
                links: existing.enabled
                  ? s.resume.links.map((l) => (l.type === type ? { ...l, enabled: false } : l))
                  : s.resume.links.map((l) => (l.type === type ? { ...l, enabled: true } : l)),
              },
            };
          }
          return {
            resume: {
              ...s.resume,
              links: [...s.resume.links, { id: generateId(), type, url: '', enabled: true }],
            },
          };
        }),

      updateLinkUrl: (type, url) =>
        set((s) => ({
          resume: {
            ...s.resume,
            links: s.resume.links.map((l) => (l.type === type ? { ...l, url } : l)),
          },
        })),

      addExperience: () =>
        set((s) => ({
          resume: {
            ...s.resume,
            experience: [
              ...s.resume.experience,
              {
                id: generateId(),
                jobTitle: '',
                company: '',
                location: '',
                startMonth: new Date().getMonth() + 1,
                startYear: new Date().getFullYear(),
                endMonth: null,
                endYear: null,
                isCurrent: false,
                bullets: [{ id: generateId(), text: '', sortOrder: 0 }],
                sortOrder: s.resume.experience.length,
              },
            ],
          },
        })),

      updateExperience: (id, data) =>
        set((s) => ({
          resume: {
            ...s.resume,
            experience: s.resume.experience.map((e) =>
              e.id === id ? { ...e, ...data } : e
            ),
          },
        })),

      removeExperience: (id) =>
        set((s) => ({
          resume: {
            ...s.resume,
            experience: s.resume.experience.filter((e) => e.id !== id),
          },
        })),

      addBullet: (experienceId) =>
        set((s) => ({
          resume: {
            ...s.resume,
            experience: s.resume.experience.map((e) =>
              e.id === experienceId
                ? {
                    ...e,
                    bullets: [
                      ...e.bullets,
                      { id: generateId(), text: '', sortOrder: e.bullets.length },
                    ],
                  }
                : e
            ),
          },
        })),

      updateBullet: (experienceId, bulletId, text) =>
        set((s) => ({
          resume: {
            ...s.resume,
            experience: s.resume.experience.map((e) =>
              e.id === experienceId
                ? {
                    ...e,
                    bullets: e.bullets.map((b) =>
                      b.id === bulletId ? { ...b, text } : b
                    ),
                  }
                : e
            ),
          },
        })),

      removeBullet: (experienceId, bulletId) =>
        set((s) => ({
          resume: {
            ...s.resume,
            experience: s.resume.experience.map((e) =>
              e.id === experienceId
                ? { ...e, bullets: e.bullets.filter((b) => b.id !== bulletId) }
                : e
            ),
          },
        })),

      addEducation: () =>
        set((s) => ({
          resume: {
            ...s.resume,
            education: [
              ...s.resume.education,
              {
                id: generateId(),
                degree: '',
                institution: '',
                location: '',
                graduationMonth: null,
                graduationYear: null,
                gpa: '',
                thesisProject: '',
                sortOrder: s.resume.education.length,
              },
            ],
          },
        })),

      updateEducation: (id, data) =>
        set((s) => ({
          resume: {
            ...s.resume,
            education: s.resume.education.map((e) =>
              e.id === id ? { ...e, ...data } : e
            ),
          },
        })),

      removeEducation: (id) =>
        set((s) => ({
          resume: {
            ...s.resume,
            education: s.resume.education.filter((e) => e.id !== id),
          },
        })),

      addSkill: (name) =>
        set((s) => ({
          resume: {
            ...s.resume,
            skills: [
              ...s.resume.skills,
              { id: generateId(), name, sortOrder: s.resume.skills.length },
            ],
          },
        })),

      removeSkill: (id) =>
        set((s) => ({
          resume: {
            ...s.resume,
            skills: s.resume.skills.filter((sk) => sk.id !== id),
          },
        })),

      addLanguageEntry: () =>
        set((s) => ({
          resume: {
            ...s.resume,
            languages: [
              ...s.resume.languages,
              {
                id: generateId(),
                name: '',
                proficiency: 'intermediate',
                sortOrder: s.resume.languages.length,
              },
            ],
          },
        })),

      updateLanguageEntry: (id, data) =>
        set((s) => ({
          resume: {
            ...s.resume,
            languages: s.resume.languages.map((l) =>
              l.id === id ? { ...l, ...data } : l
            ),
          },
        })),

      removeLanguageEntry: (id) =>
        set((s) => ({
          resume: {
            ...s.resume,
            languages: s.resume.languages.filter((l) => l.id !== id),
          },
        })),

      addCertification: () =>
        set((s) => ({
          resume: {
            ...s.resume,
            certifications: [
              ...s.resume.certifications,
              {
                id: generateId(),
                name: '',
                organization: '',
                issueMonth: null,
                issueYear: null,
                expiryMonth: null,
                expiryYear: null,
                noExpiry: true,
                trainingMode: null,
                credentialId: '',
                sortOrder: s.resume.certifications.length,
              },
            ],
          },
        })),

      updateCertification: (id, data) =>
        set((s) => ({
          resume: {
            ...s.resume,
            certifications: s.resume.certifications.map((c) =>
              c.id === id ? { ...c, ...data } : c
            ),
          },
        })),

      removeCertification: (id) =>
        set((s) => ({
          resume: {
            ...s.resume,
            certifications: s.resume.certifications.filter((c) => c.id !== id),
          },
        })),

      setTemplate: (slug) =>
        set((s) => ({ resume: { ...s.resume, selectedTemplate: slug } })),

      resetBuilder: () =>
        set({
          currentStep: 'personal-info',
          guestSessionId: null,
          resumeId: null,
          resume: { ...defaultResume },
        }),
    }),
    {
      name: 'cvistan-builder',
      partialize: (state) => ({
        language: state.language,
        currentStep: state.currentStep,
        guestSessionId: state.guestSessionId,
        resumeId: state.resumeId,
        resume: state.resume,
      }),
    }
  )
);
