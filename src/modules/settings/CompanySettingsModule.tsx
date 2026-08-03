'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { Building2, ImagePlus, RotateCcw, Trash2 } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { ConfirmDialog, PageHeader } from '@/components/UI';
import { useDemo } from '@/components/DemoProvider';
import { useToast } from '@/components/ToastProvider';
import { CompanySettings } from '@/lib/types';

async function imageToJpeg(file: File) {
  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = reject;
      element.src = url;
    });
    const maxWidth = 1200;
    const maxHeight = 600;
    const scale = Math.min(1, maxWidth / image.width, maxHeight / image.height);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas is not available.');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return { dataUrl: canvas.toDataURL('image/jpeg', 0.9), width: canvas.width, height: canvas.height };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function CompanySettingsModule() {
  const { state, updateState, resetDemo } = useDemo();
  const { showToast } = useToast();
  const [draft, setDraft] = useState<CompanySettings>(state.company);
  const [resetOpen, setResetOpen] = useState(false);
  const [logoError, setLogoError] = useState('');

  const setField = <K extends keyof CompanySettings>(key: K, value: CompanySettings[K]) => setDraft((current) => ({ ...current, [key]: value }));

  async function onLogo(event: ChangeEvent<HTMLInputElement>) {
    setLogoError('');
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) { setLogoError('Use a PNG, JPG, or WebP image.'); return; }
    if (file.size > 3 * 1024 * 1024) { setLogoError('The logo must be smaller than 3 MB.'); return; }
    try {
      const logo = await imageToJpeg(file);
      setDraft((current) => ({ ...current, logoDataUrl: logo.dataUrl, logoWidth: logo.width, logoHeight: logo.height }));
      showToast('Logo prepared for the system and printable documents.');
    } catch {
      setLogoError('The image could not be processed. Please try another file.');
    }
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateState((current) => ({ ...current, company: draft }));
    showToast('Company settings saved. Branding is now applied throughout the demo.');
  }

  return (
    <AppShell>
      <PageHeader title="Company Settings" subtitle="Control account details, branding, and contract document identity" />
      <form className="settings-layout" onSubmit={save}>
        <section className="panel settings-panel">
          <div className="section-head"><div><h2>Company identity</h2><p>These details appear in the application and exported contracts.</p></div></div>
          <div className="logo-settings">
            <div className="logo-preview">
              {draft.logoDataUrl ? <img src={draft.logoDataUrl} alt="Company logo preview" /> : <Building2 size={54} />}
            </div>
            <div>
              <h3>Company logo</h3>
              <p>PNG, JPG, or WebP. Maximum 3 MB. The logo is converted to a document-safe JPG while preserving its aspect ratio.</p>
              <div className="inline-actions">
                <label className="btn secondary file-button"><ImagePlus size={17} />Upload or replace<input type="file" accept="image/png,image/jpeg,image/webp" onChange={onLogo} /></label>
                {draft.logoDataUrl && <button type="button" className="btn ghost" onClick={() => setDraft((current) => ({ ...current, logoDataUrl: '', logoWidth: 0, logoHeight: 0 }))}><Trash2 size={16} />Remove</button>}
              </div>
              {logoError && <p className="field-error">{logoError}</p>}
            </div>
          </div>
          <div className="form-grid top-gap">
            <label>Legal company name *<input value={draft.legalName} onChange={(event) => setField('legalName', event.target.value)} required /></label>
            <label>Trading name *<input value={draft.tradingName} onChange={(event) => setField('tradingName', event.target.value)} required /></label>
            <label>Registration number<input value={draft.registrationNumber} onChange={(event) => setField('registrationNumber', event.target.value)} /></label>
            <label>Tax number<input value={draft.taxNumber} onChange={(event) => setField('taxNumber', event.target.value)} /></label>
            <label className="span-2">Registered address *<input value={draft.address} onChange={(event) => setField('address', event.target.value)} required /></label>
            <label>Phone<input value={draft.phone} onChange={(event) => setField('phone', event.target.value)} /></label>
            <label>Email<input type="email" value={draft.email} onChange={(event) => setField('email', event.target.value)} /></label>
            <label>Website<input value={draft.website} onChange={(event) => setField('website', event.target.value)} /></label>
            <label>Default currency<select value={draft.defaultCurrency} onChange={(event) => setField('defaultCurrency', event.target.value as CompanySettings['defaultCurrency'])}><option>USD</option><option>IQD</option></select></label>
            <label>Default contract language<select value={draft.defaultLanguage} onChange={(event) => setField('defaultLanguage', event.target.value as CompanySettings['defaultLanguage'])}><option>English</option><option>Arabic</option><option>Kurdish</option></select></label>
          </div>
        </section>

        <aside className="settings-side">
          <section className="panel settings-panel">
            <h2>Authorized signatory</h2>
            <p>Used in contract variables and signature blocks.</p>
            <label>Full name *<input value={draft.signatoryName} onChange={(event) => setField('signatoryName', event.target.value)} required /></label>
            <label>Title *<input value={draft.signatoryTitle} onChange={(event) => setField('signatoryTitle', event.target.value)} required /></label>
          </section>
          <section className="panel settings-panel document-brand-preview">
            <span className="eyebrow">Document preview</span>
            <div className="mini-letterhead">
              {draft.logoDataUrl ? <img src={draft.logoDataUrl} alt="Logo in document preview" /> : <Building2 size={28} />}
              <div><strong>{draft.legalName || 'Company name'}</strong><small>{draft.address || 'Registered address'}</small></div>
            </div>
            <p>Logo, legal name, address, contact details, contract number, and page numbers are automatically included in Word and PDF exports.</p>
          </section>
          <button className="btn wide" type="submit">Save Company Settings</button>
          <button className="btn ghost wide" type="button" onClick={() => setResetOpen(true)}><RotateCcw size={16} />Reset complete demo data</button>
        </aside>
      </form>
      {resetOpen && <ConfirmDialog title="Reset the demo?" body="This removes all locally saved changes, uploaded branding, new records, and template edits, then restores the original demo data." confirmLabel="Reset demo" tone="danger" onClose={() => setResetOpen(false)} onConfirm={() => { resetDemo(); setDraft(state.company); setResetOpen(false); showToast('Demo data reset.', 'info'); window.location.reload(); }} />}
    </AppShell>
  );
}
