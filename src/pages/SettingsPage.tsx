import React, { useState } from 'react';
import { Save, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Store } from '../store/useStore';

export function SettingsPage({ store }: { store: Store }) {
  const [form, setForm] = useState({ ...store.settings });
  const [saved, setSaved] = useState(false);

  const save = () => {
    store.updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>

      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Workspace</h3>
        {[
          { label: 'Company / Organisation', key: 'companyName', placeholder: 'Your company name' },
          { label: 'Default Inspector Name', key: 'inspectorName', placeholder: 'Your full name' },
        ].map(({ label, key, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">{label}</label>
            <input value={form[key as keyof typeof form] as string}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              placeholder={placeholder}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Theme</label>
          <select value={form.theme} onChange={e => setForm(f => ({ ...f, theme: e.target.value as any }))}
            className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none">
            <option value="system">System (auto)</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <Button onClick={save} icon={<Save size={16}/>} className={saved ? 'bg-green-600 hover:bg-green-600' : ''}>
          {saved ? 'Saved ✓' : 'Save Settings'}
        </Button>
      </section>

      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Sample Workspace</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Sample data is clearly labelled and never mixed with your real inspections.</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={store.loadSampleData} icon={<Sparkles size={16}/>}>
            {store.stats.hasSample ? 'Reload Sample Data' : 'Load Sample Data'}
          </Button>
          {store.stats.hasSample && (
            <Button variant="danger" onClick={store.clearSampleData} icon={<Trash2 size={16}/>}>Remove Sample Data</Button>
          )}
        </div>
      </section>

      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">About this app</h3>
        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
          <p>Inspection Report Maker · Version 1.0</p>
          <p>One-time paid Microsoft Store app</p>
          <p className="text-green-600">✓ Fully unlocked · No subscription · No hidden fees</p>
        </div>
      </section>
    </div>
  );
}
