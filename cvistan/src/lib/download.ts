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
 * We no longer use html-to-pdf. Instead we use the ResumeData directly
 * to build the PDF with jsPDF. See generateResumePdf in pdf-generator.ts
 */
export async function generatePdfFromHtml(html: string, filename: string): Promise<void> {
  // This function is kept for compatibility but is no longer used.
  // PDF generation now happens via generateResumePdf() in pdf-generator.ts
  throw new Error('Use generateResumePdf instead');
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
