import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  Packer,
  BorderStyle,
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
    answerEn:
      'I am a motivated and results-driven professional with experience in my field and a strong focus on continuous improvement. In my previous work, I contributed to important projects, worked closely with teams, and developed practical skills in communication, problem-solving, and delivering quality results. I am now looking for a role where I can add value, keep learning, and grow professionally.',
    answerAr:
      'أنا شخص مهني وطموح وأسعى دائماً لتحقيق نتائج مميزة، ولدي خبرة عملية في مجالي مع حرص مستمر على التطور والتحسين. في أعمالي السابقة، ساهمت في مشاريع مهمة، وتعاونت مع فرق مختلفة، وطورت مهارات عملية في التواصل، وحل المشكلات، وتقديم نتائج عالية الجودة. وأنا الآن أبحث عن فرصة أستطيع من خلالها أن أضيف قيمة حقيقية، وأواصل التعلم، وأتطور مهنياً.',
  },
  {
    questionEn: '2. Why do you want to work here?',
    questionAr: '٢. لماذا تريد العمل هنا؟',
    answerEn:
      'I want to work here because your company has a strong reputation and a clear vision that I genuinely respect. I believe my background and skills match the needs of this role, and I am excited about the chance to contribute to a team that values quality, innovation, and growth. I also see this position as a place where I can make a meaningful contribution while developing my career.',
    answerAr:
      'أرغب في العمل هنا لأن شركتكم تتمتع بسمعة قوية ورؤية واضحة أحترمها كثيراً. أعتقد أن خلفيتي ومهاراتي تتناسب مع متطلبات هذا الدور، وأنا متحمس لفرصة المساهمة ضمن فريق يقدّر الجودة والابتكار والتطور. كما أرى أن هذه الوظيفة تمثل بيئة أستطيع فيها تقديم إضافة حقيقية وفي الوقت نفسه تطوير مسيرتي المهنية.',
  },
  {
    questionEn: '3. What are your greatest strengths?',
    questionAr: '٣. ما هي أبرز نقاط قوتك؟',
    answerEn:
      'My main strengths are problem-solving, adaptability, and strong communication. I learn quickly, stay calm under pressure, and work well with different people and responsibilities. In previous situations, these strengths helped me complete tasks efficiently, support my team, and maintain high-quality work even when challenges came up.',
    answerAr:
      'من أبرز نقاط قوتي القدرة على حل المشكلات، والتكيف مع التغييرات، ومهارات التواصل الجيدة. أتعلم بسرعة، وأحافظ على هدوئي تحت الضغط، وأستطيع العمل بكفاءة مع أشخاص ومسؤوليات متنوعة. وفي مواقف سابقة، ساعدتني هذه النقاط في إنجاز المهام بكفاءة، ودعم فريقي، والحفاظ على جودة العمل حتى عند مواجهة التحديات.',
  },
  {
    questionEn: '4. What is your greatest weakness?',
    questionAr: '٤. ما هي أكبر نقاط ضعفك؟',
    answerEn:
      'One weakness I have worked on is spending too much time making sure every detail is perfect. While this helped me produce careful work, I realized it could sometimes slow me down. To improve, I started prioritizing tasks better, setting time limits, and focusing on what creates the most impact, which has made me more efficient without reducing quality.',
    answerAr:
      'إحدى نقاط الضعف التي عملت على تطويرها هي أنني كنت أحياناً أقضي وقتاً أطول من اللازم للتأكد من أن كل التفاصيل مثالية. ورغم أن ذلك ساعدني على تقديم عمل دقيق، أدركت أنه قد يبطئني أحياناً. لذلك بدأت بتنظيم أولوياتي بشكل أفضل، وتحديد وقت لكل مهمة، والتركيز على ما يحقق الأثر الأكبر، مما جعلني أكثر كفاءة دون التأثير على الجودة.',
  },
  {
    questionEn: '5. Where do you see yourself in 5 years?',
    questionAr: '٥. أين ترى نفسك بعد ٥ سنوات؟',
    answerEn:
      'In five years, I see myself in a position where I have developed deeper expertise, taken on greater responsibility, and become a trusted member of the organization. I hope to contribute to larger projects, continue learning, and possibly support or mentor others as I grow. My goal is to build a long-term career based on performance, learning, and real contribution.',
    answerAr:
      'بعد خمس سنوات، أرى نفسي في موقع أكون فيه قد طورت خبرة أعمق، وتحمّلت مسؤوليات أكبر، وأصبحت عضواً موثوقاً داخل المؤسسة. آمل أن أساهم في مشاريع أكبر، وأواصل التعلم، وربما أدعم أو أوجّه الآخرين مع تطوري المهني. هدفي هو بناء مسيرة مهنية طويلة الأمد قائمة على الأداء والتعلم وتقديم قيمة حقيقية.',
  },
  {
    questionEn: '6. Why did you leave your last job?',
    questionAr: '٦. لماذا تركت وظيفتك الأخيرة؟',
    answerEn:
      'I appreciated my time in my previous role and learned a lot from the experience. However, I reached a point where I wanted new challenges, more growth opportunities, and a role that better aligns with my long-term goals. That is why I decided to look for a new opportunity where I can continue to develop and contribute at a higher level.',
    answerAr:
      'أقدر كثيراً الفترة التي قضيتها في وظيفتي السابقة وقد تعلمت منها الكثير. لكنني وصلت إلى مرحلة أصبحت أبحث فيها عن تحديات جديدة، وفرص أكبر للنمو، ودور يتوافق بشكل أفضل مع أهدافي المهنية طويلة المدى. لذلك قررت البحث عن فرصة جديدة أستطيع فيها أن أواصل التطور وأساهم بمستوى أعلى.',
  },
  {
    questionEn: '7. How do you handle stress and pressure?',
    questionAr: '٧. كيف تتعامل مع الضغط والتوتر؟',
    answerEn:
      'I handle stress by staying organized and focusing on priorities. When the workload increases, I break tasks into smaller steps, manage my time carefully, and communicate clearly with others when needed. This approach helps me stay productive, maintain quality, and avoid becoming overwhelmed.',
    answerAr:
      'أتعامل مع الضغط من خلال التنظيم والتركيز على الأولويات. عندما يزداد حجم العمل، أقسم المهام إلى خطوات أصغر، وأدير وقتي بعناية، وأحافظ على التواصل الواضح مع الآخرين عند الحاجة. هذه الطريقة تساعدني على البقاء منتجاً، والحفاظ على جودة العمل، وتجنب الشعور بالإرهاق.',
  },
  {
    questionEn: '8. Describe a difficult work situation and how you handled it.',
    questionAr: '٨. صف موقفاً صعباً في العمل وكيف تعاملت معه.',
    answerEn:
      'In one challenging situation, I had to complete an important task within a limited time while dealing with unexpected issues. I stayed calm, reviewed the priorities, communicated with the people involved, and focused on practical solutions instead of the problem itself. As a result, the work was completed successfully, and I learned the importance of flexibility, planning, and clear communication.',
    answerAr:
      'في أحد المواقف الصعبة، كان عليّ إنجاز مهمة مهمة خلال وقت محدود مع ظهور مشكلات غير متوقعة. حافظت على هدوئي، وراجعت الأولويات، وتواصلت مع الأشخاص المعنيين، وركّزت على الحلول العملية بدلاً من المشكلة نفسها. ونتيجة لذلك، تم إنجاز العمل بنجاح، وتعلمت أهمية المرونة، والتخطيط، والتواصل الواضح.',
  },
  {
    questionEn: '9. What are your salary expectations?',
    questionAr: '٩. ما هي توقعاتك للراتب؟',
    answerEn:
      'I am looking for a salary that is fair and competitive based on the responsibilities of the role, the market, and my experience level. I am open to discussion because I also consider the overall package, including growth opportunities, benefits, and the chance to contribute meaningfully. For me, the right role and long-term development are also very important.',
    answerAr:
      'أتطلع إلى راتب عادل وتنافسي يتناسب مع مسؤوليات الوظيفة، ووضع السوق، ومستوى خبرتي. وأنا منفتح على النقاش لأنني أنظر أيضاً إلى الحزمة الكاملة، بما في ذلك فرص التطور، والمزايا، وإمكانية تقديم مساهمة حقيقية. بالنسبة لي، فإن الدور المناسب وفرص النمو على المدى الطويل مهمان جداً أيضاً.',
  },
  {
    questionEn: '10. Why should we hire you?',
    questionAr: '١٠. لماذا يجب أن نوظفك؟',
    answerEn:
      'You should hire me because I bring a strong work ethic, a willingness to learn, and skills that match the needs of this role. I take responsibility seriously, work well with others, and focus on delivering results with quality and consistency. I am confident that I can quickly become a valuable member of your team and contribute positively to your goals.',
    answerAr:
      'يجب أن توظفوني لأنني أمتلك أخلاقيات عمل قوية، ورغبة حقيقية في التعلم، ومهارات تتناسب مع متطلبات هذا الدور. أتعامل مع المسؤوليات بجدية، وأعمل بشكل جيد مع الآخرين، وأركز على تقديم نتائج بجودة واستمرارية. وأنا واثق من أنني أستطيع أن أصبح بسرعة عضواً قيماً في فريقكم وأسهم بشكل إيجابي في تحقيق أهدافكم.',
  },
  {
    questionEn: '11. Tell me about a time you showed leadership.',
    questionAr: '١١. حدثني عن موقف أظهرت فيه قيادة.',
    answerEn:
      'In one situation, I noticed that the team needed better coordination to complete a task successfully. I took the initiative to organize the work, clarify responsibilities, and keep communication clear among everyone involved. This helped the team move forward more smoothly and showed me that leadership is not only about giving instructions, but also about supporting others and helping them succeed.',
    answerAr:
      'في أحد المواقف، لاحظت أن الفريق كان بحاجة إلى تنسيق أفضل لإنجاز المهمة بنجاح. لذلك بادرت بتنظيم العمل، وتوضيح المسؤوليات، والحفاظ على تواصل واضح بين جميع المعنيين. وقد ساعد ذلك الفريق على التقدم بشكل أكثر سلاسة، وأثبت لي أن القيادة لا تعني فقط إعطاء التعليمات، بل أيضاً دعم الآخرين ومساعدتهم على النجاح.',
  },
  {
    questionEn: '12. How do you work in a team?',
    questionAr: '١٢. كيف تعمل ضمن فريق؟',
    answerEn:
      'I work well in teams because I value respect, communication, and shared goals. I listen carefully to others, contribute my ideas when appropriate, and support my teammates when needed. I believe strong teamwork comes from trust, accountability, and a willingness to work together toward the best result.',
    answerAr:
      'أعمل بشكل جيد ضمن الفريق لأنني أقدّر الاحترام، والتواصل، والأهداف المشتركة. أستمع جيداً للآخرين، وأطرح أفكاري في الوقت المناسب، وأدعم زملائي عند الحاجة. وأؤمن أن العمل الجماعي الناجح يقوم على الثقة، وتحمل المسؤولية، والاستعداد للتعاون للوصول إلى أفضل نتيجة.',
  },
  {
    questionEn: '13. What do you know about our company?',
    questionAr: '١٣. ماذا تعرف عن شركتنا؟',
    answerEn:
      'I understand that your company is known for its work, reputation, and commitment to quality in its field. I also know that your organization values professionalism and aims to deliver strong results to its clients or customers. That is one of the reasons I am interested in joining, because I want to be part of a company that is respected and forward-looking.',
    answerAr:
      'أفهم أن شركتكم معروفة بأعمالها وسمعتها والتزامها بالجودة في مجالها. كما أعلم أن مؤسستكم تقدّر المهنية وتسعى إلى تقديم نتائج قوية لعملائها أو المستفيدين من خدماتها. وهذا أحد الأسباب التي تجعلني مهتماً بالانضمام إليكم، لأنني أرغب في أن أكون جزءاً من شركة تحظى بالاحترام وتتطلع إلى المستقبل.',
  },
  {
    questionEn: '14. Do you have any questions for us?',
    questionAr: '١٤. هل لديك أي أسئلة لنا؟',
    answerEn:
      'Yes, I do. I would like to know what success in this role looks like during the first few months, what the team’s main priorities are right now, and what opportunities the company offers for learning and professional development. These questions are important to me because I want to understand how I can contribute effectively from the beginning.',
    answerAr:
      'نعم، لدي بعض الأسئلة. أود أن أعرف كيف يتم قياس النجاح في هذا الدور خلال الأشهر الأولى، وما هي أولويات الفريق الحالية، وما الفرص التي تقدمها الشركة للتعلم والتطوير المهني. هذه الأسئلة مهمة بالنسبة لي لأنني أريد أن أفهم كيف يمكنني المساهمة بفعالية منذ البداية.',
  },
  {
    questionEn: '15. How do you handle criticism or feedback?',
    questionAr: '١٥. كيف تتعامل مع النقد أو الملاحظات؟',
    answerEn:
      'I see constructive feedback as a valuable part of professional growth. When I receive feedback, I listen carefully, try to understand the main point, and use it as an opportunity to improve my performance. I believe that people who are open to feedback develop faster and become stronger professionals over time.',
    answerAr:
      'أنظر إلى الملاحظات البناءة على أنها جزء مهم من التطور المهني. عندما أتلقى ملاحظة، أستمع بعناية، وأحاول فهم النقطة الأساسية، وأتعامل معها كفرصة لتحسين أدائي. وأؤمن أن الأشخاص المنفتحين على الملاحظات يتطورون بشكل أسرع ويصبحون أكثر قوة على المستوى المهني مع مرور الوقت.',
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
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: isAr ? 'أهم ١٥ سؤالاً في مقابلات العمل' : '15 Common Interview Questions and Sample Answers',
          bold: true,
          size: 34,
          font,
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      alignment: isAr ? AlignmentType.RIGHT : AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: isAr ? 'إجابات احترافية جاهزة للتعديل حسب خبرتك' : 'Professional Answers You Can Edit to Match Your Experience',
          size: 22,
          color: '666666',
          font,
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 4, color: '333333' },
      },
      spacing: { after: 260 },
      children: [],
    })
  );

  children.push(
    new Paragraph({
      alignment: align,
      spacing: { after: 220 },
      children: [
        new TextRun({
          text: isAr
            ? 'تعليمات: استخدم هذه الإجابات كنموذج، ثم عدّلها بما يناسب خبرتك الحقيقية ومجال عملك وشخصيتك. كلما كانت إجابتك صادقة ومحددة، كانت أكثر تأثيراً في المقابلة.'
            : 'Instructions: Use these answers as a starting point, then adapt them to your real experience, industry, and personality. The more honest and specific your answer is, the stronger it will sound in an interview.',
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
        spacing: { before: 260, after: 100 },
        children: [
          new TextRun({
            text: isAr ? item.questionAr : item.questionEn,
            bold: true,
            size: 26,
            font,
            color: '1A1A2E',
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
        spacing: { after: 120, line: 320 },
        indent: { left: isAr ? 0 : 360, right: isAr ? 360 : 0 },
        children: [
          new TextRun({
            text: isAr ? item.answerAr : item.answerEn,
            size: 23,
            font,
            color: '333333',
          }),
        ],
      })
    );

    children.push(
      new Paragraph({
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
        },
        spacing: { after: 80 },
        children: [],
      })
    );
  }

  children.push(
    new Paragraph({
      alignment: isAr ? AlignmentType.RIGHT : AlignmentType.CENTER,
      spacing: { before: 360, after: 80 },
      children: [
        new TextRun({
          text: isAr ? 'بالتوفيق في مقابلتك!' : 'Good luck with your interview!',
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
      children: [
        new TextRun({
          text: isAr ? 'تم الإنشاء بواسطة Cvistan' : 'Generated by Cvistan',
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
          run: {
            font,
            size: 24,
          },
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

  return Packer.toBlob(doc);
}
