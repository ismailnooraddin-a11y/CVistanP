'use client';

import { useState, useEffect } from 'react';
import { useBuilderStore } from '@/store/builder';
import { BUILDER_STEPS, BuilderStep } from '@/types';
import { t, isRtl } from '@/i18n/translations';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/FormElements';
import ResumePreview from '@/components/preview/ResumePreview';
import StepPersonalInfo from '@/components/builder/StepPersonalInfo';
import StepSummary from '@/components/builder/StepSummary';
import StepExperience from '@/components/builder/StepExperience';
import StepEducation from '@/components/builder/StepEducation';
import StepSkills from '@/components/builder/StepSkills';
import StepLanguages from '@/components/builder/StepLanguages';
import StepVolunteer from '@/components/builder/StepVolunteer';
import StepCertifications from '@/components/builder/StepCertifications';
import StepTemplate from '@/components/builder/StepTemplate';
import StepFinalize from '@/components/builder/StepFinalize';
import {
  FileText, ChevronLeft, ChevronRight, Eye, EyeOff,
  User, AlignLeft, Briefcase, GraduationCap, Wrench,
  Globe2, Heart, Award, Palette, CheckCircle,
} from 'lucide-react';

const stepComponents: Record<BuilderStep, React.ComponentType> = {
  'personal-info': StepPersonalInfo,
  'summary': StepSummary,
  'experience': StepExperience,
  'education': StepEducation,
  'skills': StepSkills,
  'languages': StepLanguages,
  'volunteer': StepVolunteer,
  'certifications': StepCertifications,
  'template': StepTemplate,
  'finalize': StepFinalize,
};

const stepIcons: Record<BuilderStep, React.ComponentType<{ className?: string }>> = {
  'personal-info': User,
  'summary': AlignLeft,
  'experience': Briefcase,
  'education': GraduationCap,
  'skills': Wrench,
  'languages': Globe2,
  'volunteer': Heart,
  'certifications': Award,
  'template': Palette,
  'finalize': CheckCircle,
};
export default function BuilderPage() {
  const { language, currentStep, setCurrentStep } = useBuilderStore();
  const lang = language;
  const rtl = isRtl(lang);
  const [showPreview, setShowPreview] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const currentIndex = BUILDER_STEPS.findIndex((s) => s.key === currentStep);
  const StepComponent = stepComponents[currentStep];
  const stepInfo = BUILDER_STEPS[currentIndex];

  const goNext = () => {
    if (currentIndex < BUILDER_STEPS.length - 1) {
      setCurrentStep(BUILDER_STEPS[currentIndex + 1].key);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentStep(BUILDER_STEPS[currentIndex - 1].key);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!mounted) return null;

  return (
    <div dir={rtl ? 'rtl' : 'ltr'} className="min-h-screen bg-surface-50">
      {/* Top nav */}
      <nav className="bg-white border-b border-surface-100 px-4 py-3 sticky top-0 z-40">
        <div className="max-w-builder mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-lg font-bold text-surface-900 hidden sm:block">CVistan</span>
          </a>
          <a href="/learn" className="text-sm text-surface-500 hover:text-brand-600 transition-colors hidden sm:block">Learn</a>

          {/* Desktop stepper */}
          <div className="hidden lg:flex items-center gap-1">
            {BUILDER_STEPS.map((step, i) => {
              const Icon = stepIcons[step.key];
              const isActive = i === currentIndex;
              const isDone = i < currentIndex;
              return (
                <button
                  key={step.key}
                  onClick={() => setCurrentStep(step.key)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    isActive && 'bg-brand-50 text-brand-700',
                    isDone && 'text-green-600',
                    !isActive && !isDone && 'text-surface-400 hover:text-surface-600'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">{lang === 'ar' ? step.titleAr : step.titleEn}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile step indicator */}
          <div className="lg:hidden text-sm text-surface-500 font-medium">
            {t('step', lang)} {currentIndex + 1} {t('of', lang)} {BUILDER_STEPS.length}
          </div>

          {/* Preview toggle (mobile) */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="lg:hidden flex items-center gap-1.5 text-sm text-brand-600 font-medium"
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? t('hide_preview', lang) : t('show_preview', lang)}
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-builder mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left: Form panel */}
          <div className={cn('w-full lg:w-[40%] flex-shrink-0', showPreview && 'hidden lg:block')}>
            <div className="bg-white rounded-2xl border border-surface-100 shadow-sm">
              {/* Step header */}
              <div className="px-6 py-4 border-b border-surface-100">
                <h2 className="text-lg font-semibold text-surface-800">
                  {lang === 'ar' ? stepInfo.titleAr : stepInfo.titleEn}
                </h2>
                {/* Progress bar */}
                <div className="mt-3 h-1.5 bg-surface-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all duration-500"
                    style={{ width: `${((currentIndex + 1) / BUILDER_STEPS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Step content */}
              <div className="px-6 py-5">
                <StepComponent />
              </div>

              {/* Navigation */}
              <div className="px-6 py-4 border-t border-surface-100 flex items-center justify-between gap-3">
                <Button
                  variant="ghost"
                  onClick={goBack}
                  disabled={currentIndex === 0}
                  className="min-w-[100px]"
                >
                  {rtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  {t('back', lang)}
                </Button>
                {currentIndex < BUILDER_STEPS.length - 1 && (
                  <Button onClick={goNext} className="min-w-[100px]">
                    {t('next', lang)}
                    {rtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right: Preview panel */}
          <div className={cn(
            'flex-1 min-w-0',
            !showPreview && 'hidden lg:block'
          )}>
            <div className="sticky top-20">
              <div className="bg-surface-100 rounded-2xl p-4 lg:p-6 max-h-[calc(100vh-120px)] overflow-y-auto hide-scrollbar">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-surface-500">{t('preview', lang)}</h3>
                </div>
                <ResumePreview />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-surface-100 px-4 py-3 z-40">
        <div className="flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={goBack} disabled={currentIndex === 0} size="lg" className="flex-1">
            {rtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {t('back', lang)}
          </Button>
          <Button
            onClick={() => setShowPreview(!showPreview)}
            variant="secondary"
            size="lg"
          >
            <Eye className="w-4 h-4" />
          </Button>
          {currentIndex < BUILDER_STEPS.length - 1 && (
            <Button onClick={goNext} size="lg" className="flex-1">
              {t('next', lang)}
              {rtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
