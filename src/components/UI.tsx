import { ReactNode } from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

// ── StatCard ───────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  color?: string;
  sub?: string;
}
export function StatCard({ label, value, icon, color = 'blue', sub }: StatCardProps) {
  const colorMap: Record<string,string> = {
    blue:   'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    green:  'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    amber:  'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    red:    'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    slate:  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  };
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex items-start gap-4">
      <div className={`p-3 rounded-lg ${colorMap[color] || colorMap.blue}`}>{icon}</div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-700 text-slate-900 dark:text-white mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── SeverityBadge ──────────────────────────────────────────
const SEV_STYLES: Record<string,string> = {
  pass:     'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  minor:    'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  major:    'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  critical: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  na:       'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
};
const SEV_LABELS: Record<string,string> = { pass:'Pass', minor:'Minor', major:'Major', critical:'Critical', na:'N/A' };

export function SeverityBadge({ severity }: { severity: string }) {
  return (
    <span className={`text-xs font-600 px-2 py-0.5 rounded-full ${SEV_STYLES[severity] || SEV_STYLES.na}`}>
      {SEV_LABELS[severity] || severity}
    </span>
  );
}

// ── StatusBadge ────────────────────────────────────────────
const STATUS_STYLES: Record<string,string> = {
  draft:       'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  completed:   'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  signed:      'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
};
const STATUS_LABELS: Record<string,string> = {
  draft: 'Draft', in_progress: 'In Progress', completed: 'Completed', signed: 'Signed'
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs font-600 px-2.5 py-1 rounded-full ${STATUS_STYLES[status] || STATUS_STYLES.draft}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

// ── SampleBadge ────────────────────────────────────────────
export function SampleBadge() {
  return (
    <span className="text-xs font-600 px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
      Sample
    </span>
  );
}

// ── EmptyState ─────────────────────────────────────────────
interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-slate-300 dark:text-slate-600 mb-4">{icon}</div>
      <h3 className="text-lg font-600 text-slate-700 dark:text-slate-300 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}

// ── Toast ──────────────────────────────────────────────────
export function Toast({ message, type = 'info', onClose }: { message: string; type?: 'info'|'success'|'error'; onClose: () => void }) {
  const styles = {
    info:    'bg-blue-600 text-white',
    success: 'bg-green-600 text-white',
    error:   'bg-red-600 text-white',
  };
  const Icon = type === 'success' ? CheckCircle : type === 'error' ? XCircle : Info;
  return (
    <div className={`fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg z-50 ${styles[type]}`}>
      <Icon size={18} />
      <span className="text-sm font-500">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><XCircle size={16}/></button>
    </div>
  );
}

// ── ConfirmModal ───────────────────────────────────────────
export function ConfirmModal({ title, message, onConfirm, onCancel, danger = false }:
  { title: string; message: string; onConfirm: () => void; onCancel: () => void; danger?: boolean }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 w-full max-w-md">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className={danger ? 'text-red-500' : 'text-amber-500'} size={22} />
          <div>
            <h3 className="font-700 text-slate-900 dark:text-white text-base">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-500 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">Cancel</button>
          <button onClick={onConfirm} className={`px-4 py-2 text-sm font-600 text-white rounded-lg ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
