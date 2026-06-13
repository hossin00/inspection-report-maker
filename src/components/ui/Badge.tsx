import React from 'react';
import { Severity, InspectionStatus } from '../../types';

const severityMap: Record<Severity, string> = {
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  major:    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  minor:    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  pass:     'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const statusMap: Record<InspectionStatus, string> = {
  draft:       'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  completed:   'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  signed:      'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400',
};

const statusLabel: Record<InspectionStatus, string> = {
  draft: 'Draft', in_progress: 'In Progress', completed: 'Completed', signed: 'Signed',
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${severityMap[severity]}`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
}

export function StatusBadge({ status }: { status: InspectionStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusMap[status]}`}>
      {statusLabel[status]}
    </span>
  );
}

export function SampleBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
      ✦ Sample
    </span>
  );
}
