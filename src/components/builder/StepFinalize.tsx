'use client';

import { useState, useCallback } from 'react';
import { useBuilderStore } from '@/store/builder';
import { Input, Button } from '@/components/ui/FormElements';
import { t } from '@/i18n/translations';
import { generateResumePdf } from '@/lib/pdf-generator';
import { generateCoverLetterBlob } from '@/lib/cover-letter';
import { generateInterviewFaqBlob } from '@/lib/interview-faq';
import { downloadBlob } from '@/lib/download';
import { useEmailDelivery } from '@/hooks/useEmailDelivery';
import { ErrorBoundary } from '@/components/error';
import {
  Download,
  FileText,
  Mail,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  UserPlus,
} from 'lucide-react';

interface StepFinalizeProps {
  resumeId?: string;
}

/**
 * StepFinalize - Final step of the CV Builder
 *
 * Features:
 * - Download CV as PDF (client-side)
 * - Download Cover Letter as DOCX
 * - Download Interview FAQ as DOCX
 * - Send complete package via email
 * - Sign up prompt for saving
 *
 * @version 2.0.0 - Removed Telegram, fixed email API path
 */
export default function StepFinalize({ resumeId }: StepFinalizeProps) {
  const { resume, language } = useBuilderStore();
  const lang = language;
  const pi = resume.personalInfo;

  // Download states
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const [downloadingFaq, setDownloadingFaq] = useState(false);
  const [pdfDone, setPdfDone] = useState(false);
  const [docxDone, setDocxDone] = useState(false);
  const [faqDone, setFaqDone] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  // Email states
  const [email, setEmail] = useState(pi.email || '');

  const { loading: sendingEmail, error: emailError, sendEmail, emailSent } = useEmailDelivery({
    resume,
    language: lang as 'en' | 'ar',
    onSuccess: () => {
      // Email sent successfully
    },
    onError: (error) => {
      setDownloadError(error);
    },
  });

  // Download PDF handler
  const handleDownloadPdf = useCallback(async () => {
    setDownloadingPdf(true);
    setDownloadError('');
    setPdfDone(false);
    try {
      await generateResumePdf(resume);
      setPdfDone(true);
    } catch (err) {
      console.error('PDF generation error:', err);
      setDownloadError(
        lang === 'ar' ? 'فشل في تحميل PDF.' : 'PDF download failed.'
      );
    } finally {
      setDownloadingPdf(false);
    }
  }, [resume, lang]);

  // Download Cover Letter handler
  const handleDownloadDocx = useCallback(async () => {
    setDownloadingDocx(true);
    setDownloadError('');
    setDocxDone(false);
    try {
      const blob = await generateCoverLetterBlob(resume, lang);
      const filename = `${pi.fullName || 'Cover Letter'} - Cover Letter.docx`;
      downloadBlob(blob, filename);
      setDocxDone(true);
    } catch (err) {
      console.error('DOCX generation error:', err);
      setDownloadError(
        lang === 'ar'
          ? 'فشل في تحميل رسالة التغطية.'
          : 'Cover letter download failed.'
      );
    } finally {
      setDownloadingDocx(false);
    }
  }, [resume, lang, pi.fullName]);

  // Download FAQ handler
  const handleDownloadFaq = useCallback(async () => {
    setDownloadingFaq(true);
    setDownloadError('');
    setFaqDone(false);
    try {
      const blob = await generateInterviewFaqBlob(lang);
      const filename =
        lang === 'ar'
          ? 'أسئلة المقابلة - Interview FAQ.docx'
          : 'Interview FAQ - Top 15 Questions.docx';
      downloadBlob(blob, filename);
      setFaqDone(true);
    } catch (err) {
      console.error('FAQ generation error:', err);
      setDownloadError(
        lang === 'ar'
          ? 'فشل في تحميل أسئلة المقابلة.'
          : 'Interview FAQ download failed.'
      );
    } finally {
      setDownloadingFaq(false);
    }
  }, [lang]);

  // Send Email handler
  const handleSendEmail = useCallback(async () => {
    if (!email || !resumeId) return;
    await sendEmail(email, resumeId);
  }, [email, resumeId, sendEmail]);

  return (
    <ErrorBoundary>
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
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleDownloadPdf}
                variant="primary"
                size="lg"
                loading={downloadingPdf}
                disabled={downloadingPdf}
              >
                {pdfDone ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    {lang === 'ar' ? 'تم!' : 'Downloaded!'}
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    {t('download_cv', lang)}
                  </>
                )}
              </Button>
              <Button
                onClick={handleDownloadDocx}
                variant="secondary"
                size="lg"
                loading={downloadingDocx}
                disabled={downloadingDocx}
              >
                {docxDone ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    {lang === 'ar' ? 'تم!' : 'Downloaded!'}
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    {t('download_cover_letter', lang)}
                  </>
                )}
              </Button>
            </div>
            <Button
              onClick={handleDownloadFaq}
              variant="secondary"
              size="lg"
              loading={downloadingFaq}
              disabled={downloadingFaq}
              className="w-full sm:w-auto"
            >
              {faqDone ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  {lang === 'ar' ? 'تم!' : 'Downloaded!'}
                </>
              ) : (
                <>
                  <HelpCircle className="w-4 h-4" />
                  {t('download_faq', lang)}
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-surface-400 mt-3">
            {lang === 'ar'
              ? 'استبدل XXXXX بالمسمى الوظيفي في رسالة التغطية، واستبدل [ ] بمعلوماتك في أسئلة المقابلة.'
              : 'Replace XXXXX with the job title in the cover letter, and replace [ ] with your info in the interview FAQ.'}
          </p>
          {downloadError && (
            <div className="mt-3 flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {downloadError}
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
            <div className="space-y-3">
              <div className="flex gap-3">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('email_address', lang)}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendEmail}
                  loading={sendingEmail}
                  disabled={!email || !resumeId}
                >
                  {t('send', lang)}
                </Button>
              </div>
              {!resumeId && (
                <p className="text-xs text-amber-600">
                  {lang === 'ar'
                    ? 'احفظ سيرتك الذاتية أولاً لإرسالها بالبريد.'
                    : 'Save your CV first to send it by email.'}
                </p>
              )}
            </div>
          )}
          {emailError && (
            <div className="mt-3 flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {emailError}
            </div>
          )}
        </div>

        {/* ─── Save Prompt ─── */}
        <div className="bg-brand-50 rounded-xl border border-brand-100 p-6">
          <h3 className="font-semibold text-surface-800 mb-2 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-brand-600" />
            {t('save_your_work', lang)}
          </h3>
          <p className="text-sm text-surface-500 mb-4">
            {t('save_prompt', lang)}
          </p>
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={() => (window.location.href = '/auth/signup')}
            >
              {t('sign_up', lang)}
            </Button>
            {/* FIXED: "No thanks" button now dismisses the prompt */}
            <Button
              variant="ghost"
              onClick={() => {
                // Simply dismiss the save prompt - user can still download without saving
                const prompt = document.querySelector('[class*="bg-brand-50"]');
                if (prompt) {
                  prompt.classList.add('hidden');
                }
              }}
            >
              {t('no_thanks', lang)}
            </Button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
