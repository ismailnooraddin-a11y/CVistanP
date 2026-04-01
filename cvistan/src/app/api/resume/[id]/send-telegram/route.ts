import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { chatId, resume, language } = await req.json();

    if (!chatId) {
      return NextResponse.json({ error: 'Telegram chat ID required' }, { status: 400 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return NextResponse.json({ error: 'Telegram not configured' }, { status: 500 });
    }

    // Generate PDF
    const generateRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/resume/${resume.id || 'local'}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume, language }),
    });

    if (!generateRes.ok) throw new Error('PDF generation failed');

    const pdfBuffer = await generateRes.arrayBuffer();

    // Send document via Telegram Bot API
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('document', new Blob([pdfBuffer], { type: 'application/pdf' }), `${resume.personalInfo?.fullName || 'CV'}.pdf`);
    formData.append('caption', language === 'ar' ? 'سيرتك الذاتية من Cvistan' : 'Your CV from Cvistan');

    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
      method: 'POST',
      body: formData,
    });

    const tgData = await tgRes.json();
    if (!tgData.ok) throw new Error(tgData.description || 'Telegram send failed');

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Telegram send error:', err);
    return NextResponse.json({ error: err.message || 'Failed to send to Telegram' }, { status: 500 });
  }
}
