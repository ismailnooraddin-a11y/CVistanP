import { CompanySettings } from './types';
import { base64ToBytes, createZip, downloadBlob, utf8 } from './zip';
import { fileSafe } from './format';

export interface ContractSectionOutput {
  title: string;
  body: string;
}

export interface ContractDocumentOutput {
  title: string;
  contractNumber: string;
  contractDate: string;
  company: CompanySettings;
  sections: ContractSectionOutput[];
  clientName: string;
}

const xmlEscape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

function paragraphs(value: string, style = '') {
  return value.split(/\n+/).filter(Boolean).map((line) => `<w:p>${style ? `<w:pPr><w:pStyle w:val="${style}"/></w:pPr>` : ''}<w:r><w:t xml:space="preserve">${xmlEscape(line.trim())}</w:t></w:r></w:p>`).join('');
}

function imageDrawing(company: CompanySettings) {
  const sourceWidth = company.logoWidth || 1200;
  const sourceHeight = company.logoHeight || 400;
  const maxWidth = 1550000;
  const maxHeight = 550000;
  const scale = Math.min(maxWidth / sourceWidth, maxHeight / sourceHeight);
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));
  return `<w:p><w:pPr><w:jc w:val="left"/></w:pPr><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"><wp:extent cx="${width}" cy="${height}"/><wp:docPr id="1" name="Company Logo"/><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="0" name="logo.jpg"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rId1" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${width}" cy="${height}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`;
}

export function exportContractDocx(document: ContractDocumentOutput) {
  const hasLogo = document.company.logoDataUrl.startsWith('data:image/jpeg');
  const body = document.sections.map((section) => `${paragraphs(section.title, 'Heading1')}${paragraphs(section.body)}`).join('');
  const signatureTable = `<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders></w:tblPr><w:tblGrid><w:gridCol w:w="4500"/><w:gridCol w:w="4500"/></w:tblGrid><w:tr><w:tc><w:tcPr><w:tcW w:w="4500" w:type="dxa"/></w:tcPr>${paragraphs('For the Company', 'Heading2')}${paragraphs(`Name: ${document.company.signatoryName}\nTitle: ${document.company.signatoryTitle}\nSignature: ____________________\nDate: ____________________`)}</w:tc><w:tc><w:tcPr><w:tcW w:w="4500" w:type="dxa"/></w:tcPr>${paragraphs('Client / Counterparty', 'Heading2')}${paragraphs(`Name: ${document.clientName}\nSignature: ____________________\nDate: ____________________`)}</w:tc></w:tr></w:tbl>`;
  const header = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">${hasLogo ? imageDrawing(document.company) : ''}<w:p><w:pPr><w:jc w:val="right"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="7A3D18"/></w:rPr><w:t>${xmlEscape(document.company.legalName)}</w:t></w:r></w:p><w:p><w:pPr><w:jc w:val="right"/></w:pPr><w:r><w:rPr><w:sz w:val="18"/></w:rPr><w:t>${xmlEscape(document.company.address)}</w:t></w:r></w:p></w:hdr>`;
  const footer = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:color w:val="7D6C63"/><w:sz w:val="18"/></w:rPr><w:t>${xmlEscape(document.contractNumber)}  |  Page </w:t></w:r><w:fldSimple w:instr="PAGE"><w:r><w:rPr><w:color w:val="7D6C63"/><w:sz w:val="18"/></w:rPr><w:t>1</w:t></w:r></w:fldSimple><w:r><w:rPr><w:color w:val="7D6C63"/><w:sz w:val="18"/></w:rPr><w:t> of </w:t></w:r><w:fldSimple w:instr="NUMPAGES"><w:r><w:rPr><w:color w:val="7D6C63"/><w:sz w:val="18"/></w:rPr><w:t>1</w:t></w:r></w:fldSimple></w:p></w:ftr>`;
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><w:body><w:p><w:pPr><w:pStyle w:val="Title"/><w:jc w:val="center"/></w:pPr><w:r><w:t>${xmlEscape(document.title)}</w:t></w:r></w:p><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="7D6C63"/></w:rPr><w:t>${xmlEscape(`Contract No. ${document.contractNumber}  |  ${document.contractDate}`)}</w:t></w:r></w:p>${body}${signatureTable}<w:sectPr><w:headerReference w:type="default" r:id="rId1"/><w:footerReference w:type="default" r:id="rId2"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1701" w:right="1134" w:bottom="1417" w:left="1134" w:header="567" w:footer="567"/></w:sectPr></w:body></w:document>`;
  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Aptos" w:hAnsi="Aptos"/><w:sz w:val="22"/><w:lang w:val="en-US"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="160" w:line="300" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style><w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:color w:val="271B16"/><w:sz w:val="36"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="260" w:after="100"/></w:pPr><w:rPr><w:b/><w:color w:val="7A3D18"/><w:sz w:val="26"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="22"/></w:rPr></w:style></w:styles>`;
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>${hasLogo ? '<Default Extension="jpg" ContentType="image/jpeg"/>' : ''}<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`;
  const entries = [
    { name: '[Content_Types].xml', data: utf8(contentTypes) },
    { name: '_rels/.rels', data: utf8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`) },
    { name: 'word/document.xml', data: utf8(documentXml) },
    { name: 'word/styles.xml', data: utf8(styles) },
    { name: 'word/header1.xml', data: utf8(header) },
    { name: 'word/footer1.xml', data: utf8(footer) },
    { name: 'word/_rels/document.xml.rels', data: utf8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`) },
    { name: 'docProps/core.xml', data: utf8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/"><dc:title>${xmlEscape(document.title)}</dc:title><dc:creator>${xmlEscape(document.company.legalName)}</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">${new Date().toISOString()}</dcterms:created></cp:coreProperties>`) },
    { name: 'docProps/app.xml', data: utf8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>EstateFlow ERP</Application></Properties>`) },
  ];
  if (hasLogo) {
    entries.push({ name: 'word/_rels/header1.xml.rels', data: utf8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/logo.jpg"/></Relationships>`) });
    entries.push({ name: 'word/media/logo.jpg', data: base64ToBytes(document.company.logoDataUrl) });
  }
  const zip = createZip(entries);
  downloadBlob(new Blob([zip], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }), `${fileSafe(document.contractNumber)}.docx`);
}

