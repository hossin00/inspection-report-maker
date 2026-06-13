import { ReactNode, useState } from 'react';
import {
  LayoutDashboard, ClipboardList, FileText, Settings, HelpCircle, Info,
  Menu, X, ClipboardCheck, ChevronRight, Moon, Sun
} from 'lucide-react';
import { AppSettings } from '../types';

type Screen = 'dashboard' | 'inspections' | 'templates' | 'settings' | 'help' | 'about';

interface Props {
  currentScreen: Screen;
  onNav: (s: Screen) => void;
  settings: AppSettings;
  onThemeToggle: () => void;
  children: ReactNode;
}

const NAV = [
  { key: 'dashboard' as Screen, label: 'Dashboard', icon: LayoutDashboard },
  { key: 'inspections' as Screen, label: 'Inspections', icon: ClipboardList },
  { key: 'templates' as Screen, label: 'Templates', icon: FileText },
];
const NAV_BOTTOM = [
  { key: 'settings' as Screen, label: 'Settings', icon: Settings },
  { key: 'help' as Screen, label: 'Help', icon: HelpCircle },
  { key: 'about' as Screen, label: 'About', icon: Info },
];

export default function AppShell({ currentScreen, onNav, settings, onThemeToggle, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <ClipboardCheck className="text-white" size={16}/>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-700 text-slate-900 dark:text-white leading-tight">Inspection</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">Report Maker</p>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-xs font-600 text-slate-400 dark:text-slate-500 px-2 mb-2 uppercase tracking-wider">Menu</p>
        {NAV.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { onNav(key); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-500 transition-colors ${
              currentScreen === key
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Icon size={16}/>
            <span className="flex-1 text-left">{label}</span>
            {currentScreen === key && <ChevronRight size={14} className="opacity-70"/>}
          </button>
        ))}
      </nav>

      {/* Bottom Nav */}
      <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-700 space-y-1">
        {NAV_BOTTOM.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { onNav(key); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-500 transition-colors ${
              currentScreen === key
                ? 'bg-blue-600 text-white'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-white'
            }`}
          >
            <Icon size={15}/>
            {label}
          </button>
        ))}
        {/* Theme toggle */}
        <button
          onClick={onThemeToggle}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-500 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          {settings.theme === 'dark' ? <Sun size={15}/> : <Moon size={15}/>}
          {settings.theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen bg-slate-50 dark:bg-slate-900 ${settings.theme === 'dark' ? 'dark' : ''}`}>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex-col">
        <SidebarContent/>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)}/>
          <aside className="relative w-56 bg-white dark:bg-slate-800 shadow-xl h-full flex flex-col">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={18}/>
            </button>
            <SidebarContent/>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Topbar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-500 hover:text-slate-700">
            <Menu size={20}/>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <ClipboardCheck className="text-white" size={12}/>
            </div>
            <span className="text-sm font-700 text-slate-900 dark:text-white">Inspection Report Maker</span>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
