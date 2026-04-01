import { NextRequest, NextResponse } from 'next/server';
import { renderResumeHtml } from '@/templates/renderer';

export async function POST(req: NextRequest) {
  try {
    const { resume, language } = await req.json();

    const cvHtml = renderResumeHtml(resume, true);
    const fullHtml = `<!DOCTYPE html>
<html dir="${language === 'ar' ? 'rtl' : 'ltr'}" lang="${language}">
<head>
  <meta charset="utf-8"/>
  <style>
    @page { size: A4; margin: 0; }
    body { margin: 0; padding: 0; }
  </style>
</head>
<body>${cvHtml}</body>
</html>`;

    return NextResponse.json({ html: fullHtml });
  } catch (err: any) {
    console.error('Generate error:', err);
    return NextResponse.json({ error: err.message || 'Generation failed' }, { status: 500 });
  }
}
