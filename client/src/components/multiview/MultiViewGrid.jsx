import React, { useState, useEffect } from 'react';
import { useCctvStore } from '../../store/useCctvStore';
import WebRtcPlayer from '../player/WebRtcPlayer';
import { X, LayoutGrid, Grid3X3, Grid, Maximize, Minimize, Trash2, Home, Video } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function MultiViewGrid() {
  const { cameras, activeMultiViews, removeFromMultiView } = useCctvStore();
  const [layout, setLayout] = useState(4); // 4, 9, 16
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const navigate = useNavigate();

  const getGridCols = () => {
    switch(layout) {
      case 4: return 'grid-cols-2';
      case 9: return 'grid-cols-3';
      case 16: return 'grid-cols-4';
      case 25: return 'grid-cols-5';
      case 36: return 'grid-cols-6';
      default: return 'grid-cols-4';
    }
  };
  const getGridRows = () => {
    switch(layout) {
      case 4: return 'grid-rows-2';
      case 9: return 'grid-rows-3';
      case 16: return 'grid-rows-4';
      case 25: return 'grid-rows-5';
      case 36: return 'grid-rows-6';
      default: return 'grid-rows-4';
    }
  };
  const gridClass = `${getGridCols()} ${getGridRows()}`;

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement) {
        setExpandedIndex(null);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = (index = null) => {
    if (!document.fullscreenElement) {
      if (index !== null) setExpandedIndex(index);
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen();
      setExpandedIndex(null);
    }
  };

  const closeAll = () => {
    useCctvStore.setState({ activeMultiViews: [] });
  };

  const handleDragStart = (e, cam) => {
    e.dataTransfer.setData('camId', cam.id);
  };

  const handleDrop = (e, slotIndex) => {
    e.preventDefault();
    const camId = parseInt(e.dataTransfer.getData('camId'), 10);
    const cam = cameras.find(c => c.id === camId);
    if (!cam) return;

    const newViews = [...activeMultiViews];
    // Ensure array is long enough
    while (newViews.length < layout) {
      newViews.push(null);
    }
    
    // Remove if already exists elsewhere
    const existingIndex = newViews.findIndex(v => v?.id === camId);
    if (existingIndex !== -1) {
      newViews[existingIndex] = null;
    }
    
    newViews[slotIndex] = cam;
    useCctvStore.setState({ activeMultiViews: newViews });
  };

  const renderGridIcon = (num) => {
    switch(num) {
      case 4: return <LayoutGrid size={14} />;
      case 9: return <Grid3X3 size={14} />;
      case 16: return <Grid size={14} />;
      case 25: return <Grid size={14} />;
      case 36: return <Grid size={14} />;
      default: return <LayoutGrid size={14} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#050B14] font-sans text-white overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-64 bg-[#0a1220] border-r border-white/10 flex flex-col z-10 shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
        <div className="p-4 border-b border-white/10 bg-[#050B14]">
          <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-1">Daftar Kamera</h2>
          <p className="text-[10px] text-slate-500">Drag & Drop ke slot matriks</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-700">
          {cameras.filter(c => c.is_active).map(cam => (
            <div 
              key={cam.id}
              draggable
              onDragStart={(e) => handleDragStart(e, cam)}
              className="flex items-center gap-3 p-2.5 mb-1 hover:bg-white/5 cursor-grab active:cursor-grabbing rounded-lg border border-transparent hover:border-white/10 transition-colors"
            >
              <Video size={14} className="text-cyan-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold truncate text-slate-200">{cam.name}</div>
                <div className="text-[9px] text-slate-500 truncate">{cam.location || 'Area Lainnya'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        {/* HEADER */}
        <div className="h-14 bg-[#0a1220]/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 z-10 shadow-md">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/monitor/map')}
              className="flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:bg-white/5 px-3 py-1.5 rounded-lg transition-colors border border-cyan-500/30"
            >
              ← Kembali ke Peta
            </button>
            <div className="h-4 w-px bg-white/10"></div>
            <div className="flex gap-1 bg-black/20 p-1 rounded-lg border border-white/5">
              {[4, 9, 16, 25, 36].map(num => (
                <button 
                  key={num}
                  onClick={() => { setLayout(num); setExpandedIndex(null); }}
                  className={`flex items-center justify-center px-3 py-1.5 rounded-md transition-colors text-xs font-bold gap-2 ${layout === num ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'hover:bg-white/5 text-slate-400 border border-transparent'}`}
                  title={`Grid ${Math.sqrt(num)}x${Math.sqrt(num)}`}
                >
                  {renderGridIcon(num)}
                  <span>{Math.sqrt(num)}x{Math.sqrt(num)}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={() => toggleFullscreen()} className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
              {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />} 
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
            <button onClick={closeAll} className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors bg-red-400/10 px-3 py-1.5 rounded-lg border border-red-400/20 hover:border-red-400/40">
              <X size={14} strokeWidth={3} /> Bersihkan Grid
            </button>
          </div>
        </div>
        
        {/* GRID */}
        <div className={`flex-1 bg-[#02050A] p-2 grid ${expandedIndex !== null ? 'grid-cols-1 grid-rows-1' : gridClass} gap-2 min-h-0`}>
          {(expandedIndex !== null ? [expandedIndex] : Array.from({ length: layout }).map((_, i) => i)).map((i) => {
            const cam = activeMultiViews[i];
            const isMainStream = expandedIndex !== null;
            return (
              <div 
                key={i} 
                className="relative bg-[#0a1220] border border-white/5 rounded-xl overflow-hidden group flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, i)}
                onDoubleClick={() => {
                  if (cam) {
                    toggleFullscreen(expandedIndex !== null ? null : i);
                  }
                }}
              >
                {cam ? (
                  <>
                    <WebRtcPlayer cameraId={cam.id} streamType={isMainStream ? "main" : "sub"} />
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-3 pointer-events-none flex justify-between items-start">
                      <div className="text-[10px] font-bold text-white uppercase tracking-widest drop-shadow-md flex items-center gap-2">
                        <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded">CH {cam.id}</span>
                        {cam.name}
                      </div>
                      {isMainStream && (
                        <div className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-[9px] font-bold tracking-widest flex items-center gap-1.5 backdrop-blur-sm">
                           <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                           MAIN STREAM
                        </div>
                      )}
                      {!isMainStream && (
                        <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[9px] font-bold tracking-widest flex items-center gap-1.5 backdrop-blur-sm">
                           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                           SUB STREAM
                        </div>
                      )}
                    </div>
                    {expandedIndex === null && (
                      <button 
                        onClick={() => {
                           const newViews = [...activeMultiViews];
                           newViews[i] = null;
                           useCctvStore.setState({ activeMultiViews: newViews });
                        }}
                        className="absolute top-2 right-2 bg-black/60 p-2 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 border border-transparent hover:border-white/20 backdrop-blur-sm"
                        title="Hapus dari grid"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-slate-600">
                    <LayoutGrid size={32} className="opacity-50" />
                    <span className="text-[10px] font-bold tracking-widest uppercase bg-white/5 px-3 py-1 rounded-full border border-white/5">Drop Kamera Di Sini</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
