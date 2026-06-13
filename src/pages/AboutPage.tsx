import React from 'react';
import { CheckCircle, Shield, Wifi, Lock } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-8 text-white">
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-4">📋</div>
        <h2 className="text-2xl font-bold mb-2">Inspection Report Maker</h2>
        <p className="text-brand-200 mb-4">Professional inspection reports for property, equipment, cleaning, and vehicle inspections.</p>
        <div className="flex items-center gap-2 text-sm font-medium bg-white/10 rounded-xl px-4 py-2 inline-flex">
          <CheckCircle size={16} />One-time paid app · No subscription · No hidden fees
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">What's included</h3>
        <div className="space-y-3">
          {[
            ['4 professional inspection templates', 'Property, Equipment, Cleaning, Vehicle'],
            ['Full checklist with severity ratings', 'Critical, Major, Minor levels'],
            ['Inspector & client signature capture', 'Sign off inspections professionally'],
            ['Score calculation system', 'Weighted by severity for accuracy'],
            ['Sample workspace', 'Learn the app with realistic demo data'],
            ['Local-first privacy', 'All data stays on your device'],
          ].map(([title, desc]) => (
            <div key={title} className="flex items-start gap-3">
              <CheckCircle size={16} className="text-brand-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{title}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Shield, label: 'Private', desc: 'Local storage only' },
          { icon: Wifi, label: 'Offline', desc: 'Works without internet' },
          { icon: Lock, label: 'Secure', desc: 'No data sent anywhere' },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 text-center">
            <Icon size={20} className="text-brand-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
            <p className="text-xs text-gray-400">{desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-xs text-gray-400 text-center">
        Inspection Report Maker v1.0 · Microsoft Store · $49.99 one-time purchase<br/>
        Fully unlocked after purchase · No subscription · No in-app purchases
      </div>
    </div>
  );
}
