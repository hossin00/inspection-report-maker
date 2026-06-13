import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { TEMPLATES } from '../data/templates';

type Page = 'dashboard' | 'inspections' | 'new' | 'templates' | 'settings' | 'help' | 'about';
interface Props { onNavigate: (p: Page) => void; }

export function TemplatesPage({ onNavigate }: Props) {
  return (
    <div className="p-6 max-w-5xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Inspection Templates</h2>
        <p className="text-sm text-gray-500">Choose a template to start a new inspection. Each template includes professional checklist items tailored to the industry.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {TEMPLATES.map(tpl => (
          <div key={tpl.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/20 rounded-xl flex items-center justify-center text-2xl">{tpl.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{tpl.name}</h3>
                  <p className="text-xs text-gray-400">{tpl.sections.reduce((s, sec) => s + sec.items.length, 0)} items · {tpl.sections.length} sections</p>
                </div>
              </div>
              <Button size="sm" onClick={() => onNavigate('new')} icon={<Plus size={14}/>}>Use</Button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{tpl.description}</p>
            <div className="space-y-2">
              {tpl.sections.map(sec => (
                <div key={sec.id} className="text-xs">
                  <p className="font-medium text-gray-600 dark:text-gray-400">{sec.title}</p>
                  <p className="text-gray-400">{sec.items.slice(0,3).map(i => i.label).join(' · ')}{sec.items.length > 3 ? ` +${sec.items.length - 3} more` : ''}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
