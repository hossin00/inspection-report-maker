import { useState } from 'react';
import { Plus, FileText, Trash2, Copy, Edit3, Search } from 'lucide-react';
import { Template, ChecklistSection } from '../types';
import { SampleBadge, EmptyState, ConfirmModal } from '../components/UI';
import { saveTemplate, deleteTemplate, generateId } from '../utils/storage';

interface Props {
  templates: Template[];
  onRefresh: () => void;
}

const CATEGORIES = ['All','Real Estate','Industrial','Cleaning Services','Safety & Compliance','General','Other'];

export default function Templates({ templates, onRefresh }: Props) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [deleteId, setDeleteId] = useState<string|null>(null);
  const [editing, setEditing] = useState<Template|null>(null);

  const filtered = templates.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = cat === 'All' || t.category === cat;
    return matchSearch && matchCat;
  });

  function handleDuplicate(tpl: Template) {
    const dup: Template = {
      ...JSON.parse(JSON.stringify(tpl)),
      id: generateId('tpl'),
      name: `${tpl.name} (Copy)`,
      isSample: false,
    };
    saveTemplate(dup);
    onRefresh();
  }

  function handleDelete() {
    if (!deleteId) return;
    deleteTemplate(deleteId);
    setDeleteId(null);
    onRefresh();
  }

  function handleSaveTemplate(tpl: Template) {
    saveTemplate(tpl);
    setEditing(null);
    onRefresh();
  }

  function newTemplate(): Template {
    return {
      id: generateId('tpl'),
      name: '',
      category: 'General',
      description: '',
      sections: [
        { id: generateId('sec'), title: 'Section 1', items: [] }
      ],
    };
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-700 text-slate-900 dark:text-white">Templates</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{templates.length} templates</p>
        </div>
        <button
          onClick={() => setEditing(newTemplate())}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-600 transition-colors shadow-sm"
        >
          <Plus size={16}/> New Template
        </button>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15}/>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3 py-2 text-xs font-500 rounded-lg transition-colors ${cat===c ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileText size={48}/>}
          title="No templates found"
          description="Create a template to reuse across multiple inspections."
          action={
            <button onClick={() => setEditing(newTemplate())} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-600">
              Create Template
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(tpl => (
            <div key={tpl.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-600 text-slate-900 dark:text-white text-sm truncate">{tpl.name}</h3>
                    {tpl.isSample && <SampleBadge/>}
                  </div>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-500">{tpl.category}</span>
                </div>
                <div className="flex gap-1 ml-2">
                  {!tpl.isSample && (
                    <button onClick={() => setEditing(JSON.parse(JSON.stringify(tpl)))} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <Edit3 size={14}/>
                    </button>
                  )}
                  <button onClick={() => handleDuplicate(tpl)} className="p-1.5 text-slate-400 hover:text-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20">
                    <Copy size={14}/>
                  </button>
                  {!tpl.isSample && (
                    <button onClick={() => setDeleteId(tpl.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 size={14}/>
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{tpl.description}</p>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span>{tpl.sections.length} section{tpl.sections.length!==1?'s':''}</span>
                <span>·</span>
                <span>{tpl.sections.reduce((s,x)=>s+x.items.length,0)} items</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteId && (
        <ConfirmModal
          title="Delete Template"
          message="This template will be permanently deleted."
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {editing && (
        <TemplateEditor
          template={editing}
          onSave={handleSaveTemplate}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}

// ── Template Editor Modal ──────────────────────────────────
function TemplateEditor({ template: initial, onSave, onCancel }: {
  template: Template;
  onSave: (t: Template) => void;
  onCancel: () => void;
}) {
  const [tpl, setTpl] = useState<Template>(initial);

  function addSection() {
    setTpl(p => ({ ...p, sections: [...p.sections, { id: generateId('sec'), title: 'New Section', items: [] }] }));
  }
  function addItem(secId: string) {
    setTpl(p => ({
      ...p,
      sections: p.sections.map(s => s.id === secId
        ? { ...s, items: [...s.items, { id: generateId('item'), label: 'New item', severity: 'na' as const, notes: '', photoPlaceholder: false }] }
        : s
      )
    }));
  }
  function removeSection(secId: string) {
    setTpl(p => ({ ...p, sections: p.sections.filter(s => s.id !== secId) }));
  }
  function removeItem(secId: string, itemId: string) {
    setTpl(p => ({
      ...p,
      sections: p.sections.map(s => s.id === secId ? { ...s, items: s.items.filter(i => i.id !== itemId) } : s)
    }));
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl my-8">
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-700 text-slate-900 dark:text-white">{initial.name ? 'Edit Template' : 'New Template'}</h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-600 text-slate-500 mb-1.5">Template Name</label>
              <input value={tpl.name} onChange={e=>setTpl(p=>({...p,name:e.target.value}))} placeholder="e.g. Property Inspection" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="block text-xs font-600 text-slate-500 mb-1.5">Category</label>
              <select value={tpl.category} onChange={e=>setTpl(p=>({...p,category:e.target.value}))} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {CATEGORIES.filter(c=>c!=='All').map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-600 text-slate-500 mb-1.5">Description</label>
              <input value={tpl.description} onChange={e=>setTpl(p=>({...p,description:e.target.value}))} placeholder="Brief description" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>

          {tpl.sections.map(sec => (
            <div key={sec.id} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-700/50">
                <input value={sec.title} onChange={e=>setTpl(p=>({...p,sections:p.sections.map(s=>s.id===sec.id?{...s,title:e.target.value}:s)}))} className="flex-1 bg-transparent font-600 text-sm text-slate-900 dark:text-white focus:outline-none"/>
                <button onClick={()=>removeSection(sec.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={13}/></button>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {sec.items.map(item => (
                  <div key={item.id} className="flex items-center gap-2 px-4 py-2.5">
                    <input value={item.label} onChange={e=>setTpl(p=>({...p,sections:p.sections.map(s=>s.id===sec.id?{...s,items:s.items.map(i=>i.id===item.id?{...i,label:e.target.value}:i)}:s)}))} className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 focus:outline-none"/>
                    <button onClick={()=>removeItem(sec.id,item.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={12}/></button>
                  </div>
                ))}
              </div>
              <button onClick={()=>addItem(sec.id)} className="w-full px-4 py-2.5 text-xs text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-left font-500 flex items-center gap-1">
                <Plus size={12}/> Add item
              </button>
            </div>
          ))}
          <button onClick={addSection} className="w-full py-2.5 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-sm text-slate-500 hover:border-blue-400 hover:text-blue-600 flex items-center justify-center gap-1.5">
            <Plus size={14}/> Add Section
          </button>
        </div>
        <div className="p-5 border-t border-slate-200 dark:border-slate-700 flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-500 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">Cancel</button>
          <button onClick={()=>onSave(tpl)} className="px-4 py-2 text-sm font-600 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Save Template</button>
        </div>
      </div>
    </div>
  );
}
