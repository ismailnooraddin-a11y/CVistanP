import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email, resume, language } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate PDF (reuse generate endpoint logic)
    const generateRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/resume/${resume.id || 'local'}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume, language }),
    });

    const isLangAr = language === 'ar';

    // Send email with Resend
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Cvistan <noreply@cvistan.com>',
      to: email,
      subject: isLangAr ? 'سيرتك الذاتية من Cvistan' : 'Your CV from Cvistan',
      html: isLangAr
        ? `<div dir="rtl"><h2>مرحباً ${resume.personalInfo?.fullName || ''}!</h2><p>مرفق سيرتك الذاتية التي تم إنشاؤها على Cvistan.</p><p>شكراً لاستخدامك Cvistan!</p></div>`
        : `<h2>Hi ${resume.personalInfo?.fullName || ''}!</h2><p>Attached is your CV generated on Cvistan.</p><p>Thanks for using Cvistan!</p>`,
    });

    if (error) throw error;

    return NextResponse.json({ success: true, messageId: data?.id });
  } catch (err: any) {
    console.error('Email send error:', err);
    return NextResponse.json({ error: err.message || 'Failed to send email' }, { status: 500 });
  }
}
