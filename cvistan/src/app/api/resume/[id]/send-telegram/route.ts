import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { resume, language, phone } = await req.json();
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      return NextResponse.json({ error: 'Telegram not configured' }, { status: 500 });
    }

    const supabase = createServiceClient();
    const { data: connections } = await supabase
      .from('telegram_connections')
      .select('chat_id')
      .order('updated_at', { ascending: false })
      .limit(1);

    if (!connections || connections.length === 0) {
      return NextResponse.json({ 
        error: language === 'ar' 
          ? 'لم يتم العثور على اتصال تيليغرام. اضغط Start في البوت أولاً.' 
          : 'No Telegram connection found. Please press Start in the bot first.' 
      }, { status: 400 });
    }

    const chatId = connections[0].chat_id;
    const pi = resume.personalInfo || {};
    const fullName = pi.fullName || 'there';
    const isAr = language === 'ar';

    // Welcome message
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        parse_mode: 'HTML',
        text: isAr
          ? `✨ <b>مرحباً ${fullName}!</b>\n\n🎯 حزمة التقديم الوظيفي الخاصة بك جاهزة.\n\nستتلقى الملفات التالية:\n\n📝 <b>رسالة التغطية</b> — قالب احترافي مع بياناتك\n❓ <b>أسئلة المقابلة</b> — أهم الأسئلة مع نماذج إجابات\n\nجاري الإرسال...`
          : `✨ <b>Hi ${fullName}!</b>\n\n🎯 Your <b>Job Application Package</b> is ready!\n\nYou will receive:\n\n📝 <b>Cover Letter</b> — Professional template with your details\n❓ <b>Interview Prep</b> — Top questions with sample answers\n\nSending your files now...`,
      }),
    });

    const { Document, Paragraph, TextRun, AlignmentType, Packer, BorderStyle } = await import('docx');

    // --- Cover Letter ---
    const coverDoc = await buildCoverLetter(resume, language, { Document, Paragraph, TextRun, AlignmentType, Packer, BorderStyle });
    const coverBuffer = Buffer.from(await Packer.toBuffer(coverDoc));
    await sendTelegramDocument(botToken, chatId, coverBuffer, `${fullName} - Cover Letter.docx`, isAr ? '📝 رسالة التغطية' : '📝 Cover Letter');

    // --- FAQ ---
    const faqDoc = await buildFaq(language, { Document, Paragraph, TextRun, AlignmentType, Packer, BorderStyle });
    const faqBuffer = Buffer.from(await Packer.toBuffer(faqDoc));
    await sendTelegramDocument(botToken, chatId, faqBuffer, isAr ? `${fullName} - أسئلة المقابلة.docx` : `${fullName} - Interview FAQ.docx`, isAr ? '❓ أسئلة المقابلة' : '❓ Interview FAQ');

    // Final message
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        parse_mode: 'HTML',
        text: isAr
          ? `✅ <b>تم إرسال جميع ملفاتك بنجاح!</b>\n\n💡 <b>قبل أن تبدأ:</b>\n• استبدل <b>XXXXX</b> في رسالة التغطية بالمسمى الوظيفي المستهدف\n• عدّل النصوص بين <b>[ ]</b> في أسئلة المقابلة بإجاباتك الشخصية\n• تدرّب على إجاباتك بصوت عالٍ قبل المقابلة\n\n🌟 <b>نتمنى لك كل التوفيق في رحلتك المهنية!</b>\n\n— فريق <b>Cvistan</b> 💼`
          : `✅ <b>All your files have been sent successfully!</b>\n\n💡 <b>Before you start:</b>\n• Replace <b>XXXXX</b> in the cover letter with the job title you're applying for\n• Fill in the <b>[ ]</b> brackets in the interview prep with your own answers\n• Practice your answers out loud before the interview\n\n🌟 <b>Wishing you the very best on your career journey!</b>\n\n— The <b>Cvistan</b> Team 💼`,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Telegram send error:', err);
    return NextResponse.json({ error: err.message || 'Failed to send to Telegram' }, { status: 500 });
  }
}

