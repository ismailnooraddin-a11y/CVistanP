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

    const coverLetterBuffer = await generateCoverLetterBuffer(resume, language);
    const faqBuffer = await generateFaqBuffer(language);
    const cvBuffer = await generateCvDocxBuffer(resume, language);

    const emailHtml = isAr ? `
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
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="color: #1e293b; font-weight: bold; margin: 0 0 8px;">📋 ملخص سيرتك:</p>
            <p style="color: #475569; margin: 4px 0;">الاسم: <strong>${fullName}</strong></p>
            <p style="color: #475569; margin: 4px 0;">المسمى: <strong>${pi.jobTitle || '-'}</strong></p>
            <p style="color: #475569; margin: 4px 0;">البريد: <strong>${pi.email || '-'}</strong></p>
            <p style="color: #475569; margin: 4px 0;">الهاتف: <strong>${pi.phone || '-'}</strong></p>
          </div>
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 24px 0 0;">تم الإرسال بواسطة Cvistan</p>
        </div>
      </div>
    ` : `
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
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="color: #1e293b; font-weight: bold; margin: 0 0 8px;">📋 Your CV Summary:</p>
            <p style="color: #475569; margin: 4px 0;">Name: <strong>${fullName}</strong></p>
            <p style="color: #475569; margin: 4px 0;">Title: <strong>${pi.jobTitle || '-'}</strong></p>
            <p style="color: #475569; margin: 4px 0;">Email: <strong>${pi.email || '-'}</strong></p>
            <p style="color: #475569; margin: 4px 0;">Phone: <strong>${pi.phone || '-'}</strong></p>
          </div>
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 24px 0 0;">Sent by Cvistan — Professional CV Builder</p>
        </div>
      </div>
    `;

    const docxType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Cvistan <noreply@cvistan.com>',
      to: email,
      subject: isAr
        ? `${fullName} — ملفاتك من Cvistan`
        : `${fullName} — Your CV Package from Cvistan`,
      html: emailHtml,
      attachments: [
        {
          filename: `${fullName} - CV.docx`,
          content: cvBuffer.toString('base64'),
          content_type: docxType,
        },
        {
          filename: `${fullName} - Cover Letter.docx`,
          content: coverLetterBuffer.toString('base64'),
          content_type: docxType,
        },
        {
          filename: isAr ? `أسئلة المقابلة - Interview FAQ.docx` : `Interview FAQ - Top 15 Questions.docx`,
          content: faqBuffer.toString('base64'),
          content_type: docxType,
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

// ══════════════════════════════════════════
// CV DOCX GENERATOR
// ══════════════════════════════════════════
async function generateCvDocxBuffer(data: any, language: string): Promise<Buffer> {
  const pi = data.personalInfo || {};
  const isAr = language === 'ar';
  const font = 'Arial';
  const align = isAr ? AlignmentType.RIGHT : AlignmentType.LEFT;
  const children: Paragraph[] = [];

  // Header
  children.push(new Paragraph({
    alignment: isAr ? AlignmentType.RIGHT : AlignmentType.CENTER,
    spacing: { after: 40 },
    children: [new TextRun({ text: pi.fullName || '', bold: true, size: 32, font })],
  }));
  children.push(new Paragraph({
    alignment: isAr ? AlignmentType.RIGHT : AlignmentType.CENTER,
    spacing: { after: 40 },
    children: [new TextRun({ text: pi.jobTitle || '', size: 24, color: '444444', font })],
  }));

  const contact = [pi.email, pi.phone, pi.location].filter(Boolean).join('  |  ');
  if (contact) {
    children.push(new Paragraph({
      alignment: isAr ? AlignmentType.RIGHT : AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [new TextRun({ text: contact, size: 20, color: '666666', font })],
    }));
  }

  children.push(new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '333333' } },
    spacing: { after: 200 },
    children: [],
  }));

  // Summary
  if (pi.summary) {
    children.push(sectionTitle(isAr ? 'الملخص المهني' : 'Professional Summary', font));
    children.push(new Paragraph({
      alignment: align, spacing: { after: 160, line: 320 },
      children: [new TextRun({ text: pi.summary, size: 22, font })],
    }));
  }

  // Experience
  const experience = data.experience || [];
  if (experience.length > 0) {
    children.push(sectionTitle(isAr ? 'الخبرة' : 'Experience', font));
    for (const exp of experience) {
      children.push(new Paragraph({
        alignment: align, spacing: { after: 40 },
        children: [
          new TextRun({ text: `${exp.jobTitle || ''} — ${exp.company || ''}`, bold: true, size: 22, font }),
          new TextRun({ text: exp.location ? `, ${exp.location}` : '', size: 22, color: '666666', font }),
        ],
      }));
      const startDate = formatDateSimple(exp.startMonth, exp.startYear);
      const endDate = exp.isCurrent ? (isAr ? 'حالياً' : 'Present') : formatDateSimple(exp.endMonth, exp.endYear);
      children.push(new Paragraph({
        alignment: align, spacing: { after: 80 },
        children: [new TextRun({ text: `${startDate} — ${endDate}`, size: 20, color: '888888', font })],
      }));
      const bullets = (exp.bullets || []).filter((b: any) => b.text);
      for (const bullet of bullets) {
        children.push(new Paragraph({
          alignment: align, spacing: { after: 40 },
          indent: { left: 400 },
          children: [new TextRun({ text: `•  ${bullet.text}`, size: 21, font })],
        }));
      }
      children.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
    }
  }

  // Education
  const education = data.education || [];
  if (education.length > 0) {
    children.push(sectionTitle(isAr ? 'التعليم' : 'Education', font));
    for (const edu of education) {
      children.push(new Paragraph({
        alignment: align, spacing: { after: 40 },
        children: [
          new TextRun({ text: `${edu.degree || ''} — ${edu.institution || ''}`, bold: true, size: 22, font }),
        ],
      }));
      const gradDate = formatDateSimple(edu.graduationMonth, edu.graduationYear);
      if (gradDate) {
        children.push(new Paragraph({
          alignment: align, spacing: { after: 40 },
          children: [new TextRun({ text: gradDate, size: 20, color: '888888', font })],
        }));
      }
      if (edu.gpa) {
        children.push(new Paragraph({
          alignment: align, spacing: { after: 40 },
          children: [new TextRun({ text: `${isAr ? 'المعدل' : 'GPA'}: ${edu.gpa}`, size: 20, color: '666666', font })],
        }));
      }
      children.push(new Paragraph({ spacing: { after: 100 }, children: [] }));
    }
  }

  // Skills
  const skills = data.skills || [];
  if (skills.length > 0) {
    children.push(sectionTitle(isAr ? 'المهارات' : 'Skills', font));
    children.push(new Paragraph({
      alignment: align, spacing: { after: 160 },
      children: [new TextRun({ text: skills.map((s: any) => s.name).join('  •  '), size: 22, font })],
    }));
  }

  // Languages
  const languages = data.languages || [];
  if (languages.length > 0) {
    const profLabels: Record<string, string> = isAr
      ? { beginner: 'مبتدئ', intermediate: 'متوسط', fluent: 'متقدم', native: 'لغة أم' }
      : { beginner: 'Beginner', intermediate: 'Intermediate', fluent: 'Fluent', native: 'Native' };
    children.push(sectionTitle(isAr ? 'اللغات' : 'Languages', font));
    children.push(new Paragraph({
      alignment: align, spacing: { after: 160 },
      children: [new TextRun({
        text: languages.map((l: any) => `${l.name} (${profLabels[l.proficiency] || l.proficiency})`).join('  •  '),
        size: 22, font,
      })],
    }));
  }

  // Certifications
  const certs = data.certifications || [];
  if (certs.length > 0) {
    children.push(sectionTitle(isAr ? 'الشهادات' : 'Certifications', font));
    for (const cert of certs) {
      children.push(new Paragraph({
        alignment: align, spacing: { after: 40 },
        children: [new TextRun({ text: `${cert.name} — ${cert.organization}`, bold: true, size: 22, font })],
      }));
      const issueDate = formatDateSimple(cert.issueMonth, cert.issueYear);
      if (issueDate) {
        children.push(new Paragraph({
          alignment: align, spacing: { after: 80 },
          children: [new TextRun({ text: issueDate, size: 20, color: '888888', font })],
        }));
      }
    }
  }

  const doc = new Document({
    styles: { default: { document: { run: { font: 'Arial', size: 22 } } } },
    sections: [{
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1200, right: 1200, bottom: 1200, left: 1200 } } },
      children,
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  return Buffer.from(buffer);
}

