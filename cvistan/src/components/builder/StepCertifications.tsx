'use client';

import { useBuilderStore } from '@/store/builder';
import { Input, SelectField, Toggle, Button } from '@/components/ui/FormElements';
import { t } from '@/i18n/translations';
import { MONTHS, getYearRange } from '@/lib/utils';
import { Plus, Trash2 } from 'lucide-react';

export default function StepCertifications() {
  const { resume, language, addCertification, updateCertification, removeCertification } = useBuilderStore();
  const lang = language;
  const months = MONTHS.map((m) => ({ value: m.value, label: lang === 'ar' ? m.labelAr : m.labelEn }));
  const years = getYearRange(30, 5).map((y) => ({ value: y, label: String(y) }));

  return (
    <div className="space-y-6 animate-fade-in">
      {resume.certifications.length === 0 && (
        <p className="text-center py-6 text-surface-400">
          {lang === 'ar' ? 'لم تضف أي شهادة بعد' : "You haven't added any certifications yet"}
        </p>
      )}

      {resume.certifications.map((cert, idx) => (
        <div key={cert.id} className="bg-surface-50 rounded-xl p-5 border border-surface-100 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-surface-600">
              {t('certifications', lang)} #{idx + 1}
            </span>
            <button onClick={() => removeCertification(cert.id)} className="text-red-400 hover:text-red-600 p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label={t('certification_name', lang)} required value={cert.name} onChange={(e) => updateCertification(cert.id, { name: e.target.value })} />
            <Input label={t('organization', lang)} required value={cert.organization} onChange={(e) => updateCertification(cert.id, { organization: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <SelectField label={lang === 'ar' ? 'شهر الإصدار' : 'Issue Month'} value={cert.issueMonth || ''} onChange={(e) => updateCertification(cert.id, { issueMonth: Number(e.target.value) || null })} options={months} placeholder={t('select', lang)} />
            <SelectField label={lang === 'ar' ? 'سنة الإصدار' : 'Issue Year'} value={cert.issueYear || ''} onChange={(e) => updateCertification(cert.id, { issueYear: Number(e.target.value) || null })} options={years} placeholder={t('select', lang)} />
            {!cert.noExpiry && (
              <>
                <SelectField label={lang === 'ar' ? 'شهر الانتهاء' : 'Expiry Month'} value={cert.expiryMonth || ''} onChange={(e) => updateCertification(cert.id, { expiryMonth: Number(e.target.value) || null })} options={months} placeholder={t('select', lang)} />
                <SelectField label={lang === 'ar' ? 'سنة الانتهاء' : 'Expiry Year'} value={cert.expiryYear || ''} onChange={(e) => updateCertification(cert.id, { expiryYear: Number(e.target.value) || null })} options={years} placeholder={t('select', lang)} />
              </>
            )}
          </div>

          <Toggle label={t('no_expiry', lang)} checked={cert.noExpiry} onChange={(checked) => updateCertification(cert.id, { noExpiry: checked })} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              label={t('training_mode', lang)}
              value={cert.trainingMode || ''}
              onChange={(e) => updateCertification(cert.id, { trainingMode: (e.target.value as any) || null })}
              options={[
                { value: 'online', label: t('online', lang) },
                { value: 'in-person', label: t('in_person', lang) },
              ]}
              placeholder={t('select', lang)}
            />
            <Input label={t('credential_id', lang)} value={cert.credentialId || ''} onChange={(e) => updateCertification(cert.id, { credentialId: e.target.value })} />
          </div>
        </div>
      ))}

      <Button variant="secondary" onClick={addCertification} className="w-full">
        <Plus className="w-4 h-4" />
        {t('add_certification', lang)}
      </Button>
    </div>
  );
}
