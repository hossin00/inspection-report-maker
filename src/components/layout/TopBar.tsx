import React from 'react';
import { Sun, Moon, Monitor, Bell } from 'lucide-react';
import { AppSettings } from '../../types';

interface Props {
  title: string;
  settings: AppSettings;
  onTheme: (t: 'light' | 'dark' | 'system') => void;
  criticalIssues?: number;
}

export function TopBar({ title, settings, onTheme, criticalIssues = 0 }: Props) {
  const cycleTheme = () => {
    const next = settings.theme === 'light' ? 'dark' : settings.theme === 'dark' ? 'system' : 'light';
    onTheme(next);
  };

  const ThemeIcon = settings.theme === 'dark' ? Moon : settings.theme === 'light' ? Sun : Monitor;

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h1>
      <div className="flex items-center gap-2">
        {criticalIssues > 0 && (
          <button className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{criticalIssues}</span>
          </button>
        )}
        <button
          onClick={cycleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
          title={`Theme: ${settings.theme}`}
        >
          <ThemeIcon size={18} />
        </button>
        {settings.inspectorName && (
          <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {settings.inspectorName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </header>
  );
}
