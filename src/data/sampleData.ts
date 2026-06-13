import { Inspection } from '../types';

export const SAMPLE_INSPECTIONS: Inspection[] = [
  {
    id: 'sample-1',
    title: 'Riverside Apartments – Unit 4B',
    type: 'Property',
    templateId: 'property',
    location: '12 Riverside Drive, Unit 4B',
    inspector: 'James Thornton',
    client: 'Maria Santos',
    status: 'signed',
    date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    overallNotes: 'Property in generally good condition. Bathroom mold requires immediate attention. Smoke detectors need battery replacement.',
    tags: ['rental', 'move-in', 'urgent-item'],
    score: 78,
    isSample: true,
    signatures: {
      inspector: { name: 'James Thornton', role: 'Inspector', date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], captured: true },
      client:    { name: 'Maria Santos',   role: 'Tenant',    date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], captured: true },
    },
    sections: [
      {
        id: 'exterior', title: 'Exterior',
        items: [
          { id: 'e1', label: 'Roof & gutters condition',  status: 'pass', severity: 'major', notes: '' },
          { id: 'e2', label: 'Walls / cladding',          status: 'pass', severity: 'major', notes: 'Minor paint peeling on north side' },
          { id: 'e3', label: 'Windows & frames',          status: 'pass', severity: 'minor', notes: '' },
          { id: 'e4', label: 'Entry doors & locks',       status: 'pass', severity: 'major', notes: '' },
          { id: 'e5', label: 'Driveway / pathways',       status: 'pass', severity: 'minor', notes: '' },
        ]
      },
      {
        id: 'interior', title: 'Interior – Living Areas',
        items: [
          { id: 'i1', label: 'Walls & ceilings (cracks/stains)', status: 'pass', severity: 'major', notes: '' },
          { id: 'i2', label: 'Floors & carpets',                 status: 'fail', severity: 'minor', notes: 'Carpet stain near window – pre-existing' },
          { id: 'i3', label: 'Windows operational',              status: 'pass', severity: 'minor', notes: '' },
          { id: 'i4', label: 'Electrical outlets functional',    status: 'pass', severity: 'major', notes: '' },
          { id: 'i5', label: 'Smoke detectors present',         status: 'fail', severity: 'critical', notes: 'Battery low – replace immediately' },
        ]
      },
      {
        id: 'kitchen', title: 'Kitchen',
        items: [
          { id: 'k1', label: 'Sink & taps (leaks)',        status: 'pass', severity: 'major', notes: '' },
          { id: 'k2', label: 'Appliances functional',      status: 'pass', severity: 'minor', notes: '' },
          { id: 'k3', label: 'Cupboards & hinges',         status: 'pass', severity: 'minor', notes: '' },
          { id: 'k4', label: 'Ventilation / extractor fan', status: 'pass', severity: 'minor', notes: '' },
        ]
      },
      {
        id: 'bathroom', title: 'Bathroom',
        items: [
          { id: 'b1', label: 'Toilet flush & seal',      status: 'pass', severity: 'major', notes: '' },
          { id: 'b2', label: 'Shower / bath condition',  status: 'fail', severity: 'major', notes: 'Grout cracking around shower tray' },
          { id: 'b3', label: 'Water pressure & drainage',status: 'pass', severity: 'major', notes: '' },
          { id: 'b4', label: 'Mold / dampness',          status: 'fail', severity: 'critical', notes: 'Visible mold on ceiling – must be treated' },
        ]
      },
    ]
  },
  {
    id: 'sample-2',
    title: 'CNC Machine M-200 – Bay 3',
    type: 'Equipment',
    templateId: 'equipment',
    location: 'Factory Floor, Bay 3',
    inspector: 'James Thornton',
    client: 'Precision Parts Ltd',
    status: 'completed',
    date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
    overallNotes: 'Machine in good working order. Emergency stop tested and functional. Minor cable management needed.',
    tags: ['factory', 'monthly-check'],
    score: 92,
    isSample: true,
    signatures: {
      inspector: { name: 'James Thornton', role: 'Inspector',   date: '', captured: true },
      client:    { name: 'Tom Walsh',       role: 'Site Manager', date: '', captured: false },
    },
    sections: [
      {
        id: 'general', title: 'General Condition',
        items: [
          { id: 'g1', label: 'Equipment ID / serial number verified', status: 'pass', severity: 'minor', notes: 'Serial: M200-2847-X' },
          { id: 'g2', label: 'Visible damage or corrosion',          status: 'pass', severity: 'major', notes: '' },
          { id: 'g3', label: 'Safety labels / warnings legible',     status: 'pass', severity: 'critical', notes: '' },
          { id: 'g4', label: 'Cleanliness & housekeeping',           status: 'fail', severity: 'minor', notes: 'Oil residue on base – clean required' },
        ]
      },
      {
        id: 'safety', title: 'Safety Systems',
        items: [
          { id: 's1', label: 'Emergency stop functional', status: 'pass', severity: 'critical', notes: 'Tested 3x – all passed' },
          { id: 's2', label: 'Guards & shields in place', status: 'pass', severity: 'critical', notes: '' },
          { id: 's3', label: 'Electrical cables secure',  status: 'fail', severity: 'critical', notes: 'Cable tray loose at junction box – minor fix needed' },
          { id: 's4', label: 'Fire extinguisher nearby',  status: 'pass', severity: 'major', notes: '' },
        ]
      },
      {
        id: 'operation', title: 'Operational Check',
        items: [
          { id: 'o1', label: 'Startup procedure correct',          status: 'pass', severity: 'major', notes: '' },
          { id: 'o2', label: 'Noise / vibration within limits',    status: 'pass', severity: 'major', notes: '' },
          { id: 'o3', label: 'Temperature within range',           status: 'pass', severity: 'major', notes: 'Operating at 68°C – within spec' },
          { id: 'o4', label: 'Output quality acceptable',          status: 'pass', severity: 'minor', notes: '' },
        ]
      },
    ]
  },
  {
    id: 'sample-3',
    title: 'The Grand Hotel – Suite 12 Turnover',
    type: 'Cleaning',
    templateId: 'cleaning',
    location: 'The Grand Hotel, Suite 12',
    inspector: 'James Thornton',
    client: 'The Grand Hotel Management',
    status: 'in_progress',
    date: new Date().toISOString().split('T')[0],
    overallNotes: '',
    tags: ['hotel', 'turnover'],
    score: 65,
    isSample: true,
    signatures: {
      inspector: { name: 'James Thornton', role: 'Supervisor', date: '', captured: false },
      client:    { name: '',               role: 'Manager',    date: '', captured: false },
    },
    sections: [
      {
        id: 'floors', title: 'Floors & Surfaces',
        items: [
          { id: 'f1', label: 'Floors swept / vacuumed', status: 'pass', severity: 'major', notes: '' },
          { id: 'f2', label: 'Floors mopped / polished', status: 'pending', severity: 'major', notes: '' },
          { id: 'f3', label: 'Skirting boards dusted',   status: 'pending', severity: 'minor', notes: '' },
          { id: 'f4', label: 'Stairs / hallways clean',  status: 'pass',    severity: 'minor', notes: '' },
        ]
      },
      {
        id: 'kitchen_c', title: 'Kitchen',
        items: [
          { id: 'kc1', label: 'Surfaces wiped & sanitised', status: 'pass', severity: 'major', notes: '' },
          { id: 'kc2', label: 'Sink cleaned & descaled',    status: 'pass', severity: 'major', notes: '' },
          { id: 'kc3', label: 'Bin emptied & relined',      status: 'pass', severity: 'major', notes: '' },
          { id: 'kc4', label: 'Appliance fronts wiped',     status: 'fail', severity: 'minor', notes: 'Microwave interior needs attention' },
        ]
      },
      {
        id: 'bathrooms', title: 'Bathrooms',
        items: [
          { id: 'bt1', label: 'Toilet cleaned & disinfected', status: 'pass',    severity: 'critical', notes: '' },
          { id: 'bt2', label: 'Sink & taps cleaned',          status: 'pass',    severity: 'major',    notes: '' },
          { id: 'bt3', label: 'Mirrors polished',             status: 'pending', severity: 'minor',    notes: '' },
          { id: 'bt4', label: 'Fresh towels / supplies stocked', status: 'pending', severity: 'minor', notes: '' },
        ]
      },
    ]
  },
];
