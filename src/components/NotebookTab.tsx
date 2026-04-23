import React, { useState } from 'react';
import { Plus, Book, ChevronLeft, Calendar, FileText, MousePointer2, PenLine, Trash2, X } from 'lucide-react';
import { Notebook, NotebookPage, RawMaterial, Formula, Fragrance, InventoryItem, Equipment } from '../types';
import NotebookCanvas from './NotebookCanvas';
import { motion, AnimatePresence } from 'motion/react';

interface NotebookTabProps {
  notebooks: Notebook[];
  setNotebooks: (notebooks: Notebook[]) => void;
  rawMaterials: RawMaterial[];
  formulas: Formula[];
  fragrances: Fragrance[];
  inventory: InventoryItem[];
  equipments: Equipment[];
}

export default function NotebookTab({
  notebooks,
  setNotebooks,
  rawMaterials,
  formulas,
  fragrances,
  inventory,
  equipments
}: NotebookTabProps) {
  const [activeNotebookId, setActiveNotebookId] = useState<string | null>(null);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [showCreateNotebook, setShowCreateNotebook] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState('');
  const [showCreatePage, setShowCreatePage] = useState(false);

  // For delete confirmation
  const [deleteConfirmInfo, setDeleteConfirmInfo] = useState<{type: 'notebook' | 'page', id: string} | null>(null);

  const activeNotebook = notebooks.find(n => n.id === activeNotebookId);

  const handleCreateNotebook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotebookName.trim()) return;

    const newNotebook: Notebook = {
      id: `nb_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: newNotebookName,
      createdAt: Date.now(),
      pages: []
    };

    setNotebooks([...notebooks, newNotebook]);
    setActiveNotebookId(newNotebook.id);
    setShowCreateNotebook(false);
    setNewNotebookName('');
  };

  const deleteNotebook = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotebooks(notebooks.filter(n => n.id !== id));
    if (activeNotebookId === id) setActiveNotebookId(null);
    setDeleteConfirmInfo(null);
  };

  const handleCreatePage = (backgroundType: 'blank' | 'lined' | 'grid') => {
    if (!activeNotebook) return;

    const newPage: NotebookPage = {
      id: `pg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: Date.now(),
      backgroundType,
      elements: [],
      drawings: []
    };

    const updatedNotebook = {
      ...activeNotebook,
      pages: [...activeNotebook.pages, newPage]
    };

    updateNotebook(updatedNotebook);
    setActivePageId(newPage.id);
    setShowCreatePage(false);
  };

  const deletePage = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!activeNotebook) return;

    const updatedNotebook = {
      ...activeNotebook,
      pages: activeNotebook.pages.filter(p => p.id !== id)
    };
    updateNotebook(updatedNotebook);
    if (activePageId === id) setActivePageId(null);
    setDeleteConfirmInfo(null);
  };

  const updateNotebook = (updated: Notebook) => {
    setNotebooks(notebooks.map(nb => nb.id === updated.id ? updated : nb));
  };

  const updatePage = (updatedPage: NotebookPage) => {
    if (!activeNotebook) return;

    const updatedNotebook = {
      ...activeNotebook,
      pages: activeNotebook.pages.map(p => p.id === updatedPage.id ? updatedPage : p)
    };
    updateNotebook(updatedNotebook);
  };

  // Render Modals
  const renderModals = () => {
    return (
      <AnimatePresence>
        {showCreateNotebook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-app-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-4 border-b border-app-border">
                <h3 className="font-bold text-lg text-app-text">Create Notebook</h3>
                <button onClick={() => setShowCreateNotebook(false)} className="text-app-muted hover:text-app-accent">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateNotebook} className="p-4">
                <label className="block text-sm font-medium text-app-muted mb-1">Notebook Name</label>
                <input
                  type="text"
                  value={newNotebookName}
                  onChange={(e) => setNewNotebookName(e.target.value)}
                  className="w-full px-4 py-2 bg-app-bg border border-app-border rounded-lg outline-none focus:ring-2 focus:ring-app-accent"
                  placeholder="e.g. Summer Formulas 2026"
                  autoFocus
                />
                <div className="flex justify-end gap-2 mt-6">
                  <button type="button" onClick={() => setShowCreateNotebook(false)} className="px-4 py-2 rounded-lg text-app-text bg-app-bg hover:bg-app-border transition">Cancel</button>
                  <button type="submit" disabled={!newNotebookName.trim()} className="px-4 py-2 rounded-lg bg-app-accent text-white hover:bg-app-accent-hover transition disabled:opacity-50">Create</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showCreatePage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-app-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-4 border-b border-app-border">
                <h3 className="font-bold text-lg text-app-text">Choose Page Template</h3>
                <button onClick={() => setShowCreatePage(false)} className="text-app-muted hover:text-app-accent">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 grid grid-cols-3 gap-3">
                <button onClick={() => handleCreatePage('blank')} className="flex flex-col items-center gap-2 p-4 border border-app-border rounded-xl hover:border-app-accent hover:bg-app-accent/5 transition group">
                  <div className="w-12 h-16 bg-app-bg border border-app-border shadow-sm rounded-sm"></div>
                  <span className="text-xs font-bold text-app-text group-hover:text-app-accent">Blank</span>
                </button>
                <button onClick={() => handleCreatePage('lined')} className="flex flex-col items-center gap-2 p-4 border border-app-border rounded-xl hover:border-app-accent hover:bg-app-accent/5 transition group">
                  <div className="w-12 h-16 bg-app-bg border border-app-border shadow-sm rounded-sm overflow-hidden flex flex-col justify-evenly px-1">
                    <div className="w-full h-[1px] bg-app-border"></div>
                    <div className="w-full h-[1px] bg-app-border"></div>
                    <div className="w-full h-[1px] bg-app-border"></div>
                    <div className="w-full h-[1px] bg-app-border"></div>
                  </div>
                  <span className="text-xs font-bold text-app-text group-hover:text-app-accent">Lined</span>
                </button>
                <button onClick={() => handleCreatePage('grid')} className="flex flex-col items-center gap-2 p-4 border border-app-border rounded-xl hover:border-app-accent hover:bg-app-accent/5 transition group">
                  <div className="w-12 h-16 bg-app-bg border border-app-border shadow-sm rounded-sm relative overflow-hidden" style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
                  <span className="text-xs font-bold text-app-text group-hover:text-app-accent">Grid</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {deleteConfirmInfo && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-app-card w-full max-w-sm rounded-2xl shadow-xl overflow-hidden p-6 text-center"
             >
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={32} />
                </div>
                <h3 className="font-bold text-xl text-app-text mb-2">Delete {deleteConfirmInfo.type === 'notebook' ? 'Notebook' : 'Page'}?</h3>
                <p className="text-app-muted text-sm mb-6">This action cannot be undone. All content within will be permanently removed.</p>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => setDeleteConfirmInfo(null)} className="px-5 py-2 font-medium rounded-lg text-app-text bg-app-bg hover:bg-app-border transition">Cancel</button>
                  <button onClick={() => deleteConfirmInfo.type === 'notebook' ? deleteNotebook(deleteConfirmInfo.id) : deletePage(deleteConfirmInfo.id)} className="px-5 py-2 font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition">Delete</button>
                </div>
             </motion.div>
           </div>
        )}
      </AnimatePresence>
    );
  };

  // Render Page Canvas view
  if (activeNotebook && activePageId) {
    const activePage = activeNotebook.pages.find(p => p.id === activePageId);
    if (activePage) {
      return (
        <NotebookCanvas
          notebook={activeNotebook}
          updateNotebook={updateNotebook}
          activePageId={activePageId}
          setActivePageId={setActivePageId}
          onBack={() => setActivePageId(null)}
          rawMaterials={rawMaterials}
          formulas={formulas}
          fragrances={fragrances}
          inventory={inventory}
          equipments={equipments}
        />
      );
    }
  }

  // Render Notebook Front Page (Table of contents)
  if (activeNotebook) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {renderModals()}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveNotebookId(null)}
              className="p-2 -ml-2 rounded-lg text-app-muted hover:text-app-text hover:bg-app-card transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-app-text">{activeNotebook.name}</h2>
              <p className="text-app-muted">Table of Contents</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreatePage(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-app-accent text-white rounded-lg hover:bg-app-accent-hover transition-colors shadow-sm font-medium"
          >
            <Plus size={20} />
            <span>New Page</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {activeNotebook.pages.map((page, idx) => (
              <motion.div
                key={page.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -4 }}
                className="bg-app-card rounded-xl border border-app-border shadow-sm overflow-hidden cursor-pointer group"
                onClick={() => setActivePageId(page.id)}
              >
                <div className="h-32 flex flex-col justify-center items-center bg-app-bg border-b border-app-border relative overflow-hidden">
                  {/* Miniature representation of the page background */}
                  {page.backgroundType === 'grid' && (
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                  )}
                  {page.backgroundType === 'lined' && (
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 20px' }} />
                  )}
                  <span className="text-3xl font-black text-app-accent/20">PAGE {idx + 1}</span>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirmInfo({ type: 'page', id: page.id });
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="p-4">
                  <div className="text-sm font-medium text-app-text mb-1">Page {idx + 1}</div>
                  <div className="flex items-center gap-2 text-xs text-app-muted">
                    <Calendar size={12} />
                    {new Date(page.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2 mt-3 text-app-muted text-xs">
                    <span className="flex items-center gap-1 bg-app-bg px-2 py-1 rounded-md">
                      <FileText size={12} /> {page.elements.filter(e => e.type === 'text').length} Text
                    </span>
                    <span className="flex items-center gap-1 bg-app-bg px-2 py-1 rounded-md">
                      <PenLine size={12} /> {page.drawings.length} Sketches
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {activeNotebook.pages.length === 0 && (
             <div className="col-span-full py-12 text-center text-app-muted bg-app-card border border-dashed border-app-border rounded-xl">
               <p>This notebook is empty.</p>
               <button onClick={() => setShowCreatePage(true)} className="text-app-accent font-medium mt-2 hover:underline">Create your first page</button>
             </div>
          )}
        </div>
      </div>
    );
  }

  // Render Notebooks List
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {renderModals()}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-app-text">Notebooks</h2>
          <p className="text-app-muted">Your personal lab journals and sketchpads</p>
        </div>
        <button
          onClick={() => setShowCreateNotebook(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-app-accent text-white rounded-lg hover:bg-app-accent-hover transition-colors shadow-sm font-medium"
        >
          <Plus size={20} />
          <span>New Notebook</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {notebooks.map((notebook) => (
            <motion.div
              key={notebook.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -4 }}
              className="bg-app-card rounded-xl border border-app-border shadow-sm p-5 cursor-pointer group flex flex-col justify-between h-48 relative"
              onClick={() => setActiveNotebookId(notebook.id)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteConfirmInfo({ type: 'notebook', id: notebook.id });
                }}
                className="absolute top-3 right-3 p-1.5 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
              >
                <Trash2 size={16} />
              </button>
              
              <div className="p-3 bg-app-accent/10 text-app-accent rounded-xl w-fit mb-4">
                <Book size={24} />
              </div>
              
              <div>
                <h3 className="font-bold text-app-text text-lg line-clamp-1">{notebook.name}</h3>
                <div className="flex items-center justify-between mt-2 text-sm text-app-muted">
                  <span className="flex items-center gap-1"><FileText size={14}/> {notebook.pages.length} Pages</span>
                  <span>{new Date(notebook.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {notebooks.length === 0 && (
           <div className="col-span-full py-20 text-center text-app-muted">
             <div className="mx-auto w-16 h-16 bg-app-card border-2 border-app-border rounded-full flex items-center justify-center mb-4">
                <Book size={32} className="opacity-20" />
             </div>
             <p className="text-lg font-medium text-app-text">No notebooks yet</p>
             <p className="text-sm mt-1">Create an interactive journal for your lab notes.</p>
           </div>
        )}
      </div>
    </div>
  );
}
