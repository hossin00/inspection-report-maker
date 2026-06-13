import { useState, useEffect, useCallback } from 'react';
import AppShell from './components/AppShell';
import Onboarding from './screens/Onboarding';
import Dashboard from './screens/Dashboard';
import InspectionsList from './screens/InspectionsList';
import InspectionDetail from './screens/InspectionDetail';
import Templates from './screens/Templates';
import { Settings, Help, About } from './screens/SettingsHelp';
import {
  isOnboardingDone, getInspections, getTemplates, getSettings, saveSettings
} from './utils/storage';
import { Inspection, Template, AppSettings } from './types';

type Screen = 'dashboard' | 'inspections' | 'templates' | 'settings' | 'help' | 'about';

export default function App() {
  const [onboarded, setOnboarded] = useState(isOnboardingDone());
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [openInspId, setOpenInspId] = useState<string|null>(null);
  const [isNewInsp, setIsNewInsp] = useState(false);

  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [settings, setSettings] = useState<AppSettings>(getSettings());

  const refresh = useCallback(() => {
    setInspections(getInspections());
    setTemplates(getTemplates());
  }, []);

  useEffect(() => {
    if (onboarded) refresh();
  }, [onboarded, refresh]);

  // Apply theme
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  function handleOnboardingDone() {
    setOnboarded(true);
    refresh();
  }

  function handleOpenInspection(id: string) {
    setOpenInspId(id);
    setIsNewInsp(false);
  }

  function handleNewInspection() {
    setOpenInspId(null);
    setIsNewInsp(true);
  }

  function handleBackFromInspection() {
    setOpenInspId(null);
    setIsNewInsp(false);
    refresh();
  }

  function handleThemeToggle() {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    const updated = { ...settings, theme: newTheme };
    setSettings(updated as AppSettings);
    saveSettings(updated as AppSettings);
  }

  function handleSettingsSaved(s: AppSettings) {
    setSettings(s);
    refresh();
  }

  if (!onboarded) {
    return <Onboarding onDone={handleOnboardingDone}/>;
  }

  // ── Inspection detail view ─────────────────────────────
  if (openInspId || isNewInsp) {
    const insp = openInspId ? inspections.find(i => i.id === openInspId) || null : null;
    return (
      <div className={settings.theme === 'dark' ? 'dark' : ''}>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
          <InspectionDetail
            inspection={insp}
            templates={templates}
            onBack={handleBackFromInspection}
            onSaved={refresh}
          />
        </div>
      </div>
    );
  }

  // ── Main app ───────────────────────────────────────────
  return (
    <AppShell
      currentScreen={screen}
      onNav={setScreen}
      settings={settings}
      onThemeToggle={handleThemeToggle}
    >
      {screen === 'dashboard' && (
        <Dashboard
          inspections={inspections}
          onNew={handleNewInspection}
          onOpen={handleOpenInspection}
        />
      )}
      {screen === 'inspections' && (
        <InspectionsList
          inspections={inspections}
          onNew={handleNewInspection}
          onOpen={handleOpenInspection}
          onRefresh={refresh}
        />
      )}
      {screen === 'templates' && (
        <Templates
          templates={templates}
          onRefresh={refresh}
        />
      )}
      {screen === 'settings' && (
        <Settings
          settings={settings}
          onSaved={handleSettingsSaved}
        />
      )}
      {screen === 'help' && <Help/>}
      {screen === 'about' && <About/>}
    </AppShell>
  );
}
