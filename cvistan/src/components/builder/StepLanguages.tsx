'use client';

import { useBuilderStore } from '@/store/builder';
import { Input, SelectField, Button } from '@/components/ui/FormElements';
import { t } from '@/i18n/translations';
import { Plus, Trash2 } from 'lucide-react';

export default function StepLanguages() {
  const { resume, language, addLanguageEntry, updateLanguageEntry, removeLanguageEntry } = useBuilderStore();
  const lang = language;

  const proficiencyOptions = [
    { value: 'beginner', label: t('beginner', lang) },
    { value: 'intermediate', label: t('intermediate', lang) },
    { value: 'fluent', label: t('fluent', lang) },
    { value: 'native', label: t('native', lang) },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      {resume.languages.length === 0 && (
        <p className="text-center py-6 text-surface-400">
          {lang === 'ar' ? 'لم تضف أي لغة بعد' : "You haven't added any languages yet"}
        </p>
      )}

      {resume.languages.map((entry, idx) => (
        <div key={entry.id} className="flex items-end gap-3 bg-surface-50 rounded-xl p-4 border border-surface-100">
          <Input
            label={idx === 0 ? t('language_name', lang) : undefined}
            value={entry.name}
            onChange={(e) => updateLanguageEntry(entry.id, { name: e.target.value })}
            placeholder={lang === 'ar' ? 'مثال: الإنجليزية' : 'e.g. English'}
            className="flex-1"
          />
          <SelectField
            label={idx === 0 ? t('proficiency', lang) : undefined}
            value={entry.proficiency}
            onChange={(e) => updateLanguageEntry(entry.id, { proficiency: e.target.value as any })}
            options={proficiencyOptions}
            className="w-40"
          />
          <button onClick={() => removeLanguageEntry(entry.id)} className="text-red-400 hover:text-red-600 pb-1">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      <Button variant="secondary" onClick={addLanguageEntry} className="w-full">
        <Plus className="w-4 h-4" />
        {t('add_language', lang)}
      </Button>
    </div>
  );
}
