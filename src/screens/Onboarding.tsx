import { useState } from 'react';
import { ClipboardCheck, Sparkles, ArrowRight, Star, FileText, Shield } from 'lucide-react';
import { setWorkspaceMode, markOnboardingDone } from '../utils/storage';
import { WorkspaceMode } from '../utils/storage';

interface Props { onDone: () => void; }

export default function Onboarding({ onDone }: Props) {
  const [step, setStep] = useState<'welcome' | 'choose'>('welcome');

  function handleChoice(mode: WorkspaceMode) {
    setWorkspaceMode(mode);
    markOnboardingDone();
    onDone();
  }

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl shadow-lg mb-6">
            <ClipboardCheck className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-700 text-slate-900 dark:text-white mb-3">Inspection Report Maker</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base mb-8 leading-relaxed">
            Create professional inspection reports with checklists, severity ratings, client signatures, and PDF export.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { icon: <FileText size={20}/>, label: 'Professional PDFs' },
              { icon: <Star size={20}/>, label: 'Severity Ratings' },
              { icon: <Shield size={20}/>, label: 'Client Signatures' },
            ].map(f => (
              <div key={f.label} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <div className="text-blue-600 mb-2 flex justify-center">{f.icon}</div>
                <p className="text-xs font-500 text-slate-600 dark:text-slate-400">{f.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-8 text-left">
            <div className="flex items-start gap-3">
              <Sparkles className="text-amber-600 mt-0.5 shrink-0" size={18} />
              <div>
                <p className="text-sm font-600 text-amber-800 dark:text-amber-300">One-time paid app</p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                  Fully unlocked. No subscription. No hidden fees. Your data stays on your device.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep('choose')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-600 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            Get Started <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-700 text-slate-900 dark:text-white mb-2">How would you like to start?</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">You can always change this later in Settings.</p>
        </div>

        <div className="space-y-4">
          {/* Sample Workspace */}
          <button
            onClick={() => handleChoice('sample')}
            className="w-full bg-white dark:bg-slate-800 border-2 border-blue-500 rounded-2xl p-6 text-left hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors group"
          >
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-xl">
                <Sparkles className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-700 text-slate-900 dark:text-white text-base">Explore Sample Workspace</span>
                  <span className="text-xs font-600 bg-blue-600 text-white px-2 py-0.5 rounded-full">Recommended</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Load example inspections, templates, and reports so you can explore every feature immediately. Sample data is clearly labeled and can be deleted any time.
                </p>
                <ul className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <li className="flex items-center gap-1.5">✓ 5 example inspections (property, equipment, cleaning, safety)</li>
                  <li className="flex items-center gap-1.5">✓ 4 ready-to-use templates</li>
                  <li className="flex items-center gap-1.5">✓ Full dashboard with real data to explore</li>
                </ul>
              </div>
            </div>
          </button>

          {/* Start Empty */}
          <button
            onClick={() => handleChoice('empty')}
            className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-left hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-xl">
                <ClipboardCheck className="text-slate-500 dark:text-slate-400" size={24} />
              </div>
              <div>
                <span className="font-700 text-slate-900 dark:text-white text-base">Start Empty</span>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Begin with a clean workspace. Create your own templates and add real inspections from the start.
                </p>
              </div>
            </div>
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
          All your data is stored locally on this device only.
        </p>
      </div>
    </div>
  );
}