async function sendTelegramDocument(botToken: string, chatId: string, buffer: Buffer, filename: string, caption: string) {
  const formData = new FormData();
  formData.append('chat_id', chatId);
  formData.append('document', new Blob([new Uint8Array(buffer)], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }), filename);
  formData.append('caption', caption);

  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!data.ok) throw new Error(`Telegram: ${data.description}`);
}

async function buildCoverLetter(resume: any, language: string, docx: any): Promise<any> {
  const pi = resume.personalInfo || {};
  const isAr = language === 'ar';
  const font = 'Times New Roman';
  const fs = 24;
  const align = isAr ? docx.AlignmentType.RIGHT : docx.AlignmentType.LEFT;
  const justify = isAr ? docx.AlignmentType.RIGHT : docx.AlignmentType.JUSTIFIED;
  const today = new Date().toLocaleDateString(isAr ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return new docx.Document({
    sections: [{
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      children: [
        new docx.Paragraph({ alignment: isAr ? docx.AlignmentType.RIGHT : docx.AlignmentType.CENTER, spacing: { after: 40 }, children: [new docx.TextRun({ text: pi.fullName || 'XXXXX', bold: true, size: 32, font })] }),
        new docx.Paragraph({ alignment: isAr ? docx.AlignmentType.RIGHT : docx.AlignmentType.CENTER, spacing: { after: 40 }, children: [new docx.TextRun({ text: pi.jobTitle || 'XXXXX', size: 26, color: '333333', font })] }),
        new docx.Paragraph({ alignment: isAr ? docx.AlignmentType.RIGHT : docx.AlignmentType.CENTER, spacing: { after: 80 }, children: [new docx.TextRun({ text: [pi.email, pi.phone, pi.location].filter(Boolean).join('  |  ') || '', size: 22, color: '555555', font })] }),
        new docx.Paragraph({ border: { bottom: { style: docx.BorderStyle.SINGLE, size: 4, color: '333333' } }, spacing: { after: 200 }, children: [] }),
        new docx.Paragraph({ alignment: align, spacing: { after: 200 }, children: [new docx.TextRun({ text: today, size: fs, font })] }),
        new docx.Paragraph({ alignment: align, spacing: { after: 80 }, children: [new docx.TextRun({ text: isAr ? '[اسم مسؤول التوظيف]' : '[Hiring Manager Name]', size: fs, italics: true, color: '888888', font })] }),
        new docx.Paragraph({ alignment: align, spacing: { after: 80 }, children: [new docx.TextRun({ text: isAr ? '[اسم الشركة]' : '[Company Name]', size: fs, italics: true, color: '888888', font })] }),
        new docx.Paragraph({ alignment: align, spacing: { after: 300 }, children: [new docx.TextRun({ text: isAr ? '[عنوان الشركة]' : '[Company Address]', size: fs, italics: true, color: '888888', font })] }),
        new docx.Paragraph({ alignment: align, spacing: { after: 200 }, children: [new docx.TextRun({ text: isAr ? 'الموضوع: طلب التقديم لوظيفة XXXXX' : 'RE: Application for the Position of XXXXX', bold: true, size: fs, font })] }),
        new docx.Paragraph({ alignment: align, spacing: { after: 200 }, children: [new docx.TextRun({ text: isAr ? 'السلام عليكم ورحمة الله وبركاته،' : 'Dear Hiring Manager,', size: fs, font })] }),
        new docx.Paragraph({ alignment: justify, spacing: { after: 200, line: 360 }, children: [new docx.TextRun({ text: isAr ? `أكتب إليكم للتعبير عن اهتمامي الكبير بوظيفة XXXXX المعلن عنها في شركتكم الموقرة. أنا ${pi.fullName || 'XXXXX'}، أعمل حالياً بصفة ${pi.jobTitle || 'XXXXX'}، وأعتقد أن مؤهلاتي وخبراتي المهنية تجعلني مرشحاً مناسباً لهذا الدور.` : `I am writing to express my enthusiastic interest in the XXXXX position at your esteemed organization. My name is ${pi.fullName || 'XXXXX'}, and I am currently working as a ${pi.jobTitle || 'XXXXX'}. I am confident that my qualifications and professional experience make me a strong candidate for this role.`, size: fs, font })] }),
        new docx.Paragraph({ alignment: justify, spacing: { after: 200, line: 360 }, children: [new docx.TextRun({ text: isAr ? 'خلال مسيرتي المهنية، اكتسبت خبرة واسعة في مجال تخصصي، حيث تمكنت من تطوير مهاراتي التقنية والقيادية. لقد عملت على مشاريع متنوعة ساهمت في تحقيق نتائج ملموسة.' : 'Throughout my professional career, I have gained extensive experience in my field, developing both my technical and leadership skills. I have successfully contributed to diverse projects that delivered measurable results.', size: fs, font })] }),
        new docx.Paragraph({ alignment: justify, spacing: { after: 200, line: 360 }, children: [new docx.TextRun({ text: isAr ? '[أضف هنا تفاصيل عن إنجازاتك ومشاريعك الأكثر صلة بالوظيفة المستهدفة.]' : '[Add details here about your most relevant achievements and projects for the target position.]', size: fs, italics: true, color: '888888', font })] }),
        new docx.Paragraph({ alignment: justify, spacing: { after: 200, line: 360 }, children: [new docx.TextRun({ text: isAr ? 'أتطلع إلى فرصة مناقشة كيف يمكنني المساهمة في تحقيق أهداف فريقكم. أشكركم جزيل الشكر على وقتكم واهتمامكم بطلبي.' : 'I would welcome the opportunity to discuss how my skills and experience can contribute to your team\'s objectives. Thank you for considering my application.', size: fs, font })] }),
        new docx.Paragraph({ alignment: align, spacing: { before: 400, after: 60 }, children: [new docx.TextRun({ text: isAr ? 'مع خالص التقدير والاحترام،' : 'Yours sincerely,', size: fs, font })] }),
        new docx.Paragraph({ alignment: align, spacing: { after: 40 }, children: [] }),
        new docx.Paragraph({ alignment: align, spacing: { after: 40 }, children: [new docx.TextRun({ text: pi.fullName || 'XXXXX', bold: true, size: 26, font })] }),
        new docx.Paragraph({ alignment: align, spacing: { after: 40 }, children: [new docx.TextRun({ text: pi.email || 'XXXXX', size: 22, color: '555555', font })] }),
        new docx.Paragraph({ alignment: align, children: [new docx.TextRun({ text: pi.phone || 'XXXXX', size: 22, color: '555555', font })] }),
      ],
    }],
  });
}

async function buildFaq(language: string, docx: any): Promise<any> {
  const isAr = language === 'ar';
  const font = 'Times New Roman';
  const align = isAr ? docx.AlignmentType.RIGHT : docx.AlignmentType.LEFT;
  const faqs = [
    { en: 'Tell me about yourself.', ar: 'حدثني عن نفسك.', ansEn: 'I am a [your title] with [X] years of experience in [your field]. I have worked on [key projects]. I am passionate about [interest] and looking for new challenges.', ansAr: 'أنا [المسمى الوظيفي] ولدي [عدد] سنوات من الخبرة في [مجالك]. عملت على [مشاريع رئيسية]. أنا شغوف بـ[اهتمام] وأبحث عن تحديات جديدة.' },
    { en: 'Why do you want to work here?', ar: 'لماذا تريد العمل هنا؟', ansEn: 'I admire your company\'s [mission/products]. My skills in [area] align well with this role, and I see great opportunity for mutual growth.', ansAr: 'أعجبني [رسالة/منتجات] شركتكم. مهاراتي في [مجال] تتوافق مع هذا الدور، وأرى فرصة رائعة للنمو المتبادل.' },
    { en: 'What are your greatest strengths?', ar: 'ما هي أبرز نقاط قوتك؟', ansEn: 'My key strengths include [strength 1], [strength 2], and [strength 3]. For example, I [brief example demonstrating the strength].', ansAr: 'أبرز نقاط قوتي تشمل [قوة ١] و[قوة ٢] و[قوة ٣]. على سبيل المثال، [مثال موجز يوضح القوة].' },
    { en: 'What is your greatest weakness?', ar: 'ما هي أكبر نقاط ضعفك؟', ansEn: 'I tend to [honest weakness]. However, I have been actively improving by [specific strategy]. This has helped me become more efficient.', ansAr: 'أميل إلى [ضعف حقيقي]. ومع ذلك، أعمل بنشاط على تحسين ذلك من خلال [استراتيجية محددة]. وقد ساعدني ذلك على التحسن.' },
    { en: 'Where do you see yourself in 5 years?', ar: 'أين ترى نفسك بعد ٥ سنوات؟', ansEn: 'I see myself in a [target role] where I can lead projects and mentor others. I want to deepen my expertise in [field].', ansAr: 'أرى نفسي في [دور مستهدف] حيث أقود المشاريع وأوجه الآخرين. أريد تعميق خبرتي في [المجال].' },
    { en: 'Why did you leave your last job?', ar: 'لماذا تركت وظيفتك الأخيرة؟', ansEn: 'I am looking for new challenges and opportunities to grow professionally that better align with my long-term career goals.', ansAr: 'أبحث عن تحديات وفرص جديدة للنمو المهني تتوافق بشكل أفضل مع أهدافي المهنية طويلة المدى.' },
    { en: 'How do you handle stress and pressure?', ar: 'كيف تتعامل مع الضغط؟', ansEn: 'I stay organized, prioritize tasks, and break projects into manageable steps. Clear communication with my team also helps prevent unnecessary stress.', ansAr: 'أبقى منظماً، وأرتب الأولويات، وأقسم المشاريع إلى خطوات يمكن إدارتها. التواصل الواضح مع فريقي يمنع التوتر غير الضروري.' },
    { en: 'Describe a difficult work situation.', ar: 'صف موقفاً صعباً في العمل.', ansEn: 'In my previous role, [describe situation]. I approached it by [actions taken]. The result was [positive outcome]. I learned [key lesson].', ansAr: 'في وظيفتي السابقة، [صف الموقف]. تعاملت معه من خلال [الإجراءات]. وكانت النتيجة [نتيجة إيجابية]. تعلمت [الدرس المستفاد].' },
    { en: 'What are your salary expectations?', ar: 'ما هي توقعاتك للراتب؟', ansEn: 'Based on my research and experience, I am looking for a salary in the range of [range]. I am open to discussion about the full compensation package.', ansAr: 'بناءً على بحثي وخبرتي، أتطلع إلى راتب في نطاق [النطاق]. أنا منفتح على النقاش حول حزمة التعويضات الكاملة.' },
    { en: 'Why should we hire you?', ar: 'لماذا يجب أن نوظفك؟', ansEn: 'I bring a combination of [skill 1], [skill 2], and [skill 3] that directly match what this role requires. I am a fast learner and genuinely excited about contributing.', ansAr: 'أقدم مزيجاً من [مهارة ١] و[مهارة ٢] و[مهارة ٣] تتطابق مباشرة مع متطلبات هذا الدور. أنا سريع التعلم ومتحمس للمساهمة.' },
    { en: 'Tell me about a time you showed leadership.', ar: 'حدثني عن موقف أظهرت فيه قيادة.', ansEn: 'When [situation], I took the initiative to [action]. I coordinated with [who] and the outcome was [positive result].', ansAr: 'عندما [الموقف]، بادرت بـ[الإجراء]. نسقت مع [من] وكانت النتيجة [نتيجة إيجابية].' },
    { en: 'How do you work in a team?', ar: 'كيف تعمل ضمن فريق؟', ansEn: 'I believe in open communication, respecting diverse perspectives, and contributing my best work. I actively listen and offer help when needed.', ansAr: 'أؤمن بالتواصل المفتوح، واحترام وجهات النظر المتنوعة، وتقديم أفضل ما لدي. أستمع بفاعلية وأقدم المساعدة عند الحاجة.' },
    { en: 'What do you know about our company?', ar: 'ماذا تعرف عن شركتنا؟', ansEn: 'I know that your company [mention specific facts]. I particularly admire [specific aspect] and see my skills as a great fit for your team.', ansAr: 'أعلم أن شركتكم [حقائق محددة]. أعجبني بشكل خاص [جانب محدد] وأرى أن مهاراتي مناسبة جداً لفريقكم.' },
    { en: 'Do you have any questions for us?', ar: 'هل لديك أي أسئلة لنا؟', ansEn: 'Yes! What does a typical day look like in this role? What are the biggest challenges the team faces? What growth opportunities does the company offer?', ansAr: 'نعم! كيف يبدو اليوم العادي في هذا الدور؟ ما أكبر تحديات الفريق حالياً؟ ما فرص التطوير المهني المتاحة؟' },
    { en: 'How do you handle feedback or criticism?', ar: 'كيف تتعامل مع النقد والملاحظات؟', ansEn: 'I view constructive feedback as an opportunity to grow. I listen carefully, ask clarifying questions if needed, and take actionable steps to improve.', ansAr: 'أنظر إلى الملاحظات البناءة كفرصة للنمو. أستمع بعناية، وأطرح أسئلة توضيحية إذا لزم الأمر، وأتخذ خطوات عملية للتحسين.' },
  ];

  const children: any[] = [];

  children.push(new docx.Paragraph({
    alignment: isAr ? docx.AlignmentType.RIGHT : docx.AlignmentType.CENTER,
    spacing: { after: 100 },
    children: [new docx.TextRun({ text: isAr ? 'أهم ١٥ سؤالاً في مقابلات العمل' : '15 Most Asked Interview Questions', bold: true, size: 36, font })],
  }));
  children.push(new docx.Paragraph({
    alignment: isAr ? docx.AlignmentType.RIGHT : docx.AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [new docx.TextRun({ text: isAr ? 'مع نماذج إجابات جاهزة للتخصيص' : 'With Template Answers Ready to Customize', size: 24, color: '666666', font })],
  }));
  children.push(new docx.Paragraph({ border: { bottom: { style: docx.BorderStyle.SINGLE, size: 4, color: '333333' } }, spacing: { after: 200 }, children: [] }));
  children.push(new docx.Paragraph({
    alignment: align, spacing: { after: 200 },
    children: [new docx.TextRun({ text: isAr ? 'تعليمات: استبدل النصوص بين الأقواس [ ] بمعلوماتك الشخصية وخبراتك.' : 'Instructions: Replace text in square brackets [ ] with your own personal information and experience.', size: 22, italics: true, color: '666666', font })],
  }));

  faqs.forEach((faq, i) => {
    children.push(new docx.Paragraph({
      alignment: align, spacing: { before: 250, after: 80 },
      children: [new docx.TextRun({ text: `${i + 1}. ${isAr ? faq.ar : faq.en}`, bold: true, size: 26, font, color: '1a1a2e' })],
    }));
    children.push(new docx.Paragraph({
      alignment: align, spacing: { after: 40 },
      children: [new docx.TextRun({ text: isAr ? 'نموذج إجابة:' : 'Sample Answer:', bold: true, size: 22, font, color: '0066CC' })],
    }));
    children.push(new docx.Paragraph({
      alignment: align, spacing: { after: 60, line: 340 }, indent: { left: isAr ? 0 : 400, right: isAr ? 400 : 0 },
      children: [new docx.TextRun({ text: isAr ? faq.ansAr : faq.ansEn, size: 24, font, color: '333333' })],
    }));
    children.push(new docx.Paragraph({ border: { bottom: { style: docx.BorderStyle.SINGLE, size: 1, color: 'DDDDDD' } }, spacing: { after: 80 }, children: [] }));
  });

  children.push(new docx.Paragraph({
    alignment: isAr ? docx.AlignmentType.RIGHT : docx.AlignmentType.CENTER, spacing: { before: 300 },
    children: [new docx.TextRun({ text: isAr ? 'حظاً موفقاً في مقابلتك! 🌟' : 'Good luck with your interview! 🌟', bold: true, size: 26, font, color: '0066CC' })],
  }));
  children.push(new docx.Paragraph({
    alignment: isAr ? docx.AlignmentType.RIGHT : docx.AlignmentType.CENTER, spacing: { before: 80 },
    children: [new docx.TextRun({ text: isAr ? 'تم إنشاؤه بواسطة Cvistan' : 'Generated by Cvistan', size: 20, color: '999999', font })],
  }));

  return new docx.Document({
    sections: [{
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1200, right: 1200, bottom: 1200, left: 1200 } } },
      children,
    }],
  });
}
