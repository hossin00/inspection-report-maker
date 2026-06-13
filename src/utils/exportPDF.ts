import { Inspection } from '../types';
import { getSettings } from './storage';

const SEV_LABELS: Record<string, string> = {
  pass: 'PASS', minor: 'MINOR', major: 'MAJOR', critical: 'CRITICAL', na: 'N/A'
};
const SEV_COLORS: Record<string, [number,number,number]> = {
  pass: [34,197,94], minor: [251,191,36], major: [249,115,22], critical: [239,68,68], na: [148,163,184]
};

export function exportInspectionPDF(inspection: Inspection) {
  // Build a clean HTML string and open in a new window for printing
  const settings = getSettings();
  const company = settings.companyName || 'Inspection Report Maker';

  const severityBadge = (s: string) => {
    const colors: Record<string,string> = {
      pass: '#22c55e', minor: '#f59e0b', major: '#f97316', critical: '#ef4444', na: '#94a3b8'
    };
    return `<span style="background:${colors[s]||'#94a3b8'};color:white;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600">${SEV_LABELS[s]||s.toUpperCase()}</span>`;
  };

  const passCount = inspection.sections.flatMap(s=>s.items).filter(i=>i.severity==='pass').length;
  const issueCount = inspection.sections.flatMap(s=>s.items).filter(i=>['minor','major','critical'].includes(i.severity)).length;
  const criticalCount = inspection.sections.flatMap(s=>s.items).filter(i=>i.severity==='critical').length;
  const totalItems = inspection.sections.flatMap(s=>s.items).length;

  const sectionsHtml = inspection.sections.map(sec => `
    <div style="margin-bottom:24px">
      <h3 style="color:#1e40af;font-size:14px;font-weight:700;padding:8px 12px;background:#eff6ff;border-left:4px solid #2563eb;margin-bottom:12px">${sec.title}</h3>
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead>
          <tr style="background:#f1f5f9">
            <th style="padding:8px;text-align:left;border:1px solid #e2e8f0">Item</th>
            <th style="padding:8px;text-align:center;width:100px;border:1px solid #e2e8f0">Status</th>
            <th style="padding:8px;text-align:left;border:1px solid #e2e8f0">Notes</th>
          </tr>
        </thead>
        <tbody>
          ${sec.items.map(item => `
            <tr>
              <td style="padding:8px;border:1px solid #e2e8f0">${item.label}</td>
              <td style="padding:8px;text-align:center;border:1px solid #e2e8f0">${severityBadge(item.severity)}</td>
              <td style="padding:8px;border:1px solid #e2e8f0;color:#64748b">${item.notes || '—'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `).join('');

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>Inspection Report — ${inspection.title}</title>
<style>
  body { font-family: Arial, sans-serif; color: #1e293b; margin: 0; padding: 0; }
  .page { max-width: 800px; margin: 0 auto; padding: 40px; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="page">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:24px;border-bottom:2px solid #2563eb">
    <div>
      <div style="font-size:22px;font-weight:700;color:#1e40af">INSPECTION REPORT</div>
      <div style="font-size:14px;color:#64748b;margin-top:4px">${company}</div>
    </div>
    <div style="text-align:right;font-size:12px;color:#64748b">
      <div><strong>Date:</strong> ${inspection.date}</div>
      <div><strong>Inspector:</strong> ${inspection.inspectorName}</div>
      <div><strong>Report ID:</strong> ${inspection.id.toUpperCase()}</div>
    </div>
  </div>

  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin-bottom:24px">
    <h2 style="margin:0 0 12px;font-size:16px;color:#1e293b">${inspection.title}</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px">
      <div><span style="color:#64748b">Location:</span> ${inspection.location}</div>
      <div><span style="color:#64748b">Client:</span> ${inspection.clientName}</div>
      <div><span style="color:#64748b">Email:</span> ${inspection.clientEmail || '—'}</div>
      <div><span style="color:#64748b">Template:</span> ${inspection.templateName}</div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:28px">
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;text-align:center">
      <div style="font-size:24px;font-weight:700;color:#16a34a">${passCount}</div>
      <div style="font-size:12px;color:#64748b">Passed</div>
    </div>
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:16px;text-align:center">
      <div style="font-size:24px;font-weight:700;color:#d97706">${issueCount}</div>
      <div style="font-size:12px;color:#64748b">Issues</div>
    </div>
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:16px;text-align:center">
      <div style="font-size:24px;font-weight:700;color:#ea580c">${criticalCount}</div>
      <div style="font-size:12px;color:#64748b">Critical</div>
    </div>
    <div style="background:#f1f5f9;border:1px solid #e2e8f0;border-radius:8px;padding:16px;text-align:center">
      <div style="font-size:24px;font-weight:700;color:#1e293b">${totalItems}</div>
      <div style="font-size:12px;color:#64748b">Total Items</div>
    </div>
  </div>

  ${sectionsHtml}

  ${inspection.overallNotes ? `
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-bottom:24px">
    <div style="font-size:13px;font-weight:600;margin-bottom:6px">Overall Notes</div>
    <div style="font-size:13px;color:#475569">${inspection.overallNotes}</div>
  </div>` : ''}

  ${inspection.signature ? `
  <div style="margin-top:32px;border-top:1px solid #e2e8f0;padding-top:20px">
    <div style="font-size:13px;color:#64748b;margin-bottom:8px">Client Signature</div>
    <div style="font-family:Georgia,serif;font-size:22px;color:#1e293b;font-style:italic">${inspection.signature}</div>
    <div style="font-size:11px;color:#94a3b8;margin-top:4px">Signed: ${inspection.date}</div>
  </div>` : ''}

  <div style="margin-top:40px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;text-align:center">
    Generated by Inspection Report Maker · ${new Date().toLocaleDateString()} · For informational purposes only
  </div>
</div>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 500);
  }
}

export function exportInspectionsCSV(inspections: Inspection[]) {
  const rows = [
    ['Title','Location','Client','Inspector','Date','Status','Template','Passed','Issues','Critical','Total Items'],
    ...inspections.filter(i=>!i.isSample).map(i => {
      const items = i.sections.flatMap(s=>s.items);
      return [
        i.title, i.location, i.clientName, i.inspectorName, i.date, i.status, i.templateName,
        items.filter(x=>x.severity==='pass').length,
        items.filter(x=>['minor','major','critical'].includes(x.severity)).length,
        items.filter(x=>x.severity==='critical').length,
        items.length
      ];
    })
  ];
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `inspections-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
