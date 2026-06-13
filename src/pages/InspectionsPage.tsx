import React, { useState } from 'react';
import { Search, Plus, Trash2, Eye, Filter, X } from 'lucide-react';
import { StatusBadge, SampleBadge, SeverityBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { Store } from '../store/useStore';
import { Inspection, InspectionStatus } from '../types';

type Page = 'dashboard' | 'inspections' | 'new' | 'templates' | 'settings' | 'help' | 'about';

interface Props { store: Store; onNavigate: (p: Page) => void; onEdit: (id: string) => void; }

export function InspectionsPage({ store, onNavigate, onEdit }: Props) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<InspectionStatus | 'all'>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selected, setSelected] = useState<Inspection | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = store.inspections.filter(i => {
    const q = search.toLowerCase();
    const matchQ = !q || i.title.toLowerCase().includes(q) || i.location.toLowerCase().includes(q) || i.client.toLowerCase().includes(q);
    const matchS = filterStatus === 'all' || i.status === filterStatus;
    const matchT = filterType === 'all' || i.type === filterType;
    return matchQ && matchS && matchT;
  });

  const types = Array.from(new Set(store.inspections.map(i => i.type)));
  const scoreColor = (s: number) => s >= 90 ? 'text-green-600' : s >= 70 ? 'text-orange-500' : 'text-red-500';
  const criticalCount = (i: Inspection) => i.sections.flatMap(s => s.items).filter(it => it.status === 'fail' && it.severity === 'critical').length;
  const failCount = (i: Inspection) => i.sections.flatMap(s => s.items).filter(it => it.status === 'fail').length;

  return (
    <div className="p-6 space-y-4 max-w-6xl">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search inspections…"
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><X size={14}/></button>}
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)}
          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none">
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="signed">Signed</option>
        </select>
        {types.length > 0 && (
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none">
            <option value="all">All types</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        )}
        <Button onClick={() => onNavigate('new')} icon={<Plus size={16} />}>New Inspection</Button>
      </div>

      {/* Count */}
      {filtered.length > 0 && (
        <p className="text-sm text-gray-500">{filtered.length} inspection{filtered.length !== 1 ? 's' : ''}</p>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState icon={<Search size={28} />} title="No inspections found"
          description={search ? 'Try adjusting your search or filters.' : 'Create your first inspection to get started.'}
          action={!search ? <Button onClick={() => onNavigate('new')} icon={<Plus size={16} />}>New Inspection</Button> : undefined} />
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-50 dark:divide-gray-800">
          {filtered.map(i => {
            const crit = criticalCount(i);
            const fails = failCount(i);
            return (
              <div key={i.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-xl flex-shrink-0">
                  {i.type === 'Property' ? '🏠' : i.type === 'Equipment' ? '⚙️' : i.type === 'Cleaning' ? '🧹' : '🚗'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{i.title}</span>
                    {i.isSample && <SampleBadge />}
                    <StatusBadge status={i.status} />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{i.location} · {i.client} · {i.date}</p>
                  {(crit > 0 || fails > 0) && (
                    <div className="flex items-center gap-2 mt-1.5">
                      {crit > 0 && <SeverityBadge severity="critical" />}
                      {fails > 0 && <span className="text-xs text-gray-500">{fails} issue{fails !== 1 ? 's' : ''}</span>}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className={`text-lg font-bold ${scoreColor(i.score)}`}>{i.score}%</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setSelected(i)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-brand-600">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => onEdit(i.id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 text-xs font-medium px-2">
                      Edit
                    </button>
                    <button onClick={() => setConfirmDelete(i.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title} size="xl">
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[['Location', selected.location], ['Inspector', selected.inspector], ['Client', selected.client], ['Date', selected.date]].map(([l,v]) => (
                <div key={l}><p className="text-gray-400">{l}</p><p className="font-medium text-gray-900 dark:text-white">{v || '—'}</p></div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={selected.status} />
              {selected.isSample && <SampleBadge />}
              <span className={`text-sm font-semibold ${scoreColor(selected.score)}`}>Score: {selected.score}%</span>
            </div>
            {selected.sections.map(sec => (
              <div key={sec.id}>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{sec.title}</h4>
                <div className="space-y-1.5">
                  {sec.items.map(item => (
                    <div key={item.id} className="flex items-start gap-3 text-sm">
                      <span className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        item.status === 'pass' ? 'bg-green-100 text-green-700' :
                        item.status === 'fail' ? 'bg-red-100 text-red-700' :
                        item.status === 'na' ? 'bg-gray-100 text-gray-500' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.status === 'pass' ? '✓' : item.status === 'fail' ? '✗' : item.status === 'na' ? '—' : '?'}
                      </span>
                      <div className="flex-1">
                        <span className="text-gray-800 dark:text-gray-200">{item.label}</span>
                        {item.notes && <p className="text-gray-400 text-xs mt-0.5">{item.notes}</p>}
                      </div>
                      <SeverityBadge severity={item.severity} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {selected.overallNotes && (
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Overall Notes</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl p-3">{selected.overallNotes}</p>
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <Button onClick={() => { onEdit(selected.id); setSelected(null); }} variant="secondary">Edit Inspection</Button>
              <Button onClick={() => { setConfirmDelete(selected.id); setSelected(null); }} variant="danger" icon={<Trash2 size={14}/>}>Delete</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete Inspection?" size="sm">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">This action cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setConfirmDelete(null)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={() => { store.deleteInspection(confirmDelete!); setConfirmDelete(null); }} className="flex-1">Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
