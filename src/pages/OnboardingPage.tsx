import React, { useState } from 'react';
import { ClipboardList, Sparkles, ArrowRight, Building2, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Store } from '../store/useStore';

export function OnboardingPage({ store }: { store: Store }) {
  const [step, setStep] = useState<'welcome' | 'setup' | 'choice'>('welcome');
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');

  const handleSetup = () => {
    store.updateSettings({ companyName: company, inspectorName: name });
    setStep('choice');
  };

  if (step === 'welcome') return (
    <div className="min-h-screen bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ClipboardList size={40} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Inspection Report Maker</h1>
        <p className="text-brand-200 text-lg mb-8">
          Create professional inspection reports with checklists, severity ratings, and signed PDF exports.
        </p>
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[['✓ Checklists','4 industry templates'],['✓ PDF Export','Professional reports'],['✓ Signatures','Client & inspector']].map(([t,s])=>(
            <div key={t} className="bg-white/10 rounded-xl p-4 text-left">
              <p className="text-white font-medium text-sm">{t}</p>
              <p className="text-brand-200 text-xs mt-1">{s}</p>
            </div>
          ))}
        </div>
        <Button size="lg" onClick={() => setStep('setup')} icon={<ArrowRight size={20} />}
          className="bg-white text-brand-700 hover:bg-brand-50 w-full">
          Get Started
        </Button>
        <p className="text-brand-300 text-xs mt-4">One-time paid app · No subscription · No hidden fees</p>
      </div>
    </div>
  );

  if (step === 'setup') return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Set up your workspace</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">This personalises your reports. You can change these in Settings anytime.</p>
        <div className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Building2 size={16} /> Company / Organisation <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Thornton Inspections"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <User size={16} /> Your name <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. James Thornton"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
          </div>
        </div>
        <Button className="w-full mt-8" onClick={handleSetup} icon={<ArrowRight size={16} />}>Continue</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">How would you like to start?</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-8">You can always switch in Settings.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={() => store.completeOnboarding(false)}
            className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-brand-500 rounded-2xl p-8 text-left transition-all group">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-4 text-2xl">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Start Empty</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Clean workspace. Create your first inspection from a template.</p>
          </button>
          <button onClick={() => store.completeOnboarding(true)}
            className="bg-brand-600 border-2 border-brand-600 hover:bg-brand-700 rounded-2xl p-8 text-left transition-all group">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <Sparkles size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Explore Sample Workspace</h3>
            <p className="text-sm text-brand-200">Load realistic sample inspections so you can see how everything works.</p>
            <p className="text-xs text-brand-300 mt-3">Sample data is clearly labelled and can be removed anytime.</p>
          </button>
        </div>
      </div>
    </div>
  );
}
