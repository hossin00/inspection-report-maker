export type Severity = 'pass' | 'minor' | 'major' | 'critical' | 'na';
export type InspectionStatus = 'draft' | 'in_progress' | 'completed' | 'signed';

export interface ChecklistItem {
  id: string;
  label: string;
  severity: Severity;
  notes: string;
  photoPlaceholder: boolean;
}

export interface ChecklistSection {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  sections: ChecklistSection[];
  isSample?: boolean;
}

export interface Inspection {
  id: string;
  title: string;
  templateId: string;
  templateName: string;
  location: string;
  clientName: string;
  clientEmail: string;
  inspectorName: string;
  date: string;
  status: InspectionStatus;
  sections: ChecklistSection[];
  overallNotes: string;
  signature: string;
  createdAt: number;
  updatedAt: number;
  isSample?: boolean;
}

export interface AppSettings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  defaultInspector: string;
  theme: 'light' | 'dark';
  accentColor: string;
}
