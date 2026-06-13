import { useState, useEffect, useCallback } from 'react';
import { Inspection, AppSettings, InspectionTemplate } from '../types';
import { TEMPLATES } from '../data/templates';
import { SAMPLE_INSPECTIONS } from '../data/sampleData';

const STORAGE_KEY = 'irm_inspections_v1';
const SETTINGS_KEY = 'irm_settings_v1';
const ONBOARDED_KEY = 'irm_onboarded_v1';

const defaultSettings: AppSettings = {
  companyName: '',
  inspectorName: '',
  theme: 'system',
  defaultType: 'Property',
};

function load<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}

function save<T>(key: string, val: T) {
  localStorage.setItem(key, JSON.stringify(val));
}

export function useStore() {
  const [inspections, setInspections] = useState<Inspection[]>(() => load(STORAGE_KEY, []));
  const [settings, setSettings] = useState<AppSettings>(() => load(SETTINGS_KEY, defaultSettings));
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => load(ONBOARDED_KEY, false));
  const [activeInspectionId, setActiveInspectionId] = useState<string | null>(null);

  useEffect(() => { save(STORAGE_KEY, inspections); }, [inspections]);
  useEffect(() => { save(SETTINGS_KEY, settings); }, [settings]);
  useEffect(() => { save(ONBOARDED_KEY, isOnboarded); }, [isOnboarded]);

  const loadSampleData = useCallback(() => {
    setInspections(prev => {
      const filtered = prev.filter(i => !i.isSample);
      return [...filtered, ...SAMPLE_INSPECTIONS];
    });
  }, []);

  const clearSampleData = useCallback(() => {
    setInspections(prev => prev.filter(i => !i.isSample));
  }, []);

  const completeOnboarding = useCallback((withSample: boolean) => {
    if (withSample) loadSampleData();
    setIsOnboarded(true);
  }, [loadSampleData]);

  const addInspection = useCallback((insp: Inspection) => {
    setInspections(prev => [insp, ...prev]);
  }, []);

  const updateInspection = useCallback((insp: Inspection) => {
    setInspections(prev => prev.map(i => i.id === insp.id ? insp : i));
  }, []);

  const deleteInspection = useCallback((id: string) => {
    setInspections(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateSettings = useCallback((s: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...s }));
  }, []);

  const getInspection = useCallback((id: string) => {
    return inspections.find(i => i.id === id) ?? null;
  }, [inspections]);

  const stats = {
    total: inspections.length,
    completed: inspections.filter(i => i.status === 'completed' || i.status === 'signed').length,
    inProgress: inspections.filter(i => i.status === 'in_progress').length,
    drafts: inspections.filter(i => i.status === 'draft').length,
    avgScore: inspections.length
      ? Math.round(inspections.reduce((s, i) => s + i.score, 0) / inspections.length)
      : 0,
    criticalIssues: inspections.reduce((sum, i) =>
      sum + i.sections.flatMap(s => s.items).filter(it => it.status === 'fail' && it.severity === 'critical').length, 0),
    hasSample: inspections.some(i => i.isSample),
  };

  return {
    inspections, settings, isOnboarded, activeInspectionId,
    templates: TEMPLATES as InspectionTemplate[],
    stats,
    setActiveInspectionId,
    addInspection, updateInspection, deleteInspection, getInspection,
    updateSettings, loadSampleData, clearSampleData, completeOnboarding,
  };
}

export type Store = ReturnType<typeof useStore>;
