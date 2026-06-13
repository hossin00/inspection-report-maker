import React from 'react';

interface Props {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'brand' | 'green' | 'orange' | 'red' | 'blue' | 'gray';
  sub?: string;
}

const colorMap = {
  brand:  'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400',
  green:  'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
  red:    'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  blue:   'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  gray:   'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
};

export function StatCard({ label, value, icon, color = 'brand', sub }: Props) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 flex items-start gap-4">
      <div className={`p-2.5 rounded-lg ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
