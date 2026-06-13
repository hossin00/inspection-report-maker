export type Severity = 'critical' | 'major' | 'minor' | 'pass';
export type InspectionStatus = 'draft' | 'in_progress' | 'completed' | 'signed';

export interface ChecklistItem {
  id: string;
  label: string;
  status: 'pass' | 'fail' | 'na' | 'pending';
  severity: Severity;
  notes: string;
  photoPlaceholder?: boolean;
}

export interface ChecklistSection {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface Signature {
  name: string;
  role: string;
  date: string;
  captured: boolean;
}

export interface Inspection {
  id: string;
  title: string;
  type: string;
  templateId: string;
  location: string;
  inspector: string;
  client: string;
  status: InspectionStatus;
  date: string;
  sections: ChecklistSection[];
  signatures: { inspector: Signature; client: Signature };
  overallNotes: string;
  tags: string[];
  score: number;
  isSample?: boolean;
}

export interface TemplateItem {
  label: string;
  severity: Severity;
  photoPlaceholder?: boolean;
}

export interface TemplateSection {
  id: string;
  title: string;
  items: TemplateItem[];
}

export interface InspectionTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  sections: TemplateSection[];
  icon: string;
}

export interface AppSettings {
  companyName: string;
  inspectorName: string;
  theme: 'light' | 'dark' | 'system';
  defaultType: string;
}
