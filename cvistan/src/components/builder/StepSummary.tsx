'use client';

import { useBuilderStore } from '@/store/builder';
import { Textarea } from '@/components/ui/FormElements';
import { t } from '@/i18n/translations';

export default function StepSummary() {
  const { resume, language, updatePersonalInfo } = useBuilderStore();
  const lang = language;

  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-sm text-surface-500">
        {lang === 'ar'
          ? 'اكتب ملخصاً مهنياً موجزاً يسلط الضوء على خبراتك وأهدافك المهنية.'
          : 'Write a brief professional summary highlighting your experience and career goals.'}
      </p>
      <Textarea
        label={t('professional_summary', lang)}
        value={resume.personalInfo.summary || ''}
        onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
        placeholder={t('summary_placeholder', lang)}
        rows={6}
      />
      <p className="text-xs text-surface-400">
        {resume.personalInfo.summary?.length || 0} / 500
      </p>
    </div>
  );
}