function loadImage(dataUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUrl;
  });
}

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const paragraphs = text.split(/\n+/);
  const lines: string[] = [];
  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    let line = '';
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (context.measureText(test).width > maxWidth && line) { lines.push(line); line = word; } else line = test;
    }
    if (line) lines.push(line);
    if (!words.length) lines.push('');
  }
  return lines;
}

async function renderContractPages(document: ContractDocumentOutput) {
  const width = 1240;
  const height = 1754;
  const margin = 105;
  const bottom = 105;
  const pageCanvases: HTMLCanvasElement[] = [];
  let canvas = documentCanvas();
  let context = canvas.getContext('2d')!;
  let pageNumber = 1;
  let y = await drawHeader(context, pageNumber);

  function documentCanvas() {
    const next = window.document.createElement('canvas');
    next.width = width;
    next.height = height;
    const ctx = next.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    return next;
  }

  async function drawHeader(ctx: CanvasRenderingContext2D, page: number) {
    let top = 72;
    if (document.company.logoDataUrl) {
      try {
        const image = await loadImage(document.company.logoDataUrl);
        const maxW = 220;
        const maxH = 80;
        const scale = Math.min(maxW / image.width, maxH / image.height);
        ctx.drawImage(image, margin, top, image.width * scale, image.height * scale);
      } catch { /* Text branding remains available if the image cannot render. */ }
    }
    ctx.fillStyle = '#7a3d18';
    ctx.textAlign = 'right';
    ctx.font = '700 24px Arial';
    ctx.fillText(document.company.legalName, width - margin, top + 20);
    ctx.fillStyle = '#6f625b';
    ctx.font = '16px Arial';
    ctx.fillText(document.company.address, width - margin, top + 49);
    ctx.fillText(`${document.company.phone}  |  ${document.company.email}`, width - margin, top + 73);
    ctx.strokeStyle = '#d8c8bd';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(margin, top + 100); ctx.lineTo(width - margin, top + 100); ctx.stroke();
    if (page === 1) {
      ctx.textAlign = 'center';
      ctx.fillStyle = '#271b16';
      ctx.font = '700 38px Georgia';
      ctx.fillText(document.title, width / 2, top + 160);
      ctx.fillStyle = '#7d6c63';
      ctx.font = '700 18px Arial';
      ctx.fillText(`Contract No. ${document.contractNumber}  |  ${document.contractDate}`, width / 2, top + 198);
      return top + 245;
    }
    return top + 140;
  }

  function drawFooter(ctx: CanvasRenderingContext2D, page: number) {
    ctx.strokeStyle = '#e5d9d1';
    ctx.beginPath(); ctx.moveTo(margin, height - 73); ctx.lineTo(width - margin, height - 73); ctx.stroke();
    ctx.fillStyle = '#7d6c63';
    ctx.font = '15px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(document.contractNumber, margin, height - 43);
    ctx.textAlign = 'right';
    ctx.fillText(`Page ${page}`, width - margin, height - 43);
  }

  async function newPage() {
    drawFooter(context, pageNumber);
    pageCanvases.push(canvas);
    pageNumber += 1;
    canvas = documentCanvas();
    context = canvas.getContext('2d')!;
    y = await drawHeader(context, pageNumber);
  }

  for (const section of document.sections) {
    context.textAlign = 'left';
    context.font = '700 24px Georgia';
    const headingLines = wrapText(context, section.title, width - margin * 2);
    const headingHeight = headingLines.length * 34 + 15;
    context.font = '19px Arial';
    const bodyLines = wrapText(context, section.body, width - margin * 2);
    const bodyHeight = bodyLines.length * 31 + 28;
    if (y + headingHeight + Math.min(bodyHeight, 150) > height - bottom) await newPage();
    context.fillStyle = '#7a3d18';
    context.font = '700 24px Georgia';
    for (const line of headingLines) { context.fillText(line, margin, y); y += 34; }
    y += 6;
    context.fillStyle = '#271b16';
    context.font = '19px Arial';
    for (const line of bodyLines) {
      if (y + 34 > height - bottom) await newPage();
      context.fillText(line, margin, y);
      y += 31;
    }
    y += 25;
  }

  if (y + 220 > height - bottom) await newPage();
  context.fillStyle = '#7a3d18';
  context.font = '700 24px Georgia';
  context.fillText('Signatures', margin, y);
  y += 55;
  context.fillStyle = '#271b16';
  context.font = '18px Arial';
  context.fillText('For the Company', margin, y);
  context.fillText('Client / Counterparty', width / 2 + 30, y);
  y += 38;
  context.fillText(document.company.signatoryName, margin, y);
  context.fillText(document.clientName, width / 2 + 30, y);
  y += 70;
  context.strokeStyle = '#271b16';
  context.beginPath(); context.moveTo(margin, y); context.lineTo(margin + 380, y); context.moveTo(width / 2 + 30, y); context.lineTo(width - margin, y); context.stroke();
  y += 27;
  context.fillStyle = '#7d6c63';
  context.font = '15px Arial';
  context.fillText('Signature and date', margin, y);
  context.fillText('Signature and date', width / 2 + 30, y);
  drawFooter(context, pageNumber);
  pageCanvases.push(canvas);
  return pageCanvases;
}

