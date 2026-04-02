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
 * Generates a PDF from HTML. 
 * Renders HTML in a visible off-screen container, applies computed styles inline,
 * then captures with html2pdf.js for auto-download.
 */
export async function generatePdfFromHtml(html: string, filename: string): Promise<void> {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.2/html2pdf.bundle.min.js');

  // Step 1: Create a visible but off-screen container
  const wrapper = document.createElement('div');
  wrapper.id = 'pdf-render-wrapper';
  wrapper.style.position = 'absolute';
  wrapper.style.left = '-10000px';
  wrapper.style.top = '0';
  wrapper.style.width = '794px';
  wrapper.style.background = 'white';
  wrapper.style.zIndex = '1';
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  // Step 2: Wait for browser to fully render (fonts, layout)
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Step 3: Inline all computed styles so html2canvas can see them
  inlineAllStyles(wrapper);

  // Step 4: Remove the <style> tags (no longer needed, everything is inline now)
  const styleTags = wrapper.querySelectorAll('style');
  styleTags.forEach((s) => s.remove());

  // Step 5: Capture with html2pdf
  try {
    const html2pdf = (window as any).html2pdf;
    const totalHeight = wrapper.scrollHeight || 1123;

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
          height: totalHeight,
          windowWidth: 794,
          backgroundColor: '#ffffff',
          logging: false,
          foreignObjectRendering: false,
        },
        jsPDF: {
          unit: 'px',
          format: [794, 1123],
          orientation: 'portrait',
          hotfixes: ['px_scaling'],
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      })
      .from(wrapper)
      .save();
  } finally {
    document.body.removeChild(wrapper);
  }
}

/**
 * Recursively applies all computed styles as inline styles on every element.
 * This makes html2canvas see the styles even without <style> tags.
 */
function inlineAllStyles(element: Element): void {
  const children = element.querySelectorAll('*');
  
  const importantProps = [
    'color', 'background-color', 'background',
    'font-family', 'font-size', 'font-weight', 'font-style',
    'text-align', 'text-transform', 'text-decoration', 'letter-spacing',
    'line-height', 'white-space',
    'display', 'flex-direction', 'justify-content', 'align-items', 'flex-wrap', 'flex-shrink', 'flex',
    'width', 'min-width', 'max-width', 'height', 'min-height',
    'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'border', 'border-top', 'border-right', 'border-bottom', 'border-left',
    'border-color', 'border-style', 'border-width',
    'border-radius',
    'box-sizing', 'overflow',
    'opacity',
    'gap',
    'list-style-type',
    'direction',
  ];

  children.forEach((child) => {
    if (child instanceof HTMLElement) {
      const computed = window.getComputedStyle(child);
      let inlineStyle = '';
      
      for (const prop of importantProps) {
        const value = computed.getPropertyValue(prop);
        if (value && value !== '' && value !== 'none' && value !== 'normal' && value !== 'auto') {
          // Skip defaults that add noise
          if (prop === 'display' && value === 'block') continue;
          if (prop === 'box-sizing' && value === 'content-box') continue;
          if (prop === 'overflow' && value === 'visible') continue;
          inlineStyle += `${prop}:${value};`;
        }
      }
      
      // Preserve existing inline styles (they take priority)
      const existing = child.getAttribute('style') || '';
      child.setAttribute('style', inlineStyle + existing);
    }
  });

  // Also inline styles on the root element itself
  if (element instanceof HTMLElement) {
    const computed = window.getComputedStyle(element);
    const existing = element.getAttribute('style') || '';
    let rootStyle = '';
    rootStyle += `background:${computed.getPropertyValue('background') || 'white'};`;
    rootStyle += `color:${computed.getPropertyValue('color')};`;
    rootStyle += `font-family:${computed.getPropertyValue('font-family')};`;
    rootStyle += `font-size:${computed.getPropertyValue('font-size')};`;
    rootStyle += `width:794px;`;
    element.setAttribute('style', rootStyle + existing);
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
