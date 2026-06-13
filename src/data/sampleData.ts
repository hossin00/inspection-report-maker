import { Template, Inspection } from '../types';

export const SAMPLE_TEMPLATES: Template[] = [
  {
    id: 'tpl-property',
    name: 'Property Inspection',
    category: 'Real Estate',
    description: 'Full room-by-room property condition report for move-in/move-out.',
    isSample: true,
    sections: [
      {
        id: 's1', title: 'Exterior & Entry',
        items: [
          { id: 'i1', label: 'Front door condition', severity: 'pass', notes: '', photoPlaceholder: false },
          { id: 'i2', label: 'Windows & frames', severity: 'minor', notes: 'Minor paint peeling on east window', photoPlaceholder: false },
          { id: 'i3', label: 'Roof visible damage', severity: 'pass', notes: '', photoPlaceholder: false },
          { id: 'i4', label: 'Gutters & drainage', severity: 'pass', notes: '', photoPlaceholder: false },
        ]
      },
      {
        id: 's2', title: 'Living Room',
        items: [
          { id: 'i5', label: 'Walls & ceiling', severity: 'pass', notes: '', photoPlaceholder: false },
          { id: 'i6', label: 'Flooring condition', severity: 'minor', notes: 'Small scuff near entrance', photoPlaceholder: false },
          { id: 'i7', label: 'Light fixtures', severity: 'pass', notes: '', photoPlaceholder: false },
          { id: 'i8', label: 'Electrical outlets', severity: 'pass', notes: '', photoPlaceholder: false },
        ]
      },
      {
        id: 's3', title: 'Kitchen',
        items: [
          { id: 'i9', label: 'Appliances functional', severity: 'pass', notes: '', photoPlaceholder: false },
          { id: 'i10', label: 'Sink & plumbing', severity: 'pass', notes: '', photoPlaceholder: false },
          { id: 'i11', label: 'Cabinets & drawers', severity: 'pass', notes: '', photoPlaceholder: false },
          { id: 'i12', label: 'Ventilation / hood', severity: 'major', notes: 'Hood fan not working — needs repair', photoPlaceholder: false },
        ]
      },
      {
        id: 's4', title: 'Bathroom',
        items: [
          { id: 'i13', label: 'Toilet flush & seal', severity: 'pass', notes: '', photoPlaceholder: false },
          { id: 'i14', label: 'Shower / tub condition', severity: 'minor', notes: 'Minor grout discoloration', photoPlaceholder: false },
          { id: 'i15', label: 'Water pressure', severity: 'pass', notes: '', photoPlaceholder: false },
        ]
      }
    ]
  },
  {
    id: 'tpl-equipment',
    name: 'Equipment Inspection',
    category: 'Industrial',
    description: 'Mechanical and electrical equipment condition check with safety findings.',
    isSample: true,
    sections: [
      {
        id: 's1', title: 'General Condition',
        items: [
          { id: 'i1', label: 'Equipment label & serial number', severity: 'pass', notes: '', photoPlaceholder: false },
          { id: 'i2', label: 'Physical damage / corrosion', severity: 'minor', notes: 'Surface rust on frame base', photoPlaceholder: false },
          { id: 'i3', label: 'Safety guards in place', severity: 'pass', notes: '', photoPlaceholder: false },
        ]
      },
      {
        id: 's2', title: 'Mechanical',
        items: [
          { id: 'i4', label: 'Bearings / vibration', severity: 'pass', notes: '', photoPlaceholder: false },
          { id: 'i5', label: 'Lubrication levels', severity: 'critical', notes: 'Oil level critically low — immediate top-up required', photoPlaceholder: false },
          { id: 'i6', label: 'Belts & chains', severity: 'pass', notes: '', photoPlaceholder: false },
        ]
      },
      {
        id: 's3', title: 'Electrical',
        items: [
          { id: 'i7', label: 'Wiring condition', severity: 'pass', notes: '', photoPlaceholder: false },
          { id: 'i8', label: 'Control panel / switches', severity: 'pass', notes: '', photoPlaceholder: false },
          { id: 'i9', label: 'Grounding / earthing', severity: 'major', notes: 'Grounding cable needs replacement', photoPlaceholder: false },
        ]
      }
    ]
  },
  {
    id: 'tpl-cleaning',
    name: 'Cleaning Inspection',
    category: 'Cleaning Services',
    description: 'Post-cleaning quality check for offices, Airbnb, and commercial sites.',
    isSample: true,
    sections: [
      {
        id: 's1', title: 'Common Areas',
        items: [
          { id: 'i1', label: 'Floors swept & mopped', severity: 'pass', notes: '', photoPlaceholder: false },
          { id: 'i2', label: 'Surfaces dusted', severity: 'pass', notes: '', photoPlaceholder: false },
          { id: 'i3', label: 'Trash emptied', severity: 'pass', notes: '', photoPlaceholder: false },
          { id: 'i4', label: 'Glass / mirrors clean', severity: 'minor', notes: 'Streak marks on lobby mirror', photoPlaceholder: false },
        ]
      },
      {
        id: 's2', title: 'Restrooms',
        items: [
          { id: 'i5', label: 'Toilets cleaned & sanitized', severity: 'pass', notes: '', photoPlaceholder: false },
          { id: 'i6', label: 'Soap / paper towel stocked', severity: 'major', notes: 'Paper towels empty in stall 2', photoPlaceholder: false },
          { id: 'i7', label: 'Floors mopped', severity: 'pass', notes: '', photoPlaceholder: false },
        ]
      },
      {
        id: 's3', title: 'Kitchen / Break Room',
        items: [
          { id: 'i8', label: 'Counters wiped', severity: 'pass', notes: '', photoPlaceholder: false },
          { id: 'i9', label: 'Sink cleaned', severity: 'pass', notes: '', photoPlaceholder: false },
          { id: 'i10', label: 'Microwave inside cleaned', severity: 'minor', notes: 'Food residue inside microwave', photoPlaceholder: false },
        ]
      }
    ]
  },
  {
    id: 'tpl-safety',
    name: 'Safety Audit',
    category: 'Safety & Compliance',
    description: 'Workplace safety audit with risk levels and corrective action tracking.',
    isSample: true,
    sections: [
      {
        id: 's1', title: 'Fire Safety',
        items: [
          { id: 'i1', label: 'Fire extinguishers accessible', severity: 'pass', notes: '', photoPlaceholder: false },
          { id: 'i2', label: 'Emergency exits clear', severity: 'critical', notes: 'Storage boxes blocking Exit B', photoPlaceholder: false },
          { id: 'i3', label: 'Smoke detectors tested', severity: 'major', notes: 'Unit 3B detector battery expired', photoPlaceholder: false },
        ]
      },
      {
        id: 's2', title: 'Workplace Hazards',
        items: [
          { id: 'i4', label: 'Floor surfaces dry & clean', severity: 'pass', notes: '', photoPlaceholder: false },
          { id: 'i5', label: 'Cables / cords managed', severity: 'minor', notes: 'Cable trailing in aisle 2', photoPlaceholder: false },
          { id: 'i6', label: 'PPE available & accessible', severity: 'pass', notes: '', photoPlaceholder: false },
        ]
      },
      {
        id: 's3', title: 'Chemical Storage',
        items: [
          { id: 'i7', label: 'Chemicals properly labelled', severity: 'pass', notes: '', photoPlaceholder: false },
          { id: 'i8', label: 'MSDS sheets available', severity: 'major', notes: 'Missing MSDS for 3 chemicals', photoPlaceholder: false },
          { id: 'i9', label: 'Storage area ventilated', severity: 'pass', notes: '', photoPlaceholder: false },
        ]
      }
    ]
  }
];

