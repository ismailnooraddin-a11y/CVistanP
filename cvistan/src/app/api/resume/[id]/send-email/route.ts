import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  Packer,
  BorderStyle,
} from 'docx';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email, resume, language } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const pi = resume.personalInfo || {};
    const isAr = language === 'ar';
    const fullName = pi.fullName || 'User';

    // Generate cover letter DOCX as attachment
    const coverLetterBuffer = await generateCoverLetterBuffer(resume, language);

    // Build a nice HTML email
    const emailHtml = isAr ? `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #0c8eeb; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Cvistan</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">سيرتك الذاتية جاهزة</p>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1e293b; margin: 0 0 16px;">مرحباً ${fullName}! 👋</h2>
          <p style="color: #475569; line-height: 1.8; margin: 0 0 16px;">
            شكراً لاستخدامك Cvistan لبناء سيرتك الذاتية. مرفق رسالة التغطية بصيغة Word (DOCX) جاهزة للتعديل.
          </p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="color: #1e293b; font-weight: bold; margin: 0 0 8px;">📋 ملخص سيرتك الذاتية:</p>
            <p style="color: #475569; margin: 4px 0;">الاسم: <strong>${fullName}</strong></p>
            <p style="color: #475569; margin: 4px 0;">المسمى الوظيفي: <strong>${pi.jobTitle || '-'}</strong></p>
            <p style="color: #475569; margin: 4px 0;">البريد: <strong>${pi.email || '-'}</strong></p>
            <p style="color: #475569; margin: 4px 0;">الهاتف: <strong>${pi.phone || '-'}</strong></p>
            <p style="color: #475569; margin: 4px 0;">الموقع: <strong>${pi.location || '-'}</strong></p>
          </div>
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="color: #1e40af; font-weight: bold; margin: 0 0 8px;">💡 نصائح:</p>
            <p style="color: #1e40af; margin: 4px 0;">• استبدل XXXXX في رسالة التغطية بالمسمى الوظيفي المستهدف</p>
            <p style="color: #1e40af; margin: 4px 0;">• عدّل الأقواس المربعة [ ] بمعلوماتك الشخصية</p>
            <p style="color: #1e40af; margin: 4px 0;">• لتحميل سيرتك الذاتية كـ PDF، ارجع إلى الموقع واضغط "تحميل"</p>
          </div>
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 24px 0 0;">
            تم إرسال هذا البريد بواسطة Cvistan — منصة بناء السيرة الذاتية
          </p>
        </div>
      </div>
    ` : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #0c8eeb; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Cvistan</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Your CV package is ready</p>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1e293b; margin: 0 0 16px;">Hi ${fullName}! 👋</h2>
          <p style="color: #475569; line-height: 1.8; margin: 0 0 16px;">
            Thank you for using Cvistan to build your CV. Attached is your cover letter in Word (DOCX) format, ready for you to customize.
          </p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="color: #1e293b; font-weight: bold; margin: 0 0 8px;">📋 Your CV Summary:</p>
            <p style="color: #475569; margin: 4px 0;">Name: <strong>${fullName}</strong></p>
            <p style="color: #475569; margin: 4px 0;">Job Title: <strong>${pi.jobTitle || '-'}</strong></p>
            <p style="color: #475569; margin: 4px 0;">Email: <strong>${pi.email || '-'}</strong></p>
            <p style="color: #475569; margin: 4px 0;">Phone: <strong>${pi.phone || '-'}</strong></p>
            <p style="color: #475569; margin: 4px 0;">Location: <strong>${pi.location || '-'}</strong></p>
          </div>
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="color: #1e40af; font-weight: bold; margin: 0 0 8px;">💡 Quick Tips:</p>
            <p style="color: #1e40af; margin: 4px 0;">• Replace XXXXX in the cover letter with your target job title</p>
            <p style="color: #1e40af; margin: 4px 0;">• Fill in the square brackets [ ] with your personal details</p>
            <p style="color: #1e40af; margin: 4px 0;">• To download your CV as PDF, go back to the website and click "Download"</p>
          </div>
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 24px 0 0;">
            This email was sent by Cvistan — Professional CV Builder
          </p>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Cvistan <noreply@cvistan.com>',
      to: email,
      subject: isAr
        ? `${fullName} — سيرتك الذاتية من Cvistan`
        : `${fullName} — Your CV Package from Cvistan`,
      html: emailHtml,
      attachments: [
        {
          filename: `${fullName} - Cover Letter.docx`,
          content: coverLetterBuffer.toString('base64'),
          contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        },
      ],
    });

    if (error) throw error;

    return NextResponse.json({ success: true, messageId: data?.id });
  } catch (err: any) {
    console.error('Email send error:', err);
    return NextResponse.json({ error: err.message || 'Failed to send email' }, { status: 500 });
  }
}

