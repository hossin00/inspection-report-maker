import { Inspection, Template, AppSettings } from '../types';
import { SAMPLE_INSPECTIONS, SAMPLE_TEMPLATES } from '../data/sampleData';

const KEYS = {
  INSPECTIONS: 'irm_inspections',
  TEMPLATES: 'irm_templates',
  SETTINGS: 'irm_settings',
  ONBOARDING: 'irm_onboarding_done',
  WORKSPACE: 'irm_workspace_mode',
};

// ── Workspace mode ─────────────────────────────────────────
export type WorkspaceMode = 'empty' | 'sample';

export function getWorkspaceMode(): WorkspaceMode | null {
  return (localStorage.getItem(KEYS.WORKSPACE) as WorkspaceMode) || null;
}

export function setWorkspaceMode(mode: WorkspaceMode) {
  localStorage.setItem(KEYS.WORKSPACE, mode);
  if (mode === 'sample') {
    loadSampleWorkspace();
  }
}

export function isOnboardingDone(): boolean {
  return localStorage.getItem(KEYS.ONBOARDING) === 'true';
}

export function markOnboardingDone() {
  localStorage.setItem(KEYS.ONBOARDING, 'true');
}

// ── Sample workspace ───────────────────────────────────────
export function loadSampleWorkspace() {
  const existing = getInspections();
  const sampleIds = new Set(SAMPLE_INSPECTIONS.map(i => i.id));
  const filtered = existing.filter(i => !sampleIds.has(i.id));
  saveInspections([...SAMPLE_INSPECTIONS, ...filtered]);

  const existingTpls = getTemplates();
  const sampleTplIds = new Set(SAMPLE_TEMPLATES.map(t => t.id));
  const filteredTpls = existingTpls.filter(t => !sampleTplIds.has(t.id));
  saveTemplates([...SAMPLE_TEMPLATES, ...filteredTpls]);
}

export function clearSampleWorkspace() {
  const inspections = getInspections().filter(i => !i.isSample);
  saveInspections(inspections);
  const templates = getTemplates().filter(t => !t.isSample);
  saveTemplates(templates);
}

// ── Inspections ────────────────────────────────────────────
export function getInspections(): Inspection[] {
  try { return JSON.parse(localStorage.getItem(KEYS.INSPECTIONS) || '[]'); }
  catch { return []; }
}

export function saveInspections(data: Inspection[]) {
  localStorage.setItem(KEYS.INSPECTIONS, JSON.stringify(data));
}

export function saveInspection(inspection: Inspection) {
  const all = getInspections();
  const idx = all.findIndex(i => i.id === inspection.id);
  if (idx >= 0) all[idx] = inspection;
  else all.unshift(inspection);
  saveInspections(all);
}

export function deleteInspection(id: string) {
  saveInspections(getInspections().filter(i => i.id !== id));
}

// ── Templates ──────────────────────────────────────────────
export function getTemplates(): Template[] {
  try { return JSON.parse(localStorage.getItem(KEYS.TEMPLATES) || '[]'); }
  catch { return []; }
}

export function saveTemplates(data: Template[]) {
  localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(data));
}

export function saveTemplate(template: Template) {
  const all = getTemplates();
  const idx = all.findIndex(t => t.id === template.id);
  if (idx >= 0) all[idx] = template;
  else all.unshift(template);
  saveTemplates(all);
}

export function deleteTemplate(id: string) {
  saveTemplates(getTemplates().filter(t => t.id !== id));
}

// ── Settings ───────────────────────────────────────────────
const DEFAULT_SETTINGS: AppSettings = {
  companyName: '',
  companyEmail: '',
  companyPhone: '',
  defaultInspector: '',
  theme: 'light',
  accentColor: '#2563eb',
};

export function getSettings(): AppSettings {
  try {
    const s = localStorage.getItem(KEYS.SETTINGS);
    return s ? { ...DEFAULT_SETTINGS, ...JSON.parse(s) } : DEFAULT_SETTINGS;
  } catch { return DEFAULT_SETTINGS; }
}

export function saveSettings(s: AppSettings) {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(s));
}

// ── Export ─────────────────────────────────────────────────
export function exportAllData() {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    inspections: getInspections().filter(i => !i.isSample),
    templates: getTemplates().filter(t => !t.isSample),
    settings: getSettings(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `inspection-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importData(json: string): { ok: boolean; message: string } {
  try {
    const data = JSON.parse(json);
    if (data.inspections) {
      const existing = getInspections().filter(i => i.isSample);
      saveInspections([...existing, ...data.inspections]);
    }
    if (data.templates) {
      const existing = getTemplates().filter(t => t.isSample);
      saveTemplates([...existing, ...data.templates]);
    }
    if (data.settings) saveSettings({ ...getSettings(), ...data.settings });
    return { ok: true, message: 'Data imported successfully.' };
  } catch {
    return { ok: false, message: 'Invalid file. Please use a valid backup file.' };
  }
}

// ── Helpers ────────────────────────────────────────────────
export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
}
