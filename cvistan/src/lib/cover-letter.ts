import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  Packer,
} from 'docx';
import { ResumeData, AppLanguage } from '@/types';

export async function generateCoverLetterDocx(
  data: ResumeData,
  language: AppLanguage
): Promise<Buffer> {
  const pi = data.personalInfo;
  const isAr = language === 'ar';

  const today = new Date().toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children: [
          // Header with name
          new Paragraph({
            alignment: isAr ? AlignmentType.RIGHT : AlignmentType.LEFT,
            children: [
              new TextRun({ text: pi.fullName || '', bold: true, size: 28, font: isAr ? 'Arial' : 'Calibri' }),
            ],
          }),
          new Paragraph({
            alignment: isAr ? AlignmentType.RIGHT : AlignmentType.LEFT,
            children: [
              new TextRun({ text: pi.jobTitle || '', size: 22, color: '666666', font: isAr ? 'Arial' : 'Calibri' }),
            ],
          }),
          new Paragraph({
            alignment: isAr ? AlignmentType.RIGHT : AlignmentType.LEFT,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: [pi.email, pi.phone, pi.location].filter(Boolean).join(' | '),
                size: 20,
                color: '888888',
                font: isAr ? 'Arial' : 'Calibri',
              }),
            ],
          }),

          // Date
          new Paragraph({
            alignment: isAr ? AlignmentType.RIGHT : AlignmentType.LEFT,
            spacing: { before: 400, after: 200 },
            children: [new TextRun({ text: today, size: 22, font: isAr ? 'Arial' : 'Calibri' })],
          }),

          // Placeholder for recipient
          new Paragraph({
            alignment: isAr ? AlignmentType.RIGHT : AlignmentType.LEFT,
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: isAr ? '[اسم مسؤول التوظيف]' : '[Hiring Manager Name]',
                size: 22,
                italics: true,
                color: '999999',
                font: isAr ? 'Arial' : 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            alignment: isAr ? AlignmentType.RIGHT : AlignmentType.LEFT,
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: isAr ? '[اسم الشركة]' : '[Company Name]',
                size: 22,
                italics: true,
                color: '999999',
                font: isAr ? 'Arial' : 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            alignment: isAr ? AlignmentType.RIGHT : AlignmentType.LEFT,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: isAr ? '[عنوان الشركة]' : '[Company Address]',
                size: 22,
                italics: true,
                color: '999999',
                font: isAr ? 'Arial' : 'Calibri',
              }),
            ],
          }),

          // Subject
          new Paragraph({
            alignment: isAr ? AlignmentType.RIGHT : AlignmentType.LEFT,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: isAr
                  ? `الموضوع: طلب التقديم لوظيفة ${pi.jobTitle || '[المسمى الوظيفي]'}`
                  : `RE: Application for ${pi.jobTitle || '[Job Title]'} Position`,
                bold: true,
                size: 22,
                font: isAr ? 'Arial' : 'Calibri',
              }),
            ],
          }),

          // Greeting
          new Paragraph({
            alignment: isAr ? AlignmentType.RIGHT : AlignmentType.LEFT,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: isAr ? 'السلام عليكم ورحمة الله وبركاته،' : 'Dear Hiring Manager,',
                size: 22,
                font: isAr ? 'Arial' : 'Calibri',
              }),
            ],
          }),

          // Body paragraph 1
          new Paragraph({
            alignment: isAr ? AlignmentType.RIGHT : AlignmentType.LEFT,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: isAr
                  ? `أكتب إليكم للتعبير عن اهتمامي بوظيفة ${pi.jobTitle || '[المسمى الوظيفي]'} في شركتكم. بخبرتي المهنية ومهاراتي، أعتقد أنني سأكون إضافة قيمة لفريقكم.`
                  : `I am writing to express my interest in the ${pi.jobTitle || '[Job Title]'} position at your company. With my professional experience and skill set, I believe I would be a valuable addition to your team.`,
                size: 22,
                font: isAr ? 'Arial' : 'Calibri',
              }),
            ],
          }),

          // Body paragraph 2
          new Paragraph({
            alignment: isAr ? AlignmentType.RIGHT : AlignmentType.LEFT,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: isAr
                  ? '[أضف هنا تفاصيل عن خبراتك وإنجازاتك ذات الصلة بالوظيفة المطلوبة]'
                  : '[Add details here about your relevant experience and achievements for the target role]',
                size: 22,
                italics: true,
                color: '999999',
                font: isAr ? 'Arial' : 'Calibri',
              }),
            ],
          }),

          // Closing paragraph
          new Paragraph({
            alignment: isAr ? AlignmentType.RIGHT : AlignmentType.LEFT,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: isAr
                  ? 'أتطلع إلى فرصة مناقشة كيف يمكنني المساهمة في نجاح فريقكم. أشكركم على وقتكم واهتمامكم.'
                  : 'I look forward to the opportunity to discuss how I can contribute to your team\'s success. Thank you for your time and consideration.',
                size: 22,
                font: isAr ? 'Arial' : 'Calibri',
              }),
            ],
          }),

          // Sign off
          new Paragraph({
            alignment: isAr ? AlignmentType.RIGHT : AlignmentType.LEFT,
            spacing: { before: 400 },
            children: [
              new TextRun({
                text: isAr ? 'مع خالص التقدير،' : 'Sincerely,',
                size: 22,
                font: isAr ? 'Arial' : 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            alignment: isAr ? AlignmentType.RIGHT : AlignmentType.LEFT,
            spacing: { before: 200 },
            children: [
              new TextRun({ text: pi.fullName || '', bold: true, size: 22, font: isAr ? 'Arial' : 'Calibri' }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return Buffer.from(buffer);
}
