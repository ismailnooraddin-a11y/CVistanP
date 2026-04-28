import { ResumeData } from '@/types';
import { getTemplate } from '@/templates/configs';
import { formatDate, sortByDate, sortEducationByDate } from '@/lib/utils';
import { downloadBlob } from '@/lib/download';

async function loadJsPdf(): Promise<any> {
  return new Promise((resolve, reject) => {
    if ((window as any).jspdf) {
      resolve((window as any).jspdf);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.2/jspdf.umd.min.js';
    script.onload = () => resolve((window as any).jspdf);
    script.onerror = () => reject(new Error('Failed to load jsPDF'));
    document.head.appendChild(script);
  });
}

export async function generateResumePdf(data: ResumeData): Promise<void> {
  const jspdfLib = await loadJsPdf();
  const { jsPDF } = jspdfLib;

  const config = getTemplate(data.selectedTemplate);
  const lang = data.language;
  const isAr = lang === 'ar';
  const pi = data.personalInfo;
  const sortedExp = sortByDate(data.experience);
  const sortedEdu = sortEducationByDate(data.education);

  // A4 dimensions in mm
  const pageW = 210;
  const pageH = 297;
  const marginL = 20;
  const marginR = 20;
  const marginT = 20;
  const marginB = 20;
  const contentW = pageW - marginL - marginR;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Colors from template
  const primaryColor = hexToRgb(config.primaryColor);
  const accentColor = hexToRgb(config.accentColor);
  const secondaryColor = hexToRgb(config.secondaryColor);
  const black: [number, number, number] = [30, 30, 30];
  const gray: [number, number, number] = [100, 100, 100];
  const lightGray: [number, number, number] = [180, 180, 180];

  let y = marginT;
  let pageNum = 1;

  function checkPage(needed: number) {
    if (y + needed > pageH - marginB) {
      doc.addPage();
      pageNum++;
      y = marginT;
    }
  }

  function setFont(style: 'normal' | 'bold' | 'italic', size: number) {
    doc.setFontSize(size);
    if (style === 'bold') {
      doc.setFont('helvetica', 'bold');
    } else if (style === 'italic') {
      doc.setFont('helvetica', 'italic');
    } else {
      doc.setFont('helvetica', 'normal');
    }
  }

  function drawText(
    text: string,
    x: number,
    currentY: number,
    options?: { maxWidth?: number; align?: 'left' | 'center' | 'right'; color?: [number, number, number] }
  ): number {
    const color = options?.color || black;
    doc.setTextColor(color[0], color[1], color[2]);
    const maxW = options?.maxWidth || contentW;
    const align = options?.align || (isAr ? 'right' : 'left');

    let xPos = x;
    if (align === 'center') {
      xPos = pageW / 2;
    } else if (align === 'right') {
      xPos = pageW - marginR;
    }

    const lines = doc.splitTextToSize(text, maxW);
    const lineHeight = doc.getFontSize() * 0.45;

    for (const line of lines) {
      checkPage(lineHeight);
      doc.text(line, xPos, y, { align });
      y += lineHeight;
    }

    return y;
  }

  function drawLine() {
    checkPage(3);
    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setLineWidth(0.3);
    doc.line(marginL, y, pageW - marginR, y);
    y += 3;
  }

  function drawSectionTitle(title: string) {
    checkPage(12);
    y += 3;
    setFont('bold', 12);
    drawText(title, marginL, y, { color: accentColor });
    y += 1;
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setLineWidth(0.4);
    doc.line(marginL, y, pageW - marginR, y);
    y += 4;
  }

  // ═══════════════════════════════════
  // HEADER
  // ═══════════════════════════════════
  setFont('bold', 22);
  drawText(pi.fullName || '', marginL, y, { align: 'center', color: primaryColor });
  y += 2;

  setFont('normal', 12);
  drawText(pi.jobTitle || '', marginL, y, { align: 'center', color: secondaryColor });
  y += 2;

  const contactParts: string[] = [];
  if (pi.email) contactParts.push(pi.email);
  if (pi.phone) contactParts.push(pi.phone);
  if (pi.location) contactParts.push(pi.location);

  if (contactParts.length > 0) {
    setFont('normal', 9);
    drawText(contactParts.join('  |  '), marginL, y, { align: 'center', color: gray });
    y += 2;
  }

  // Links
  const enabledLinks = data.links.filter((l) => l.enabled && l.url);
  if (enabledLinks.length > 0) {
    setFont('normal', 8);
    drawText(enabledLinks.map((l) => `${l.type}: ${l.url}`).join('  |  '), marginL, y, { align: 'center', color: accentColor });
    y += 2;
  }

  drawLine();

  // ═══════════════════════════════════
  // SECTIONS (following template order)
  // ═══════════════════════════════════
  for (const section of config.sectionOrder) {
    switch (section) {
      case 'summary':
        if (pi.summary) {
          drawSectionTitle(isAr ? 'الملخص المهني' : 'Professional Summary');
          setFont('normal', 10);
          drawText(pi.summary, marginL, y, { color: black });
          y += 3;
        }
        break;

      case 'experience':
        if (sortedExp.length > 0) {
          drawSectionTitle(isAr ? 'الخبرة' : 'Experience');
          for (const exp of sortedExp) {
            checkPage(20);
            // Job title + company
            setFont('bold', 10.5);
            const expTitle = `${exp.jobTitle} — ${exp.company}${exp.location ? ', ' + exp.location : ''}`;
            drawText(expTitle, marginL, y, { color: black });

            // Dates
            const dateStr = `${formatDate(exp.startMonth, exp.startYear, lang)} — ${exp.isCurrent ? (isAr ? 'حالياً' : 'Present') : formatDate(exp.endMonth, exp.endYear, lang)}`;
            setFont('normal', 9);
            drawText(dateStr, marginL, y, { color: gray });
            y += 1;

            // Bullets
            const filledBullets = exp.bullets.filter((b) => b.text);
            for (const bullet of filledBullets) {
              checkPage(8);
              setFont('normal', 9.5);
              const bulletText = '•  ' + bullet.text;
              drawText(bulletText, marginL + 4, y, { maxWidth: contentW - 8, color: black });
              y += 1;
            }
            y += 3;
          }
        }
        break;

      case 'education':
        if (sortedEdu.length > 0) {
          drawSectionTitle(isAr ? 'التعليم' : 'Education');
          for (const edu of sortedEdu) {
            checkPage(15);
            setFont('bold', 10.5);
            const eduTitle = `${edu.degree} — ${edu.institution}${edu.location ? ', ' + edu.location : ''}`;
            drawText(eduTitle, marginL, y, { color: black });

            if (edu.graduationYear) {
              setFont('normal', 9);
              drawText(formatDate(edu.graduationMonth, edu.graduationYear, lang), marginL, y, { color: gray });
            }

            if (edu.gpa) {
              setFont('normal', 9);
              drawText(`${isAr ? 'المعدل' : 'GPA'}: ${edu.gpa}`, marginL + 4, y, { color: gray });
            }

            if (edu.thesisProject) {
              setFont('italic', 9);
              drawText(`${isAr ? 'المشروع' : 'Thesis'}: ${edu.thesisProject}`, marginL + 4, y, { color: gray });
            }
            y += 3;
          }
        }
        break;

      case 'skills':
        if (data.skills.length > 0) {
          drawSectionTitle(isAr ? 'المهارات' : 'Skills');
          setFont('normal', 10);
          drawText(data.skills.map((s) => s.name).join('  •  '), marginL, y, { color: black });
          y += 3;
        }
        break;

      case 'languages':
        if (data.languages.length > 0) {
          const profLabels: Record<string, string> = isAr
            ? { beginner: 'مبتدئ', intermediate: 'متوسط', fluent: 'متقدم', native: 'لغة أم' }
            : { beginner: 'Beginner', intermediate: 'Intermediate', fluent: 'Fluent', native: 'Native' };
          drawSectionTitle(isAr ? 'اللغات' : 'Languages');
          setFont('normal', 10);
          drawText(
            data.languages.map((l) => `${l.name} (${profLabels[l.proficiency] || l.proficiency})`).join('  •  '),
            marginL, y, { color: black }
          );
          y += 3;
        }
        break;

      case 'certifications':
        if (data.certifications.length > 0) {
          drawSectionTitle(isAr ? 'الشهادات' : 'Certifications');
          for (const cert of data.certifications) {
            checkPage(10);
            setFont('bold', 10);
            drawText(`${cert.name} — ${cert.organization}`, marginL, y, { color: black });
            if (cert.issueYear) {
              setFont('normal', 9);
              drawText(formatDate(cert.issueMonth, cert.issueYear, lang), marginL, y, { color: gray });
            }
            y += 3;
          }
        }
        break;
    }
  }

  // Save
  const fileName = (pi.fullName || 'CV') + ' - Resume.pdf';
  doc.save(fileName);
}

function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return [r, g, b];
}
