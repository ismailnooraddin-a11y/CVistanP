'use client';

import { useState } from 'react';
import { useBuilderStore } from '@/store/builder';
import { Input, Button } from '@/components/ui/FormElements';
import { t } from '@/i18n/translations';
import { Download, Mail, Send, UserPlus, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

export default function StepFinalize() {
  const { resume, language } = useBuilderStore();
  const lang = language;

  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState('');

  const [email, setEmail] = useState(resume.personalInfo.email || '');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const [telegramConnected, setTelegramConnected] = useState(false);
  const [sendingTelegram, setSendingTelegram] = useState(false);
  const [telegramSent, setTelegramSent] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      const res = await fetch(`/api/resume/${resume.id || 'local'}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, language: lang }),
      });
      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      // Download files
      if (data.cvPdfUrl) window.open(data.cvPdfUrl, '_blank');
      setGenerated(true);
    } catch (err) {
      setError(lang === 'ar' ? 'فشل في التوليد. حاول مرة أخرى.' : 'Generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadLocal = () => {
    // Client-side generation fallback using print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const { renderResumeHtml } = require('@/templates/renderer');
      const html = renderResumeHtml(resume, true);
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="${lang === 'ar' ? 'rtl' : 'ltr'}" lang="${lang}">
        <head>
          <meta charset="utf-8"/>
          <title>${resume.personalInfo.fullName} - CV</title>
          <style>
            @page { size: A4; margin: 0; }
            body { margin: 0; padding: 0; }
          </style>
        </head>
        <body>${html}</body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
    }
  };

  const handleSendEmail = async () => {
    if (!email) return;
    setSendingEmail(true);
    try {
      const res = await fetch(`/api/resume/${resume.id || 'local'}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, email, language: lang }),
      });
      if (!res.ok) throw new Error('Email failed');
      setEmailSent(true);
    } catch {
      setError(lang === 'ar' ? 'فشل إرسال البريد' : 'Failed to send email');
    } finally {
      setSendingEmail(false);
    }
  };

  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'CvistanBot';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-xl border border-surface-200 p-6">
        <h3 className="font-semibold text-surface-800 mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-brand-600" />
          {t('download_cv', lang)}
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleDownloadLocal} variant="primary" size="lg">
            <Download className="w-4 h-4" />
            {t('download_cv', lang)}
          </Button>
          <Button onClick={handleGenerate} variant="secondary" size="lg" loading={generating}>
            {t('download_cover_letter', lang)}
          </Button>
        </div>
        {error && (
          <div className="mt-3 flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>

      {/* Email */}
      <div className="bg-white rounded-xl border border-surface-200 p-6">
        <h3 className="font-semibold text-surface-800 mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5 text-brand-600" />
          {t('send_by_email', lang)}
        </h3>
        {emailSent ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            {t('success', lang)}
          </div>
        ) : (
          <div className="flex gap-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('email_address', lang)}
              className="flex-1"
            />
            <Button onClick={handleSendEmail} loading={sendingEmail} disabled={!email}>
              {t('send', lang)}
            </Button>
          </div>
        )}
      </div>

      {/* Telegram */}
      <div className="bg-white rounded-xl border border-surface-200 p-6">
        <h3 className="font-semibold text-surface-800 mb-4 flex items-center gap-2">
          <Send className="w-5 h-5 text-brand-600" />
          {t('send_to_telegram', lang)}
        </h3>
        <p className="text-sm text-surface-500 mb-4">{t('telegram_instructions', lang)}</p>
        <ol className="text-sm text-surface-600 space-y-2 mb-4">
          <li>{t('telegram_step_1', lang)}</li>
          <li>{t('telegram_step_2', lang)}</li>
          <li>{t('telegram_step_3', lang)}</li>
        </ol>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`https://t.me/${botUsername}?start=cv`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#0088cc] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#006daa] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            {t('open_telegram_bot', lang)}
          </a>
          {telegramSent ? (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle className="w-4 h-4" />
              {t('success', lang)}
            </div>
          ) : (
            <Button variant="secondary" disabled={!telegramConnected} loading={sendingTelegram}>
              <Send className="w-4 h-4" />
              {t('send_to_telegram', lang)}
            </Button>
          )}
        </div>
      </div>

      {/* Save prompt */}
      <div className="bg-brand-50 rounded-xl border border-brand-100 p-6">
        <h3 className="font-semibold text-surface-800 mb-2 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-brand-600" />
          {t('save_your_work', lang)}
        </h3>
        <p className="text-sm text-surface-500 mb-4">{t('save_prompt', lang)}</p>
        <div className="flex gap-3">
          <Button variant="primary" onClick={() => window.location.href = '/auth/signup'}>
            {t('sign_up', lang)}
          </Button>
          <Button variant="ghost">
            {t('no_thanks', lang)}
          </Button>
        </div>
      </div>
    </div>
  );
}
