'use client';

import { useState } from 'react';
import { useBuilderStore } from '@/store/builder';
import { Input } from '@/components/ui/FormElements';
import { t } from '@/i18n/translations';
import { X } from 'lucide-react';

export default function StepSkills() {
  const { resume, language, addSkill, removeSkill } = useBuilderStore();
  const [input, setInput] = useState('');
  const lang = language;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      addSkill(input.trim());
      setInput('');
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-sm text-surface-500">
        {lang === 'ar'
          ? 'أدخل مهاراتك واضغط Enter لإضافتها.'
          : 'Type a skill and press Enter to add it.'}
      </p>

      <Input
        label={t('skills', lang)}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('skill_placeholder', lang)}
      />

      {resume.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {resume.skills.map((skill) => (
            <span
              key={skill.id}
              className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 px-3 py-1.5 rounded-full text-sm font-medium"
            >
              {skill.name}
              <button
                onClick={() => removeSkill(skill.id)}
                className="text-brand-400 hover:text-brand-700 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
