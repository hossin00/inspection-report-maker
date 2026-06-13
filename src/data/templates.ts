import { InspectionTemplate } from '../types';

export const TEMPLATES: InspectionTemplate[] = [
  {
    id: 'property',
    name: 'Property Inspection',
    type: 'Property',
    description: 'Comprehensive property condition assessment for landlords, agents, and tenants.',
    icon: '🏠',
    sections: [
      {
        id: 'exterior',
        title: 'Exterior',
        items: [
          { label: 'Roof & gutters condition', severity: 'major', photoPlaceholder: true },
          { label: 'Walls / cladding', severity: 'major', photoPlaceholder: true },
          { label: 'Windows & frames', severity: 'minor', photoPlaceholder: true },
          { label: 'Entry doors & locks', severity: 'major', photoPlaceholder: false },
          { label: 'Driveway / pathways', severity: 'minor', photoPlaceholder: false },
        ]
      },
      {
        id: 'interior',
        title: 'Interior – Living Areas',
        items: [
          { label: 'Walls & ceilings (cracks/stains)', severity: 'major', photoPlaceholder: true },
          { label: 'Floors & carpets', severity: 'minor', photoPlaceholder: true },
          { label: 'Windows operational', severity: 'minor', photoPlaceholder: false },
          { label: 'Electrical outlets functional', severity: 'major', photoPlaceholder: false },
          { label: 'Smoke detectors present', severity: 'critical', photoPlaceholder: false },
        ]
      },
      {
        id: 'kitchen',
        title: 'Kitchen',
        items: [
          { label: 'Sink & taps (leaks)', severity: 'major', photoPlaceholder: true },
          { label: 'Appliances functional', severity: 'minor', photoPlaceholder: false },
          { label: 'Cupboards & hinges', severity: 'minor', photoPlaceholder: false },
          { label: 'Ventilation / extractor fan', severity: 'minor', photoPlaceholder: false },
        ]
      },
      {
        id: 'bathroom',
        title: 'Bathroom',
        items: [
          { label: 'Toilet flush & seal', severity: 'major', photoPlaceholder: false },
          { label: 'Shower / bath condition', severity: 'major', photoPlaceholder: true },
          { label: 'Water pressure & drainage', severity: 'major', photoPlaceholder: false },
          { label: 'Mold / dampness', severity: 'critical', photoPlaceholder: true },
        ]
      },
    ]
  },
  {
    id: 'equipment',
    name: 'Equipment Inspection',
    type: 'Equipment',
    description: 'Safety and functional check for machinery, tools, and industrial equipment.',
    icon: '⚙️',
    sections: [
      {
        id: 'general',
        title: 'General Condition',
        items: [
          { label: 'Equipment ID / serial number verified', severity: 'minor', photoPlaceholder: false },
          { label: 'Visible damage or corrosion', severity: 'major', photoPlaceholder: true },
          { label: 'Safety labels / warnings legible', severity: 'critical', photoPlaceholder: false },
          { label: 'Cleanliness & housekeeping', severity: 'minor', photoPlaceholder: false },
        ]
      },
      {
        id: 'safety',
        title: 'Safety Systems',
        items: [
          { label: 'Emergency stop functional', severity: 'critical', photoPlaceholder: false },
          { label: 'Guards & shields in place', severity: 'critical', photoPlaceholder: true },
          { label: 'Electrical cables secure', severity: 'critical', photoPlaceholder: false },
          { label: 'Fire extinguisher nearby', severity: 'major', photoPlaceholder: false },
        ]
      },
      {
        id: 'operation',
        title: 'Operational Check',
        items: [
          { label: 'Startup procedure correct', severity: 'major', photoPlaceholder: false },
          { label: 'Noise / vibration within limits', severity: 'major', photoPlaceholder: false },
          { label: 'Temperature within range', severity: 'major', photoPlaceholder: false },
          { label: 'Output quality acceptable', severity: 'minor', photoPlaceholder: false },
        ]
      },
    ]
  },
  {
    id: 'cleaning',
    name: 'Cleaning Inspection',
    type: 'Cleaning',
    description: 'Quality control checklist for commercial and residential cleaning services.',
    icon: '🧹',
    sections: [
      {
        id: 'floors',
        title: 'Floors & Surfaces',
        items: [
          { label: 'Floors swept / vacuumed', severity: 'major', photoPlaceholder: false },
          { label: 'Floors mopped / polished', severity: 'major', photoPlaceholder: false },
          { label: 'Skirting boards dusted', severity: 'minor', photoPlaceholder: false },
          { label: 'Stairs / hallways clean', severity: 'minor', photoPlaceholder: false },
        ]
      },
      {
        id: 'kitchen_c',
        title: 'Kitchen',
        items: [
          { label: 'Surfaces wiped & sanitised', severity: 'major', photoPlaceholder: true },
          { label: 'Sink cleaned & descaled', severity: 'major', photoPlaceholder: false },
          { label: 'Bin emptied & relined', severity: 'major', photoPlaceholder: false },
          { label: 'Appliance fronts wiped', severity: 'minor', photoPlaceholder: false },
        ]
      },
      {
        id: 'bathrooms',
        title: 'Bathrooms',
        items: [
          { label: 'Toilet cleaned & disinfected', severity: 'critical', photoPlaceholder: false },
          { label: 'Sink & taps cleaned', severity: 'major', photoPlaceholder: false },
          { label: 'Mirrors polished', severity: 'minor', photoPlaceholder: false },
          { label: 'Fresh towels / supplies stocked', severity: 'minor', photoPlaceholder: false },
        ]
      },
    ]
  },
  {
    id: 'vehicle',
    name: 'Vehicle Inspection',
    type: 'Vehicle',
    description: 'Pre/post rental and fleet vehicle condition report.',
    icon: '🚗',
    sections: [
      {
        id: 'exterior_v',
        title: 'Exterior',
        items: [
          { label: 'Body panels (dents/scratches)', severity: 'major', photoPlaceholder: true },
          { label: 'Windscreen / glass condition', severity: 'major', photoPlaceholder: true },
          { label: 'Tyre tread & pressure (all 4)', severity: 'critical', photoPlaceholder: false },
          { label: 'Lights functional (all)', severity: 'critical', photoPlaceholder: false },
          { label: 'Mirrors intact', severity: 'major', photoPlaceholder: false },
        ]
      },
      {
        id: 'interior_v',
        title: 'Interior',
        items: [
          { label: 'Seats & upholstery clean', severity: 'minor', photoPlaceholder: true },
          { label: 'Dashboard warning lights', severity: 'critical', photoPlaceholder: false },
          { label: 'Seatbelts functional', severity: 'critical', photoPlaceholder: false },
          { label: 'Air conditioning working', severity: 'minor', photoPlaceholder: false },
        ]
      },
      {
        id: 'mechanical',
        title: 'Mechanical',
        items: [
          { label: 'Oil level', severity: 'critical', photoPlaceholder: false },
          { label: 'Coolant level', severity: 'critical', photoPlaceholder: false },
          { label: 'Brake fluid', severity: 'critical', photoPlaceholder: false },
          { label: 'Spare tyre & jack present', severity: 'major', photoPlaceholder: false },
        ]
      },
    ]
  },
];
