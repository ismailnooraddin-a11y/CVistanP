import { NextRequest, NextResponse } from 'next/server';
import { renderResumeHtml } from '@/templates/renderer';

export async function POST(req: NextRequest) {
  try {
    const { resume, language } = await req.json();

    // Generate CV HTML for PDF
    const cvHtml = renderResumeHtml(resume, true);
    const fullHtml = `<!DOCTYPE html>
<html dir="${language === 'ar' ? 'rtl' : 'ltr'}" lang="${language}">
<head>
  <meta charset="utf-8"/>
  <style>
    @page { size: A4; margin: 0; }
    body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  </style>
</head>
<body>${cvHtml}</body>
</html>`;

    // Try server-side PDF generation with Puppeteer
    let pdfBuffer: Buffer | null = null;
    try {
      const chromium = await import('@sparticuz/chromium');
      const puppeteer = await import('puppeteer-core');

      const browser = await puppeteer.default.launch({
        args: chromium.default.args,
        defaultViewport: chromium.default.defaultViewport,
        executablePath: await chromium.default.executablePath(),
        headless: true,
      });

      const page = await browser.newPage();
      await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
      pdfBuffer = Buffer.from(
        await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
        })
      );
      await browser.close();
    } catch (pdfErr) {
      console.error('Server PDF generation failed, client will use print fallback:', pdfErr);
    }

    if (pdfBuffer) {
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${resume.personalInfo?.fullName || 'CV'}.pdf"`,
        },
      });
    }

    // Return HTML for client-side print fallback
    return NextResponse.json({
      html: fullHtml,
      fallback: 'print',
    });
  } catch (err: any) {
    console.error('Generate error:', err);
    return NextResponse.json({ error: err.message || 'Generation failed' }, { status: 500 });
  }
}
