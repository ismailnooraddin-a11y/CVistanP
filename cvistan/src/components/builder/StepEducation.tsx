'use client';

import { useBuilderStore } from '@/store/builder';
import { Input, SelectField, Button } from '@/components/ui/FormElements';
import { t } from '@/i18n/translations';
import { MONTHS, getYearRange } from '@/lib/utils';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export default function StepEducation() {
  const { resume, language, addEducation, updateEducation, removeEducation } = useBuilderStore();
  const lang = language;
  const months = MONTHS.map((m) => ({ value: m.value, label: lang === 'ar' ? m.labelAr : m.labelEn }));
  const years = getYearRange().map((y) => ({ value: y, label: String(y) }));

  return (
    <div className="space-y-6 animate-fade-in">
      {resume.education.length === 0 && (
        <div className="text-center py-8 text-surface-400">
          <p className="mb-4">{lang === 'ar' ? 'لم تضف أي تعليم بعد' : "You haven't added any education yet"}</p>
        </div>
      )}

      {resume.education.map((edu, idx) => (
        <div key={edu.id} className="bg-surface-50 rounded-xl p-5 border border-surface-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-surface-600">
              <GripVertical className="w-4 h-4 text-surface-300" />
              {t('education', lang)} #{idx + 1}
            </div>
            <button onClick={() => removeEducation(edu.id)} className="text-red-400 hover:text-red-600 p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label={t('degree', lang)} required value={edu.degree} onChange={(e) => updateEducation(edu.id, { degree: e.target.value })} />
            <Input label={t('institution', lang)} required value={edu.institution} onChange={(e) => updateEducation(edu.id, { institution: e.target.value })} />
          </div>

          <Input label={t('location_field', lang)} value={edu.location || ''} onChange={(e) => updateEducation(edu.id, { location: e.target.value })} />

          <div className="grid grid-cols-2 gap-3">
            <SelectField
              label={t('month', lang)}
              value={edu.graduationMonth || ''}
              onChange={(e) => updateEducation(edu.id, { graduationMonth: Number(e.target.value) || null })}
              options={months}
              placeholder={t('select', lang)}
            />
            <SelectField
              label={t('year', lang)}
              value={edu.graduationYear || ''}
              onChange={(e) => updateEducation(edu.id, { graduationYear: Number(e.target.value) || null })}
              options={years}
              placeholder={t('select', lang)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label={t('gpa', lang)} value={edu.gpa || ''} onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })} />
            <Input label={t('thesis', lang)} value={edu.thesisProject || ''} onChange={(e) => updateEducation(edu.id, { thesisProject: e.target.value })} />
          </div>
        </div>
      ))}

      <Button variant="secondary" onClick={addEducation} className="w-full">
        <Plus className="w-4 h-4" />
        {t('add_education', lang)}
      </Button>
    </div>
  );
}
