import type { ResumeData } from '@/types/resume';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { renderResumeHtml } from '@/templates/renderer';

// Better typing using z.custom
const generateSchema = z.object({
  resume: z.custom<ResumeData>(),
  language: z.enum(['en', 'ar']).default('en'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const validation = generateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { resume, language } = validation.data;

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
    return NextResponse.json(
      { error: err?.message || 'Generation failed' },
      { status: 500 }
    );
  }
}
