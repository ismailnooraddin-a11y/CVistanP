'use client';

import { useBuilderStore } from '@/store/builder';
import { t } from '@/i18n/translations';
import { TemplateSlug } from '@/types';
import { getAllTemplates } from '@/templates/configs';
import { cn } from '@/lib/utils';
import { Check, FileText, Layout, Palette } from 'lucide-react';

const familyIcons = {
  classic: FileText,
  balanced: Layout,
  visual: Palette,
};

export default function StepTemplate() {
  const { resume, language, setTemplate } = useBuilderStore();
  const lang = language;
  const templates = getAllTemplates();

  const descMap: Record<TemplateSlug, string> = {
    'classic-ats': lang === 'ar' ? 'نظيف واحترافي. الأفضل لأنظمة تتبع المتقدمين.' : 'Clean and professional. Best for ATS and formal CVs.',
    'balanced-modern': lang === 'ar' ? 'تصميم عصري ومتوازن. مثالي لمعظم المهنيين.' : 'Modern balanced design. Great for most professionals.',
    'visual-elegant': lang === 'ar' ? 'تصميم جذاب مع شريط جانبي.' : 'Eye-catching sidebar design for creative roles.',
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-sm text-surface-500">
        {lang === 'ar'
          ? 'اختر القالب الذي يناسب سيرتك الذاتية.'
          : 'Choose the template that best suits your CV.'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {templates.map((tmpl) => {
          const isSelected = resume.selectedTemplate === tmpl.slug;
          const Icon = familyIcons[tmpl.family];
          return (
            <button
              key={tmpl.slug}
              onClick={() => setTemplate(tmpl.slug)}
              className={cn(
                'relative p-5 rounded-xl border-2 text-left transition-all',
                isSelected
                  ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-200'
                  : 'border-surface-200 bg-white hover:border-surface-300 hover:shadow-sm'
              )}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-brand-600 rounded-full flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', isSelected ? 'bg-brand-100' : 'bg-surface-100')}>
                <Icon className={cn('w-5 h-5', isSelected ? 'text-brand-600' : 'text-surface-500')} />
              </div>
              <h3 className="font-semibold text-surface-800 mb-1">{tmpl.displayName}</h3>
              <p className="text-xs text-surface-500 leading-relaxed">{descMap[tmpl.slug]}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tmpl.atsFriendly && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">ATS</span>
                )}
                {tmpl.supportsPhoto && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">Photo</span>
                )}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-100 text-surface-600 font-medium">
                  {tmpl.rtlSupport ? 'RTL' : 'LTR'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
