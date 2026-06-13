import React, { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { InspectionsPage } from './pages/InspectionsPage';
import { NewInspectionPage } from './pages/NewInspectionPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpPage } from './pages/HelpPage';
import { AboutPage } from './pages/AboutPage';

type Page = 'dashboard' | 'inspections' | 'new' | 'templates' | 'settings' | 'help' | 'about';

const pageTitles: Record<Page, string> = {
  dashboard: 'Dashboard', inspections: 'Inspections', new: 'New Inspection',
  templates: 'Templates', settings: 'Settings', help: 'Help', about: 'About',
};

export default function App() {
  const store = useStore();
  const [page, setPage] = useState<Page>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Apply theme
  useEffect(() => {
    const theme = store.settings.theme;
    const el = document.documentElement;
    if (theme === 'dark') el.classList.add('dark');
    else if (theme === 'light') el.classList.remove('dark');
    else {
      const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      sysDark ? el.classList.add('dark') : el.classList.remove('dark');
    }
  }, [store.settings.theme]);

  const navigate = (p: Page) => setPage(p);

  const handleEdit = (id: string) => {
    setEditId(id);
    setPage('new');
  };

  const handleTheme = (t: 'light' | 'dark' | 'system') => {
    store.updateSettings({ theme: t });
  };

  if (!store.isOnboarded) return <OnboardingPage store={store} />;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar
        current={page}
        onChange={p => { setPage(p); if (p !== 'new') setEditId(null); }}
        companyName={store.settings.companyName}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          title={pageTitles[page]}
          settings={store.settings}
          onTheme={handleTheme}
          criticalIssues={store.stats.criticalIssues}
        />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {page === 'dashboard'    && <DashboardPage store={store} onNavigate={navigate} />}
          {page === 'inspections'  && <InspectionsPage store={store} onNavigate={navigate} onEdit={handleEdit} />}
          {page === 'new'          && <NewInspectionPage store={store} editId={editId} onNavigate={navigate} />}
          {page === 'templates'    && <TemplatesPage onNavigate={navigate} />}
          {page === 'settings'     && <SettingsPage store={store} />}
          {page === 'help'         && <HelpPage />}
          {page === 'about'        && <AboutPage />}
        </main>
      </div>
    </div>
  );
}