function pdfEscape(value: string) { return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)'); }

function concatenateToArrayBuffer(parts: readonly Uint8Array[]): ArrayBuffer {
  const totalLength = parts.reduce((sum, part) => sum + part.byteLength, 0);
  const buffer = new ArrayBuffer(totalLength);
  const output = new Uint8Array(buffer);
  let writeOffset = 0;
  for (const part of parts) {
    output.set(part, writeOffset);
    writeOffset += part.byteLength;
  }
  return buffer;
}

export function makeImagePdf(images: { bytes: Uint8Array; width: number; height: number }[]) {
  const encoder = new TextEncoder();
  const objects: Uint8Array[] = [];
  const pageObjectIds: number[] = [];
  let objectId = 3;
  for (let index = 0; index < images.length; index += 1) {
    pageObjectIds.push(objectId);
    objectId += 3;
  }
  objects[1] = encoder.encode('<< /Type /Catalog /Pages 2 0 R >>');
  objects[2] = encoder.encode(`<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${images.length} >>`);
  images.forEach((image, index) => {
    const pageId = pageObjectIds[index];
    const imageId = pageId + 1;
    const contentId = pageId + 2;
    objects[pageId] = encoder.encode(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im${index + 1} ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`);
    const imageHeader = encoder.encode(`<< /Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.bytes.length} >>\nstream\n`);
    const imageFooter = encoder.encode('\nendstream');
    const imageObject = new Uint8Array(imageHeader.length + image.bytes.length + imageFooter.length);
    imageObject.set(imageHeader, 0); imageObject.set(image.bytes, imageHeader.length); imageObject.set(imageFooter, imageHeader.length + image.bytes.length);
    objects[imageId] = imageObject;
    const content = `q\n595.28 0 0 841.89 0 0 cm\n/Im${index + 1} Do\nQ`;
    objects[contentId] = encoder.encode(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
  });
  const header = encoder.encode('%PDF-1.4\n%âãÏÓ\n');
  const parts: Uint8Array[] = [header];
  const offsets = [0];
  let offset = header.length;
  for (let id = 1; id < objects.length; id += 1) {
    const object = objects[id];
    if (!object) continue;
    offsets[id] = offset;
    const prefix = encoder.encode(`${id} 0 obj\n`);
    const suffix = encoder.encode('\nendobj\n');
    parts.push(prefix, object, suffix);
    offset += prefix.length + object.length + suffix.length;
  }
  const xrefOffset = offset;
  let xref = `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let id = 1; id < objects.length; id += 1) xref += `${String(offsets[id] || 0).padStart(10, '0')} 00000 n \n`;
  xref += `trailer\n<< /Size ${objects.length} /Root 1 0 R /Info << /Producer (${pdfEscape('EstateFlow ERP')}) >> >>\nstartxref\n${xrefOffset}\n%%EOF`;
  parts.push(encoder.encode(xref));
  return new Blob([concatenateToArrayBuffer(parts)], { type: 'application/pdf' });
}

export async function exportContractPdf(document: ContractDocumentOutput) {
  const canvases = await renderContractPages(document);
  const images = canvases.map((canvas) => ({ bytes: base64ToBytes(canvas.toDataURL('image/jpeg', 0.92)), width: canvas.width, height: canvas.height }));
  downloadBlob(makeImagePdf(images), `${fileSafe(document.contractNumber)}.pdf`);
}