export const SAMPLE_INSPECTIONS: Inspection[] = [
  {
    id: 'insp-001',
    title: 'Apartment 4B — Move-In Report',
    templateId: 'tpl-property',
    templateName: 'Property Inspection',
    location: '14 Elm Street, Apt 4B, Manchester',
    clientName: 'Sarah Mitchell',
    clientEmail: 'sarah.mitchell@email.com',
    inspectorName: 'James Carter',
    date: '2026-06-10',
    status: 'signed',
    overallNotes: 'Property is in good overall condition. Hood fan requires immediate attention. Minor cosmetic issues noted.',
    signature: 'Sarah Mitchell',
    sections: SAMPLE_TEMPLATES[0].sections,
    createdAt: Date.now() - 3 * 86400000,
    updatedAt: Date.now() - 3 * 86400000,
    isSample: true,
  },
  {
    id: 'insp-002',
    title: 'Pump Station — Monthly Check',
    templateId: 'tpl-equipment',
    templateName: 'Equipment Inspection',
    location: 'Warehouse Unit 7, Industrial Park',
    clientName: 'Atlas Engineering Ltd',
    clientEmail: 'ops@atlaseng.com',
    inspectorName: 'Yusuf Osman',
    date: '2026-06-08',
    status: 'completed',
    overallNotes: 'Critical oil level issue flagged. Grounding cable replacement scheduled for next week.',
    signature: '',
    sections: SAMPLE_TEMPLATES[1].sections,
    createdAt: Date.now() - 5 * 86400000,
    updatedAt: Date.now() - 5 * 86400000,
    isSample: true,
  },
  {
    id: 'insp-003',
    title: 'Grand Plaza Office — Weekly Clean',
    templateId: 'tpl-cleaning',
    templateName: 'Cleaning Inspection',
    location: 'Grand Plaza Office Tower, Floor 8',
    clientName: 'Brightside Facilities',
    clientEmail: 'quality@brightside.co',
    inspectorName: 'Maria Santos',
    date: '2026-06-12',
    status: 'in_progress',
    overallNotes: '',
    signature: '',
    sections: SAMPLE_TEMPLATES[2].sections,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 3600000,
    isSample: true,
  },
  {
    id: 'insp-004',
    title: 'Warehouse B — Q2 Safety Audit',
    templateId: 'tpl-safety',
    templateName: 'Safety Audit',
    location: 'Distribution Centre, Building B',
    clientName: 'Vantage Logistics',
    clientEmail: 'safety@vantagelogistics.com',
    inspectorName: 'James Carter',
    date: '2026-06-05',
    status: 'completed',
    overallNotes: 'Critical exit blockage resolved on-site. Follow-up required for detector and MSDS.',
    signature: '',
    sections: SAMPLE_TEMPLATES[3].sections,
    createdAt: Date.now() - 8 * 86400000,
    updatedAt: Date.now() - 8 * 86400000,
    isSample: true,
  },
  {
    id: 'insp-005',
    title: 'Unit 12 — Move-Out Check',
    templateId: 'tpl-property',
    templateName: 'Property Inspection',
    location: '88 Birch Avenue, Unit 12',
    clientName: 'Tom Wheeler',
    clientEmail: 'tom.w@gmail.com',
    inspectorName: 'James Carter',
    date: '2026-06-13',
    status: 'draft',
    overallNotes: '',
    signature: '',
    sections: SAMPLE_TEMPLATES[0].sections,
    createdAt: Date.now() - 1800000,
    updatedAt: Date.now() - 1800000,
    isSample: true,
  }
];
