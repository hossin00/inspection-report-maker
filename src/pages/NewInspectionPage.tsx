import React, { useState, useCallback } from 'react';
import { Save, ChevronLeft, ChevronRight, CheckCircle, User, Building2, MapPin, Calendar, Tag, Plus, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SeverityBadge } from '../components/ui/Badge';
import { Store } from '../store/useStore';
import { Inspection, ChecklistItem, ChecklistSection, InspectionTemplate } from '../types';
import { TEMPLATES } from '../data/templates';

type Page = 'dashboard' | 'inspections' | 'new' | 'templates' | 'settings' | 'help' | 'about';

interface Props { store: Store; editId?: string | null; onNavigate: (p: Page) => void; }

function calcScore(sections: ChecklistSection[]): number {
  const items = sections.flatMap(s => s.items).filter(i => i.status !== 'na' && i.status !== 'pending');
  if (!items.length) return 0;
  const weights: Record<string, number> = { critical: 3, major: 2, minor: 1, pass: 1 };
  const totalW = items.reduce((s, i) => s + (weights[i.severity] || 1), 0);
  const passW = items.filter(i => i.status === 'pass').reduce((s, i) => s + (weights[i.severity] || 1), 0);
  return Math.round((passW / totalW) * 100);
}

function makeId() { return Math.random().toString(36).slice(2, 10); }

function sectionsFromTemplate(tpl: InspectionTemplate): ChecklistSection[] {
  return tpl.sections.map(s => ({
    id: s.id,
    title: s.title,
    items: s.items.map(item => ({
      id: makeId(),
      label: item.label,
      severity: item.severity,
      status: 'pending' as const,
      notes: '',
      photoPlaceholder: item.photoPlaceholder,
    }))
  }));
}

