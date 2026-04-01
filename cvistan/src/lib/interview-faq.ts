import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  Packer,
  BorderStyle,
  LevelFormat,
} from 'docx';
import { AppLanguage } from '@/types';

interface FaqItem {
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    questionEn: '1. Tell me about yourself.',
    questionAr: '١. حدثني عن نفسك.',
    answerEn: 'I am a [your title] with [X] years of experience in [your field]. I have worked on [key projects/achievements]. I am passionate about [relevant interest] and I am looking for an opportunity to bring my skills to a new challenge.',
    answerAr: 'أنا [المسمى الوظيفي] ولدي [عدد] سنوات من الخبرة في [مجالك]. عملت على [مشاريع/إنجازات رئيسية]. أنا شغوف بـ[اهتمام ذو صلة] وأبحث عن فرصة لتوظيف مهاراتي في تحدٍ جديد.',
  },
  {
    questionEn: '2. Why do you want to work here?',
    questionAr: '٢. لماذا تريد العمل هنا؟',
    answerEn: 'I admire your company\'s [mission/products/culture]. My skills in [relevant area] align well with this role, and I believe I can contribute to [specific goal]. I see this as a great opportunity for mutual growth.',
    answerAr: 'أعجبني [رسالة/منتجات/ثقافة] شركتكم. مهاراتي في [مجال ذو صلة] تتوافق مع هذا الدور، وأعتقد أنني أستطيع المساهمة في [هدف محدد]. أرى هذه فرصة رائعة للنمو المتبادل.',
  },
  {
    questionEn: '3. What are your greatest strengths?',
    questionAr: '٣. ما هي أبرز نقاط قوتك؟',
    answerEn: 'My key strengths include [strength 1, e.g., problem-solving], [strength 2, e.g., communication], and [strength 3, e.g., adaptability]. For example, in my previous role I [give a brief example demonstrating the strength].',
    answerAr: 'أبرز نقاط قوتي تشمل [قوة ١، مثل: حل المشكلات]، [قوة ٢، مثل: التواصل]، و[قوة ٣، مثل: التكيف]. على سبيل المثال، في وظيفتي السابقة [اذكر مثالاً موجزاً يوضح هذه القوة].',
  },
  {
    questionEn: '4. What is your greatest weakness?',
    questionAr: '٤. ما هي أكبر نقاط ضعفك؟',
    answerEn: 'I tend to [honest weakness, e.g., be overly detail-oriented]. However, I have been actively working on this by [specific improvement strategy]. This has helped me become more efficient while maintaining quality.',
    answerAr: 'أميل إلى [ضعف حقيقي، مثل: الاهتمام المفرط بالتفاصيل]. ومع ذلك، أعمل بنشاط على تحسين ذلك من خلال [استراتيجية تحسين محددة]. وقد ساعدني ذلك على أن أصبح أكثر كفاءة مع الحفاظ على الجودة.',
  },
  {
    questionEn: '5. Where do you see yourself in 5 years?',
    questionAr: '٥. أين ترى نفسك بعد ٥ سنوات؟',
    answerEn: 'In five years, I see myself having grown into a [target role] where I can lead projects and mentor others. I want to deepen my expertise in [field] and take on increasing responsibility within the organization.',
    answerAr: 'بعد خمس سنوات، أرى نفسي قد تطورت إلى [دور مستهدف] حيث أقود المشاريع وأوجه الآخرين. أريد تعميق خبرتي في [المجال] وتحمل مسؤوليات متزايدة داخل المؤسسة.',
  },
  {
    questionEn: '6. Why did you leave your last job?',
    questionAr: '٦. لماذا تركت وظيفتك الأخيرة؟',
    answerEn: 'I am looking for new challenges and opportunities to grow professionally. While I valued my experience at my previous company, I felt it was the right time to pursue a role that better aligns with my long-term career goals.',
    answerAr: 'أبحث عن تحديات وفرص جديدة للنمو المهني. بينما أقدر تجربتي في شركتي السابقة، شعرت أن الوقت مناسب للبحث عن دور يتوافق بشكل أفضل مع أهدافي المهنية طويلة المدى.',
  },
  {
    questionEn: '7. How do you handle stress and pressure?',
    questionAr: '٧. كيف تتعامل مع الضغط والتوتر؟',
    answerEn: 'I handle pressure by staying organized, prioritizing tasks, and breaking large projects into manageable steps. I also find that clear communication with my team helps prevent unnecessary stress and keeps everyone aligned.',
    answerAr: 'أتعامل مع الضغط من خلال البقاء منظماً، وترتيب الأولويات، وتقسيم المشاريع الكبيرة إلى خطوات يمكن إدارتها. كما أجد أن التواصل الواضح مع فريقي يساعد في منع التوتر غير الضروري.',
  },
  {
    questionEn: '8. Describe a difficult work situation and how you handled it.',
    questionAr: '٨. صف موقفاً صعباً في العمل وكيف تعاملت معه.',
    answerEn: 'In my previous role, [describe the situation briefly]. I approached it by [actions you took]. The result was [positive outcome]. This experience taught me the importance of [key lesson learned].',
    answerAr: 'في وظيفتي السابقة، [صف الموقف باختصار]. تعاملت معه من خلال [الإجراءات التي اتخذتها]. وكانت النتيجة [نتيجة إيجابية]. علمتني هذه التجربة أهمية [الدرس المستفاد].',
  },
  {
    questionEn: '9. What are your salary expectations?',
    questionAr: '٩. ما هي توقعاتك للراتب؟',
    answerEn: 'Based on my research and experience level, I am looking for a salary in the range of [range]. However, I am open to discussion and would like to learn more about the full compensation package and growth opportunities.',
    answerAr: 'بناءً على بحثي ومستوى خبرتي، أتطلع إلى راتب في نطاق [النطاق]. ومع ذلك، أنا منفتح على النقاش وأود معرفة المزيد عن حزمة التعويضات الكاملة وفرص النمو.',
  },
  {
    questionEn: '10. Why should we hire you?',
    questionAr: '١٠. لماذا يجب أن نوظفك؟',
    answerEn: 'I bring a combination of [key skill 1], [key skill 2], and [key skill 3] that directly match what this role requires. I am a fast learner, a team player, and I am genuinely excited about contributing to your company\'s success.',
    answerAr: 'أقدم مزيجاً من [مهارة ١] و[مهارة ٢] و[مهارة ٣] تتطابق مباشرة مع متطلبات هذا الدور. أنا سريع التعلم، أعمل بروح الفريق، ومتحمس حقاً للمساهمة في نجاح شركتكم.',
  },
  {
    questionEn: '11. Tell me about a time you showed leadership.',
    questionAr: '١١. حدثني عن موقف أظهرت فيه قيادة.',
    answerEn: 'When [describe the situation], I took the initiative to [action]. I coordinated with [who], ensured [what], and the outcome was [result]. It reinforced my belief that good leadership is about empowering others.',
    answerAr: 'عندما [صف الموقف]، بادرت بـ[الإجراء]. نسقت مع [من]، وتأكدت من [ماذا]، وكانت النتيجة [النتيجة]. عزز ذلك إيماني بأن القيادة الجيدة تعني تمكين الآخرين.',
  },
  {
    questionEn: '12. How do you work in a team?',
    questionAr: '١٢. كيف تعمل ضمن فريق؟',
    answerEn: 'I believe in open communication, respecting diverse perspectives, and contributing my best work. I actively listen to teammates, offer help when needed, and I am not afraid to ask for input when I need it.',
    answerAr: 'أؤمن بالتواصل المفتوح، واحترام وجهات النظر المتنوعة، وتقديم أفضل ما لدي. أستمع بفاعلية لزملائي، وأقدم المساعدة عند الحاجة، ولا أتردد في طلب المشورة عندما أحتاجها.',
  },
  {
    questionEn: '13. What do you know about our company?',
    questionAr: '١٣. ماذا تعرف عن شركتنا؟',
    answerEn: 'I know that your company [mention specific facts: founding year, products, mission, recent news]. I particularly admire [specific aspect] and I see my skills in [area] as a great fit for your team.',
    answerAr: 'أعلم أن شركتكم [اذكر حقائق محددة: سنة التأسيس، المنتجات، الرسالة، أخبار حديثة]. أعجبني بشكل خاص [جانب محدد] وأرى أن مهاراتي في [المجال] مناسبة جداً لفريقكم.',
  },
  {
    questionEn: '14. Do you have any questions for us?',
    questionAr: '١٤. هل لديك أي أسئلة لنا؟',
    answerEn: 'Yes! I would love to know: What does a typical day look like in this role? What are the biggest challenges the team is currently facing? What opportunities for professional development does the company offer?',
    answerAr: 'نعم! أود أن أعرف: كيف يبدو اليوم العادي في هذا الدور؟ ما أكبر التحديات التي يواجهها الفريق حالياً؟ ما فرص التطوير المهني التي تقدمها الشركة؟',
  },
  {
    questionEn: '15. How do you handle criticism or feedback?',
    questionAr: '١٥. كيف تتعامل مع النقد أو الملاحظات؟',
    answerEn: 'I view constructive feedback as an opportunity to grow. I listen carefully, ask clarifying questions if needed, and take actionable steps to improve. I believe continuous improvement is essential for professional success.',
    answerAr: 'أنظر إلى الملاحظات البناءة كفرصة للنمو. أستمع بعناية، وأطرح أسئلة توضيحية إذا لزم الأمر، وأتخذ خطوات عملية للتحسين. أؤمن بأن التحسين المستمر ضروري للنجاح المهني.',
  },
];

