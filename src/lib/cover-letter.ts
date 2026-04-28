import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  Packer,
  BorderStyle,
} from 'docx';
import { ResumeData, AppLanguage } from '@/types';

export async function generateCoverLetterBlob(
  data: ResumeData,
  language: AppLanguage
): Promise<Blob> {
  const pi = data.personalInfo;
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
        document: {
          run: { font: font, size: fontSize },
        },
      },
    },
    sections: [
      {
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
            children: [
              new TextRun({ text: pi.fullName || 'XXXXX', bold: true, size: 32, font }),
            ],
          }),
          new Paragraph({
            alignment: isAr ? AlignmentType.RIGHT : AlignmentType.CENTER,
            spacing: { after: 40 },
            children: [
              new TextRun({ text: pi.jobTitle || 'XXXXX', size: 26, color: '333333', font }),
            ],
          }),
          new Paragraph({
            alignment: isAr ? AlignmentType.RIGHT : AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: [pi.email, pi.phone, pi.location].filter(Boolean).join('  |  ') || 'XXXXX',
                size: 22,
                color: '555555',
                font,
              }),
            ],
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
            alignment: align,
            spacing: { after: 80 },
            children: [new TextRun({ text: isAr ? '[اسم مسؤول التوظيف]' : '[Hiring Manager Name]', size: fontSize, color: '888888', italics: true, font })],
          }),
          new Paragraph({
            alignment: align,
            spacing: { after: 80 },
            children: [new TextRun({ text: isAr ? '[اسم الشركة]' : '[Company Name]', size: fontSize, color: '888888', italics: true, font })],
          }),
          new Paragraph({
            alignment: align,
            spacing: { after: 80 },
            children: [new TextRun({ text: isAr ? '[عنوان الشركة]' : '[Company Address]', size: fontSize, color: '888888', italics: true, font })],
          }),
          new Paragraph({
            alignment: align,
            spacing: { after: 300 },
            children: [new TextRun({ text: isAr ? '[المدينة، الرمز البريدي]' : '[City, State, ZIP Code]', size: fontSize, color: '888888', italics: true, font })],
          }),

          new Paragraph({
            alignment: align,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: isAr
                  ? 'الموضوع: طلب التقديم لوظيفة XXXXX'
                  : 'RE: Application for the Position of XXXXX',
                bold: true,
                size: fontSize,
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
                size: fontSize,
                font,
              }),
            ],
          }),

          new Paragraph({
            alignment: justify,
            spacing: { after: 200, line: 360 },
            children: [
              new TextRun({
                text: isAr
                  ? `أكتب إليكم للتعبير عن اهتمامي الكبير بوظيفة XXXXX المعلن عنها في شركتكم الموقرة. أنا ${pi.fullName || 'XXXXX'}، أعمل حالياً بصفة ${pi.jobTitle || 'XXXXX'}، وأعتقد أن مؤهلاتي وخبراتي المهنية تجعلني مرشحاً مناسباً لهذا الدور المهم.`
                  : `I am writing to express my enthusiastic interest in the XXXXX position at your esteemed organization. My name is ${pi.fullName || 'XXXXX'}, and I am currently working as a ${pi.jobTitle || 'XXXXX'}. I am confident that my qualifications, professional experience, and dedication make me a strong candidate for this important role.`,
                size: fontSize,
                font,
              }),
            ],
          }),

          new Paragraph({
            alignment: justify,
            spacing: { after: 200, line: 360 },
            children: [
              new TextRun({
                text: isAr
                  ? 'خلال مسيرتي المهنية، اكتسبت خبرة واسعة في مجال تخصصي، حيث تمكنت من تطوير مهاراتي التقنية والقيادية. لقد عملت على مشاريع متنوعة ساهمت في تحقيق نتائج ملموسة، وأنا حريص على توظيف هذه الخبرات لخدمة فريقكم وتحقيق أهداف المؤسسة.'
                  : 'Throughout my professional career, I have gained extensive experience in my field of expertise, developing both my technical and leadership skills. I have successfully contributed to diverse projects that delivered measurable results, and I am eager to bring this experience to your team to help achieve the organization\'s goals.',
                size: fontSize,
                font,
              }),
            ],
          }),

          new Paragraph({
            alignment: justify,
            spacing: { after: 200, line: 360 },
            children: [
              new TextRun({
                text: isAr
                  ? '[أضف هنا فقرة تفصيلية عن إنجازاتك ومشاريعك الأكثر صلة بالوظيفة المستهدفة. اذكر أرقاماً ونتائج محددة إن أمكن، مثل: زيادة المبيعات بنسبة معينة، أو قيادة فريق من عدد معين، أو إطلاق مشروع ناجح.]'
                  : '[Add a detailed paragraph here about your most relevant achievements and projects for the target position. Include specific numbers and results where possible, such as: increased sales by a certain percentage, led a team of a specific size, or launched a successful project.]',
                size: fontSize,
                italics: true,
                color: '888888',
                font,
              }),
            ],
          }),

          new Paragraph({
            alignment: justify,
            spacing: { after: 200, line: 360 },
            children: [
              new TextRun({
                text: isAr
                  ? 'بالإضافة إلى مهاراتي المهنية، أتميز بقدرتي على العمل ضمن فريق، والتواصل الفعال، وحل المشكلات بطرق إبداعية. أؤمن بأن هذه الصفات، إلى جانب شغفي بالتطور المستمر، ستمكنني من المساهمة بشكل إيجابي في نجاح مؤسستكم.'
                  : 'In addition to my professional skills, I pride myself on my ability to work collaboratively within a team, communicate effectively, and solve problems creatively. I believe these qualities, combined with my passion for continuous growth and development, will enable me to make a meaningful contribution to your organization\'s success.',
                size: fontSize,
                font,
              }),
            ],
          }),

          new Paragraph({
            alignment: justify,
            spacing: { after: 200, line: 360 },
            children: [
              new TextRun({
                text: isAr
                  ? 'أتطلع بشوق إلى فرصة مناقشة كيف يمكنني المساهمة في تحقيق أهداف فريقكم. أشكركم جزيل الشكر على وقتكم واهتمامكم بطلبي، وأرحب بأي استفسار عبر بريدي الإلكتروني أو رقم هاتفي المذكورين أعلاه.'
                  : 'I would welcome the opportunity to discuss in further detail how my skills and experience can contribute to your team\'s objectives. Thank you very much for taking the time to consider my application. Please do not hesitate to contact me via email or phone as listed above should you require any additional information.',
                size: fontSize,
                font,
              }),
            ],
          }),

          new Paragraph({
            alignment: align,
            spacing: { before: 200, after: 200 },
            children: [
              new TextRun({
                text: isAr
                  ? 'في انتظار ردكم الكريم، تفضلوا بقبول فائق الاحترام والتقدير.'
                  : 'I look forward to hearing from you at your earliest convenience.',
                size: fontSize,
                font,
              }),
            ],
          }),

          new Paragraph({
            alignment: align,
            spacing: { before: 400, after: 60 },
            children: [
              new TextRun({ text: isAr ? 'مع خالص التقدير والاحترام،' : 'Yours sincerely,', size: fontSize, font }),
            ],
          }),
          new Paragraph({
            alignment: align,
            spacing: { after: 40 },
            children: [],
          }),
          new Paragraph({
            alignment: align,
            spacing: { after: 40 },
            children: [
              new TextRun({ text: pi.fullName || 'XXXXX', bold: true, size: 26, font }),
            ],
          }),
          new Paragraph({
            alignment: align,
            spacing: { after: 40 },
            children: [
              new TextRun({ text: pi.jobTitle || 'XXXXX', size: fontSize, color: '444444', font }),
            ],
          }),
          new Paragraph({
            alignment: align,
            spacing: { after: 40 },
            children: [
              new TextRun({ text: pi.email || 'XXXXX', size: 22, color: '555555', font }),
            ],
          }),
          new Paragraph({
            alignment: align,
            children: [
              new TextRun({ text: pi.phone || 'XXXXX', size: 22, color: '555555', font }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}
