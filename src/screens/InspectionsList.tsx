import { useState, useMemo } from 'react';
import { Plus, Search, FileText, Trash2, Download, Eye } from 'lucide-react';
import { Inspection } from '../types';
import { StatusBadge, SampleBadge, EmptyState, ConfirmModal } from '../components/UI';
import { deleteInspection } from '../utils/storage';
import { exportInspectionPDF, exportInspectionsCSV } from '../utils/exportPDF';

interface Props {
  inspections: Inspection[];
  onNew: () => void;
  onOpen: (id: string) => void;
  onRefresh: () => void;
}

const STATUS_OPTS = ['all','draft','in_progress','completed','signed'];

export default function InspectionsList({ inspections, onNew, onOpen, onRefresh }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string|null>(null);

  const filtered = useMemo(() => {
    return inspections.filter(i => {
      const matchSearch = !search || [i.title, i.location, i.clientName, i.inspectorName]
        .some(f => f.toLowerCase().includes(search.toLowerCase()));
      const matchStatus = statusFilter === 'all' || i.status === statusFilter;
      return matchSearch && matchStatus;
    }).sort((a,b) => b.updatedAt - a.updatedAt);
  }, [inspections, search, statusFilter]);

  function handleDelete() {
    if (!deleteId) return;
    deleteInspection(deleteId);
    setDeleteId(null);
    onRefresh();
  }

  const statusLabels: Record<string,string> = {
    all:'All', draft:'Draft', in_progress:'In Progress', completed:'Completed', signed:'Signed'
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-700 text-slate-900 dark:text-white">Inspections</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{inspections.length} total</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportInspectionsCSV(inspections)}
            className="px-3 py-2.5 text-sm font-500 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5"
          >
            <Download size={15}/> Export CSV
          </button>
          <button
            onClick={onNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-600 transition-colors shadow-sm"
          >
            <Plus size={16}/> New Inspection
          </button>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15}/>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search inspections..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-1.5">
          {STATUS_OPTS.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-xs font-500 rounded-lg transition-colors ${statusFilter===s ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            >
              {statusLabels[s]}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileText size={48}/>}
          title={search || statusFilter !== 'all' ? 'No results found' : 'No inspections yet'}
          description={search || statusFilter !== 'all' ? 'Try adjusting your search or filter.' : 'Start by creating your first inspection report.'}
          action={!search && statusFilter==='all' ? (
            <button onClick={onNew} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-600">
              Create First Inspection
            </button>
          ) : undefined}
        />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 bg-slate-50 dark:bg-slate-700/50 text-xs font-600 text-slate-500 dark:text-slate-400 uppercase tracking-wide border-b border-slate-200 dark:border-slate-700">
            <div className="col-span-4">Inspection</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Inspector</div>
            <div className="col-span-1 text-center">Issues</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {filtered.map((insp, idx) => {
            const items = insp.sections.flatMap(s=>s.items);
            const critical = items.filter(x=>x.severity==='critical').length;
            const issues = items.filter(x=>['minor','major','critical'].includes(x.severity)).length;
            return (
              <div
                key={insp.id}
                className={`grid grid-cols-12 gap-3 px-5 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${idx>0?'border-t border-slate-100 dark:border-slate-700':''}`}
              >
                <div className="col-span-12 md:col-span-4">
                  <div className="flex items-center gap-2">
                    <span className="font-500 text-slate-900 dark:text-white text-sm">{insp.title}</span>
                    {insp.isSample && <SampleBadge/>}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{insp.location}</p>
                </div>
                <div className="col-span-6 md:col-span-2 text-xs text-slate-500 dark:text-slate-400">{insp.date}</div>
                <div className="col-span-6 md:col-span-2 text-xs text-slate-600 dark:text-slate-300">{insp.inspectorName}</div>
                <div className="col-span-4 md:col-span-1 text-center">
                  {issues > 0 ? (
                    <span className={`text-xs font-600 ${critical>0?'text-red-600':'text-amber-600'}`}>{issues}</span>
                  ) : (
                    <span className="text-xs text-green-600">✓</span>
                  )}
                </div>
                <div className="col-span-4 md:col-span-1 text-center">
                  <StatusBadge status={insp.status}/>
                </div>
                <div className="col-span-4 md:col-span-2 flex items-center justify-end gap-1">
                  <button
                    onClick={() => onOpen(insp.id)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    title="Open"
                  >
                    <Eye size={15}/>
                  </button>
                  <button
                    onClick={() => exportInspectionPDF(insp)}
                    className="p-1.5 text-slate-400 hover:text-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                    title="Export PDF"
                  >
                    <Download size={15}/>
                  </button>
                  <button
                    onClick={() => setDeleteId(insp.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Delete"
                  >
                    <Trash2 size={15}/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {deleteId && (
        <ConfirmModal
          title="Delete Inspection"
          message="This inspection will be permanently deleted. This action cannot be undone."
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
