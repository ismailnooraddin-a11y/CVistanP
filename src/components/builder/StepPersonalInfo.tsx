'use client';

import { useBuilderStore } from '@/store/builder';
import { Input, Toggle } from '@/components/ui/FormElements';
import { t } from '@/i18n/translations';
import { SocialLink } from '@/types';
import { Camera, X } from 'lucide-react';

const SOCIAL_LINKS: { type: SocialLink['type']; icon: string }[] = [
  { type: 'linkedin', icon: 'in' },
  { type: 'github', icon: 'GH' },
  { type: 'portfolio', icon: '🌐' },
  { type: 'twitter', icon: 'X' },
  { type: 'instagram', icon: 'IG' },
  { type: 'behance', icon: 'Be' },
];

export default function StepPersonalInfo() {
  const { resume, language, updatePersonalInfo, toggleLink, updateLinkUrl } = useBuilderStore();
  const pi = resume.personalInfo;
  const lang = language;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('full_name', lang)}
          required
          value={pi.fullName}
          onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
          placeholder="Ahmed Jasm"
        />
        <Input
          label={t('job_title', lang)}
          value={pi.jobTitle}
          onChange={(e) => updatePersonalInfo({ jobTitle: e.target.value })}
          placeholder="Software Engineer"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('email', lang)}
          type="email"
          value={pi.email}
          onChange={(e) => updatePersonalInfo({ email: e.target.value })}
          placeholder="ahmed.jasm@example.com"
        />
        <Input
          label={t('phone', lang)}
          type="tel"
          required
          value={pi.phone}
          onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
          placeholder="+964 750 000 0000"
        />
      </div>

      <Input
        label={t('location_field', lang)}
        value={pi.location}
        onChange={(e) => updatePersonalInfo({ location: e.target.value })}
        placeholder="Gullan Street, Erbil, Kurdistan"
      />

      {/* Photo upload placeholder */}
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1.5">
          {t('photo', lang)} <span className="text-surface-400 text-xs font-normal">({t('optional', lang)})</span>
        </label>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-surface-100 border-2 border-dashed border-surface-300 flex items-center justify-center overflow-hidden">
            {pi.photoUrl ? (
              <img src={pi.photoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-5 h-5 text-surface-400" />
            )}
          </div>
          <div className="flex gap-2">
            <label className="cursor-pointer text-sm text-brand-600 hover:text-brand-700 font-medium">
              {t('upload_photo', lang)}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      updatePersonalInfo({ photoUrl: ev.target?.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
            {pi.photoUrl && (
              <button
                onClick={() => updatePersonalInfo({ photoUrl: null })}
                className="text-sm text-red-500 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Social links */}
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-3">
          Social Links <span className="text-surface-400 text-xs font-normal">({t('optional', lang)})</span>
        </label>
        <div className="space-y-3">
          {SOCIAL_LINKS.map((sl) => {
            const link = resume.links.find((l) => l.type === sl.type);
            const isEnabled = link?.enabled || false;
            return (
              <div key={sl.type}>
                <Toggle
                  label={t(sl.type as any, lang)}
                  checked={isEnabled}
                  onChange={() => toggleLink(sl.type)}
                />
                {isEnabled && (
                  <div className="mt-2 ml-[52px]">
                    <Input
                      value={link?.url || ''}
                      onChange={(e) => updateLinkUrl(sl.type, e.target.value)}
                      placeholder={`https://${sl.type}.com/...`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
