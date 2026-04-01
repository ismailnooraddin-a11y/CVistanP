import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  Packer,
} from 'docx';
import { ResumeData, AppLanguage } from '@/types';

export async function generateCoverLetterBlob(
  data: ResumeData,
  language: AppLanguage
): Promise<Blob> {
  const pi = data.personalInfo;
  const isAr = language === 'ar';
  const font = isAr ? 'Arial' : 'Calibri';
  const align = isAr ? AlignmentType.RIGHT : AlignmentType.LEFT;

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
          new Paragraph({
            alignment: align,
            children: [
              new TextRun({ text: pi.fullName || 'XXX', bold: true, size: 32, font }),
            ],
          }),
          new Paragraph({
            alignment: align,
            children: [
              new TextRun({ text: pi.jobTitle || 'XXX', size: 24, color: '444444', font }),
            ],
          }),
          new Paragraph({
            alignment: align,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: [pi.email || 'XXX', pi.phone || 'XXX', pi.location].filter(Boolean).join('  |  '),
                size: 20,
                color: '777777',
                font,
              }),
            ],
          }),
          new Paragraph({
            alignment: align,
            spacing: { before: 300, after: 200 },
            children: [new TextRun({ text: today, size: 22, font })],
          }),
          new Paragraph({
            alignment: align,
            spacing: { after: 60 },
            children: [new TextRun({ text: isAr ? '[اسم مسؤول التوظيف]' : '[Hiring Manager Name]', size: 22, italics: true, color: '999999', font })],
          }),
          new Paragraph({
            alignment: align,
            spacing: { after: 60 },
            children: [new TextRun({ text: isAr ? '[اسم الشركة]' : '[Company Name]', size: 22, italics: true, color: '999999', font })],
          }),
          new Paragraph({
            alignment: align,
            spacing: { after: 300 },
            children: [new TextRun({ text: isAr ? '[عنوان الشركة]' : '[Company Address]', size: 22, italics: true, color: '999999', font })],
          }),
          new Paragraph({
            alignment: align,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: isAr
                  ? 'الموضوع: طلب التقديم لوظيفة XXXXX'
                  : 'RE: Application for XXXXX Position',
                bold: true,
                size: 22,
                font,
              }),
            ],
          }),
          new Paragraph({
            alignment: align,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: isAr ? 'السلام عليكم ورحمة الله وبركاته،' : 'Dear Hiring Manager,',
                size: 22,
                font,
              }),
            ],
          }),
          new Paragraph({
            alignment: align,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: isAr
                  ? `أكتب إليكم للتعبير عن اهتمامي بوظيفة XXXXX في شركتكم. أنا ${pi.fullName || 'XXX'}، ${pi.jobTitle || 'XXX'}، وأعتقد أن خبرتي المهنية ومهاراتي تجعلني مرشحاً مناسباً لهذا الدور.`
                  : `I am writing to express my strong interest in the XXXXX position at your company. My name is ${pi.fullName || 'XXX'}, and as a ${pi.jobTitle || 'XXX'}, I believe my professional experience and skills make me a strong candidate for this role.`,
                size: 22,
                font,
              }),
            ],
          }),
          new Paragraph({
            alignment: align,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: isAr
                  ? '[أضف هنا تفاصيل عن خبراتك وإنجازاتك ذات الصلة بالوظيفة المطلوبة. اذكر مشاريع محددة أو نتائج حققتها تُظهر قدرتك على النجاح في هذا الدور.]'
                  : '[Add details here about your relevant experience and key achievements. Mention specific projects or results that demonstrate your ability to excel in this role.]',
                size: 22,
                italics: true,
                color: '999999',
                font,
              }),
            ],
          }),
          new Paragraph({
            alignment: align,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: isAr
                  ? 'أتطلع إلى فرصة مناقشة كيف يمكنني المساهمة في نجاح فريقكم. أشكركم على وقتكم واهتمامكم، وأرحب بأي استفسار على بريدي الإلكتروني أو رقم هاتفي أدناه.'
                  : 'I look forward to the opportunity to discuss how I can contribute to your team\'s success. Thank you for your time and consideration. Please feel free to reach me at my email or phone number listed above.',
                size: 22,
                font,
              }),
            ],
          }),
          new Paragraph({
            alignment: align,
            spacing: { before: 400, after: 100 },
            children: [
              new TextRun({ text: isAr ? 'مع خالص التقدير،' : 'Sincerely,', size: 22, font }),
            ],
          }),
          new Paragraph({
            alignment: align,
            spacing: { after: 40 },
            children: [
              new TextRun({ text: pi.fullName || 'XXX', bold: true, size: 24, font }),
            ],
          }),
          new Paragraph({
            alignment: align,
            spacing: { after: 40 },
            children: [
              new TextRun({ text: pi.email || 'XXX', size: 20, color: '555555', font }),
            ],
          }),
          new Paragraph({
            alignment: align,
            children: [
              new TextRun({ text: pi.phone || 'XXX', size: 20, color: '555555', font }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}
