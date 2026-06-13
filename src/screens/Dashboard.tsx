import { useMemo } from 'react';
import { ClipboardCheck, AlertTriangle, CheckCircle, Clock, TrendingUp, Plus, FileText } from 'lucide-react';
import { Inspection } from '../types';
import { StatCard, StatusBadge, SampleBadge } from '../components/UI';
import { format, isAfter, subDays } from 'date-fns';

interface Props {
  inspections: Inspection[];
  onNew: () => void;
  onOpen: (id: string) => void;
}

export default function Dashboard({ inspections, onNew, onOpen }: Props) {
  const stats = useMemo(() => {
    const total = inspections.length;
    const completed = inspections.filter(i => i.status === 'completed' || i.status === 'signed').length;
    const inProgress = inspections.filter(i => i.status === 'in_progress').length;
    const drafts = inspections.filter(i => i.status === 'draft').length;
    const thisWeek = inspections.filter(i => isAfter(new Date(i.date), subDays(new Date(), 7))).length;

    // Issues across all inspections
    const allItems = inspections.flatMap(i => i.sections.flatMap(s => s.items));
    const critical = allItems.filter(x => x.severity === 'critical').length;
    const issues = allItems.filter(x => ['minor','major','critical'].includes(x.severity)).length;

    return { total, completed, inProgress, drafts, thisWeek, critical, issues };
  }, [inspections]);

  const recent = [...inspections].sort((a,b) => b.updatedAt - a.updatedAt).slice(0, 5);

  const statusCounts = useMemo(() => {
    const m: Record<string,number> = { draft:0, in_progress:0, completed:0, signed:0 };
    inspections.forEach(i => m[i.status] = (m[i.status]||0)+1);
    return m;
  }, [inspections]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-700 text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{format(new Date(),'EEEE, d MMMM yyyy')}</p>
        </div>
        <button
          onClick={onNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-600 transition-colors shadow-sm"
        >
          <Plus size={16}/> New Inspection
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Inspections" value={stats.total} icon={<ClipboardCheck size={20}/>} color="blue" sub={`${stats.thisWeek} this week`}/>
        <StatCard label="Completed" value={stats.completed} icon={<CheckCircle size={20}/>} color="green" sub={`${stats.inProgress} in progress`}/>
        <StatCard label="Open Issues" value={stats.issues} icon={<AlertTriangle size={20}/>} color="amber" sub={`${stats.critical} critical`}/>
        <StatCard label="Drafts" value={stats.drafts} icon={<Clock size={20}/>} color="slate" sub="pending completion"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Inspections */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h2 className="font-600 text-slate-900 dark:text-white">Recent Inspections</h2>
            <button onClick={onNew} className="text-xs text-blue-600 hover:text-blue-700 font-500">+ New</button>
          </div>
          {recent.length === 0 ? (
            <div className="p-10 text-center">
              <FileText className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={36}/>
              <p className="text-sm text-slate-500 dark:text-slate-400">No inspections yet</p>
              <button onClick={onNew} className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-500">Create your first inspection →</button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {recent.map(insp => {
                const items = insp.sections.flatMap(s=>s.items);
                const issues = items.filter(x=>['minor','major','critical'].includes(x.severity)).length;
                return (
                  <button
                    key={insp.id}
                    onClick={() => onOpen(insp.id)}
                    className="w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-500 text-slate-900 dark:text-white text-sm truncate">{insp.title}</span>
                          {insp.isSample && <SampleBadge/>}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{insp.location}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs text-slate-400">{insp.date}</span>
                          {issues > 0 && (
                            <span className="text-xs text-amber-600 dark:text-amber-400 font-500">{issues} issue{issues>1?'s':''}</span>
                          )}
                        </div>
                      </div>
                      <StatusBadge status={insp.status}/>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="font-600 text-slate-900 dark:text-white mb-4 text-sm">Status Overview</h3>
            <div className="space-y-3">
              {[
                { key: 'draft', label: 'Draft', color: 'bg-slate-400' },
                { key: 'in_progress', label: 'In Progress', color: 'bg-blue-500' },
                { key: 'completed', label: 'Completed', color: 'bg-green-500' },
                { key: 'signed', label: 'Signed', color: 'bg-purple-500' },
              ].map(s => {
                const count = statusCounts[s.key] || 0;
                const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
                return (
                  <div key={s.key}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600 dark:text-slate-400">{s.label}</span>
                      <span className="font-600 text-slate-900 dark:text-white">{count}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full">
                      <div className={`h-1.5 ${s.color} rounded-full transition-all`} style={{ width: `${pct}%` }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Critical issues */}
          {stats.critical > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-red-600" size={16}/>
                <span className="text-sm font-600 text-red-800 dark:text-red-300">Critical Issues</span>
              </div>
              <p className="text-sm text-red-700 dark:text-red-400">
                {stats.critical} critical finding{stats.critical>1?'s':''} across your inspections require immediate attention.
              </p>
            </div>
          )}

          {/* Quick actions */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="font-600 text-slate-900 dark:text-white mb-3 text-sm">Quick Actions</h3>
            <div className="space-y-2">
              <button onClick={onNew} className="w-full text-left text-sm text-blue-600 hover:text-blue-700 font-500 py-1.5 flex items-center gap-2">
                <Plus size={14}/> New Inspection
              </button>
              <button className="w-full text-left text-sm text-slate-600 dark:text-slate-400 hover:text-slate-700 py-1.5 flex items-center gap-2">
                <TrendingUp size={14}/> Export Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
