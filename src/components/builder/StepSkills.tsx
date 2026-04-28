'use client';

import { useState } from 'react';
import { useBuilderStore } from '@/store/builder';
import { Input } from '@/components/ui/FormElements';
import { t } from '@/i18n/translations';
import { X, Plus } from 'lucide-react';

const COMMON_SKILLS_EN = [
  'Microsoft Office',
  'Communication',
  'Teamwork',
  'Problem Solving',
  'Time Management',
  'Leadership',
  'Project Management',
  'Data Analysis',
  'Customer Service',
  'Public Speaking',
  'Critical Thinking',
  'Adaptability',
  'Negotiation',
  'Research',
  'Social Media',
];

const COMMON_SKILLS_AR = [
  'مايكروسوفت أوفيس',
  'التواصل',
  'العمل الجماعي',
  'حل المشكلات',
  'إدارة الوقت',
  'القيادة',
  'إدارة المشاريع',
  'تحليل البيانات',
  'خدمة العملاء',
  'الخطابة',
  'التفكير النقدي',
  'التكيف',
  'التفاوض',
  'البحث',
  'وسائل التواصل الاجتماعي',
];

export default function StepSkills() {
  const { resume, language, addSkill, removeSkill } = useBuilderStore();
  const [input, setInput] = useState('');
  const lang = language;

  const commonSkills = lang === 'ar' ? COMMON_SKILLS_AR : COMMON_SKILLS_EN;
  const addedNames = resume.skills.map((s) => s.name.toLowerCase());

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      addSkill(input.trim());
      setInput('');
    }
  };

  const handleAddCommon = (skill: string) => {
    if (!addedNames.includes(skill.toLowerCase())) {
      addSkill(skill);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Common skills to tap */}
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-2">
          {lang === 'ar' ? 'مهارات شائعة — اضغط للإضافة' : 'Common Skills — tap to add'}
        </label>
        <div className="flex flex-wrap gap-2">
          {commonSkills.map((skill) => {
            const isAdded = addedNames.includes(skill.toLowerCase());
            return (
              <button
                key={skill}
                onClick={() => handleAddCommon(skill)}
                disabled={isAdded}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isAdded
                    ? 'bg-green-50 text-green-600 border border-green-200 cursor-default'
                    : 'bg-surface-100 text-surface-600 border border-surface-200 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 cursor-pointer active:scale-95'
                }`}
              >
                {isAdded ? '✓' : <Plus className="w-3 h-3" />}
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom skill input */}
      <div>
        <Input
          label={lang === 'ar' ? 'أو أضف مهارة مخصصة' : 'Or add a custom skill'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('skill_placeholder', lang)}
        />
      </div>

      {/* Added skills */}
      {resume.skills.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            {lang === 'ar' ? `المهارات المضافة (${resume.skills.length})` : `Your Skills (${resume.skills.length})`}
          </label>
          <div className="flex flex-wrap gap-2">
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
        </div>
      )}
    </div>
  );
}