export function NewInspectionPage({ store, editId, onNavigate }: Props) {
  const existing = editId ? store.getInspection(editId) : null;

  const [step, setStep] = useState<'template' | 'info' | 'checklist' | 'sign'>(!existing ? 'template' : 'checklist');
  const [selectedTemplate, setSelectedTemplate] = useState<InspectionTemplate | null>(
    existing ? TEMPLATES.find(t => t.id === existing.templateId) ?? null : null
  );
  const [form, setForm] = useState({
    title: existing?.title ?? '',
    location: existing?.location ?? '',
    inspector: existing?.inspector ?? store.settings.inspectorName,
    client: existing?.client ?? '',
    date: existing?.date ?? new Date().toISOString().split('T')[0],
    overallNotes: existing?.overallNotes ?? '',
    tags: existing?.tags ?? [] as string[],
  });
  const [sections, setSections] = useState<ChecklistSection[]>(
    existing?.sections ?? []
  );
  const [tagInput, setTagInput] = useState('');
  const [inspSig, setInspSig] = useState(existing?.signatures.inspector ?? { name: store.settings.inspectorName, role: 'Inspector', date: '', captured: false });
  const [clientSig, setClientSig] = useState(existing?.signatures.client ?? { name: '', role: 'Client', date: '', captured: false });
  const [saved, setSaved] = useState(false);

  const handleSelectTemplate = (tpl: InspectionTemplate) => {
    setSelectedTemplate(tpl);
    setSections(sectionsFromTemplate(tpl));
    setForm(f => ({ ...f, title: f.title || `${tpl.name} – ${new Date().toLocaleDateString()}` }));
    setStep('info');
  };

  const setItemStatus = useCallback((secId: string, itemId: string, status: ChecklistItem['status']) => {
    setSections(prev => prev.map(s => s.id !== secId ? s : {
      ...s, items: s.items.map(i => i.id !== itemId ? i : { ...i, status })
    }));
  }, []);

  const setItemNotes = useCallback((secId: string, itemId: string, notes: string) => {
    setSections(prev => prev.map(s => s.id !== secId ? s : {
      ...s, items: s.items.map(i => i.id !== itemId ? i : { ...i, notes })
    }));
  }, []);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) { setForm(f => ({ ...f, tags: [...f.tags, t] })); }
    setTagInput('');
  };

  const handleSave = (status: Inspection['status'] = 'in_progress') => {
    const score = calcScore(sections);
    const insp: Inspection = {
      id: existing?.id ?? makeId(),
      title: form.title || selectedTemplate?.name + ' ' + form.date,
      type: selectedTemplate?.type ?? 'Custom',
      templateId: selectedTemplate?.id ?? '',
      location: form.location,
      inspector: form.inspector,
      client: form.client,
      date: form.date,
      status,
      sections,
      overallNotes: form.overallNotes,
      tags: form.tags,
      score,
      signatures: { inspector: inspSig, client: clientSig },
    };
    if (existing) store.updateInspection(insp);
    else store.addInspection(insp);
    setSaved(true);
    setTimeout(() => onNavigate('inspections'), 800);
  };

  const statusCounts = sections.flatMap(s => s.items).reduce(
    (acc, i) => { acc[i.status] = (acc[i.status] || 0) + 1; return acc; },
    {} as Record<string, number>
  );

  if (saved) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Saved!</h2>
        <p className="text-gray-500 mt-2">Redirecting to inspections…</p>
      </div>
    </div>
  );

  const steps = [
    { id: 'template', label: 'Template' },
    { id: 'info',     label: 'Details' },
    { id: 'checklist',label: 'Checklist' },
    { id: 'sign',     label: 'Sign & Save' },
  ];
  const stepIdx = steps.findIndex(s => s.id === step);

  return (
    <div className="p-6 max-w-4xl space-y-5">
      {/* Steps */}
      <div className="flex items-center gap-0">
        {steps.map((s, idx) => (
          <React.Fragment key={s.id}>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
              s.id === step ? 'bg-brand-600 text-white' :
              idx < stepIdx ? 'text-green-600' : 'text-gray-400'
            }`}>
              {idx < stepIdx ? <CheckCircle size={14}/> : <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs">{idx+1}</span>}
              {s.label}
            </div>
            {idx < steps.length - 1 && <div className={`h-px flex-1 ${idx < stepIdx ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'}`}/>}
          </React.Fragment>
        ))}
      </div>

      {/* Template selection */}
      {step === 'template' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Choose a template</h2>
          <p className="text-sm text-gray-500 mb-5">Select the type of inspection you want to conduct.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TEMPLATES.map(tpl => (
              <button key={tpl.id} onClick={() => handleSelectTemplate(tpl)}
                className="text-left bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-brand-500 rounded-2xl p-6 transition-all group">
                <div className="text-3xl mb-3">{tpl.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{tpl.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tpl.description}</p>
                <p className="text-xs text-gray-400 mt-3">{tpl.sections.reduce((s, sec) => s + sec.items.length, 0)} checklist items</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Info step */}
      {step === 'info' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Inspection Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Title', key: 'title', icon: Building2, placeholder: 'e.g. Unit 4B – Move-in' },
              { label: 'Location', key: 'location', icon: MapPin, placeholder: 'e.g. 12 Riverside Drive' },
              { label: 'Inspector', key: 'inspector', icon: User, placeholder: 'Your name' },
              { label: 'Client / Site', key: 'client', icon: Building2, placeholder: 'Client or site name' },
            ].map(({ label, key, icon: Icon, placeholder }) => (
              <div key={key}>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  <Icon size={14} />{label}
                </label>
                <input value={form[key as keyof typeof form] as string}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
            ))}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                <Calendar size={14} />Date
              </label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                <Tag size={14} />Tags
              </label>
              <div className="flex gap-2">
                <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTag()}
                  placeholder="Add tag…"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                <Button size="sm" variant="secondary" onClick={addTag} icon={<Plus size={14}/>}>Add</Button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.tags.map(t => (
                    <span key={t} className="inline-flex items-center gap-1 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 text-xs px-2.5 py-1 rounded-full">
                      {t}<button onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }))}><X size={10}/></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setStep('template')} icon={<ChevronLeft size={16}/>}>Back</Button>
            <Button onClick={() => setStep('checklist')} icon={<ChevronRight size={16}/>}>Continue to Checklist</Button>
          </div>
        </div>
      )}

      {/* Checklist step */}
      {step === 'checklist' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Complete Checklist</h2>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span className="text-green-600">✓ {statusCounts.pass || 0} pass</span>
                <span className="text-red-500">✗ {statusCounts.fail || 0} fail</span>
                <span className="text-gray-400">— {statusCounts.na || 0} N/A</span>
                <span className="text-yellow-500">? {statusCounts.pending || 0} pending</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Current score</p>
              <p className="text-2xl font-bold text-brand-600">{calcScore(sections)}%</p>
            </div>
          </div>

          {sections.map(sec => (
            <div key={sec.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{sec.title}</h3>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {sec.items.map(item => (
                  <div key={item.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm text-gray-800 dark:text-gray-200">{item.label}</span>
                          <SeverityBadge severity={item.severity} />
                          {item.photoPlaceholder && (
                            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">📷 Photo note</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        {(['pass','fail','na'] as const).map(s => (
                          <button key={s} onClick={() => setItemStatus(sec.id, item.id, s)}
                            className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
                              item.status === s
                                ? s === 'pass' ? 'bg-green-500 text-white' : s === 'fail' ? 'bg-red-500 text-white' : 'bg-gray-400 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-gray-200'
                            }`}>
                            {s === 'pass' ? '✓' : s === 'fail' ? '✗' : '—'}
                          </button>
                        ))}
                      </div>
                    </div>
                    {item.status === 'fail' && (
                      <input value={item.notes} onChange={e => setItemNotes(sec.id, item.id, e.target.value)}
                        placeholder="Add note about this issue…"
                        className="mt-2.5 w-full px-3 py-2 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-800 dark:text-gray-200" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Overall Notes</label>
            <textarea value={form.overallNotes} onChange={e => setForm(f => ({ ...f, overallNotes: e.target.value }))}
              rows={3} placeholder="Summary notes, recommendations…"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep('info')} icon={<ChevronLeft size={16}/>}>Back</Button>
            <Button variant="secondary" onClick={() => handleSave('draft')} icon={<Save size={16}/>}>Save Draft</Button>
            <Button onClick={() => setStep('sign')} icon={<ChevronRight size={16}/>}>Continue to Sign</Button>
          </div>
        </div>
      )}

      {/* Sign step */}
      {step === 'sign' && (
        <div className="space-y-5">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Signatures</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: 'Inspector Signature', sig: inspSig, setSig: setInspSig },
                { label: 'Client / Tenant Signature', sig: clientSig, setSig: setClientSig },
              ].map(({ label, sig, setSig }) => (
                <div key={label} className="space-y-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
                  <input value={sig.name} onChange={e => setSig(s => ({ ...s, name: e.target.value }))}
                    placeholder="Full name" className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  <input value={sig.role} onChange={e => setSig(s => ({ ...s, role: e.target.value }))}
                    placeholder="Role / Title" className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  <input type="date" value={sig.date} onChange={e => setSig(s => ({ ...s, date: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  <div className={`h-24 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors ${
                    sig.captured ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-brand-400'
                  }`} onClick={() => setSig(s => ({ ...s, captured: !s.captured, date: s.date || new Date().toISOString().split('T')[0] }))}>
                    {sig.captured ? (
                      <div className="text-center">
                        <CheckCircle size={24} className="text-green-500 mx-auto" />
                        <p className="text-xs text-green-600 mt-1">Signature captured ✓</p>
                        <p className="text-xs text-gray-400">(click to remove)</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">Click to mark signature captured</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Score summary */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Summary</h3>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-brand-600">{calcScore(sections)}%</p>
                <p className="text-xs text-gray-400 mt-1">Score</p>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-3 text-center text-sm">
                <div><p className="text-green-600 font-semibold">{statusCounts.pass||0}</p><p className="text-gray-400 text-xs">Pass</p></div>
                <div><p className="text-red-500 font-semibold">{statusCounts.fail||0}</p><p className="text-gray-400 text-xs">Fail</p></div>
                <div><p className="text-gray-500 font-semibold">{statusCounts.na||0}</p><p className="text-gray-400 text-xs">N/A</p></div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep('checklist')} icon={<ChevronLeft size={16}/>}>Back</Button>
            <Button variant="secondary" onClick={() => handleSave('completed')} icon={<Save size={16}/>}>Save as Completed</Button>
            <Button onClick={() => handleSave('signed')} icon={<CheckCircle size={16}/>}>Save as Signed</Button>
          </div>
        </div>
      )}
    </div>
  );
}
