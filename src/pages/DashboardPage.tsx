import React from 'react';
import { ClipboardList, CheckCircle, AlertTriangle, Clock, TrendingUp, Plus, ChevronRight, Sparkles } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge, SampleBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Store } from '../store/useStore';

type Page = 'dashboard' | 'inspections' | 'new' | 'templates' | 'settings' | 'help' | 'about';

interface Props { store: Store; onNavigate: (p: Page) => void; }

export function DashboardPage({ store, onNavigate }: Props) {
  const { stats, inspections } = store;
  const recent = inspections.slice(0, 5);

  const scoreColor = (s: number) =>
    s >= 90 ? 'text-green-600' : s >= 70 ? 'text-orange-500' : 'text-red-500';

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      {/* Sample data banner */}
      {stats.hasSample && (
        <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-sm">
            <Sparkles size={16} />
            <span>Sample workspace is loaded. This demo data helps you explore the app.</span>
          </div>
          <button onClick={store.clearSampleData} className="text-xs text-amber-600 dark:text-amber-400 underline">
            Remove sample data
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Inspections" value={stats.total} icon={<ClipboardList size={20} />} color="brand" />
        <StatCard label="Completed" value={stats.completed} icon={<CheckCircle size={20} />} color="green" />
        <StatCard label="In Progress" value={stats.inProgress} icon={<Clock size={20} />} color="blue" />
        <StatCard label="Critical Issues" value={stats.criticalIssues} icon={<AlertTriangle size={20} />} color={stats.criticalIssues > 0 ? 'red' : 'gray'} />
      </div>

      {/* Score + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Average Score</p>
          <p className={`text-5xl font-bold ${stats.avgScore > 0 ? scoreColor(stats.avgScore) : 'text-gray-300'}`}>
            {stats.avgScore > 0 ? `${stats.avgScore}%` : '—'}
          </p>
          <p className="text-xs text-gray-400 mt-1">across all inspections</p>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Actions</p>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => onNavigate('new')} icon={<Plus size={16} />} className="justify-start">
              New Inspection
            </Button>
            <Button variant="secondary" onClick={() => onNavigate('templates')} icon={<ClipboardList size={16} />} className="justify-start">
              View Templates
            </Button>
            <Button variant="secondary" onClick={() => onNavigate('inspections')} icon={<TrendingUp size={16} />} className="justify-start">
              All Inspections
            </Button>
            {!stats.hasSample && (
              <Button variant="ghost" onClick={store.loadSampleData} icon={<Sparkles size={16} />} className="justify-start text-amber-600">
                Load Sample Data
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Recent inspections */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recent Inspections</h2>
          <button onClick={() => onNavigate('inspections')} className="text-sm text-brand-600 flex items-center gap-1 hover:underline">
            View all <ChevronRight size={14} />
          </button>
        </div>
        {recent.length === 0 ? (
          <EmptyState
            icon={<ClipboardList size={28} />}
            title="No inspections yet"
            description="Create your first inspection using one of our professional templates."
            action={<Button onClick={() => onNavigate('new')} icon={<Plus size={16} />}>New Inspection</Button>}
          />
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {recent.map(i => (
              <div key={i.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
                onClick={() => { store.setActiveInspectionId(i.id); onNavigate('inspections'); }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-lg flex-shrink-0">
                    {i.type === 'Property' ? '🏠' : i.type === 'Equipment' ? '⚙️' : i.type === 'Cleaning' ? '🧹' : '🚗'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{i.title}</p>
                      {i.isSample && <SampleBadge />}
                    </div>
                    <p className="text-xs text-gray-400">{i.location} · {i.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-sm font-semibold ${scoreColor(i.score)}`}>{i.score}%</span>
                  <StatusBadge status={i.status} />
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
