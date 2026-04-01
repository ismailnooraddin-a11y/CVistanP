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
          ?  'كتب ملخصاً مهنياً موجزاً يسلط الضوء على خبراتك وأهدافك المهنية.
مثال: مهندس برمجيات يتمتع بخبرة 3 سنوات في تصميم وتطوير حلول برمجية فعّالة وموثوقة. شغوف بتحسين الأداء، وحل المشكلات المعقدة، وتعلّم التقنيات الحديثة لتطوير المهارات المهنية'
          : 'Write a brief professional summary highlighting your experience and career goals. Example "Software Engineer with 3 years of experience in designing and building efficient, reliable software solutions. Passionate about improving performance, solving complex problems, and growing through new technologies."'}
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
