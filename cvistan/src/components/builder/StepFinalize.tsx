'use client';

import { useState, useEffect } from 'react';
import { useBuilderStore } from '@/store/builder';
import { Input, Button } from '@/components/ui/FormElements';
import { t } from '@/i18n/translations';
import { generateResumePdf } from '@/lib/pdf-generator';
import { generateCoverLetterBlob } from '@/lib/cover-letter';
import { generateInterviewFaqBlob } from '@/lib/interview-faq';
import { downloadBlob } from '@/lib/download';
import {
  Download, FileText, Mail, Send, UserPlus,
  CheckCircle, AlertCircle, ExternalLink, HelpCircle,
} from 'lucide-react';

export default function StepFinalize() {
  const { resume, language } = useBuilderStore();
  const lang = language;
  const pi = resume.personalInfo;

  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const [downloadingFaq, setDownloadingFaq] = useState(false);
  const [pdfDone, setPdfDone] = useState(false);
  const [docxDone, setDocxDone] = useState(false);
  const [faqDone, setFaqDone] = useState(false);
  const [error, setError] = useState('');

  const [email, setEmail] = useState(pi.email || '');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const [telegramPhone, setTelegramPhone] = useState(pi.phone || '');
  const [telegramStep, setTelegramStep] = useState<'start' | 'waiting' | 'ready' | 'sent'>('start');
  const [sendingTelegram, setSendingTelegram] = useState(false);
  const [telegramError, setTelegramError] = useState('');

  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'CvistanBot';

  // Poll for Telegram connection after user clicks "Open Telegram Bot"
  useEffect(() => {
    if (telegramStep !== 'waiting') return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/telegram/check?phone=${encodeURIComponent(telegramPhone)}`);
        const data = await res.json();
        if (data.connected) {
          setTelegramStep('ready');
          clearInterval(interval);
        }
      } catch {}
    }, 3000);

    // Stop polling after 2 minutes
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 120000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [telegramStep, telegramPhone]);

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    setError('');
    setPdfDone(false);
    try {
      await generateResumePdf(resume);
      setPdfDone(true);
    } catch (err) {
      console.error('PDF generation error:', err);
      setError(lang === 'ar' ? 'فشل في تحميل PDF.' : 'PDF download failed.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadDocx = async () => {
    setDownloadingDocx(true);
    setError('');
    setDocxDone(false);
    try {
      const blob = await generateCoverLetterBlob(resume, lang);
      const filename = (pi.fullName || 'Cover Letter') + ' - Cover Letter.docx';
      downloadBlob(blob, filename);
      setDocxDone(true);
    } catch (err) {
      console.error('DOCX generation error:', err);
      setError(lang === 'ar' ? 'فشل في تحميل رسالة التغطية.' : 'Cover letter download failed.');
    } finally {
      setDownloadingDocx(false);
    }
  };

  const handleDownloadFaq = async () => {
    setDownloadingFaq(true);
    setError('');
    setFaqDone(false);
    try {
      const blob = await generateInterviewFaqBlob(lang);
      const filename = lang === 'ar'
        ? 'أسئلة المقابلة - Interview FAQ.docx'
        : 'Interview FAQ - Top 15 Questions.docx';
      downloadBlob(blob, filename);
      setFaqDone(true);
    } catch (err) {
      console.error('FAQ generation error:', err);
      setError(lang === 'ar' ? 'فشل في تحميل أسئلة المقابلة.' : 'Interview FAQ download failed.');
    } finally {
      setDownloadingFaq(false);
    }
  };

  const handleSendEmail = async () => {
    if (!email) return;
    setSendingEmail(true);
    setError('');
    try {
      const res = await fetch('/api/resume/local/send-email', {
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

  const handleOpenTelegram = () => {
    setTelegramStep('waiting');
    window.open(`https://t.me/${botUsername}?start=cv`, '_blank');
  };

  const handleSendTelegram = async () => {
    setSendingTelegram(true);
    setTelegramError('');
    try {
      const res = await fetch('/api/resume/local/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, language: lang, phone: telegramPhone }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed');
      }
      setTelegramStep('sent');
    } catch (err: any) {
      setTelegramError(err.message || (lang === 'ar' ? 'فشل الإرسال' : 'Failed to send'));
    } finally {
      setSendingTelegram(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ─── Download Section ─── */}
      <div className="bg-white rounded-xl border border-surface-200 p-6">
        <h3 className="font-semibold text-surface-800 mb-2 flex items-center gap-2">
          <Download className="w-5 h-5 text-brand-600" />
          {lang === 'ar' ? 'تحميل الملفات' : 'Download Your Files'}
        </h3>
        <p className="text-sm text-surface-400 mb-4">
          {lang === 'ar' ? 'اضغط على الأزرار أدناه لتحميل ملفاتك مباشرة.' : 'Click the buttons below to auto-download your files.'}
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleDownloadPdf} variant="primary" size="lg" loading={downloadingPdf} disabled={downloadingPdf}>
              {pdfDone ? <><CheckCircle className="w-4 h-4" /> {lang === 'ar' ? 'تم!' : 'Downloaded!'}</> : <><FileText className="w-4 h-4" /> {t('download_cv', lang)}</>}
            </Button>
            <Button onClick={handleDownloadDocx} variant="secondary" size="lg" loading={downloadingDocx} disabled={downloadingDocx}>
              {docxDone ? <><CheckCircle className="w-4 h-4 text-green-600" /> {lang === 'ar' ? 'تم!' : 'Downloaded!'}</> : <><Download className="w-4 h-4" /> {t('download_cover_letter', lang)}</>}
            </Button>
          </div>
          <Button onClick={handleDownloadFaq} variant="secondary" size="lg" loading={downloadingFaq} disabled={downloadingFaq} className="w-full sm:w-auto">
            {faqDone ? <><CheckCircle className="w-4 h-4 text-green-600" /> {lang === 'ar' ? 'تم!' : 'Downloaded!'}</> : <><HelpCircle className="w-4 h-4" /> {t('download_faq', lang)}</>}
          </Button>
        </div>
        <p className="text-xs text-surface-400 mt-3">
          {lang === 'ar' ? 'استبدل XXXXX بالمسمى الوظيفي في رسالة التغطية، واستبدل [ ] بمعلوماتك في أسئلة المقابلة.' : 'Replace XXXXX with the job title in the cover letter, and replace [ ] with your info in the interview FAQ.'}
        </p>
        {error && <div className="mt-3 flex items-center gap-2 text-red-500 text-sm"><AlertCircle className="w-4 h-4 flex-shrink-0" />{error}</div>}
      </div>

      {/* ─── Email Section ─── */}
      <div className="bg-white rounded-xl border border-surface-200 p-6">
        <h3 className="font-semibold text-surface-800 mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5 text-brand-600" />
          {t('send_by_email', lang)}
        </h3>
        {emailSent ? (
          <div className="flex items-center gap-2 text-green-600"><CheckCircle className="w-5 h-5" />{t('success', lang)}</div>
        ) : (
          <div className="flex gap-3">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('email_address', lang)} className="flex-1" />
            <Button onClick={handleSendEmail} loading={sendingEmail} disabled={!email}>{t('send', lang)}</Button>
          </div>
        )}
      </div>

      {/* ─── Telegram Section ─── */}
      <div className="bg-white rounded-xl border border-surface-200 p-6">
        <h3 className="font-semibold text-surface-800 mb-4 flex items-center gap-2">
          <Send className="w-5 h-5 text-brand-600" />
          {t('send_to_telegram', lang)}
        </h3>

        {telegramStep === 'sent' ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            {lang === 'ar' ? 'تم إرسال الملفات إلى تيليغرام!' : 'Files sent to Telegram!'}
          </div>
        ) : (
          <>
            {/* Phone number input */}
            <div className="mb-4">
              <Input
                type="tel"
                value={telegramPhone}
                onChange={(e) => setTelegramPhone(e.target.value)}
                label={lang === 'ar' ? 'رقم الهاتف (المرتبط بتيليغرام)' : 'Phone Number (linked to Telegram)'}
                placeholder={lang === 'ar' ? 'رقم هاتفك على تيليغرام' : 'Your Telegram phone number'}
              />
            </div>

            {/* Step-by-step instructions */}
            <div className="bg-surface-50 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-surface-700 mb-3">
                {lang === 'ar' ? 'الخطوات:' : 'Steps:'}
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${telegramStep === 'start' ? 'bg-brand-600 text-white' : 'bg-green-100 text-green-700'}`}>
                    {telegramStep === 'start' ? '1' : '✓'}
                  </span>
                  <p className="text-sm text-surface-600">
                    {lang === 'ar' ? 'اضغط الزر أدناه لفتح بوت تيليغرام واضغط Start' : 'Click the button below to open the Telegram bot and press Start'}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${telegramStep === 'ready' || telegramStep === 'sent' ? 'bg-green-100 text-green-700' : telegramStep === 'waiting' ? 'bg-brand-600 text-white animate-pulse' : 'bg-surface-200 text-surface-500'}`}>
                    {telegramStep === 'ready' || telegramStep === 'sent' ? '✓' : '2'}
                  </span>
                  <p className="text-sm text-surface-600">
                    {telegramStep === 'waiting'
                      ? (lang === 'ar' ? 'بانتظار الاتصال... اضغط Start في تيليغرام' : 'Waiting for connection... press Start in Telegram')
                      : telegramStep === 'ready'
                      ? (lang === 'ar' ? 'متصل! اضغط إرسال أدناه' : 'Connected! Click Send below')
                      : (lang === 'ar' ? 'عد إلى هنا واضغط "إرسال إلى تيليغرام"' : 'Come back here and click "Send to Telegram"')}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {telegramStep === 'start' || telegramStep === 'waiting' ? (
                <button
                  onClick={handleOpenTelegram}
                  className="inline-flex items-center justify-center gap-2 bg-[#0088cc] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#006daa] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  {telegramStep === 'waiting'
                    ? (lang === 'ar' ? 'فتح مرة أخرى' : 'Open Again')
                    : (lang === 'ar' ? 'فتح بوت تيليغرام' : 'Open Telegram Bot')}
                </button>
              ) : null}

              {telegramStep === 'ready' && (
                <Button onClick={handleSendTelegram} variant="primary" size="lg" loading={sendingTelegram}>
                  <Send className="w-4 h-4" />
                  {lang === 'ar' ? 'إرسال إلى تيليغرام' : 'Send to Telegram'}
                </Button>
              )}

              {/* Manual override — skip waiting */}
              {telegramStep === 'waiting' && (
                <Button variant="ghost" size="sm" onClick={() => setTelegramStep('ready')}>
                  {lang === 'ar' ? 'ضغطت Start بالفعل' : 'I already pressed Start'}
                </Button>
              )}
            </div>

            {telegramError && (
              <div className="mt-3 flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />{telegramError}
              </div>
            )}
          </>
        )}
      </div>

      {/* ─── Save Prompt ─── */}
      <div className="bg-brand-50 rounded-xl border border-brand-100 p-6">
        <h3 className="font-semibold text-surface-800 mb-2 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-brand-600" />
          {t('save_your_work', lang)}
        </h3>
        <p className="text-sm text-surface-500 mb-4">{t('save_prompt', lang)}</p>
        <div className="flex gap-3">
          <Button variant="primary" onClick={() => (window.location.href = '/auth/signup')}>{t('sign_up', lang)}</Button>
          <Button variant="ghost">{t('no_thanks', lang)}</Button>
        </div>
      </div>
    </div>
  );
}
