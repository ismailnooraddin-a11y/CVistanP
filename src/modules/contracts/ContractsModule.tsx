'use client';

import { FormEvent, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Building2, Copy, Download, FileText, FileType2, LockKeyhole, Plus, Save, Settings2, Trash2, Variable } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { Modal, PageHeader, Status } from '@/components/UI';
import { useDemo } from '@/components/DemoProvider';
import { useToast } from '@/components/ToastProvider';
import { ContractDraft, ContractSection, ContractTemplate } from '@/lib/types';
import { exportContractDocx, exportContractPdf, ContractDocumentOutput } from '@/lib/contractsExport';
import { money, todayInput, uid } from '@/lib/format';

const standardVariables = [
  'contract_number', 'contract_date', 'company_name', 'company_address', 'company_phone', 'company_email', 'company_registration',
  'signatory_name', 'signatory_title', 'client_name', 'client_phone', 'client_email', 'property_reference', 'property_title',
  'property_address', 'property_area', 'property_price', 'currency', 'owner_name', 'assigned_agent',
];

function labelFromVariable(value: string) { return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function deepTemplate(template: ContractTemplate) { return JSON.parse(JSON.stringify(template)) as ContractTemplate; }
function templateNumber() { return `EF-C-${todayInput().replace(/-/g, '')}-${String(Math.floor(Math.random() * 900) + 100)}`; }
function usedVariables(template: ContractTemplate | undefined, draft: ContractDraft) {
  if (!template) return [];
  const bodies = template.sections.map((section) => {
    if (section.type !== 'clause-group') return draft.editableSections[section.id] ?? section.body;
    const selectedId = draft.clauseSelections[section.id] || section.options[0]?.id;
    return section.options.find((option) => option.id === selectedId)?.body || '';
  });
  const matches = bodies.flatMap((body) => Array.from(body.matchAll(/{{\s*([a-zA-Z0-9_]+)\s*}}/g)).map((match) => match[1]));
  return Array.from(new Set(matches));
}

export default function ContractsModule() {
  const { state, updateState } = useDemo();
  const { showToast } = useToast();
  const activeTemplates = state.contractTemplates.filter((template) => template.active);
  const [tab, setTab] = useState<'builder' | 'templates'>('builder');
  const [draft, setDraft] = useState<ContractDraft>(() => ({
    templateId: activeTemplates[0]?.id || state.contractTemplates[0]?.id || '',
    contactId: state.contacts.find((contact) => contact.status === 'Active')?.id || '',
    propertyId: state.properties[0]?.id || '',
    contractNumber: templateNumber(),
    contractDate: todayInput(),
    customValues: {},
    clauseSelections: {},
    editableSections: {},
  }));
  const [error, setError] = useState('');
  const [exportBusy, setExportBusy] = useState(false);
  const [templateEditor, setTemplateEditor] = useState<ContractTemplate>(() => deepTemplate(state.contractTemplates[0]));
  const [variableHelp, setVariableHelp] = useState(false);

  const template = state.contractTemplates.find((item) => item.id === draft.templateId) || state.contractTemplates[0];
  const contact = state.contacts.find((item) => item.id === draft.contactId);
  const property = state.properties.find((item) => item.id === draft.propertyId);
  const unknownVariables = useMemo(() => usedVariables(template, draft).filter((variable) => !standardVariables.includes(variable)), [template, draft.clauseSelections, draft.editableSections]);
  const output = useMemo(() => buildOutput(), [draft, template, contact, property, state.company, state.contacts, state.employees]);

  function knownValues() {
    const owner = state.contacts.find((item) => item.id === property?.ownerId);
    const agent = state.employees.find((item) => item.id === property?.assignedTo);
    return {
      contract_number: draft.contractNumber,
      contract_date: draft.contractDate,
      company_name: state.company.legalName,
      company_address: state.company.address,
      company_phone: state.company.phone,
      company_email: state.company.email,
      company_registration: state.company.registrationNumber,
      signatory_name: state.company.signatoryName,
      signatory_title: state.company.signatoryTitle,
      client_name: contact?.name || '',
      client_phone: contact?.phone1 || '',
      client_email: contact?.email || '',
      property_reference: property?.reference || '',
      property_title: property?.title || '',
      property_address: property?.address || '',
      property_area: property ? String(property.area) : '',
      property_price: property ? new Intl.NumberFormat('en-US').format(property.priceFrom) : '',
      currency: property?.currency || state.company.defaultCurrency,
      owner_name: owner?.name || '',
      assigned_agent: agent?.name || '',
      ...draft.customValues,
    } as Record<string, string>;
  }

  function resolveBody(body: string) {
    const values = knownValues();
    return body.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key: string) => values[key]?.trim() || `[${labelFromVariable(key)} REQUIRED]`);
  }

  function buildOutput(): ContractDocumentOutput {
    const sections = (template?.sections || []).map((section) => {
      if (section.type === 'clause-group') {
        const selectedId = draft.clauseSelections[section.id] || section.options[0]?.id;
        const option = section.options.find((item) => item.id === selectedId);
        return { title: section.title, body: resolveBody(option?.body || '') };
      }
      if (section.type === 'editable') return { title: section.title, body: resolveBody(draft.editableSections[section.id] ?? section.body) };
      return { title: section.title, body: resolveBody(section.body) };
    });
    return { title: template?.name || 'Contract', contractNumber: draft.contractNumber, contractDate: draft.contractDate, company: state.company, sections, clientName: contact?.name || 'Client' };
  }

  function validateContract() {
    if (!template || !contact || !property) return 'Select an active template, contact, and property.';
    if (!draft.contractNumber.trim() || !draft.contractDate) return 'Contract number and contract date are required.';
    for (const section of template.sections) {
      if (section.type === 'clause-group' && section.required && !(draft.clauseSelections[section.id] || section.options[0]?.id)) return `Select an option for ${section.title}.`;
      if (section.type === 'editable' && section.required && !(draft.editableSections[section.id] ?? section.body).trim()) return `${section.title} is required.`;
    }
    const missing = unknownVariables.filter((variable) => !draft.customValues[variable]?.trim());
    if (missing.length) return `Complete the dynamic field${missing.length === 1 ? '' : 's'}: ${missing.map(labelFromVariable).join(', ')}.`;
    const unresolved = output.sections.some((section) => section.body.includes(' REQUIRED]'));
    if (unresolved) return 'One or more template variables have no value. Check the selected records and dynamic fields.';
    return '';
  }

  function prepareExport(type: 'word' | 'pdf') {
    const validation = validateContract();
    setError(validation);
    if (validation) { showToast(validation, 'error'); return; }
    if (type === 'word') { exportContractDocx(output); showToast('Word contract exported as a real .docx file.'); return; }
    setExportBusy(true);
    exportContractPdf(output).then(() => showToast('PDF contract exported with the document preview layout.')).catch(() => showToast('PDF export failed in this browser.', 'error')).finally(() => setExportBusy(false));
  }

  function selectTemplate(templateId: string) {
    const next = state.contractTemplates.find((item) => item.id === templateId);
    const clauses: Record<string, string> = {};
    const editable: Record<string, string> = {};
    next?.sections.forEach((section) => { if (section.type === 'clause-group' && section.options[0]) clauses[section.id] = section.options[0].id; if (section.type === 'editable') editable[section.id] = section.body; });
    setDraft((current) => ({ ...current, templateId, clauseSelections: clauses, editableSections: editable, customValues: {} }));
    setError('');
  }

  function saveTemplate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!templateEditor.name.trim() || !templateEditor.sections.length) { showToast('A template name and at least one section are required.', 'error'); return; }
    for (const section of templateEditor.sections) {
      if (!section.title.trim()) { showToast('Every template section needs a title.', 'error'); return; }
      if (section.type === 'clause-group' && !section.options.length) { showToast(`${section.title} needs at least one selectable clause.`, 'error'); return; }
    }
    const saved = { ...templateEditor, version: templateEditor.version + 1 };
    updateState((current) => ({ ...current, contractTemplates: current.contractTemplates.map((item) => item.id === saved.id ? saved : item) }));
    setTemplateEditor(deepTemplate(saved));
    showToast(`Template saved as version ${saved.version}.`);
  }

  function updateSection(sectionId: string, patch: Partial<ContractSection>) {
    setTemplateEditor((current) => ({ ...current, sections: current.sections.map((section) => section.id === sectionId ? { ...section, ...patch } : section) }));
  }

  function optionsToText(section: ContractSection) { return section.options.map((option) => `${option.label}|${option.body}`).join('\n'); }
  function parseOptions(value: string) { return value.split('\n').map((line) => line.trim()).filter(Boolean).map((line) => { const [label, ...body] = line.split('|'); return { id: uid('clause'), label: (label || 'Option').trim(), body: (body.join('|') || label || '').trim() }; }); }

  function moveSection(index: number, direction: -1 | 1) {
    setTemplateEditor((current) => { const sections = [...current.sections]; const target = index + direction; if (target < 0 || target >= sections.length) return current; [sections[index], sections[target]] = [sections[target], sections[index]]; return { ...current, sections }; });
  }

  return (
    <AppShell>
      <PageHeader title="Contracts" subtitle="Build professionally formatted contracts from protected text, selectable clauses, and dynamic record variables" />
      <div className="contract-tabs"><button className={tab === 'builder' ? 'active' : ''} onClick={() => setTab('builder')}><FileText size={17} />Create Contract</button><button className={tab === 'templates' ? 'active' : ''} onClick={() => setTab('templates')}><Settings2 size={17} />Template Management</button></div>

      {tab === 'builder' ? <div className="contract-builder-layout">
        <section className="contract-controls">
          <div className="panel contract-panel"><div className="section-head"><div><h2>Contract setup</h2><p>Select the approved template and connected records.</p></div><Status tone="info">Frontend demo</Status></div>
            <div className="form-grid"><label className="span-2">Contract template *<select value={draft.templateId} onChange={(event) => selectTemplate(event.target.value)}>{activeTemplates.map((item) => <option key={item.id} value={item.id}>{item.name} · v{item.version}</option>)}</select></label><label>Contract number *<input value={draft.contractNumber} onChange={(event) => setDraft((current) => ({ ...current, contractNumber: event.target.value }))} /></label><label>Contract date *<input type="date" value={draft.contractDate} onChange={(event) => setDraft((current) => ({ ...current, contractDate: event.target.value }))} /></label><label>Client / counterparty *<select value={draft.contactId} onChange={(event) => setDraft((current) => ({ ...current, contactId: event.target.value }))}>{state.contacts.filter((item) => item.status === 'Active').map((item) => <option value={item.id} key={item.id}>{item.name} · {item.types.join(', ')}</option>)}</select></label><label>Property *<select value={draft.propertyId} onChange={(event) => setDraft((current) => ({ ...current, propertyId: event.target.value }))}>{state.properties.map((item) => <option value={item.id} key={item.id}>{item.reference} — {item.title}</option>)}</select></label></div>
          </div>

          {template?.sections.some((section) => section.type === 'clause-group') && <div className="panel contract-panel"><div className="section-head"><div><h2>Approved static clauses</h2><p>Users select from text approved by the Super Admin.</p></div><LockKeyhole size={20} /></div><div className="stacked-fields">{template.sections.filter((section) => section.type === 'clause-group').map((section) => <label key={section.id}>{section.title}{section.required && ' *'}<select value={draft.clauseSelections[section.id] || section.options[0]?.id || ''} onChange={(event) => setDraft((current) => ({ ...current, clauseSelections: { ...current.clauseSelections, [section.id]: event.target.value } }))}>{section.options.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}</select><small>{section.options.find((option) => option.id === (draft.clauseSelections[section.id] || section.options[0]?.id))?.body}</small></label>)}</div></div>}

          {template?.sections.some((section) => section.type === 'editable') && <div className="panel contract-panel"><div className="section-head"><div><h2>Transaction-specific sections</h2><p>Editable only where the template explicitly permits it.</p></div></div><div className="stacked-fields">{template.sections.filter((section) => section.type === 'editable').map((section) => <label key={section.id}>{section.title}{section.required && ' *'}<textarea rows={4} value={draft.editableSections[section.id] ?? section.body} onChange={(event) => setDraft((current) => ({ ...current, editableSections: { ...current.editableSections, [section.id]: event.target.value } }))} /></label>)}</div></div>}

          {unknownVariables.length > 0 && <div className="panel contract-panel"><div className="section-head"><div><h2>Dynamic fields</h2><p>These template variables are not supplied by the selected company, client, or property records.</p></div><Variable size={20} /></div><div className="form-grid">{unknownVariables.map((variable) => <label key={variable}>{labelFromVariable(variable)} *<input value={draft.customValues[variable] || ''} onChange={(event) => setDraft((current) => ({ ...current, customValues: { ...current.customValues, [variable]: event.target.value } }))} /></label>)}</div></div>}

          {error && <div className="error-box" role="alert">{error}</div>}
          <div className="contract-export-bar"><div><strong>Export final document</strong><small>Word and PDF use the same data, branding, ordered sections, signature blocks, margins, and page numbering.</small></div><div><button className="btn secondary" onClick={() => prepareExport('word')}><FileType2 size={17} />Export Word</button><button className="btn" disabled={exportBusy} onClick={() => prepareExport('pdf')}><Download size={17} />{exportBusy ? 'Preparing PDF...' : 'Export PDF'}</button></div></div>
        </section>

        <aside className="contract-preview-wrap"><div className="preview-label"><span>A4 print preview</span><span>{template?.name}</span></div><ContractPreview output={output} /></aside>
      </div> : <form className="template-layout" onSubmit={saveTemplate}>
        <section className="template-sidebar panel"><div className="section-head"><div><h2>Templates</h2><p>Super Admin only.</p></div></div>{state.contractTemplates.map((item) => <button type="button" className={templateEditor.id === item.id ? 'template-select active' : 'template-select'} key={item.id} onClick={() => setTemplateEditor(deepTemplate(item))}><span><strong>{item.name}</strong><small>Version {item.version} · {item.sections.length} sections</small></span><Status tone={item.active ? 'good' : 'neutral'}>{item.active ? 'Active' : 'Inactive'}</Status></button>)}<button type="button" className="btn secondary wide" onClick={() => { const fresh: ContractTemplate = { id: uid('template'), name: 'New Contract Template', description: '', active: false, version: 0, sections: [{ id: uid('section'), title: '1. Parties', type: 'protected', body: 'Enter protected static text and insert variables such as {{client_name}}.', required: true, options: [] }] }; updateState((current) => ({ ...current, contractTemplates: [...current.contractTemplates, fresh] })); setTemplateEditor(deepTemplate(fresh)); }}><Plus size={16} />New Template</button></section>

        <section className="template-editor"><div className="panel contract-panel"><div className="section-head"><div><h2>Template settings</h2><p>Version {templateEditor.version}. Saving creates the next frontend version.</p></div><button type="button" className="btn secondary" onClick={() => setVariableHelp(true)}><Variable size={16} />Variable Library</button></div><div className="form-grid"><label className="span-2">Template name *<input value={templateEditor.name} onChange={(event) => setTemplateEditor((current) => ({ ...current, name: event.target.value }))} required /></label><label className="span-2">Description<textarea rows={2} value={templateEditor.description} onChange={(event) => setTemplateEditor((current) => ({ ...current, description: event.target.value }))} /></label><label className="check-line span-2"><input type="checkbox" checked={templateEditor.active} onChange={(event) => setTemplateEditor((current) => ({ ...current, active: event.target.checked }))} />Available for contract creation</label></div></div>

          <div className="template-sections">{templateEditor.sections.map((section, index) => <article className="panel template-section" key={section.id}><div className="template-section-head"><div className="section-order"><span>{index + 1}</span><div><strong>{section.title || 'Untitled section'}</strong><small>{section.type === 'protected' ? 'Protected static text' : section.type === 'clause-group' ? 'Selectable approved clauses' : 'Transaction-editable text'}</small></div></div><div className="inline-actions"><button type="button" className="icon-btn bordered" aria-label="Move section up" disabled={index === 0} onClick={() => moveSection(index, -1)}><ArrowUp size={16} /></button><button type="button" className="icon-btn bordered" aria-label="Move section down" disabled={index === templateEditor.sections.length - 1} onClick={() => moveSection(index, 1)}><ArrowDown size={16} /></button><button type="button" className="icon-btn bordered danger-text" aria-label="Remove section" disabled={templateEditor.sections.length === 1} onClick={() => setTemplateEditor((current) => ({ ...current, sections: current.sections.filter((item) => item.id !== section.id) }))}><Trash2 size={16} /></button></div></div><div className="form-grid"><label className="span-2">Section title *<input value={section.title} onChange={(event) => updateSection(section.id, { title: event.target.value })} required /></label><label>Section behavior<select value={section.type} onChange={(event) => updateSection(section.id, { type: event.target.value as ContractSection['type'], options: event.target.value === 'clause-group' && !section.options.length ? [{ id: uid('clause'), label: 'Approved option', body: 'Enter the approved clause wording.' }] : section.options })}><option value="protected">Protected static text</option><option value="clause-group">Selectable static clauses</option><option value="editable">Editable per contract</option></select></label><label className="check-line"><input type="checkbox" checked={section.required} onChange={(event) => updateSection(section.id, { required: event.target.checked })} />Required section</label>{section.type === 'clause-group' ? <label className="span-2">Approved options *<textarea rows={7} value={optionsToText(section)} onChange={(event) => updateSection(section.id, { options: parseOptions(event.target.value) })} /><small>One option per line using: Option label|Complete approved clause wording</small></label> : <label className="span-2">{section.type === 'protected' ? 'Protected wording' : 'Default editable wording'} *<textarea rows={6} value={section.body} onChange={(event) => updateSection(section.id, { body: event.target.value })} required={section.required} /><small>Insert dynamic fields with double braces, for example: {'{{client_name}}'} or {'{{deposit_amount}}'}.</small></label>}</div></article>)}</div>
          <button type="button" className="btn secondary wide add-section" onClick={() => setTemplateEditor((current) => ({ ...current, sections: [...current.sections, { id: uid('section'), title: `${current.sections.length + 1}. New Section`, type: 'protected', body: '', required: true, options: [] }] }))}><Plus size={16} />Add Section</button>
          <div className="template-save-bar"><div><strong>Ready to save?</strong><small>Static text changes and clause choices will affect future contracts using this template.</small></div><button className="btn"><Save size={17} />Save Template Version</button></div>
        </section>
      </form>}

      {variableHelp && <Modal title="Dynamic Variable Library" onClose={() => setVariableHelp(false)} wide><p className="modal-copy">Paste variables into protected, editable, or clause text. Standard variables fill from system records. Any new variable automatically becomes a required field in the contract builder.</p><div className="variable-grid">{standardVariables.map((variable) => <button key={variable} onClick={() => { navigator.clipboard?.writeText(`{{${variable}}}`); showToast(`${labelFromVariable(variable)} copied.`, 'info'); }}><Copy size={14} /><span>{`{{${variable}}}`}</span><small>{labelFromVariable(variable)}</small></button>)}</div><div className="form-note top-gap"><strong>Custom variable example:</strong> adding {'{{buyer_id_number}}'} or {'{{deposit_amount}}'} to a template creates a matching dynamic input automatically.</div></Modal>}
    </AppShell>
  );
}

function ContractPreview({ output }: { output: ContractDocumentOutput }) {
  return <article className="a4-preview"><header className="contract-letterhead"><div>{output.company.logoDataUrl ? <img src={output.company.logoDataUrl} alt={`${output.company.tradingName} logo`} /> : <span className="document-logo-fallback"><Building2 /></span>}</div><div><strong>{output.company.legalName}</strong><span>{output.company.address}</span><span>{output.company.phone} · {output.company.email}</span></div></header><div className="contract-title"><h1>{output.title}</h1><p>Contract No. {output.contractNumber} · {output.contractDate}</p></div><div className="contract-body">{output.sections.map((section, index) => <section key={`${section.title}-${index}`}><h2>{section.title}</h2><p>{section.body}</p></section>)}<section><h2>Signatures</h2><div className="signature-grid"><div><strong>For the Company</strong><span>{output.company.signatoryName}</span><span>{output.company.signatoryTitle}</span><i>Signature and date</i></div><div><strong>Client / Counterparty</strong><span>{output.clientName}</span><span>&nbsp;</span><i>Signature and date</i></div></div></section></div><footer><span>{output.contractNumber}</span><span>Page preview</span></footer></article>;
}
