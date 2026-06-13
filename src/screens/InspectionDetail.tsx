import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Download, CheckCircle, Plus, Trash2, PenTool, Camera } from 'lucide-react';
import { Inspection, ChecklistItem, Severity, InspectionStatus } from '../types';
import { SeverityBadge, StatusBadge, ConfirmModal } from '../components/UI';
import { saveInspection, generateId, getTemplates } from '../utils/storage';
import { exportInspectionPDF } from '../utils/exportPDF';
import { Template } from '../types';

interface Props {
  inspection: Inspection | null;
  templates: Template[];
  onBack: () => void;
  onSaved: () => void;
}

const SEVERITY_OPTS: Severity[] = ['pass','minor','major','critical','na'];
const SEVERITY_COLORS: Record<Severity,string> = {
  pass: 'bg-green-100 text-green-800 border-green-200',
  minor: 'bg-amber-100 text-amber-800 border-amber-200',
  major: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200',
  na: 'bg-slate-100 text-slate-600 border-slate-200',
};

function newInspection(templates: Template[]): Inspection {
  const tpl = templates[0] || null;
  return {
    id: generateId('insp'),
    title: '',
    templateId: tpl?.id || '',
    templateName: tpl?.name || '',
    location: '',
    clientName: '',
    clientEmail: '',
    inspectorName: '',
    date: new Date().toISOString().slice(0,10),
    status: 'draft',
    sections: tpl ? JSON.parse(JSON.stringify(tpl.sections)) : [],
    overallNotes: '',
    signature: '',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export default function InspectionDetail({ inspection: initialInsp, templates, onBack, onSaved }: Props) {
  const [insp, setInsp] = useState<Inspection>(() => initialInsp || newInspection(templates));
  const [activeTab, setActiveTab] = useState<'details'|'checklist'|'signature'|'report'>('details');
  const [showSignatureField, setShowSignatureField] = useState(false);
  const [unsaved, setUnsaved] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const isNew = !initialInsp;

  function update(partial: Partial<Inspection>) {
    setInsp(prev => ({ ...prev, ...partial, updatedAt: Date.now() }));
    setUnsaved(true);
  }

  function handleTemplateChange(templateId: string) {
    const tpl = templates.find(t => t.id === templateId);
    if (!tpl) return;
    update({ templateId, templateName: tpl.name, sections: JSON.parse(JSON.stringify(tpl.sections)) });
  }

  function updateItem(sectionId: string, itemId: string, partial: Partial<ChecklistItem>) {
    const sections = insp.sections.map(sec => {
      if (sec.id !== sectionId) return sec;
      return { ...sec, items: sec.items.map(item => item.id === itemId ? { ...item, ...partial } : item) };
    });
    update({ sections });
  }

  function addItem(sectionId: string) {
    const sections = insp.sections.map(sec => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        items: [...sec.items, { id: generateId('item'), label: 'New checklist item', severity: 'na' as Severity, notes: '', photoPlaceholder: false }]
      };
    });
    update({ sections });
  }

  function removeItem(sectionId: string, itemId: string) {
    const sections = insp.sections.map(sec => {
      if (sec.id !== sectionId) return sec;
      return { ...sec, items: sec.items.filter(i => i.id !== itemId) };
    });
    update({ sections });
  }

  function handleSave(newStatus?: InspectionStatus) {
    const toSave = { ...insp, status: newStatus || insp.status, updatedAt: Date.now() };
    saveInspection(toSave);
    setInsp(toSave);
    setUnsaved(false);
    onSaved();
  }

  function handleBack() {
    if (unsaved) { setShowLeaveConfirm(true); }
    else onBack();
  }

  const allItems = insp.sections.flatMap(s => s.items);
  const passCount = allItems.filter(i => i.severity === 'pass').length;
  const issueCount = allItems.filter(i => ['minor','major','critical'].includes(i.severity)).length;
  const criticalCount = allItems.filter(i => i.severity === 'critical').length;

  const tabs = [
    { key: 'details', label: 'Details' },
    { key: 'checklist', label: `Checklist (${allItems.length})` },
    { key: 'signature', label: 'Signature' },
    { key: 'report', label: 'Summary' },
  ] as const;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={handleBack} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
          <ArrowLeft size={18}/>
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-700 text-slate-900 dark:text-white">
            {insp.title || (isNew ? 'New Inspection' : 'Untitled Inspection')}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={insp.status}/>
            {unsaved && <span className="text-xs text-amber-600 dark:text-amber-400">● Unsaved changes</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportInspectionPDF(insp)}
            className="px-3 py-2 text-sm font-500 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5"
          >
            <Download size={15}/> PDF
          </button>
          <button
            onClick={() => handleSave()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-600 transition-colors"
          >
            <Save size={15}/> Save
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 dark:bg-slate-700/50 rounded-xl p-1">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex-1 py-2 text-sm font-500 rounded-lg transition-colors ${activeTab===t.key ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Details Tab ── */}
      {activeTab === 'details' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-600 text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Inspection Title *</label>
              <input
                value={insp.title}
                onChange={e => update({ title: e.target.value })}
                placeholder="e.g. Unit 4B Move-In Inspection"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-600 text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Template</label>
              <select
                value={insp.templateId}
                onChange={e => handleTemplateChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">— Select template —</option>
                {templates.map(t => <option key={t.id} value={t.id}>{t.name}{t.isSample?' (sample)':''}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-600 text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Date</label>
              <input
                type="date"
                value={insp.date}
                onChange={e => update({ date: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-600 text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Location</label>
              <input
                value={insp.location}
                onChange={e => update({ location: e.target.value })}
                placeholder="Site address or location"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-600 text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Inspector Name</label>
              <input
                value={insp.inspectorName}
                onChange={e => update({ inspectorName: e.target.value })}
                placeholder="Your name"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-600 text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Client Name</label>
              <input
                value={insp.clientName}
                onChange={e => update({ clientName: e.target.value })}
                placeholder="Client or company name"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-600 text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Client Email</label>
              <input
                value={insp.clientEmail}
                onChange={e => update({ clientEmail: e.target.value })}
                placeholder="client@example.com"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-600 text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Status</label>
              <select
                value={insp.status}
                onChange={e => update({ status: e.target.value as InspectionStatus })}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="signed">Signed</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-600 text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Overall Notes</label>
              <textarea
                value={insp.overallNotes}
                onChange={e => update({ overallNotes: e.target.value })}
                placeholder="General observations or summary notes..."
                rows={3}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Checklist Tab ── */}
      {activeTab === 'checklist' && (
        <div className="space-y-4">
          {insp.sections.length === 0 && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-300">
              No checklist loaded. Select a template in the Details tab to populate the checklist.
            </div>
          )}
          {insp.sections.map(sec => (
            <div key={sec.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="px-5 py-3.5 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
                <h3 className="font-600 text-blue-900 dark:text-blue-300 text-sm">{sec.title}</h3>
                <span className="text-xs text-blue-600 dark:text-blue-400">{sec.items.length} items</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {sec.items.map(item => (
                  <div key={item.id} className="px-5 py-3.5">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <input
                          value={item.label}
                          onChange={e => updateItem(sec.id, item.id, { label: e.target.value })}
                          className="w-full bg-transparent text-sm font-500 text-slate-900 dark:text-white focus:outline-none border-b border-transparent hover:border-slate-200 dark:hover:border-slate-600 focus:border-blue-400"
                        />
                        <input
                          value={item.notes}
                          onChange={e => updateItem(sec.id, item.id, { notes: e.target.value })}
                          placeholder="Add notes..."
                          className="w-full bg-transparent text-xs text-slate-500 dark:text-slate-400 mt-1 focus:outline-none placeholder-slate-400"
                        />
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex gap-1">
                          {SEVERITY_OPTS.map(s => (
                            <button
                              key={s}
                              onClick={() => updateItem(sec.id, item.id, { severity: s })}
                              className={`text-xs px-2 py-1 rounded-lg border font-500 transition-all ${item.severity===s ? SEVERITY_COLORS[s] : 'bg-transparent text-slate-400 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                            >
                              {s==='pass'?'✓':s==='na'?'N/A':s.charAt(0).toUpperCase()+s.slice(1)}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => removeItem(sec.id, item.id)}
                          className="p-1 text-slate-300 hover:text-red-500 rounded"
                        >
                          <Trash2 size={13}/>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => addItem(sec.id)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-500 flex items-center gap-1"
                >
                  <Plus size={12}/> Add item
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Signature Tab ── */}
      {activeTab === 'signature' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="font-600 text-slate-900 dark:text-white mb-2">Client Signature</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
            Ask the client to type their full name as their signature confirmation.
          </p>
          <label className="block text-xs font-600 text-slate-500 uppercase tracking-wide mb-1.5">Full Name (Signature)</label>
          <input
            value={insp.signature}
            onChange={e => update({ signature: e.target.value })}
            placeholder="Client types their name here..."
            className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-serif text-xl italic"
          />
          {insp.signature && (
            <div className="mt-5 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Preview:</p>
              <p className="font-serif text-2xl italic text-slate-800 dark:text-white">{insp.signature}</p>
              <p className="text-xs text-slate-400 mt-1">Signed: {insp.date}</p>
            </div>
          )}
          {insp.signature && (
            <button
              onClick={() => handleSave('signed')}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-600 flex items-center gap-2"
            >
              <CheckCircle size={16}/> Mark as Signed & Save
            </button>
          )}
        </div>
      )}

      {/* ── Summary Tab ── */}
      {activeTab === 'report' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label:'Passed', value:passCount, color:'text-green-600', bg:'bg-green-50 dark:bg-green-900/20' },
              { label:'Issues', value:issueCount, color:'text-amber-600', bg:'bg-amber-50 dark:bg-amber-900/20' },
              { label:'Critical', value:criticalCount, color:'text-red-600', bg:'bg-red-50 dark:bg-red-900/20' },
              { label:'Total', value:allItems.length, color:'text-slate-700 dark:text-slate-300', bg:'bg-slate-50 dark:bg-slate-800' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center border border-slate-200 dark:border-slate-700`}>
                <p className={`text-3xl font-700 ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {insp.sections.map(sec => {
            const sectionIssues = sec.items.filter(i=>['minor','major','critical'].includes(i.severity));
            return (
              <div key={sec.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="px-5 py-3 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="font-600 text-sm text-slate-900 dark:text-white">{sec.title}</span>
                  <span className={`text-xs font-500 ${sectionIssues.length>0?'text-amber-600':'text-green-600'}`}>
                    {sectionIssues.length > 0 ? `${sectionIssues.length} issue${sectionIssues.length>1?'s':''}` : 'All clear'}
                  </span>
                </div>
                {sectionIssues.length > 0 && (
                  <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {sectionIssues.map(item => (
                      <div key={item.id} className="px-5 py-3 flex items-start gap-3">
                        <SeverityBadge severity={item.severity}/>
                        <div>
                          <p className="text-sm text-slate-900 dark:text-white">{item.label}</p>
                          {item.notes && <p className="text-xs text-slate-500 mt-0.5">{item.notes}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <button
            onClick={() => exportInspectionPDF(insp)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-600 flex items-center justify-center gap-2"
          >
            <Download size={16}/> Export Professional PDF Report
          </button>
        </div>
      )}

      {showLeaveConfirm && (
        <ConfirmModal
          title="Unsaved Changes"
          message="You have unsaved changes. Do you want to discard them and go back?"
          onConfirm={() => { setShowLeaveConfirm(false); onBack(); }}
          onCancel={() => setShowLeaveConfirm(false)}
          danger
        />
      )}
    </div>
  );
}
