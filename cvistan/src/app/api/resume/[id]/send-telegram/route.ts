import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { resume, language, phone } = await req.json();
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      return NextResponse.json({ error: 'Telegram not configured' }, { status: 500 });
    }

    // Find the most recent telegram connection
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
    const fullName = pi.fullName || 'CV';
    const isAr = language === 'ar';

    // Send a welcome message first
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: isAr
          ? `📄 مرحباً ${fullName}!\n\nإليك ملفاتك من Cvistan:`
          : `📄 Hi ${fullName}!\n\nHere are your files from Cvistan:`,
      }),
    });

    // Generate cover letter DOCX and send as document
    const { Document, Paragraph, TextRun, AlignmentType, Packer, BorderStyle } = await import('docx');

    // --- Cover Letter ---
    const coverDoc = await buildCoverLetter(resume, language, { Document, Paragraph, TextRun, AlignmentType, Packer, BorderStyle });
    const coverBuffer = Buffer.from(await Packer.toBuffer(coverDoc));
    await sendTelegramDocument(botToken, chatId, coverBuffer, `${fullName} - Cover Letter.docx`, isAr ? '📝 رسالة التغطية' : '📝 Cover Letter');

    // --- FAQ ---
    const faqDoc = await buildFaq(language, { Document, Paragraph, TextRun, AlignmentType, Packer, BorderStyle });
    const faqBuffer = Buffer.from(await Packer.toBuffer(faqDoc));
    await sendTelegramDocument(botToken, chatId, faqBuffer, isAr ? 'أسئلة المقابلة.docx' : 'Interview FAQ.docx', isAr ? '❓ أسئلة المقابلة' : '❓ Interview FAQ');

    // Send final message
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: isAr
          ? '✅ تم! استبدل XXXXX بالمسمى الوظيفي و[ ] بمعلوماتك.\n\nحظاً موفقاً! 🌟'
          : '✅ Done! Replace XXXXX with the job title and [ ] with your info.\n\nGood luck! 🌟',
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
        new docx.Paragraph({ alignment: isAr ? docx.AlignmentType.RIGHT : docx.AlignmentType.CENTER, spacing: { after: 80 }, children: [new docx.TextRun({ text: [pi.email, pi.phone].filter(Boolean).join(' | ') || '', size: 22, color: '555555', font })] }),
        new docx.Paragraph({ border: { bottom: { style: docx.BorderStyle.SINGLE, size: 4, color: '333333' } }, spacing: { after: 200 }, children: [] }),
        new docx.Paragraph({ alignment: align, spacing: { after: 200 }, children: [new docx.TextRun({ text: today, size: fs, font })] }),
        new docx.Paragraph({ alignment: align, spacing: { after: 200 }, children: [new docx.TextRun({ text: isAr ? 'الموضوع: طلب التقديم لوظيفة XXXXX' : 'RE: Application for XXXXX Position', bold: true, size: fs, font })] }),
        new docx.Paragraph({ alignment: align, spacing: { after: 200 }, children: [new docx.TextRun({ text: isAr ? 'السلام عليكم،' : 'Dear Hiring Manager,', size: fs, font })] }),
        new docx.Paragraph({ alignment: justify, spacing: { after: 200, line: 360 }, children: [new docx.TextRun({ text: isAr ? `أكتب إليكم للتعبير عن اهتمامي بوظيفة XXXXX. أنا ${pi.fullName || 'XXXXX'}، ${pi.jobTitle || 'XXXXX'}، وأعتقد أن خبراتي تجعلني مرشحاً مناسباً.` : `I am writing to express my interest in the XXXXX position. My name is ${pi.fullName || 'XXXXX'}, and as a ${pi.jobTitle || 'XXXXX'}, I believe I am a strong candidate.`, size: fs, font })] }),
        new docx.Paragraph({ alignment: align, spacing: { before: 300 }, children: [new docx.TextRun({ text: isAr ? 'مع التقدير،' : 'Sincerely,', size: fs, font })] }),
        new docx.Paragraph({ alignment: align, spacing: { before: 100 }, children: [new docx.TextRun({ text: pi.fullName || '', bold: true, size: 26, font })] }),
      ],
    }],
  });
}

async function buildFaq(language: string, docx: any): Promise<any> {
  const isAr = language === 'ar';
  const font = 'Times New Roman';
  const align = isAr ? docx.AlignmentType.RIGHT : docx.AlignmentType.LEFT;
  const faqs = [
    { en: 'Tell me about yourself.', ar: 'حدثني عن نفسك.', ansEn: 'I am a [title] with [X] years of experience...', ansAr: 'أنا [المسمى] ولدي [عدد] سنوات خبرة...' },
    { en: 'Why do you want to work here?', ar: 'لماذا تريد العمل هنا؟', ansEn: 'I admire your company\'s [mission]...', ansAr: 'أعجبني [رسالة] شركتكم...' },
    { en: 'What are your strengths?', ar: 'ما نقاط قوتك؟', ansEn: 'My key strengths include [1], [2], [3]...', ansAr: 'نقاط قوتي تشمل [١] و[٢] و[٣]...' },
    { en: 'What is your weakness?', ar: 'ما نقاط ضعفك؟', ansEn: 'I tend to [weakness] but I am improving by [strategy]...', ansAr: 'أميل إلى [ضعف] لكنني أتحسن من خلال [استراتيجية]...' },
    { en: 'Where do you see yourself in 5 years?', ar: 'أين ترى نفسك بعد ٥ سنوات؟', ansEn: 'I see myself in a [role] leading projects...', ansAr: 'أرى نفسي في [دور] أقود المشاريع...' },
  ];

  const children: any[] = [];
  children.push(new docx.Paragraph({ alignment: isAr ? docx.AlignmentType.RIGHT : docx.AlignmentType.CENTER, spacing: { after: 200 }, children: [new docx.TextRun({ text: isAr ? 'أسئلة المقابلة الشائعة' : 'Common Interview Questions', bold: true, size: 32, font })] }));

  faqs.forEach((faq, i) => {
    children.push(new docx.Paragraph({ alignment: align, spacing: { before: 200, after: 80 }, children: [new docx.TextRun({ text: `${i + 1}. ${isAr ? faq.ar : faq.en}`, bold: true, size: 24, font })] }));
    children.push(new docx.Paragraph({ alignment: align, spacing: { after: 100 }, indent: { left: 400 }, children: [new docx.TextRun({ text: isAr ? faq.ansAr : faq.ansEn, size: 22, color: '444444', font })] }));
  });

  return new docx.Document({
    sections: [{
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1200, right: 1200, bottom: 1200, left: 1200 } } },
      children,
    }],
  });
}
