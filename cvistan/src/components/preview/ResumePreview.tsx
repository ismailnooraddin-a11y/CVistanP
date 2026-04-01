'use client';

import { useEffect, useRef, useState } from 'react';
import { useBuilderStore } from '@/store/builder';
import { renderResumeHtml } from '@/templates/renderer';

export default function ResumePreview() {
  const resume = useBuilderStore((s) => s.resume);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Auto-scale preview to fit container
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // A4 at 96dpi ≈ 794px width
        const a4Width = 794;
        const newScale = Math.min(containerWidth / a4Width, 1);
        setScale(newScale);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const html = renderResumeHtml(resume, false);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <div
        className="cv-preview-wrapper origin-top-left"
        style={{
          transform: `scale(${scale})`,
          width: '794px',
          minHeight: '1123px', // A4 height at 96dpi
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
