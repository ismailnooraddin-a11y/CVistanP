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
          ? 'أنا XX ماهر لدي XX سنوات من الخبرة في تطوير البرمجيات. لدي اهتمام كبير بإنشاء حلول موثوقة وفعّالة باستخدام التقنيات الحديثة. هدفي هو التطور المهني، والاستمرار في التعلم، والمساهمة في مشاريع مبتكرة تقدم قيمة حقيقية.'
          : 'I am a skilled XX with XX years of experience in software development. I have a strong interest in creating reliable and efficient solutions using modern technologies. My goal is to grow professionally, continue learning, and contribute to innovative projects that deliver real value.'}
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
