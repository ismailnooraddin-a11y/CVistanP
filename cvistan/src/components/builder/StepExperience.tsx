'use client';

import { useBuilderStore } from '@/store/builder';
import { Input, Textarea, SelectField, Toggle, Button } from '@/components/ui/FormElements';
import { t } from '@/i18n/translations';
import { MONTHS, getYearRange } from '@/lib/utils';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export default function StepExperience() {
  const {
    resume, language,
    addExperience, updateExperience, removeExperience,
    addBullet, updateBullet, removeBullet,
  } = useBuilderStore();
  const lang = language;
  const months = MONTHS.map((m) => ({ value: m.value, label: lang === 'ar' ? m.labelAr : m.labelEn }));
  const years = getYearRange().map((y) => ({ value: y, label: String(y) }));

  return (
    <div className="space-y-6 animate-fade-in">
      {resume.experience.length === 0 && (
        <div className="text-center py-8 text-surface-400">
          <p className="mb-4">
            {lang === 'ar' ? 'لم تضف أي خبرة بعد' : "You haven't added any experience yet"}
          </p>
        </div>
      )}

      {resume.experience.map((exp, idx) => (
        <div key={exp.id} className="bg-surface-50 rounded-xl p-5 border border-surface-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-surface-600">
              <GripVertical className="w-4 h-4 text-surface-300" />
              {t('experience', lang)} #{idx + 1}
            </div>
            <button
              onClick={() => removeExperience(exp.id)}
              className="text-red-400 hover:text-red-600 transition-colors p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('job_title', lang)}
              required
              value={exp.jobTitle}
              onChange={(e) => updateExperience(exp.id, { jobTitle: e.target.value })}
            />
            <Input
              label={t('company', lang)}
              required
              value={exp.company}
              onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
            />
          </div>

          <Input
            label={t('location_field', lang)}
            value={exp.location || ''}
            onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <SelectField
              label={t('month', lang)}
              required
              value={exp.startMonth}
              onChange={(e) => updateExperience(exp.id, { startMonth: Number(e.target.value) })}
              options={months}
              placeholder={t('select', lang)}
            />
            <SelectField
              label={t('year', lang)}
              required
              value={exp.startYear}
              onChange={(e) => updateExperience(exp.id, { startYear: Number(e.target.value) })}
              options={years}
              placeholder={t('select', lang)}
            />
            {!exp.isCurrent && (
              <>
                <SelectField
                  label={t('month', lang)}
                  value={exp.endMonth || ''}
                  onChange={(e) => updateExperience(exp.id, { endMonth: Number(e.target.value) || null })}
                  options={months}
                  placeholder={t('select', lang)}
                />
                <SelectField
                  label={t('year', lang)}
                  value={exp.endYear || ''}
                  onChange={(e) => updateExperience(exp.id, { endYear: Number(e.target.value) || null })}
                  options={years}
                  placeholder={t('select', lang)}
                />
              </>
            )}
          </div>

          <Toggle
            label={t('currently_work_here', lang)}
            checked={exp.isCurrent}
            onChange={(checked) =>
              updateExperience(exp.id, {
                isCurrent: checked,
                endMonth: checked ? null : exp.endMonth,
                endYear: checked ? null : exp.endYear,
              })
            }
          />

          {/* Bullet points */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              {t('responsibilities', lang)}
            </label>
            <div className="space-y-2">
              {exp.bullets.map((bullet) => (
                <div key={bullet.id} className="flex items-start gap-2">
                  <span className="mt-3 text-surface-300 text-xs">•</span>
                  <Input
                    value={bullet.text}
                    onChange={(e) => updateBullet(exp.id, bullet.id, e.target.value)}
                    placeholder={lang === 'ar' ? 'أضف مسؤولية...' : 'Add a responsibility...'}
                    className="flex-1"
                  />
                  {exp.bullets.length > 1 && (
                    <button
                      onClick={() => removeBullet(exp.id, bullet.id)}
                      className="mt-2 text-surface-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => addBullet(exp.id)}
              className="mt-2 text-sm text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              {t('add_bullet', lang)}
            </button>
          </div>
        </div>
      ))}

      <Button variant="secondary" onClick={addExperience} className="w-full">
        <Plus className="w-4 h-4" />
        {t('add_experience', lang)}
      </Button>
    </div>
  );
}
