import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const articles = [
  { q: 'How do I create my first inspection?', a: 'Click "New Inspection" in the sidebar. Choose a template (Property, Equipment, Cleaning, or Vehicle), fill in the details, then go through the checklist marking each item as Pass, Fail, or N/A. Add notes for any failures, then proceed to the Sign & Save step.' },
  { q: 'What do the severity levels mean?', a: 'Critical – Safety-critical items that require immediate action. Major – Significant issues that should be addressed soon. Minor – Small issues or cosmetic defects that should be noted.' },
  { q: 'How is the inspection score calculated?', a: 'The score weighs each item by severity: Critical items count 3x, Major items 2x, Minor items 1x. The score is the percentage of weighted points that passed out of the total non-N/A items.' },
  { q: 'Can I add my own notes to failed items?', a: 'Yes. When you mark an item as Fail, a notes field appears automatically where you can describe the issue in detail.' },
  { q: 'What is the Sample Workspace?', a: 'The Sample Workspace loads 3 pre-filled inspections to help you understand how the app works. Sample data is clearly labelled with a "Sample" badge and can be removed from Settings at any time.' },
  { q: 'How do I delete sample data?', a: 'Go to Settings → Sample Workspace → Remove Sample Data. Alternatively, delete individual inspections from the Inspections page.' },
  { q: 'Can I edit a completed inspection?', a: 'Yes. Click the Edit button on any inspection to reopen the full wizard and make changes.' },
  { q: 'Is my data private?', a: 'Yes. All data is stored locally on your device. Nothing is sent to external servers. This is a fully local, privacy-first app.' },
];

export function HelpPage() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Help & Guide</h2>
        <p className="text-sm text-gray-500">Frequently asked questions about Inspection Report Maker.</p>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-50 dark:divide-gray-800">
        {articles.map((a, i) => (
          <div key={i}>
            <button onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{a.q}</span>
              {open === i ? <ChevronDown size={16} className="text-gray-400 flex-shrink-0"/> : <ChevronRight size={16} className="text-gray-400 flex-shrink-0"/>}
            </button>
            {open === i && (
              <div className="px-5 pb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{a.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