async function generateCoverLetterBuffer(data: any, language: string): Promise<Buffer> {
  const pi = data.personalInfo || {};
  const isAr = language === 'ar';
  const font = 'Times New Roman';
  const fontSize = 24;
  const align = isAr ? AlignmentType.RIGHT : AlignmentType.LEFT;
  const justify = isAr ? AlignmentType.RIGHT : AlignmentType.JUSTIFIED;

  const today = new Date().toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font, size: fontSize } },
      },
    },
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: [
        new Paragraph({
          alignment: isAr ? AlignmentType.RIGHT : AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [new TextRun({ text: pi.fullName || 'XXXXX', bold: true, size: 32, font })],
        }),
        new Paragraph({
          alignment: isAr ? AlignmentType.RIGHT : AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [new TextRun({ text: pi.jobTitle || 'XXXXX', size: 26, color: '333333', font })],
        }),
        new Paragraph({
          alignment: isAr ? AlignmentType.RIGHT : AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [new TextRun({
            text: [pi.email, pi.phone, pi.location].filter(Boolean).join('  |  ') || 'XXXXX',
            size: 22, color: '555555', font,
          })],
        }),
        new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '333333' } },
          spacing: { after: 300 },
          children: [],
        }),
        new Paragraph({
          alignment: align,
          spacing: { after: 200 },
          children: [new TextRun({ text: today, size: fontSize, font })],
        }),
        new Paragraph({
          alignment: align, spacing: { after: 80 },
          children: [new TextRun({ text: isAr ? '[اسم مسؤول التوظيف]' : '[Hiring Manager Name]', size: fontSize, color: '888888', italics: true, font })],
        }),
        new Paragraph({
          alignment: align, spacing: { after: 80 },
          children: [new TextRun({ text: isAr ? '[اسم الشركة]' : '[Company Name]', size: fontSize, color: '888888', italics: true, font })],
        }),
        new Paragraph({
          alignment: align, spacing: { after: 300 },
          children: [new TextRun({ text: isAr ? '[عنوان الشركة]' : '[Company Address]', size: fontSize, color: '888888', italics: true, font })],
        }),
        new Paragraph({
          alignment: align, spacing: { after: 200 },
          children: [new TextRun({
            text: isAr ? 'الموضوع: طلب التقديم لوظيفة XXXXX' : 'RE: Application for the Position of XXXXX',
            bold: true, size: fontSize, font,
          })],
        }),
        new Paragraph({
          alignment: align, spacing: { after: 200 },
          children: [new TextRun({ text: isAr ? 'السلام عليكم ورحمة الله وبركاته،' : 'Dear Hiring Manager,', size: fontSize, font })],
        }),
        new Paragraph({
          alignment: justify, spacing: { after: 200, line: 360 },
          children: [new TextRun({
            text: isAr
              ? `أكتب إليكم للتعبير عن اهتمامي الكبير بوظيفة XXXXX المعلن عنها في شركتكم الموقرة. أنا ${pi.fullName || 'XXXXX'}، أعمل حالياً بصفة ${pi.jobTitle || 'XXXXX'}، وأعتقد أن مؤهلاتي وخبراتي المهنية تجعلني مرشحاً مناسباً لهذا الدور المهم.`
              : `I am writing to express my enthusiastic interest in the XXXXX position at your esteemed organization. My name is ${pi.fullName || 'XXXXX'}, and I am currently working as a ${pi.jobTitle || 'XXXXX'}. I am confident that my qualifications and professional experience make me a strong candidate for this important role.`,
            size: fontSize, font,
          })],
        }),
        new Paragraph({
          alignment: justify, spacing: { after: 200, line: 360 },
          children: [new TextRun({
            text: isAr
              ? 'خلال مسيرتي المهنية، اكتسبت خبرة واسعة في مجال تخصصي، حيث تمكنت من تطوير مهاراتي التقنية والقيادية. لقد عملت على مشاريع متنوعة ساهمت في تحقيق نتائج ملموسة.'
              : 'Throughout my professional career, I have gained extensive experience in my field of expertise, developing both my technical and leadership skills. I have successfully contributed to diverse projects that delivered measurable results.',
            size: fontSize, font,
          })],
        }),
        new Paragraph({
          alignment: justify, spacing: { after: 200, line: 360 },
          children: [new TextRun({
            text: isAr
              ? 'أتطلع بشوق إلى فرصة مناقشة كيف يمكنني المساهمة في تحقيق أهداف فريقكم. أشكركم جزيل الشكر على وقتكم واهتمامكم بطلبي.'
              : 'I would welcome the opportunity to discuss how my skills and experience can contribute to your team\'s objectives. Thank you very much for taking the time to consider my application.',
            size: fontSize, font,
          })],
        }),
        new Paragraph({
          alignment: align, spacing: { before: 400, after: 60 },
          children: [new TextRun({ text: isAr ? 'مع خالص التقدير والاحترام،' : 'Yours sincerely,', size: fontSize, font })],
        }),
        new Paragraph({ alignment: align, spacing: { after: 40 }, children: [] }),
        new Paragraph({
          alignment: align, spacing: { after: 40 },
          children: [new TextRun({ text: pi.fullName || 'XXXXX', bold: true, size: 26, font })],
        }),
        new Paragraph({
          alignment: align, spacing: { after: 40 },
          children: [new TextRun({ text: pi.email || 'XXXXX', size: 22, color: '555555', font })],
        }),
        new Paragraph({
          alignment: align,
          children: [new TextRun({ text: pi.phone || 'XXXXX', size: 22, color: '555555', font })],
        }),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  return Buffer.from(buffer);
}