// ══════════════════════════════════════════
// COVER LETTER GENERATOR
// ══════════════════════════════════════════
async function generateCoverLetterBuffer(data: any, language: string): Promise<Buffer> {
  const pi = data.personalInfo || {};
  const isAr = language === 'ar';
  const font = 'Times New Roman';
  const fontSize = 24;
  const align = isAr ? AlignmentType.RIGHT : AlignmentType.LEFT;
  const justify = isAr ? AlignmentType.RIGHT : AlignmentType.JUSTIFIED;

  const today = new Date().toLocaleDateString(isAr ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const doc = new Document({
    styles: { default: { document: { run: { font, size: fontSize } } } },
    sections: [{
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      children: [
        new Paragraph({ alignment: isAr ? AlignmentType.RIGHT : AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: pi.fullName || 'XXXXX', bold: true, size: 32, font })] }),
        new Paragraph({ alignment: isAr ? AlignmentType.RIGHT : AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: pi.jobTitle || 'XXXXX', size: 26, color: '333333', font })] }),
        new Paragraph({ alignment: isAr ? AlignmentType.RIGHT : AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: [pi.email, pi.phone, pi.location].filter(Boolean).join('  |  ') || 'XXXXX', size: 22, color: '555555', font })] }),
        new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '333333' } }, spacing: { after: 300 }, children: [] }),
        new Paragraph({ alignment: align, spacing: { after: 200 }, children: [new TextRun({ text: today, size: fontSize, font })] }),
        new Paragraph({ alignment: align, spacing: { after: 80 }, children: [new TextRun({ text: isAr ? '[اسم مسؤول التوظيف]' : '[Hiring Manager Name]', size: fontSize, color: '888888', italics: true, font })] }),
        new Paragraph({ alignment: align, spacing: { after: 80 }, children: [new TextRun({ text: isAr ? '[اسم الشركة]' : '[Company Name]', size: fontSize, color: '888888', italics: true, font })] }),
        new Paragraph({ alignment: align, spacing: { after: 300 }, children: [new TextRun({ text: isAr ? '[عنوان الشركة]' : '[Company Address]', size: fontSize, color: '888888', italics: true, font })] }),
        new Paragraph({ alignment: align, spacing: { after: 200 }, children: [new TextRun({ text: isAr ? 'الموضوع: طلب التقديم لوظيفة XXXXX' : 'RE: Application for the Position of XXXXX', bold: true, size: fontSize, font })] }),
        new Paragraph({ alignment: align, spacing: { after: 200 }, children: [new TextRun({ text: isAr ? 'السلام عليكم ورحمة الله وبركاته،' : 'Dear Hiring Manager,', size: fontSize, font })] }),
        new Paragraph({ alignment: justify, spacing: { after: 200, line: 360 }, children: [new TextRun({ text: isAr ? `أكتب إليكم للتعبير عن اهتمامي الكبير بوظيفة XXXXX المعلن عنها في شركتكم الموقرة. أنا ${pi.fullName || 'XXXXX'}، أعمل حالياً بصفة ${pi.jobTitle || 'XXXXX'}، وأعتقد أن مؤهلاتي وخبراتي المهنية تجعلني مرشحاً مناسباً لهذا الدور.` : `I am writing to express my enthusiastic interest in the XXXXX position at your esteemed organization. My name is ${pi.fullName || 'XXXXX'}, and I am currently working as a ${pi.jobTitle || 'XXXXX'}. I am confident that my qualifications and professional experience make me a strong candidate for this role.`, size: fontSize, font })] }),
        new Paragraph({ alignment: justify, spacing: { after: 200, line: 360 }, children: [new TextRun({ text: isAr ? 'خلال مسيرتي المهنية، اكتسبت خبرة واسعة في مجال تخصصي، حيث تمكنت من تطوير مهاراتي التقنية والقيادية. لقد عملت على مشاريع متنوعة ساهمت في تحقيق نتائج ملموسة.' : 'Throughout my professional career, I have gained extensive experience in my field, developing both my technical and leadership skills. I have successfully contributed to diverse projects that delivered measurable results.', size: fontSize, font })] }),
        new Paragraph({ alignment: justify, spacing: { after: 200, line: 360 }, children: [new TextRun({ text: isAr ? '[أضف هنا تفاصيل عن إنجازاتك ومشاريعك الأكثر صلة بالوظيفة المستهدفة.]' : '[Add details here about your most relevant achievements and projects for the target position.]', size: fontSize, italics: true, color: '888888', font })] }),
        new Paragraph({ alignment: justify, spacing: { after: 200, line: 360 }, children: [new TextRun({ text: isAr ? 'أتطلع إلى فرصة مناقشة كيف يمكنني المساهمة في تحقيق أهداف فريقكم. أشكركم جزيل الشكر على وقتكم واهتمامكم بطلبي.' : 'I would welcome the opportunity to discuss how my skills can contribute to your team. Thank you for considering my application.', size: fontSize, font })] }),
        new Paragraph({ alignment: align, spacing: { before: 400, after: 60 }, children: [new TextRun({ text: isAr ? 'مع خالص التقدير،' : 'Yours sincerely,', size: fontSize, font })] }),
        new Paragraph({ alignment: align, spacing: { after: 40 }, children: [] }),
        new Paragraph({ alignment: align, spacing: { after: 40 }, children: [new TextRun({ text: pi.fullName || 'XXXXX', bold: true, size: 26, font })] }),
        new Paragraph({ alignment: align, spacing: { after: 40 }, children: [new TextRun({ text: pi.email || 'XXXXX', size: 22, color: '555555', font })] }),
        new Paragraph({ alignment: align, children: [new TextRun({ text: pi.phone || 'XXXXX', size: 22, color: '555555', font })] }),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  return Buffer.from(buffer);
}

