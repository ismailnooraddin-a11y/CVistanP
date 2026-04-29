'use client';

import { useBuilderStore } from '@/store/builder';
import { Input, Textarea, SelectField, Toggle, Button } from '@/components/ui/FormElements';
import { t } from '@/i18n/translations';
import { MONTHS, getYearRange } from '@/lib/utils';
import { Plus, Trash2, Heart, Users, Trophy, GraduationCap, Globe2, Sparkles } from 'lucide-react';

const CATEGORY_OPTIONS_EN = [
  { value: 'volunteer', label: 'Volunteer Work' },
  { value: 'club', label: 'Club / Society' },
  { value: 'competition', label: 'Competition / Hackathon' },
  { value: 'student-org', label: 'Student Organization' },
  { value: 'community', label: 'Community Service' },
  { value: 'other', label: 'Other Activity' },
];

const CATEGORY_OPTIONS_AR = [
  { value: 'volunteer', label: 'عمل تطوعي' },
  { value: 'club', label: 'نادي / جمعية' },
  { value: 'competition', label: 'مسابقة / هاكاثون' },
  { value: 'student-org', label: 'منظمة طلابية' },
  { value: 'community', label: 'خدمة مجتمعية' },
  { value: 'other', label: 'نشاط آخر' },
];

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  volunteer: Heart,
  club: Users,
  competition: Trophy,
  'student-org': GraduationCap,
  community: Globe2,
  other: Sparkles,
};

export default function StepVolunteer() {
  const { resume, language, addVolunteer, updateVolunteer, removeVolunteer } = useBuilderStore();
  const lang = language;
  const months = MONTHS.map((m) => ({ value: m.value, label: lang === 'ar' ? m.labelAr : m.labelEn }));
  const years = getYearRange(20, 2).map((y) => ({ value: y, label: String(y) }));
  const categories = lang === 'ar' ? CATEGORY_OPTIONS_AR : CATEGORY_OPTIONS_EN;

  return (
    <div className="space-y-6 animate-fade-in">
      <p className="text-sm text-surface-500">
        {lang === 'ar'
          ? 'أضف أنشطتك التطوعية والمجتمعية والطلابية. هذا القسم اختياري ولن يظهر في سيرتك الذاتية إذا تركته فارغاً.'
          : 'Add your volunteer work, clubs, competitions, and community activities. This section is optional and won\'t appear on your CV if left empty.'}
      </p>

      {resume.volunteer.length === 0 && (
        <div className="text-center py-8 bg-surface-50 rounded-xl border border-dashed border-surface-200">
          <Heart className="w-8 h-8 text-surface-300 mx-auto mb-3" />
          <p className="text-surface-400 mb-1">
            {lang === 'ar' ? 'لم تضف أي نشاط بعد' : 'No activities added yet'}
          </p>
          <p className="text-xs text-surface-400">
            {lang === 'ar' ? 'مثالي لحديثي التخرج والطلاب' : 'Great for fresh graduates and students'}
          </p>
        </div>
      )}

      {resume.volunteer.map((entry, idx) => {
        const Icon = categoryIcons[entry.category] || Sparkles;
        return (
          <div key={entry.id} className="bg-surface-50 rounded-xl p-5 border border-surface-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-surface-600">
                <Icon className="w-4 h-4 text-brand-500" />
                {lang === 'ar' ? 'نشاط' : 'Activity'} #{idx + 1}
              </div>
              <button onClick={() => removeVolunteer(entry.id)} className="text-red-400 hover:text-red-600 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <SelectField
              label={lang === 'ar' ? 'نوع النشاط' : 'Activity Type'}
              value={entry.category}
              onChange={(e) => updateVolunteer(entry.id, { category: e.target.value as any })}
              options={categories}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={lang === 'ar' ? 'الدور / المسمى' : 'Your Role / Title'}
                required
                value={entry.title}
                onChange={(e) => updateVolunteer(entry.id, { title: e.target.value })}
                placeholder={lang === 'ar' ? 'مثال: رئيس اللجنة' : 'e.g. Team Leader'}
              />
              <Input
                label={lang === 'ar' ? 'المنظمة / الجهة' : 'Organization / Group'}
                required
                value={entry.organization}
                onChange={(e) => updateVolunteer(entry.id, { organization: e.target.value })}
                placeholder={lang === 'ar' ? 'مثال: الهلال الأحمر' : 'e.g. Red Cross'}
              />
            </div>

            <Input
              label={lang === 'ar' ? 'الموقع' : 'Location'}
              value={entry.location || ''}
              onChange={(e) => updateVolunteer(entry.id, { location: e.target.value })}
              placeholder={lang === 'ar' ? 'اختياري' : 'Optional'}
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <SelectField
                label={lang === 'ar' ? 'شهر البدء' : 'Start Month'}
                value={entry.startMonth || ''}
                onChange={(e) => updateVolunteer(entry.id, { startMonth: Number(e.target.value) || null })}
                options={months}
                placeholder={t('select', lang)}
              />
              <SelectField
                label={lang === 'ar' ? 'سنة البدء' : 'Start Year'}
                value={entry.startYear || ''}
                onChange={(e) => updateVolunteer(entry.id, { startYear: Number(e.target.value) || null })}
                options={years}
                placeholder={t('select', lang)}
              />
              {!entry.isCurrent && (
                <>
                  <SelectField
                    label={lang === 'ar' ? 'شهر الانتهاء' : 'End Month'}
                    value={entry.endMonth || ''}
                    onChange={(e) => updateVolunteer(entry.id, { endMonth: Number(e.target.value) || null })}
                    options={months}
                    placeholder={t('select', lang)}
                  />
                  <SelectField
                    label={lang === 'ar' ? 'سنة الانتهاء' : 'End Year'}
                    value={entry.endYear || ''}
                    onChange={(e) => updateVolunteer(entry.id, { endYear: Number(e.target.value) || null })}
                    options={years}
                    placeholder={t('select', lang)}
                  />
                </>
              )}
            </div>

            <Toggle
              label={lang === 'ar' ? 'لا زلت مشاركاً حالياً' : 'I am currently involved'}
              checked={entry.isCurrent}
              onChange={(checked) => updateVolunteer(entry.id, { isCurrent: checked, endMonth: checked ? null : entry.endMonth, endYear: checked ? null : entry.endYear })}
            />

            <Textarea
              label={lang === 'ar' ? 'وصف النشاط والإنجازات' : 'Description & Achievements'}
              value={entry.description}
              onChange={(e) => updateVolunteer(entry.id, { description: e.target.value })}
              placeholder={lang === 'ar' ? 'صف دورك وإنجازاتك في هذا النشاط...' : 'Describe your role and achievements in this activity...'}
              rows={3}
            />
          </div>
        );
      })}

      <Button variant="secondary" onClick={addVolunteer} className="w-full">
        <Plus className="w-4 h-4" />
        {lang === 'ar' ? 'إضافة نشاط' : 'Add Activity'}
      </Button>
    </div>
  );
}