export async function generateInterviewFaqBlob(language: AppLanguage): Promise<Blob> {
  const isAr = language === 'ar';
  const font = 'Times New Roman';
  const align = isAr ? AlignmentType.RIGHT : AlignmentType.LEFT;

  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      alignment: isAr ? AlignmentType.RIGHT : AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: isAr ? 'أهم ١٥ سؤالاً في مقابلات العمل' : '15 Most Asked Interview Questions',
          bold: true,
          size: 36,
          font,
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      alignment: isAr ? AlignmentType.RIGHT : AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: isAr ? 'مع نماذج إجابات جاهزة للتخصيص' : 'With Template Answers Ready to Customize',
          size: 24,
          color: '666666',
          font,
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '333333' } },
      spacing: { after: 300 },
      children: [],
    })
  );

  children.push(
    new Paragraph({
      alignment: align,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: isAr
            ? 'تعليمات: استبدل النصوص بين الأقواس المربعة [ ] بمعلوماتك الشخصية وخبراتك الفعلية. تدرب على إجاباتك بصوت عالٍ قبل المقابلة.'
            : 'Instructions: Replace the text in square brackets [ ] with your own personal information and real experience. Practice your answers out loud before the interview.',
          size: 22,
          italics: true,
          color: '666666',
          font,
        }),
      ],
    })
  );

  for (const item of FAQ_ITEMS) {
    children.push(
      new Paragraph({
        alignment: align,
        spacing: { before: 300, after: 120 },
        children: [
          new TextRun({
            text: isAr ? item.questionAr : item.questionEn,
            bold: true,
            size: 26,
            font,
            color: '1a1a2e',
          }),
        ],
      })
    );

    children.push(
      new Paragraph({
        alignment: align,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: isAr ? 'نموذج إجابة:' : 'Sample Answer:',
            bold: true,
            size: 22,
            font,
            color: '0066CC',
          }),
        ],
      })
    );

    children.push(
      new Paragraph({
        alignment: isAr ? AlignmentType.RIGHT : AlignmentType.JUSTIFIED,
        spacing: { after: 100, line: 340 },
        indent: { left: isAr ? 0 : 400, right: isAr ? 400 : 0 },
        children: [
          new TextRun({
            text: isAr ? item.answerAr : item.answerEn,
            size: 24,
            font,
            color: '333333',
          }),
        ],
      })
    );

    children.push(
      new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' } },
        spacing: { after: 100 },
        children: [],
      })
    );
  }

  children.push(
    new Paragraph({
      alignment: isAr ? AlignmentType.RIGHT : AlignmentType.CENTER,
      spacing: { before: 400 },
      children: [
        new TextRun({
          text: isAr ? 'حظاً موفقاً في مقابلتك! 🌟' : 'Good luck with your interview! 🌟',
          bold: true,
          size: 26,
          font,
          color: '0066CC',
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      alignment: isAr ? AlignmentType.RIGHT : AlignmentType.CENTER,
      spacing: { before: 100 },
      children: [
        new TextRun({
          text: isAr ? 'تم إنشاؤه بواسطة Cvistan' : 'Generated by Cvistan',
          size: 20,
          color: '999999',
          font,
        }),
      ],
    })
  );

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font, size: 24 },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 12240, height: 15840 },
            margin: { top: 1200, right: 1200, bottom: 1200, left: 1200 },
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBlob(doc);
}