// ══════════════════════════════════════════
// FAQ GENERATOR
// ══════════════════════════════════════════
async function generateFaqBuffer(language: string): Promise<Buffer> {
  const isAr = language === 'ar';
  const font = 'Times New Roman';
  const align = isAr ? AlignmentType.RIGHT : AlignmentType.LEFT;
  const children: Paragraph[] = [];

  const faqs = [
    { en: 'Tell me about yourself.', ar: 'حدثني عن نفسك.', ansEn: 'I am a [your title] with [X] years of experience in [your field]. I have worked on [key projects]. I am passionate about [interest] and looking for new challenges.', ansAr: 'أنا [المسمى الوظيفي] ولدي [عدد] سنوات من الخبرة في [مجالك]. عملت على [مشاريع رئيسية]. أنا شغوف بـ[اهتمام] وأبحث عن تحديات جديدة.' },
    { en: 'Why do you want to work here?', ar: 'لماذا تريد العمل هنا؟', ansEn: 'I admire your company\'s [mission/products]. My skills in [area] align well with this role, and I see great opportunity for mutual growth.', ansAr: 'أعجبني [رسالة/منتجات] شركتكم. مهاراتي في [مجال] تتوافق مع هذا الدور، وأرى فرصة رائعة للنمو المتبادل.' },
    { en: 'What are your greatest strengths?', ar: 'ما هي أبرز نقاط قوتك؟', ansEn: 'My key strengths include [strength 1], [strength 2], and [strength 3]. For example, I [brief example].', ansAr: 'أبرز نقاط قوتي تشمل [قوة ١] و[قوة ٢] و[قوة ٣]. على سبيل المثال، [مثال موجز].' },
    { en: 'What is your greatest weakness?', ar: 'ما هي أكبر نقاط ضعفك؟', ansEn: 'I tend to [honest weakness]. However, I have been improving by [strategy]. This has helped me become more efficient.', ansAr: 'أميل إلى [ضعف حقيقي]. ومع ذلك، أعمل على تحسين ذلك من خلال [استراتيجية]. وقد ساعدني ذلك على التحسن.' },
    { en: 'Where do you see yourself in 5 years?', ar: 'أين ترى نفسك بعد ٥ سنوات؟', ansEn: 'I see myself in a [target role] where I can lead projects and mentor others. I want to deepen my expertise in [field].', ansAr: 'أرى نفسي في [دور مستهدف] حيث أقود المشاريع وأوجه الآخرين. أريد تعميق خبرتي في [المجال].' },
    { en: 'Why did you leave your last job?', ar: 'لماذا تركت وظيفتك الأخيرة؟', ansEn: 'I am looking for new challenges and opportunities to grow professionally that better align with my long-term career goals.', ansAr: 'أبحث عن تحديات وفرص جديدة للنمو المهني تتوافق بشكل أفضل مع أهدافي المهنية طويلة المدى.' },
    { en: 'How do you handle stress?', ar: 'كيف تتعامل مع الضغط؟', ansEn: 'I stay organized, prioritize tasks, and break projects into manageable steps. Clear communication also helps prevent unnecessary stress.', ansAr: 'أبقى منظماً، وأرتب الأولويات، وأقسم المشاريع إلى خطوات يمكن إدارتها. التواصل الواضح يمنع التوتر غير الضروري.' },
    { en: 'Describe a difficult situation at work.', ar: 'صف موقفاً صعباً في العمل.', ansEn: 'In my previous role, [situation]. I approached it by [actions]. The result was [positive outcome]. I learned [lesson].', ansAr: 'في وظيفتي السابقة، [الموقف]. تعاملت معه من خلال [الإجراءات]. وكانت النتيجة [نتيجة إيجابية]. تعلمت [الدرس].' },
    { en: 'What are your salary expectations?', ar: 'ما هي توقعاتك للراتب؟', ansEn: 'Based on my experience, I am looking for [range]. However, I am open to discussion about the full compensation package.', ansAr: 'بناءً على خبرتي، أتطلع إلى [نطاق]. ومع ذلك، أنا منفتح على النقاش حول حزمة التعويضات الكاملة.' },
    { en: 'Why should we hire you?', ar: 'لماذا يجب أن نوظفك؟', ansEn: 'I bring [skill 1], [skill 2], and [skill 3] that match this role. I am a fast learner and excited about contributing to your success.', ansAr: 'أقدم [مهارة ١] و[مهارة ٢] و[مهارة ٣] تتطابق مع هذا الدور. أنا سريع التعلم ومتحمس للمساهمة في نجاحكم.' },
    { en: 'Tell me about a time you showed leadership.', ar: 'حدثني عن موقف أظهرت فيه قيادة.', ansEn: 'When [situation], I took initiative to [action]. I coordinated with [who] and the outcome was [result].', ansAr: 'عندما [الموقف]، بادرت بـ[الإجراء]. نسقت مع [من] وكانت النتيجة [النتيجة].' },
    { en: 'How do you work in a team?', ar: 'كيف تعمل ضمن فريق؟', ansEn: 'I believe in open communication, respecting diverse perspectives, and contributing my best work. I actively listen and offer help.', ansAr: 'أؤمن بالتواصل المفتوح، واحترام وجهات النظر المتنوعة، وتقديم أفضل ما لدي. أستمع بفاعلية وأقدم المساعدة.' },
    { en: 'What do you know about our company?', ar: 'ماذا تعرف عن شركتنا؟', ansEn: 'I know that your company [facts]. I particularly admire [aspect] and see my skills as a great fit.', ansAr: 'أعلم أن شركتكم [حقائق]. أعجبني بشكل خاص [جانب] وأرى أن مهاراتي مناسبة جداً.' },
    { en: 'Do you have any questions for us?', ar: 'هل لديك أي أسئلة لنا؟', ansEn: 'Yes! What does a typical day look like? What are the biggest team challenges? What development opportunities exist?', ansAr: 'نعم! كيف يبدو اليوم العادي؟ ما أكبر تحديات الفريق؟ ما فرص التطوير المتاحة؟' },
    { en: 'How do you handle feedback?', ar: 'كيف تتعامل مع الملاحظات؟', ansEn: 'I view feedback as an opportunity to grow. I listen carefully, ask clarifying questions, and take actionable steps to improve.', ansAr: 'أنظر إلى الملاحظات كفرصة للنمو. أستمع بعناية، وأطرح أسئلة توضيحية، وأتخذ خطوات عملية للتحسين.' },
  ];

  children.push(new Paragraph({
    alignment: isAr ? AlignmentType.RIGHT : AlignmentType.CENTER,
    spacing: { after: 100 },
    children: [new TextRun({ text: isAr ? 'أهم ١٥ سؤالاً في مقابلات العمل' : '15 Most Asked Interview Questions', bold: true, size: 36, font })],
  }));
  children.push(new Paragraph({
    alignment: isAr ? AlignmentType.RIGHT : AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [new TextRun({ text: isAr ? 'مع نماذج إجابات جاهزة للتخصيص' : 'With Template Answers Ready to Customize', size: 24, color: '666666', font })],
  }));
  children.push(new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '333333' } }, spacing: { after: 200 }, children: [] }));
  children.push(new Paragraph({
    alignment: align, spacing: { after: 200 },
    children: [new TextRun({ text: isAr ? 'تعليمات: استبدل النصوص بين الأقواس [ ] بمعلوماتك الشخصية.' : 'Instructions: Replace text in [ ] with your own information.', size: 22, italics: true, color: '666666', font })],
  }));

  faqs.forEach((faq, i) => {
    children.push(new Paragraph({
      alignment: align, spacing: { before: 250, after: 80 },
      children: [new TextRun({ text: `${i + 1}. ${isAr ? faq.ar : faq.en}`, bold: true, size: 26, font, color: '1a1a2e' })],
    }));
    children.push(new Paragraph({
      alignment: align, spacing: { after: 40 },
      children: [new TextRun({ text: isAr ? 'نموذج إجابة:' : 'Sample Answer:', bold: true, size: 22, font, color: '0066CC' })],
    }));
    children.push(new Paragraph({
      alignment: align, spacing: { after: 60, line: 340 }, indent: { left: isAr ? 0 : 400, right: isAr ? 400 : 0 },
      children: [new TextRun({ text: isAr ? faq.ansAr : faq.ansEn, size: 24, font, color: '333333' })],
    }));
    children.push(new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' } }, spacing: { after: 80 }, children: [] }));
  });

  children.push(new Paragraph({
    alignment: isAr ? AlignmentType.RIGHT : AlignmentType.CENTER, spacing: { before: 300 },
    children: [new TextRun({ text: isAr ? 'حظاً موفقاً في مقابلتك!' : 'Good luck with your interview!', bold: true, size: 26, font, color: '0066CC' })],
  }));

  const doc = new Document({
    styles: { default: { document: { run: { font, size: 24 } } } },
    sections: [{ properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1200, right: 1200, bottom: 1200, left: 1200 } } }, children }],
  });

  const buffer = await Packer.toBuffer(doc);
  return Buffer.from(buffer);
}

// ══════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════
function sectionTitle(text: string, font: string): Paragraph {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: '0c8eeb' } },
    children: [new TextRun({ text, bold: true, size: 26, font, color: '0c8eeb' })],
  });
}

function formatDateSimple(month: number | null | undefined, year: number | null | undefined): string {
  if (!year) return '';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (month && month >= 1 && month <= 12) return `${months[month - 1]} ${year}`;
  return `${year}`;
}
