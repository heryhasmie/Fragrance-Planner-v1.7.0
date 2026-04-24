import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, MousePointer2, PenTool, Type, List, Trash2, Edit2, Check, Copy, Square, Circle, Triangle, Layers, BarChart2, Hash, ChevronRight, Settings, ChevronDown, Search, Lock, Unlock } from 'lucide-react';
import { Notebook, NotebookPage, NotebookElement, NotebookTextBox, NotebookDropdown, NotebookDrawing, NotebookGroup, DrawingPath, RawMaterial, Formula, Fragrance, InventoryItem, Equipment } from '../types';
import { motion, AnimatePresence } from 'motion/react';
// import { BarChart, Bar, LineChart, Line, PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area, Cell, ResponsiveContainer } from 'recharts';

interface NotebookCanvasProps {
  notebook: Notebook;
  updateNotebook: (notebook: Notebook) => void;
  activePageId: string;
  setActivePageId: (id: string) => void;
  onBack: () => void;
  rawMaterials: RawMaterial[];
  formulas: Formula[];
  fragrances: Fragrance[];
  inventory: InventoryItem[];
  equipments: Equipment[];
}

const getContrastColor = (hexColor: string) => {
  if (!hexColor || hexColor === '#currentColor' || hexColor === 'transparent') return 'text-black dark:text-white';
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6 && hex.length !== 3) return 'text-black dark:text-white';
  let r, g, b;
  if (hex.length === 3) {
    r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
    g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
    b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
  } else {
    r = parseInt(hex.substr(0, 2), 16);
    g = parseInt(hex.substr(2, 2), 16);
    b = parseInt(hex.substr(4, 2), 16);
  }
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 128 ? 'text-black' : 'text-white';
};

