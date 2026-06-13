import { Inspection } from '../types';

export function exportCSV(inspections: Inspection[]): void {
  const headers = ['Title', 'Type', 'Location', 'Inspector', 'Client', 'Date', 'Status', 'Score', 'Issues'];
  const rows = inspections.map(i => {
    const fails = i.sections.flatMap(s => s.items).filter(it => it.status === 'fail').length;
    return [i.title, i.type, i.location, i.inspector, i.client, i.date, i.status, `${i.score}%`, fails].map(v => `"${v}"`).join(',');
  });
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'inspections.csv'; a.click();
  URL.revokeObjectURL(url);
}

export function exportJSON(inspections: Inspection[]): void {
  const json = JSON.stringify(inspections, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'inspections_backup.json'; a.click();
  URL.revokeObjectURL(url);
}
