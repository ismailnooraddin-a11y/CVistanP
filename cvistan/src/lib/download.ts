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
 * Generates a PDF by rendering HTML in a popup window and using print-to-PDF.
 * This is the most reliable method as the browser handles all CSS rendering.
 */
export async function generatePdfFromHtml(html: string, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const printWindow = window.open('', '_blank', 'width=794,height=1123');
      
      if (!printWindow) {
        // Popup blocked — fall back to same-window approach
        fallbackPrint(html, filename);
        resolve();
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8"/>
          <title>${filename}</title>
          <style>
            @page { size: A4; margin: 0; }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { margin: 0; padding: 0; background: white; width: 210mm; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>${html}</body>
        </html>
      `);
      printWindow.document.close();

      // Wait for content to render then auto-trigger print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          // Close after a delay to allow print dialog
          setTimeout(() => {
            printWindow.close();
            resolve();
          }, 1000);
        }, 300);
      };

      // Fallback if onload doesn't fire
      setTimeout(() => {
        try {
          printWindow.print();
          setTimeout(() => {
            printWindow.close();
            resolve();
          }, 1000);
        } catch (e) {
          resolve();
        }
      }, 1500);

    } catch (err) {
      reject(err);
    }
  });
}

function fallbackPrint(html: string, filename: string): void {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <title>${filename}</title>
        <style>
          @page { size: A4; margin: 0; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { margin: 0; padding: 0; background: white; }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>${html}</body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 500);
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
