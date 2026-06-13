import React from 'react';
import { LayoutDashboard, ClipboardList, FileText, BookTemplate, Settings, HelpCircle, Info, ChevronLeft, ChevronRight } from 'lucide-react';

type Page = 'dashboard' | 'inspections' | 'new' | 'templates' | 'settings' | 'help' | 'about';

interface Props {
  current: Page;
  onChange: (p: Page) => void;
  companyName: string;
  collapsed: boolean;
  onToggle: () => void;
}

const nav = [
  { id: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'inspections',  label: 'Inspections',  icon: ClipboardList },
  { id: 'new',          label: 'New Inspection',icon: FileText },
  { id: 'templates',    label: 'Templates',    icon: BookTemplate },
];

const navBottom = [
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help',     label: 'Help',     icon: HelpCircle },
  { id: 'about',    label: 'About',    icon: Info },
];

export function Sidebar({ current, onChange, companyName, collapsed, onToggle }: Props) {
  const NavItem = ({ id, label, Icon }: { id: Page; label: string; Icon: React.ElementType }) => (
    <button
      onClick={() => onChange(id)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
        current === id
          ? 'bg-brand-600 text-white shadow-sm'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
      }`}
      title={collapsed ? label : undefined}
    >
      <Icon size={18} className="flex-shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );

  return (
    <aside className={`flex flex-col h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-all duration-200 ${collapsed ? 'w-16' : 'w-56'}`}>
      {/* Logo */}
      <div className={`flex items-center h-16 px-3 border-b border-gray-100 dark:border-gray-800 ${collapsed ? 'justify-center' : 'gap-3'}`}>
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <ClipboardList size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">Inspect Pro</p>
            {companyName && <p className="text-xs text-gray-400 truncate">{companyName}</p>}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {nav.map(({ id, label, icon: Icon }) => (
          <NavItem key={id} id={id as Page} label={label} Icon={Icon} />
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="p-3 space-y-1 border-t border-gray-100 dark:border-gray-800">
        {navBottom.map(({ id, label, icon: Icon }) => (
          <NavItem key={id} id={id as Page} label={label} Icon={Icon} />
        ))}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center py-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
