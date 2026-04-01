import { ResumeData, TemplateConfig, ContentMode } from '@/types';
import { getTemplate } from './configs';
import { formatDate, sortByDate, sortEducationByDate } from '@/lib/utils';

function detectContentMode(data: ResumeData, config: TemplateConfig): ContentMode {
  const totalItems = data.experience.length + data.education.length + data.certifications.length;
  if (totalItems <= config.compactThreshold) return 'compact';
  if (totalItems >= config.denseThreshold) return 'dense';
  return 'standard';
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderResumeHtml(data: ResumeData, forExport = false): string {
  const config = getTemplate(data.selectedTemplate);
  const mode = detectContentMode(data, config);
  const lang = data.language;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const isRtl = lang === 'ar';
  const pi = data.personalInfo;
  const sortedExp = sortByDate(data.experience);
  const sortedEdu = sortEducationByDate(data.education);
  const enabledLinks = data.links.filter((l) => l.enabled && l.url);

  const bodyFs = mode === 'dense' ? config.fontSizes.body - 0.5 : config.fontSizes.body;
  const headingFs = mode === 'dense' ? config.fontSizes.heading - 1 : config.fontSizes.heading;
  const margins = config.pageMargins;

  // Section renderers
  const renderSummary = () => {
    if (!pi.summary) return '';
    return `
      <div class="cv-section">
        <h2 class="cv-section-title">${lang === 'ar' ? 'الملخص المهني' : 'Professional Summary'}</h2>
        <p class="cv-body">${escapeHtml(pi.summary)}</p>
      </div>`;
  };

  const renderExperience = () => {
    if (sortedExp.length === 0) return '';
    return `
      <div class="cv-section">
        <h2 class="cv-section-title">${lang === 'ar' ? 'الخبرة' : 'Experience'}</h2>
        ${sortedExp.map((exp) => `
          <div class="cv-entry" style="page-break-inside: avoid;">
            <div class="cv-entry-header">
              <div>
                <span class="cv-entry-title">${escapeHtml(exp.jobTitle)}</span>
                <span class="cv-entry-subtitle"> — ${escapeHtml(exp.company)}${exp.location ? `, ${escapeHtml(exp.location)}` : ''}</span>
              </div>
              <span class="cv-date">${formatDate(exp.startMonth, exp.startYear, lang)} — ${exp.isCurrent ? (lang === 'ar' ? 'حالياً' : 'Present') : formatDate(exp.endMonth, exp.endYear, lang)}</span>
            </div>
            ${exp.bullets.filter(b => b.text).length > 0 ? `
              <ul class="cv-bullets">
                ${exp.bullets.filter(b => b.text).map((b) => `<li>${escapeHtml(b.text)}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        `).join('')}
      </div>`;
  };

  const renderEducation = () => {
    if (sortedEdu.length === 0) return '';
    return `
      <div class="cv-section">
        <h2 class="cv-section-title">${lang === 'ar' ? 'التعليم' : 'Education'}</h2>
        ${sortedEdu.map((edu) => `
          <div class="cv-entry" style="page-break-inside: avoid;">
            <div class="cv-entry-header">
              <div>
                <span class="cv-entry-title">${escapeHtml(edu.degree)}</span>
                <span class="cv-entry-subtitle"> — ${escapeHtml(edu.institution)}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}</span>
              </div>
              <span class="cv-date">${formatDate(edu.graduationMonth, edu.graduationYear, lang)}</span>
            </div>
            ${edu.gpa ? `<p class="cv-body cv-small">${lang === 'ar' ? 'المعدل' : 'GPA'}: ${escapeHtml(edu.gpa)}</p>` : ''}
            ${edu.thesisProject ? `<p class="cv-body cv-small">${lang === 'ar' ? 'المشروع' : 'Thesis'}: ${escapeHtml(edu.thesisProject)}</p>` : ''}
          </div>
        `).join('')}
      </div>`;
  };

  const renderSkills = () => {
    if (data.skills.length === 0) return '';
    return `
      <div class="cv-section">
        <h2 class="cv-section-title">${lang === 'ar' ? 'المهارات' : 'Skills'}</h2>
        <p class="cv-body">${data.skills.map((s) => escapeHtml(s.name)).join(' • ')}</p>
      </div>`;
  };

  const renderLanguages = () => {
    if (data.languages.length === 0) return '';
    const profLabels: Record<string, Record<string, string>> = {
      en: { beginner: 'Beginner', intermediate: 'Intermediate', fluent: 'Fluent', native: 'Native' },
      ar: { beginner: 'مبتدئ', intermediate: 'متوسط', fluent: 'متقدم', native: 'لغة أم' },
    };
    return `
      <div class="cv-section">
        <h2 class="cv-section-title">${lang === 'ar' ? 'اللغات' : 'Languages'}</h2>
        <p class="cv-body">${data.languages.map((l) => `${escapeHtml(l.name)} (${profLabels[lang]?.[l.proficiency] || l.proficiency})`).join(' • ')}</p>
      </div>`;
  };

  const renderCertifications = () => {
    if (data.certifications.length === 0) return '';
    return `
      <div class="cv-section">
        <h2 class="cv-section-title">${lang === 'ar' ? 'الشهادات' : 'Certifications'}</h2>
        ${data.certifications.map((c) => `
          <div class="cv-entry" style="page-break-inside: avoid;">
            <div class="cv-entry-header">
              <div>
                <span class="cv-entry-title">${escapeHtml(c.name)}</span>
                <span class="cv-entry-subtitle"> — ${escapeHtml(c.organization)}</span>
              </div>
              <span class="cv-date">${formatDate(c.issueMonth, c.issueYear, lang)}</span>
            </div>
          </div>
        `).join('')}
      </div>`;
  };

  const sectionRenderers: Record<string, () => string> = {
    summary: renderSummary,
    experience: renderExperience,
    education: renderEducation,
    skills: renderSkills,
    languages: renderLanguages,
    certifications: renderCertifications,
  };

  const sectionsHtml = config.sectionOrder
    .map((key) => sectionRenderers[key]?.() || '')
    .join('');

  // Header
  const contactParts: string[] = [];
  if (pi.email) contactParts.push(escapeHtml(pi.email));
  if (pi.phone) contactParts.push(escapeHtml(pi.phone));
  if (pi.location) contactParts.push(escapeHtml(pi.location));
  const linksHtml = enabledLinks.map((l) => `<a href="${escapeHtml(l.url)}" class="cv-link">${l.type}</a>`).join(' • ');

  // Visual elegant sidebar template
  if (config.family === 'visual') {
    const sidebarSections = ['skills', 'languages'];
    const mainSections = config.sectionOrder.filter((s) => !sidebarSections.includes(s));

    const sidebarHtml = sidebarSections.map((key) => sectionRenderers[key]?.() || '').join('');
    const mainHtml = mainSections.map((key) => sectionRenderers[key]?.() || '').join('');

    return `
      <div class="cv-page cv-visual" dir="${dir}" lang="${lang}" style="font-family: ${config.fontFamilies.body}; font-size: ${bodyFs}pt; color: ${config.primaryColor};">
        <style>
          .cv-visual { display: flex; min-height: ${forExport ? '297mm' : '100%'}; width: ${forExport ? '210mm' : '100%'}; background: #fff; }
          .cv-sidebar { width: ${config.sidebarWidth}px; background: ${config.accentColor}; color: ${config.primaryColor}; padding: 40px 24px; flex-shrink: 0; }
          .cv-sidebar .cv-section-title { color: ${config.secondaryColor}; border-color: rgba(255,255,255,0.3); }
          .cv-sidebar .cv-body { color: ${config.primaryColor}; }
          .cv-main { flex: 1; padding: 40px 36px; color: ${config.accentColor}; }
          .cv-main .cv-section-title { color: ${config.accentColor}; border-color: ${config.secondaryColor}; }
          .cv-name { font-family: ${config.fontFamilies.heading}; font-size: ${config.fontSizes.name}pt; font-weight: 700; margin-bottom: 4px; }
          .cv-jobtitle { font-size: ${config.fontSizes.subheading}pt; opacity: 0.8; margin-bottom: 16px; }
          .cv-contact { font-size: ${config.fontSizes.small}pt; line-height: 1.8; margin-bottom: 24px; }
          ${getCommonStyles(config, bodyFs, headingFs)}
        </style>
        <div class="cv-sidebar">
          ${config.supportsPhoto && pi.photoUrl ? `<img src="${pi.photoUrl}" class="cv-photo" style="width:100px;height:100px;border-radius:50%;object-fit:cover;margin-bottom:16px;"/>` : ''}
          <div class="cv-name">${escapeHtml(pi.fullName || '')}</div>
          <div class="cv-jobtitle">${escapeHtml(pi.jobTitle || '')}</div>
          <div class="cv-contact">
            ${contactParts.map((c) => `<div>${c}</div>`).join('')}
            ${enabledLinks.map((l) => `<div><a href="${escapeHtml(l.url)}" class="cv-link" style="color:${config.primaryColor};">${l.type}</a></div>`).join('')}
          </div>
          ${sidebarHtml}
        </div>
        <div class="cv-main">
          ${mainHtml}
        </div>
      </div>`;
  }

  // Classic & Balanced templates (full-width)
  return `
    <div class="cv-page" dir="${dir}" lang="${lang}" style="font-family: ${config.fontFamilies.body}; font-size: ${bodyFs}pt; color: ${config.primaryColor}; ${forExport ? `width: 210mm; min-height: 297mm;` : 'width: 100%;'} padding: ${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px; background: #fff; box-sizing: border-box;">
      <style>
        ${getCommonStyles(config, bodyFs, headingFs)}
        .cv-header { text-align: center; margin-bottom: 20px; border-bottom: ${config.family === 'classic' ? '2px solid ' + config.primaryColor : '2px solid ' + config.accentColor}; padding-bottom: 16px; }
        .cv-name { font-family: ${config.fontFamilies.heading}; font-size: ${config.fontSizes.name}pt; font-weight: 700; ${config.headingStyle === 'uppercase' ? 'text-transform: uppercase; letter-spacing: 2px;' : ''} margin-bottom: 4px; color: ${config.primaryColor}; }
        .cv-jobtitle { font-size: ${config.fontSizes.subheading + 2}pt; color: ${config.secondaryColor}; margin-bottom: 8px; }
        .cv-contact-line { font-size: ${config.fontSizes.small}pt; color: ${config.secondaryColor}; }
        .cv-link { color: ${config.accentColor}; text-decoration: none; }
      </style>
      <div class="cv-header">
        ${config.supportsPhoto && pi.photoUrl ? `<img src="${pi.photoUrl}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;margin-bottom:8px;display:block;margin-left:auto;margin-right:auto;"/>` : ''}
        <div class="cv-name">${escapeHtml(pi.fullName || '')}</div>
        <div class="cv-jobtitle">${escapeHtml(pi.jobTitle || '')}</div>
        <div class="cv-contact-line">${contactParts.join(' • ')}${linksHtml ? ' • ' + linksHtml : ''}</div>
      </div>
      ${sectionsHtml}
    </div>`;
}

function getCommonStyles(config: TemplateConfig, bodyFs: number, headingFs: number): string {
  return `
    .cv-section { margin-bottom: 16px; }
    .cv-section-title {
      font-family: ${config.fontFamilies.heading};
      font-size: ${headingFs}pt;
      font-weight: 700;
      ${config.headingStyle === 'uppercase' ? 'text-transform: uppercase; letter-spacing: 1.5px;' : config.headingStyle === 'capitalize' ? 'text-transform: capitalize;' : ''}
      color: ${config.family === 'visual' ? 'inherit' : config.accentColor};
      border-bottom: 1px solid ${config.family === 'visual' ? 'rgba(255,255,255,0.3)' : config.secondaryColor};
      padding-bottom: 4px;
      margin-bottom: 10px;
    }
    .cv-entry { margin-bottom: 10px; }
    .cv-entry-header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 4px; }
    .cv-entry-title { font-weight: 600; font-size: ${bodyFs + 1}pt; }
    .cv-entry-subtitle { font-size: ${bodyFs}pt; color: ${config.secondaryColor}; }
    .cv-date { font-size: ${config.fontSizes.small}pt; color: ${config.secondaryColor}; white-space: nowrap; }
    .cv-body { font-size: ${bodyFs}pt; line-height: 1.5; margin: 4px 0; }
    .cv-small { font-size: ${config.fontSizes.small}pt; }
    .cv-bullets { margin: 6px 0; padding-${config.family === 'visual' ? 'left' : 'inline-start'}: 18px; }
    .cv-bullets li { font-size: ${bodyFs}pt; line-height: 1.5; margin-bottom: 3px; }
    .cv-link { color: ${config.accentColor}; text-decoration: none; }
    @media print {
      .cv-page { margin: 0; padding: ${config.pageMargins.top}px ${config.pageMargins.right}px ${config.pageMargins.bottom}px ${config.pageMargins.left}px; }
      .cv-entry { page-break-inside: avoid; }
      .cv-section-title { page-break-after: avoid; }
    }
  `;
}
