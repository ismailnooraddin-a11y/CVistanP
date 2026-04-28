/**
 * Email Service
 *
 * Handles email sending via Resend API
 * Attaches CV, Cover Letter, and FAQ documents
 *
 * @author Cvistan
 * @version 2.0.0
 */

import { Resend } from 'resend';
import { ResumeData } from '@/types';
import {
  generateCvDocx,
  generateCoverLetterDocx,
  generateFaqDocx,
} from './docx-generator';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string;
  resume: Partial<ResumeData> & { personalInfo?: Partial<ResumeData['personalInfo']> };  // ✅ Allows partial
  language: 'en' | 'ar';
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Generate email HTML template
 */
function generateEmailHtml(
  fullName: string,
  isAr: boolean
): string {
  if (isAr) {
    return `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #0c8eeb; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Cvistan</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">ملفاتك جاهزة</p>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1e293b; margin: 0 0 16px;">مرحباً ${fullName}! 👋</h2>
          <p style="color: #475569; line-height: 1.8; margin: 0 0 16px;">شكراً لاستخدامك Cvistan. مرفق ٣ ملفات:</p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="color: #1e293b; font-weight: bold; margin: 0 0 8px;">📎 الملفات المرفقة:</p>
            <p style="color: #475569; margin: 4px 0;">١. <strong>السيرة الذاتية</strong> (DOCX) — جاهزة للتعديل والطباعة</p>
            <p style="color: #475569; margin: 4px 0;">٢. <strong>رسالة التغطية</strong> (DOCX) — استبدل XXXXX بالمسمى الوظيفي</p>
            <p style="color: #475569; margin: 4px 0;">٣. <strong>أسئلة المقابلة</strong> (DOCX) — ١٥ سؤال مع نماذج إجابات</p>
          </div>
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 24px 0 0;">تم الإرسال بواسطة Cvistan</p>
        </div>
      </div>
    `;
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #0c8eeb; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Cvistan</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Your files are ready</p>
      </div>
      <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
        <h2 style="color: #1e293b; margin: 0 0 16px;">Hi ${fullName}! 👋</h2>
        <p style="color: #475569; line-height: 1.8; margin: 0 0 16px;">Thank you for using Cvistan. Attached are 3 files:</p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="color: #1e293b; font-weight: bold; margin: 0 0 8px;">📎 Attachments:</p>
          <p style="color: #475569; margin: 4px 0;">1. <strong>Your CV</strong> (DOCX) — ready to edit and print</p>
          <p style="color: #475569; margin: 4px 0;">2. <strong>Cover Letter</strong> (DOCX) — replace XXXXX with your target job title</p>
          <p style="color: #475569; margin: 4px 0;">3. <strong>Interview FAQ</strong> (DOCX) — 15 questions with sample answers</p>
        </div>
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 24px 0 0;">Sent by Cvistan — Professional CV Builder</p>
      </div>
    </div>
  `;
}

/**
 * Send email with CV package
 */
export async function sendCvPackageEmail({
  to,
  resume,
  language,
}: SendEmailOptions): Promise<EmailResult> {
  try {
    const pi = resume.personalInfo || {};
    const fullName = pi.fullName || 'there';
    const isAr = language === 'ar';

    // Generate documents
    const [cvBuffer, coverBuffer, faqBuffer] = await Promise.all([
      generateCvDocx(resume, { language }),
      generateCoverLetterDocx(resume, { language }),
      generateFaqDocx({ language }),
    ]);

    const docxType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    const emailHtml = generateEmailHtml(fullName, isAr);

    const subject = isAr
      ? `${fullName} — ملفاتك من Cvistan`
      : `${fullName} — Your CV Package from Cvistan`;

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Cvistan <noreply@cvistan.com>',
      to,
      subject,
      html: emailHtml,
      attachments: [
        {
          filename: `${fullName} - CV.docx`,
          content: cvBuffer.toString('base64'),
          content_type: docxType,
        },
        {
          filename: `${fullName} - Cover Letter.docx`,
          content: coverBuffer.toString('base64'),
          content_type: docxType,
        },
        {
          filename: isAr
            ? `أسئلة المقابلة - Interview FAQ.docx`
            : `Interview FAQ - Top 15 Questions.docx`,
          content: faqBuffer.toString('base64'),
          content_type: docxType,
        },
      ],
    });

    if (error) {
      console.error('Resend API error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error('Email send error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to send email',
    };
  }
}
