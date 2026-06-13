import { useState } from 'react';
import { Save, Download, Upload, Trash2, RefreshCw, Moon, Sun, Info, HelpCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { AppSettings } from '../types';
import { saveSettings, exportAllData, importData, loadSampleWorkspace, clearSampleWorkspace, getWorkspaceMode } from '../utils/storage';
import { ConfirmModal, Toast } from '../components/UI';

// ── Settings ───────────────────────────────────────────────
interface SettingsProps {
  settings: AppSettings;
  onSaved: (s: AppSettings) => void;
}

export function Settings({ settings: initial, onSaved }: SettingsProps) {
  const [s, setS] = useState<AppSettings>(initial);
  const [toast, setToast] = useState<{msg:string;type:'success'|'error'}|null>(null);
  const [showClearSample, setShowClearSample] = useState(false);
  const [showReloadSample, setShowReloadSample] = useState(false);
  const isSampleMode = getWorkspaceMode() === 'sample';

  function saveAll() {
    saveSettings(s);
    onSaved(s);
    setToast({ msg: 'Settings saved.', type: 'success' });
  }

  function handleImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      const result = importData(text);
      setToast({ msg: result.message, type: result.ok ? 'success' : 'error' });
      if (result.ok) onSaved(s);
    };
    input.click();
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-700 text-slate-900 dark:text-white mb-6">Settings</h1>

      {/* Company Info */}
      <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 mb-4">
        <h2 className="font-600 text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wide">Company Information</h2>
        <div className="space-y-4">
          {[
            { key:'companyName', label:'Company Name', placeholder:'Your company or trading name' },
            { key:'companyEmail', label:'Contact Email', placeholder:'contact@yourcompany.com' },
            { key:'companyPhone', label:'Phone Number', placeholder:'+1 555 000 0000' },
            { key:'defaultInspector', label:'Default Inspector Name', placeholder:'Appears on new inspections' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-600 text-slate-500 dark:text-slate-400 mb-1">{f.label}</label>
              <input
                value={(s as any)[f.key]}
                onChange={e => setS(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Appearance */}
      <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 mb-4">
        <h2 className="font-600 text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wide">Appearance</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setS(p => ({ ...p, theme: 'light' }))}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-500 transition-colors ${s.theme==='light' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400'}`}
          >
            <Sun size={16}/> Light
          </button>
          <button
            onClick={() => setS(p => ({ ...p, theme: 'dark' }))}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-500 transition-colors ${s.theme==='dark' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400'}`}
          >
            <Moon size={16}/> Dark
          </button>
        </div>
      </section>

      {/* Data */}
      <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 mb-4">
        <h2 className="font-600 text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wide">Data & Backup</h2>
        <div className="space-y-3">
          <button onClick={exportAllData} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-left">
            <Download className="text-blue-600" size={18}/>
            <div>
              <p className="text-sm font-500 text-slate-900 dark:text-white">Export Backup</p>
              <p className="text-xs text-slate-500">Save all your real data as a JSON file</p>
            </div>
          </button>
          <button onClick={handleImport} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-left">
            <Upload className="text-green-600" size={18}/>
            <div>
              <p className="text-sm font-500 text-slate-900 dark:text-white">Import Backup</p>
              <p className="text-xs text-slate-500">Restore from a previous backup file</p>
            </div>
          </button>
        </div>
      </section>

      {/* Sample Workspace */}
      <section className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-5 mb-4">
        <h2 className="font-600 text-violet-900 dark:text-violet-300 mb-1 text-sm uppercase tracking-wide">Sample Workspace</h2>
        <p className="text-xs text-violet-700 dark:text-violet-400 mb-4">Manage the demo inspections and templates loaded at setup.</p>
        <div className="space-y-2">
          <button onClick={() => setShowReloadSample(true)} className="w-full flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/30 text-left border border-violet-100 dark:border-violet-800">
            <RefreshCw className="text-violet-600" size={16}/>
            <div>
              <p className="text-sm font-500 text-slate-900 dark:text-white">Reload Sample Data</p>
              <p className="text-xs text-slate-500">Restore sample inspections and templates</p>
            </div>
          </button>
          <button onClick={() => setShowClearSample(true)} className="w-full flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-left border border-violet-100 dark:border-violet-800">
            <Trash2 className="text-red-500" size={16}/>
            <div>
              <p className="text-sm font-500 text-slate-900 dark:text-white">Clear Sample Data</p>
              <p className="text-xs text-slate-500">Remove all sample-labeled inspections and templates</p>
            </div>
          </button>
        </div>
      </section>

      <button
        onClick={saveAll}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-600 flex items-center justify-center gap-2"
      >
        <Save size={16}/> Save Settings
      </button>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)}/>}

      {showClearSample && (
        <ConfirmModal
          title="Clear Sample Data"
          message="All sample inspections and templates will be removed. Your real data is not affected."
          danger
          onConfirm={() => { clearSampleWorkspace(); setShowClearSample(false); onSaved(s); setToast({msg:'Sample data cleared.',type:'success'}); }}
          onCancel={() => setShowClearSample(false)}
        />
      )}
      {showReloadSample && (
        <ConfirmModal
          title="Reload Sample Data"
          message="Sample inspections and templates will be reloaded. Existing sample items will be replaced."
          onConfirm={() => { loadSampleWorkspace(); setShowReloadSample(false); onSaved(s); setToast({msg:'Sample data reloaded.',type:'success'}); }}
          onCancel={() => setShowReloadSample(false)}
        />
      )}
    </div>
  );
}

// ── Help ───────────────────────────────────────────────────
export function Help() {
  const [open, setOpen] = useState<string|null>('start');

  const articles = [
    { id: 'start', title: 'Getting started', content: 'Create your first inspection by clicking "New Inspection" from the Dashboard or Inspections screen. Fill in the location, client, and date. Then select a template or build your own. Go to the Checklist tab to rate each item, add notes, and flag issues. When done, export a professional PDF from the Summary tab.' },
    { id: 'templates', title: 'Using and creating templates', content: 'Templates save your checklist structure so you can reuse it across multiple inspections. Go to Templates → New Template. Add sections (e.g. "Exterior", "Kitchen") and items to each section. When creating an inspection, select your template and the checklist is automatically populated.' },
    { id: 'severity', title: 'Severity ratings explained', content: 'Pass — item is in good condition. Minor — small issue, low priority. Major — significant issue requiring attention. Critical — immediate action required, safety or functionality risk. N/A — item does not apply to this inspection.' },
    { id: 'export', title: 'Exporting PDF reports', content: 'Open any inspection and go to the Summary tab, then click "Export Professional PDF Report". The report opens in a print dialog — choose your printer or save as PDF. The report includes all checklist findings, severity ratings, notes, and the client signature if signed.' },
    { id: 'signature', title: 'Getting client signatures', content: 'In the Inspection editor, go to the Signature tab. Ask your client to type their full name in the signature field. Click "Mark as Signed & Save". The signature appears on the exported PDF with the inspection date.' },
    { id: 'sample', title: 'About sample data', content: 'Sample inspections and templates are loaded to help you explore the app. They are clearly labeled with a "Sample" badge. Your real data is stored separately. You can remove sample data from Settings → Sample Workspace → Clear Sample Data. Sample data can be reloaded from Settings at any time.' },
    { id: 'backup', title: 'Backup and restore', content: 'Go to Settings → Export Backup to save all your real data as a JSON file. To restore, go to Settings → Import Backup and select your backup file. Your data is stored locally on this device and never sent to any server.' },
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="text-blue-600" size={24}/>
        <h1 className="text-2xl font-700 text-slate-900 dark:text-white">Help & Guide</h1>
      </div>
      <div className="space-y-2">
        {articles.map(a => (
          <div key={a.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button
              onClick={() => setOpen(open === a.id ? null : a.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <span className="font-500 text-slate-900 dark:text-white text-sm">{a.title}</span>
              {open === a.id ? <ChevronDown className="text-slate-400" size={16}/> : <ChevronRight className="text-slate-400" size={16}/>}
            </button>
            {open === a.id && (
              <div className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-3">
                {a.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── About Pro ──────────────────────────────────────────────
export function About() {
  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Info className="text-blue-600" size={24}/>
        <h1 className="text-2xl font-700 text-slate-900 dark:text-white">About This App</h1>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-4">
        <h2 className="font-700 text-lg text-slate-900 dark:text-white mb-1">Inspection Report Maker</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Version 1.0</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Create professional inspection reports with custom checklists, severity ratings, client signatures, and PDF export. Built for property managers, equipment inspectors, cleaning supervisors, and safety auditors.
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 mb-4">
        <h3 className="font-600 text-blue-900 dark:text-blue-300 mb-3">What's Included</h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
          {[
            'Unlimited inspections — no monthly limits',
            'Unlimited custom templates',
            'PDF report export',
            'CSV export for reporting',
            'Client signature capture',
            'Dark mode',
            'Local-first — data stays on your device',
            'Backup and restore',
            'All future updates included',
          ].map(item => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">✓</span> {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5 mb-4">
        <h3 className="font-600 text-green-900 dark:text-green-300 mb-2">One-Time Purchase</h3>
        <p className="text-sm text-green-800 dark:text-green-400">
          This is a one-time paid Microsoft Store app. No subscription. No hidden fees. Fully unlocked after purchase. Your payment supports continued development.
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 text-xs text-slate-500 dark:text-slate-400">
        <p className="font-600 mb-1">Disclaimer</p>
        <p>This app is a reporting and organization tool. Reports generated are for informational purposes only. This app does not provide legal, medical, structural, safety compliance, or professional certification services.</p>
      </div>
    </div>
  );
}
