'use client';

import { useState } from 'react';
import { useBuilderStore } from '@/store/builder';
import { Input, Button } from '@/components/ui/FormElements';
import { t } from '@/i18n/translations';
import { renderResumeHtml } from '@/templates/renderer';
import { generateCoverLetterBlob } from '@/lib/cover-letter';
import { generatePdfFromHtml, downloadBlob } from '@/lib/download';
import {
  Download, FileText, Mail, Send, UserPlus,
  CheckCircle, AlertCircle, ExternalLink, Loader2,
} from 'lucide-react';

export default function StepFinalize() {
  const { resume, language } = useBuilderStore();
  const lang = language;
  const pi = resume.personalInfo;

  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const [pdfDone, setPdfDone] = useState(false);
  const [docxDone, setDocxDone] = useState(false);
  const [error, setError] = useState('');

  const [email, setEmail] = useState(pi.email || '');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const [telegramConnected, setTelegramConnected] = useState(false);
  const [sendingTelegram, setSendingTelegram] = useState(false);
  const [telegramSent, setTelegramSent] = useState(false);

  // ─── Auto-download CV as PDF ───
  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    setError('');
    setPdfDone(false);
    try {
      const html = renderResumeHtml(resume, true);
      const fullHtml = `
        <div style="background: white;">
          ${html}
        </div>
      `;
      const filename = `${pi.fullName || 'CV'} - Resume.pdf`;
      await generatePdfFromHtml(fullHtml, filename);
      setPdfDone(true);
    } catch (err) {
      console.error('PDF generation error:', err);
      setError(lang === 'ar' ? 'فشل في تحميل PDF. حاول مرة أخرى.' : 'PDF download failed. Please try again.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  // ─── Auto-download Cover Letter as DOCX ───
  const handleDownloadDocx = async () => {
    setDownloadingDocx(true);
    setError('');
    setDocxDone(false);
    try {
      const blob = await generateCoverLetterBlob(resume, lang);
      const filename = `${pi.fullName || 'Cover Letter'} - Cover Letter.docx`;
      downloadBlob(blob, filename);
      setDocxDone(true);
    } catch (err) {
      console.error('DOCX generation error:', err);
      setError(lang === 'ar' ? 'فشل في تحميل رسالة التغطية.' : 'Cover letter download failed. Please try again.');
    } finally {
      setDownloadingDocx(false);
    }
  };

  // ─── Send Email ───
  const handleSendEmail = async () => {
    if (!email) return;
    setSendingEmail(true);
    setError('');
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
      {/* ─── Download Section ─── */}
      <div className="bg-white rounded-xl border border-surface-200 p-6">
        <h3 className="font-semibold text-surface-800 mb-2 flex items-center gap-2">
          <Download className="w-5 h-5 text-brand-600" />
          {lang === 'ar' ? 'تحميل الملفات' : 'Download Your Files'}
        </h3>
        <p className="text-sm text-surface-400 mb-4">
          {lang === 'ar'
            ? 'اضغط على الأزرار أدناه لتحميل ملفاتك مباشرة.'
            : 'Click the buttons below to auto-download your files.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* PDF Button */}
          <Button
            onClick={handleDownloadPdf}
            variant="primary"
            size="lg"
            loading={downloadingPdf}
            disabled={downloadingPdf}
          >
            {pdfDone ? (
              <><CheckCircle className="w-4 h-4" /> {lang === 'ar' ? 'تم التحميل!' : 'Downloaded!'}</>
            ) : (
              <><FileText className="w-4 h-4" /> {t('download_cv', lang)}</>
            )}
          </Button>

          {/* DOCX Button */}
          <Button
            onClick={handleDownloadDocx}
            variant="secondary"
            size="lg"
            loading={downloadingDocx}
            disabled={downloadingDocx}
          >
            {docxDone ? (
              <><CheckCircle className="w-4 h-4 text-green-600" /> {lang === 'ar' ? 'تم التحميل!' : 'Downloaded!'}</>
            ) : (
              <><Download className="w-4 h-4" /> {t('download_cover_letter', lang)}</>
            )}
          </Button>
        </div>

        {/* Cover letter note */}
        <p className="text-xs text-surface-400 mt-3">
          {lang === 'ar'
            ? 'رسالة التغطية تتضمن اسمك وبريدك ورقم هاتفك. استبدل XXXXX بالمسمى الوظيفي المستهدف.'
            : 'The cover letter includes your name, email, and phone. Replace XXXXX with the position you are applying for.'}
        </p>

        {error && (
          <div className="mt-3 flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* ─── Email Section ─── */}
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

      {/* ─── Telegram Section ─── */}
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

      {/* ─── Save Prompt ─── */}
      <div className="bg-brand-50 rounded-xl border border-brand-100 p-6">
        <h3 className="font-semibold text-surface-800 mb-2 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-brand-600" />
          {t('save_your_work', lang)}
        </h3>
        <p className="text-sm text-surface-500 mb-4">{t('save_prompt', lang)}</p>
        <div className="flex gap-3">
          <Button variant="primary" onClick={() => (window.location.href = '/auth/signup')}>
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