export default function NotebookCanvas({
  notebook,
  updateNotebook,
  activePageId,
  setActivePageId,
  onBack,
  rawMaterials,
  formulas,
  fragrances,
  inventory,
  equipments
}: NotebookCanvasProps) {
  const page = notebook.pages.find(p => p.id === activePageId);
  const pageIndex = notebook.pages.findIndex(p => p.id === activePageId);

  const updatePage = (updatedPage: NotebookPage) => {
    updateNotebook({
      ...notebook,
      pages: notebook.pages.map(p => p.id === updatedPage.id ? updatedPage : p)
    });
  };

  const [tool, setTool] = useState<'pointer' | 'draw'>('pointer');
  const [sketchMode, setSketchMode] = useState<'freehand' | 'straight'>('freehand');
  const [currentColor, setCurrentColor] = useState('#currentColor');
  const [currentOpacity, setCurrentOpacity] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<{ x: number, y: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [editingElementId, setEditingElementId] = useState<string | null>(null);

  if (!page) return null;

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectionBox, setSelectionBox] = useState<{startX: number, startY: number, endX: number, endY: number} | null>(null);

  // Resize State
  const [resizingElement, setResizingElement] = useState<{ id: string, type: string, startX: number, startY: number, startW: number, startH: number, originalElement: any, currentUpdate?: any } | null>(null);

  const startResize = (e: React.PointerEvent, id: string, type: string) => {
    e.stopPropagation();
    const el = page.elements.find(e => e.id === id);
    if (!el || el.isLocked) return;
    setResizingElement({
       id, type,
       startX: e.clientX,
       startY: e.clientY,
       startW: (el as any).width || 100,
       startH: (el as any).height || 100,
       originalElement: JSON.parse(JSON.stringify(el)) // Deep copy to prevent mutation pollution
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  // Migrate legacy drawings to elements on mount
  useEffect(() => {
    if (page.drawings && page.drawings.length > 0) {
      const migratedDrawings: NotebookDrawing[] = page.drawings.map(d => {
        const minX = Math.min(...d.points.map(p => p.x));
        const maxX = Math.max(...d.points.map(p => p.x));
        const minY = Math.min(...d.points.map(p => p.y));
        const maxY = Math.max(...d.points.map(p => p.y));
        
        return {
          id: `element_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          type: 'drawing',
          x: minX,
          y: minY,
          width: Math.max(maxX - minX, 10),
          height: Math.max(maxY - minY, 10),
          points: d.points.map(p => ({ x: p.x - minX, y: p.y - minY })),
          color: d.color,
          strokeWidth: d.strokeWidth
        };
      });

      updatePage({
        ...page,
        elements: [...page.elements, ...migratedDrawings],
        drawings: [] // clear legacy
      });
    }
  }, [page.drawings]);

  // Background styling
  const getBackgroundStyle = () => {
    switch (page.backgroundType) {
      case 'grid':
        return {
          backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        };
      case 'lined':
        return {
          backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px)',
          backgroundSize: '100% 40px'
        };
      default:
        return {};
    }
  };

  const addTextBox = () => {
    const newBox: NotebookTextBox = {
      id: `element_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      type: 'text',
      x: 100,
      y: 100,
      content: '',
      width: 250,
      height: 150,
      color: currentColor === '#currentColor' ? '#FEFCE8' : currentColor, // default yellow-50
      opacity: currentOpacity
    };
    updatePage({ ...page, elements: [...page.elements, newBox] });
    setTool('pointer');
    setEditingElementId(newBox.id);
    setSelectedIds([newBox.id]);
  };

  const groupSelected = () => {
    if (selectedIds.length < 2) return;
    
    const selectedElements = page.elements.filter(e => selectedIds.includes(e.id));
    const minX = Math.min(...selectedElements.map(e => e.x));
    const maxX = Math.max(...selectedElements.map(e => {
       const w = (e as any).width || (e.type === 'dropdown' ? 240 : 250);
       return e.x + w;
    }));
    const minY = Math.min(...selectedElements.map(e => e.y));
    const maxY = Math.max(...selectedElements.map(e => {
       const h = (e as any).height || (e.type === 'dropdown' ? 80 : 100);
       return e.y + h;
    }));

    // Normalize elements relative to the group
    const normalizedElements = selectedElements.map(e => ({
      ...e,
      x: e.x - minX,
      y: e.y - minY
    }));

    const newGroup: NotebookGroup = {
      id: `element_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      type: 'group',
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      items: normalizedElements
    };

    updatePage({
      ...page,
      elements: [...page.elements.filter(e => !selectedIds.includes(e.id)), newGroup]
    });
    setSelectedIds([newGroup.id]);
  };

  const addDropdown = () => {
    const newDropdown: NotebookDropdown = {
      id: `element_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      type: 'dropdown',
      x: 100,
      y: 200,
      width: 250,
      height: 80,
      category: 'Material',
      selectedItemId: null
    };
    updatePage({ ...page, elements: [...page.elements, newDropdown] });
    setTool('pointer');
    setSelectedIds([newDropdown.id]);
  };

  const updateElement = (id: string, updates: Partial<NotebookElement>) => {
    updatePage({
      ...page,
      elements: page.elements.map(e => e.id === id ? { ...e, ...updates } as NotebookElement : e)
    });
  };

  const deleteSelected = () => {
    updatePage({
      ...page,
      elements: page.elements.filter(e => !selectedIds.includes(e.id))
    });
    setSelectedIds([]);
    setEditingElementId(null);
  };

  const duplicateSelected = () => {
    const selectedElements = page.elements.filter(e => selectedIds.includes(e.id));
    const duplicatedElements = selectedElements.map(el => {
      const newId = `element_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      return {
        ...el,
        id: newId,
        x: el.x + 20, // offset slightly
        y: el.y + 20
      };
    });
    
    updatePage({
      ...page,
      elements: [...page.elements, ...duplicatedElements]
    });
    setSelectedIds(duplicatedElements.map(e => e.id));
  };

  const toggleLockSelected = () => {
    const updatedElements = page.elements.map(e => 
      selectedIds.includes(e.id) ? { ...e, isLocked: !e.isLocked } : e
    );
    updatePage({ ...page, elements: updatedElements });
  };

  // Drawing logic
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'draw') {
      setIsDrawing(true);
      setCurrentStroke([{ x, y }]);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } else if (tool === 'pointer') {
      // Start selection box if clicking on background
      if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'path' || (e.target as HTMLElement).tagName === 'svg') {
        setSelectionBox({ startX: x, startY: y, endX: x, endY: y });
        setSelectedIds([]); // clear selection
        setEditingElementId(null);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    if (resizingElement) {
       const dx = e.clientX - resizingElement.startX;
       const dy = e.clientY - resizingElement.startY;
       
       let newW = Math.max(20, resizingElement.startW + dx);
       let newH = Math.max(20, resizingElement.startH + dy);

       const scaleX = newW / resizingElement.startW;
       const scaleY = newH / resizingElement.startH;
       
       let currentUpdate: any = {};

       if (resizingElement.type === 'group') {
         // Scale all items within the group
         const scaleGroupItems = (items: NotebookElement[]): NotebookElement[] => {
            return items.map(item => {
               const scaledItem = { ...item };
               // Calculate bounds using the original snapshot recursively
               scaledItem.x = item.x * scaleX;
               scaledItem.y = item.y * scaleY;
               if ((item as any).width) (scaledItem as any).width = Math.max(5, (item as any).width * scaleX);
               if ((item as any).height) (scaledItem as any).height = Math.max(5, (item as any).height * scaleY);
               
               if (item.type === 'drawing') {
                 // Rescale drawing points
                 (scaledItem as NotebookDrawing).points = (item as NotebookDrawing).points.map(p => ({
                    x: p.x * scaleX,
                    y: p.y * scaleY
                 }));
                 // Scaling stroke width looks better too
                 (scaledItem as NotebookDrawing).strokeWidth = Math.max(1, (item as NotebookDrawing).strokeWidth * Math.min(scaleX, scaleY));
               }
               
               if (item.type === 'group') {
                 (scaledItem as NotebookGroup).items = scaleGroupItems((item as NotebookGroup).items);
               }
               
               return scaledItem;
            });
         };

         const originalGroup = resizingElement.originalElement as NotebookGroup;
         if (originalGroup) {
            currentUpdate = { 
              width: newW, 
              height: newH,
              items: scaleGroupItems(originalGroup.items)
            };
         }
       } else if (resizingElement.type === 'drawing') {
          const originalDrawing = resizingElement.originalElement as NotebookDrawing;
          if (originalDrawing) {
             const scaledPoints = originalDrawing.points.map(p => ({
                 x: p.x * scaleX,
                 y: p.y * scaleY
             }));
             currentUpdate = {
                 width: newW,
                 height: newH,
                 points: scaledPoints,
                 strokeWidth: Math.max(1, originalDrawing.strokeWidth * Math.min(scaleX, scaleY))
             };
          }
       } else {
         currentUpdate = { width: newW, height: newH };
       }
       
       setResizingElement(prev => prev ? { ...prev, currentUpdate } : null);
       return;
    }

    if (tool === 'draw' && isDrawing) {
      if (sketchMode === 'straight') {
        const snapThreshold = 15;
        let snapX = x;
        let snapY = y;
        
        // Find snapping points (endpoints of all drawings)
        const snapPoints = page.elements
          .filter(el => el.type === 'drawing')
          .flatMap(el => {
            const drEl = el as NotebookDrawing;
            if (drEl.points.length === 0) return [];
            return [
               { x: drEl.x + drEl.points[0].x, y: drEl.y + drEl.points[0].y },
               { x: drEl.x + drEl.points[drEl.points.length - 1].x, y: drEl.y + drEl.points[drEl.points.length - 1].y }
            ];
          });
        
        for (const pt of snapPoints) {
           if (Math.hypot(pt.x - x, pt.y - y) < snapThreshold) {
              snapX = pt.x;
              snapY = pt.y;
              break;
           }
        }
        
        setCurrentStroke(prev => {
          if (prev.length < 2) return [...prev, { x: snapX, y: snapY }];
          return [prev[0], { x: snapX, y: snapY }];
        });
      } else {
        setCurrentStroke(prev => [...prev, { x, y }]);
      }
    } else if (tool === 'pointer' && selectionBox) {
      setSelectionBox({ ...selectionBox, endX: x, endY: y });
      
      // Calculate intersection with elements
      const minX = Math.min(selectionBox.startX, x);
      const maxX = Math.max(selectionBox.startX, x);
      const minY = Math.min(selectionBox.startY, y);
      const maxY = Math.max(selectionBox.startY, y);

      const newlySelected = page.elements.filter(el => {
        const elWidth = el.type === 'text' ? (el.width || 250) : el.type === 'dropdown' ? 240 : (el.width || 50);
        const elHeight = el.type === 'text' ? (el.height || 100) : el.type === 'dropdown' ? 80 : (el.height || 50);
        
        return (
          el.x < maxX &&
          el.x + elWidth > minX &&
          el.y < maxY &&
          el.y + elHeight > minY
        );
      }).map(el => el.id);

      setSelectedIds(newlySelected);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    
    if (resizingElement) {
       if (resizingElement.currentUpdate) {
         updateElement(resizingElement.id, resizingElement.currentUpdate);
       }
       setResizingElement(null);
       return;
    }

    if (tool === 'draw' && isDrawing) {
      setIsDrawing(false);
      if (currentStroke.length >= 2) {
        const minX = Math.min(...currentStroke.map(p => p.x));
        const maxX = Math.max(...currentStroke.map(p => p.x));
        const minY = Math.min(...currentStroke.map(p => p.y));
        const maxY = Math.max(...currentStroke.map(p => p.y));
        
        const width = Math.max(maxX - minX, 10);
        const height = Math.max(maxY - minY, 10);

        const normalizedPoints = currentStroke.map(p => ({
          x: p.x - minX,
          y: p.y - minY
        }));

        const newDrawing: NotebookDrawing = {
          id: `element_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          type: 'drawing',
          x: minX,
          y: minY,
          width,
          height,
          points: normalizedPoints,
          color: currentColor === '#currentColor' ? 'var(--accent)' : currentColor,
          strokeWidth: 3,
          drawingType: sketchMode
        };
        updatePage({ ...page, elements: [...page.elements, newDrawing] });
      }
      setCurrentStroke([]);
    } else if (tool === 'pointer' && selectionBox) {
      setSelectionBox(null);
    }
  };

  const drawPath = (points: {x: number, y: number}[], mode: 'freehand' | 'straight' | 'curve' = 'freehand') => {
    if(points.length === 0) return '';
    if(mode === 'straight' && points.length > 0) {
      // Just draw from first to last point
      return `M ${points[0].x} ${points[0].y} L ${points[points.length - 1].x} ${points[points.length - 1].y}`;
    }
    const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    return d;
  };

  const renderElement = (baseEl: NotebookElement, isGrouped: boolean = false) => {
    const el = (resizingElement?.id === baseEl.id && resizingElement.currentUpdate) 
       ? { ...baseEl, ...resizingElement.currentUpdate } as NotebookElement 
       : baseEl;
       
    const isSelected = selectedIds.includes(el.id) && !isGrouped;
    const isEditing = editingElementId === el.id;
    const isLocked = !!el.isLocked;

    const Wrapper = isGrouped ? 'div' : motion.div;
    const wrapperProps: any = isGrouped ? {
      className: "absolute",
      style: { left: el.x, top: el.y, width: (el as any).width, height: (el as any).height }
    } : {
      drag: tool === 'pointer' && !isLocked,
      dragListener: tool === 'pointer' && !isLocked,
      dragMomentum: false,
      onDragStart: (e: any) => {
        if (!isSelected && tool === 'pointer') setSelectedIds([el.id]);
      },
      onDragEnd: (e: any, info: any) => {
        if (isLocked) return;
        if (isSelected && selectedIds.length > 1) {
          const dx = info.offset.x;
          const dy = info.offset.y;
          const updatedElements = page.elements.map(e => 
            selectedIds.includes(e.id) ? { ...e, x: e.x + dx, y: e.y + dy } : e
          );
          updatePage({ ...page, elements: updatedElements });
        } else {
          updateElement(el.id, { x: el.x + info.offset.x, y: el.y + info.offset.y });
        }
      },
      onPointerDown: (e: React.PointerEvent) => handleElementClick(e, el.id),
      initial: false,
      animate: { x: el.x, y: el.y },
      className: `absolute group ${isSelected ? 'border outline outline-2 outline-app-accent z-30' : 'z-10'} ${isLocked ? 'ring-1 ring-app-accent/30 ring-dashed' : ''}`,
      style: { 
        left: 0, top: 0,
        width: (el as any).width || 250, 
        height: (el as any).height || 100,
        pointerEvents: tool === 'pointer' ? 'auto' : 'none',
        touchAction: 'none',
      }
    };

    if (el.type === 'text') {
      const tEl = el as NotebookTextBox;
      return (
        <Wrapper key={el.id} {...wrapperProps} className={`${wrapperProps.className} shadow-md ${!isSelected && !isGrouped ? 'border border-yellow-200 dark:border-yellow-700/50 hover:border-yellow-400' : ''} rounded-sm`}
          style={{ ...wrapperProps.style, fontFamily: '"Courier New", Courier, monospace', height: tEl.height || 100, backgroundColor: tEl.color, opacity: tEl.opacity ?? 1 }}>
           <div className="absolute inset-0 p-4 w-full h-full">
             {!isEditing && (
               <div className={`w-full h-full whitespace-pre-wrap overflow-hidden break-words cursor-text font-[inherit] ${getContrastColor(tEl.color || '#FEFCE8')}`}
                 onDoubleClick={() => !isGrouped && setEditingElementId(el.id)}>
                 {tEl.content || <span className="opacity-40 italic">Double click to edit...</span>}
               </div>
             )}
             {isEditing && !isGrouped && (
               <textarea autoFocus className={`w-full h-full bg-transparent resize-none outline-none font-[inherit] ${getContrastColor(tEl.color || '#FEFCE8')}`}
                 value={tEl.content} onChange={(e) => updateElement(el.id, { content: e.target.value })} onBlur={() => setEditingElementId(null)} />
             )}
           </div>
           {!isGrouped && !isLocked && (
             <button className={`absolute -top-3 -right-3 bg-app-accent text-white p-1.5 rounded-full shadow-md transition-opacity z-50 ${isSelected || isEditing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
               onPointerDown={(e) => { e.stopPropagation(); setEditingElementId(isEditing ? null : el.id); }} title={isEditing ? "Done" : "Edit Text"}>
               {isEditing ? <Check size={14} /> : <Edit2 size={14} />}
             </button>
           )}
           {isSelected && !isGrouped && !isLocked && (
             <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-white border-2 border-app-accent rounded-full cursor-nwse-resize z-50 shadow-sm"
                  onPointerDownCapture={(e) => { e.stopPropagation(); startResize(e, el.id, 'text'); }} />
           )}
        </Wrapper>
      );
    }
    
    if (el.type === 'dropdown') {
      const dEl = el as NotebookDropdown;
      return (
        <Wrapper key={el.id} {...wrapperProps} className={`${wrapperProps.className} bg-app-bg shadow-md border rounded-lg ${!isSelected && !isGrouped ? 'border-app-border hover:border-app-accent/50' : ''}`} style={{ ...wrapperProps.style, minWidth: 200, height: dEl.height || 'auto', overflow: 'visible' }}>
          <div className="p-3 w-full h-full flex flex-col">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-app-border">
               <select className="text-xs font-bold uppercase tracking-wider bg-transparent outline-none text-app-accent cursor-pointer w-full"
                 value={dEl.category} onChange={(e) => updateElement(el.id, { category: e.target.value as any, selectedItemId: null, isOpen: false, searchQuery: '' })}
                 onPointerDown={(e) => e.stopPropagation()} disabled={isGrouped}>
                 <option value="Material">Material</option><option value="Formula">Formula</option><option value="Fragrance">Fragrance</option><option value="Inventory">Inventory</option><option value="Equipment">Equipment</option>
               </select>
            </div>
            
            <div className="flex-1 relative" onPointerDown={(e) => !isGrouped && e.stopPropagation()}>
               {(() => {
                 const list = dEl.category === 'Material' ? rawMaterials : dEl.category === 'Formula' ? formulas : dEl.category === 'Fragrance' ? fragrances : dEl.category === 'Inventory' ? inventory : equipments;
                 const selectedItem = list.find(i => i.id === dEl.selectedItemId) || list.find(i => i.name === dEl.selectedItemId); // Fallback for custom strings if previously saved
                 
                 const filteredList = list.filter(i => i.name.toLowerCase().includes((dEl.searchQuery || '').toLowerCase()));

                 return (
                   <div className="w-full">
                     <button
                       className="w-full text-sm p-2 bg-app-card border border-app-border rounded-md shadow-sm outline-none text-app-text flex items-center justify-between hover:border-app-accent/50 transition-colors cursor-pointer"
                       onClick={() => updateElement(el.id, { isOpen: !dEl.isOpen, searchQuery: '' })}
                       disabled={isGrouped}
                     >
                       <span className="truncate font-medium">{selectedItem ? selectedItem.name : `Select ${dEl.category}...`}</span>
                       <ChevronDown size={14} className="text-app-muted shrink-0 ml-2" />
                     </button>
                     
                     {dEl.isOpen && !isGrouped && (
                       <div className="absolute top-full left-0 mt-1 w-[240px] bg-app-card border border-app-border rounded-md shadow-2xl z-[999] overflow-hidden text-left"
                            onPointerDown={(e) => e.stopPropagation()}>
                         <div className="flex items-center gap-2 p-2 border-b border-app-border bg-app-bg text-app-muted">
                           <Search size={14} className="shrink-0" />
                           <input 
                             type="text" 
                             autoFocus
                             placeholder="Search..." 
                             value={dEl.searchQuery || ''}
                             onChange={(e) => updateElement(el.id, { searchQuery: e.target.value })}
                             className="w-full text-sm bg-transparent outline-none text-app-text"
                           />
                         </div>
                         <div className="max-h-48 overflow-y-auto p-1 custom-scrollbar bg-app-card">
                           {filteredList.map(item => (
                             <div 
                               key={item.id} 
                               className="px-2 py-1.5 text-sm rounded-md hover:bg-app-accent/10 hover:text-app-accent cursor-pointer transition-colors"
                               onClick={() => updateElement(el.id, { selectedItemId: item.id, isOpen: false, searchQuery: '' })}
                             >
                               <div className="truncate font-medium">{item.name}</div>
                               {(item as any).concentration && <div className="text-xs text-app-muted truncate">({(item as any).concentration}%)</div>}
                             </div>
                           ))}
                           {filteredList.length === 0 && (
                             <div className="px-2 py-3 text-sm text-center text-app-muted">No results found.</div>
                           )}
                         </div>
                       </div>
                     )}
                   </div>
                 );
               })()}
            </div>
          </div>
          {isSelected && !isGrouped && !isLocked && (
             <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-white border-2 border-app-accent rounded-full cursor-nwse-resize z-[100] shadow-sm"
                  onPointerDownCapture={(e) => { e.stopPropagation(); startResize(e, el.id, 'dropdown'); }} />
          )}
        </Wrapper>
      );
    }

    if (el.type === 'drawing') {
      const drEl = el as NotebookDrawing;
      return (
        <Wrapper key={el.id} {...wrapperProps} className={`${wrapperProps.className} border border-transparent ${!isSelected && !isGrouped ? 'hover:border-dashed hover:border-app-muted z-10' : ''}`}
          style={{ ...wrapperProps.style, width: drEl.width, height: drEl.height }}>
          {/* We do NOT use viewBox here because drEl.points are exactly mapped to wrapper pixels. This prevents scaling thick strokes on flat rects. */}
          <svg className="w-full h-full pointer-events-none stroke-current" style={{ color: drEl.color, overflow: 'visible' }}>
            <path d={drawPath(drEl.points, drEl.drawingType)} fill="none" strokeWidth={drEl.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          
          {isSelected && !isGrouped && !isLocked && (
             <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-app-accent rounded-full cursor-nwse-resize z-50 shadow-sm"
                  onPointerDownCapture={(e) => { e.stopPropagation(); startResize(e, el.id, 'drawing'); }} />
          )}
        </Wrapper>
      );
    }

    if (el.type === 'group') {
      const gEl = el as NotebookGroup;
      return (
        <Wrapper key={el.id} {...wrapperProps} className={`${wrapperProps.className} ${!isSelected && !isGrouped ? 'hover:border hover:border-dashed hover:border-app-muted z-10' : ''}`} style={{ ...wrapperProps.style, width: gEl.width, height: gEl.height }}>
           <div className="relative w-full h-full border border-dashed border-transparent hover:border-app-muted">
             {gEl.items.map(subEl => renderElement(subEl, true))}
           </div>
           {isSelected && !isGrouped && !isLocked && (
             <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-white border-2 border-app-accent rounded-full cursor-nwse-resize z-50 shadow-sm"
                  onPointerDownCapture={(e) => { e.stopPropagation(); startResize(e, el.id, 'group'); }} />
           )}
        </Wrapper>
      );
    }

    return null;
  };

  const handleElementClick = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    if (tool === 'pointer') {
      if (e.shiftKey) {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
      } else {
        setSelectedIds([id]);
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] animate-in fade-in duration-500">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 bg-app-card p-3 rounded-xl border border-app-border shadow-sm overflow-x-auto gap-4 custom-scrollbar">
        <div className="flex items-center gap-2 shrink-0">
           <button onClick={onBack} className="p-2 mr-2 rounded-lg text-app-muted hover:text-app-text hover:bg-app-bg transition-colors" title="Back to notebook">
             <ChevronLeft size={20} />
           </button>
           <div className="flex bg-app-bg rounded-lg border border-app-border p-1">
              <button 
                onClick={() => setTool('pointer')}
                className={`p-2 rounded-md transition-colors flex items-center gap-1 ${tool === 'pointer' ? 'bg-app-card shadow-sm text-app-text' : 'text-app-muted hover:text-app-text'}`}
                title="Select & Move Tool"
              >
                <MousePointer2 size={18} />
              </button>
              <button 
                onClick={() => {
                  setTool('draw');
                  setSelectedIds([]);
                  setEditingElementId(null);
                }}
                className={`p-2 rounded-md transition-colors ${tool === 'draw' ? 'bg-app-card shadow-sm text-app-text' : 'text-app-muted hover:text-app-text'}`}
                title="Sketch Tool"
              >
                <PenTool size={18} />
              </button>
           </div>
           
           <div className="hidden lg:block w-px h-6 bg-app-border mx-2"></div>
           
           {tool === 'draw' && (
             <div className="flex items-center gap-2 mr-2 animate-in fade-in slide-in-from-left-4">
                <select 
                  className="text-sm border border-app-border rounded-lg bg-app-bg px-2 py-1.5 outline-none"
                  value={sketchMode}
                  onChange={(e) => setSketchMode(e.target.value as any)}
                >
                  <option value="freehand">Freehand</option>
                  <option value="straight">Straight Line</option>
                </select>
             </div>
           )}

           <div className="flex items-center gap-2 relative shrink-0">
             <input type="color" value={currentColor === '#currentColor' ? '#FEFCE8' : currentColor} 
               onChange={(e) => {
                  const newColor = e.target.value;
                  setCurrentColor(newColor);
                  if (selectedIds.length > 0) {
                    const newElements = page.elements.map(el => {
                       if (selectedIds.includes(el.id)) {
                           return { ...el, color: newColor };
                       }
                       return el;
                    });
                    updatePage({ ...page, elements: newElements });
                  }
               }} 
               className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-app-border cursor-pointer appearance-none" style={{ padding: 0 }} title="Element Color" />
             <input type="range" min="0" max="1" step="0.1" value={currentOpacity} 
               onChange={(e) => {
                  const newOpacity = parseFloat(e.target.value);
                  setCurrentOpacity(newOpacity);
                  if (selectedIds.length > 0) {
                    const newElements = page.elements.map(el => {
                       if (selectedIds.includes(el.id)) {
                           return { ...el, opacity: newOpacity };
                       }
                       return el;
                    });
                    updatePage({ ...page, elements: newElements });
                  }
               }}
               className="w-16 h-1 bg-app-border rounded-lg appearance-none cursor-pointer" title="Transparency" />

             <button onClick={addTextBox} className="flex items-center gap-1.5 px-2 py-1.5 text-sm font-medium bg-app-bg hover:bg-app-card border border-app-border rounded-lg transition-colors text-app-text" title="Typewriter Box">
               <Type size={16} /> <span className="hidden xl:inline">Text</span>
             </button>
             
             <button onClick={addDropdown} className="flex items-center gap-1.5 px-2 py-1.5 text-sm font-medium bg-app-bg hover:bg-app-card border border-app-border rounded-lg transition-colors text-app-text" title="Smart Dropdown">
               <List size={16} /> <span className="hidden xl:inline">List</span>
             </button>
           </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {selectedIds.length > 0 ? (
            <AnimatePresence>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, x: 20 }} 
                animate={{ opacity: 1, scale: 1, x: 0 }} 
                className="flex items-center gap-2 bg-app-accent/10 py-1.5 px-3 rounded-lg border border-app-accent/20"
              >
                <span className="text-xs font-bold text-app-accent uppercase tracking-wider hidden sm:inline-block mr-2">
                  {selectedIds.length} Selected
                </span>
                
                {(() => {
                  const selectedElements = page.elements.filter(e => selectedIds.includes(e.id));
                  const allLocked = selectedElements.length > 0 && selectedElements.every(e => e.isLocked);
                  
                  return (
                    <button 
                      onClick={toggleLockSelected}
                      className="flex items-center gap-1.5 px-2 py-1 bg-app-bg hover:bg-white text-app-text border border-app-border rounded-md transition-colors text-sm font-medium shadow-sm"
                      title={allLocked ? "Unlock selected items" : "Lock selected items"}
                    >
                      {allLocked ? <Unlock size={14} /> : <Lock size={14} />} {allLocked ? "Unlock" : "Lock"}
                    </button>
                  );
                })()}

                {selectedIds.length > 1 && (
                  <button 
                    onClick={groupSelected}
                    className="flex items-center gap-1.5 px-2 py-1 bg-app-bg hover:bg-white text-app-text border border-app-border rounded-md transition-colors text-sm font-medium shadow-sm"
                    title="Group selected items"
                  >
                    <Layers size={14} /> Group
                  </button>
                )}
                <button 
                  onClick={duplicateSelected}
                  className="flex items-center gap-1.5 px-2 py-1 bg-app-bg hover:bg-white text-app-text border border-app-border rounded-md transition-colors text-sm font-medium shadow-sm"
                  title="Duplicate selected items"
                >
                  <Copy size={14} /> Duplicate
                </button>
                <button 
                  onClick={deleteSelected}
                  className="flex items-center gap-1.5 px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors text-sm font-medium shadow-sm"
                  title="Delete selected items"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </motion.div>
            </AnimatePresence>
          ) : (
            <span className="text-xs text-app-muted hidden sm:inline-block">Select items to delete or duplicate</span>
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        ref={containerRef}
        className={`flex-1 relative bg-app-card rounded-xl border border-app-border overflow-hidden shadow-inner ${tool === 'draw' ? 'cursor-crosshair touching-none' : 'cursor-default'}`}
        style={{ ...getBackgroundStyle(), touchAction: 'none' }} // disable touch action to allow seamless dragging and drawing
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Current Drawing Stroke Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-app-accent z-50">
          {isDrawing && currentStroke.length > 0 && (
             <path
               d={drawPath(currentStroke, sketchMode)}
               fill="none"
               stroke="var(--accent)"
               strokeWidth={3}
               strokeLinecap="round"
               strokeLinejoin="round"
             />
          )}
        </svg>

        {/* Selection Box Overlay */}
        {selectionBox && (
          <div 
            className="absolute bg-app-accent/20 border border-app-accent/50 z-50 pointer-events-none"
            style={{
              left: Math.min(selectionBox.startX, selectionBox.endX),
              top: Math.min(selectionBox.startY, selectionBox.endY),
              width: Math.abs(selectionBox.endX - selectionBox.startX),
              height: Math.abs(selectionBox.endY - selectionBox.startY)
            }}
          />
        )}

        {/* Elements Layer */}
        {page.elements.map((el) => {
          let elementToRender = el;
          if (resizingElement && resizingElement.id === el.id && resizingElement.currentUpdate) {
             elementToRender = { ...el, ...resizingElement.currentUpdate };
          }
          return renderElement(elementToRender);
        })}

        {/* Page Navigation */}
        <div className={`absolute bottom-6 flex items-center justify-between pointer-events-none px-6 w-full ${pageIndex % 2 === 0 ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="flex items-center gap-2 bg-app-card/90 backdrop-blur-sm border border-app-border rounded-full shadow-lg p-1.5 pointer-events-auto transition-transform hover:scale-105">
             <button 
               disabled={pageIndex === 0} 
               onClick={(e) => { e.stopPropagation(); setActivePageId(notebook.pages[pageIndex - 1].id); }} 
               className="p-1.5 rounded-full hover:bg-app-accent/10 disabled:opacity-30 disabled:pointer-events-none text-app-text transition-colors"
               title="Previous Page"
             >
               <ChevronLeft size={16} />
             </button>
             <span className="text-xs font-bold text-app-muted px-3 tracking-widest uppercase">Page {pageIndex + 1} / {notebook.pages.length}</span>
             <button 
               disabled={pageIndex === notebook.pages.length - 1} 
               onClick={(e) => { e.stopPropagation(); setActivePageId(notebook.pages[pageIndex + 1].id); }} 
               className="p-1.5 rounded-full hover:bg-app-accent/10 disabled:opacity-30 disabled:pointer-events-none text-app-text transition-colors"
               title="Next Page"
             >
               <ChevronRight size={16} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
