/**
 * Triggers a browser auto-download of a Blob with the given filename.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates a PDF from HTML string using html2pdf.js.
 * Auto-downloads the file.
 */
export async function generatePdfFromHtml(html: string, filename: string): Promise<void> {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.2/html2pdf.bundle.min.js');

  // Create an iframe so styles are fully isolated and rendered
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.left = '-10000px';
  iframe.style.top = '0';
  iframe.style.width = '794px';
  iframe.style.height = '1123px';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) {
    document.body.removeChild(iframe);
    throw new Error('Could not access iframe document');
  }

  iframeDoc.open();
  iframeDoc.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8"/>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { margin: 0; padding: 0; background: white; width: 794px; }
      </style>
    </head>
    <body>${html}</body>
    </html>
  `);
  iframeDoc.close();

  // Wait for content to render and fonts to load
  await new Promise((resolve) => setTimeout(resolve, 800));

  const content = iframeDoc.body;

  try {
    const html2pdf = (window as any).html2pdf;

    await html2pdf()
      .set({
        margin: 0,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          width: 794,
          height: content.scrollHeight || 1123,
          windowWidth: 794,
          backgroundColor: '#ffffff',
          logging: false,
          foreignObjectRendering: false,
        },
        jsPDF: {
          unit: 'px',
          format: [794, Math.max(content.scrollHeight || 1123, 1123)],
          orientation: 'portrait',
          hotfixes: ['px_scaling'],
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      })
      .from(content)
      .save();
  } finally {
    document.body.removeChild(iframe);
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}
