import React, { useState, useEffect } from 'react';
import { useCctvStore } from '../../store/useCctvStore';
import WebRtcPlayer from '../player/WebRtcPlayer';
import { X, LayoutGrid, Grid3X3, Square, Grid, Maximize, Minimize, Trash2, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MultiViewGrid() {
  const { activeMultiViews, removeFromMultiView } = useCctvStore();
  const [layout, setLayout] = useState(4); // 1, 4, 9, 16, 36
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const gridCols = layout === 1 ? 'grid-cols-1' : layout === 4 ? 'grid-cols-2' : layout === 9 ? 'grid-cols-3' : layout === 16 ? 'grid-cols-4' : 'grid-cols-6';
  const gridRows = layout === 1 ? 'grid-rows-1' : layout === 4 ? 'grid-rows-2' : layout === 9 ? 'grid-rows-3' : layout === 16 ? 'grid-rows-4' : 'grid-rows-6';
  const gridClass = `${gridCols} ${gridRows}`;

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen();
    }
  };

  const closeAll = () => {
    useCctvStore.setState({ activeMultiViews: [] });
  };

  const renderGridIcon = (num) => {
    switch(num) {
      case 1: return <Square size={14} />;
      case 4: return <LayoutGrid size={14} />;
      case 9: return <Grid3X3 size={14} />;
      case 16: return <Grid size={14} />;
      case 36: return <Grid size={14} className="scale-125" />;
      default: return <LayoutGrid size={14} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      {/* HEADER */}
      <div className="h-10 bg-[#111] border-b border-[#222] flex items-center justify-between px-4 text-[#888]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#222] px-2 py-1 rounded">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]"></div>
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">{activeMultiViews.length}/{layout}</span>
          </div>
          <div className="flex gap-1 ml-2">
            {[1, 4, 9, 16, 36].map(num => (
              <button 
                key={num}
                onClick={() => { setLayout(num); setExpandedIndex(null); }}
                className={`flex items-center justify-center p-1 rounded transition ${layout === num ? 'bg-[#333] text-white' : 'hover:bg-[#222] text-[#666]'}`}
                title={`Grid ${Math.sqrt(num)}x${Math.sqrt(num)}`}
              >
                {renderGridIcon(num)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={toggleFullscreen} className="flex items-center gap-1.5 text-[11px] font-medium hover:text-white transition">
            {isFullscreen ? <Minimize size={12} /> : <Maximize size={12} />} 
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
          <Link to="/" className="flex items-center gap-1.5 text-[11px] font-medium hover:text-white transition">
            <Home size={12} /> Back to Map
          </Link>
          <button onClick={closeAll} className="flex items-center gap-1.5 text-[11px] font-bold text-red-500 hover:text-red-400 transition ml-2">
            <X size={12} strokeWidth={3} /> Close All
          </button>
        </div>
      </div>
      
      {/* GRID */}
      <div className={`flex-1 bg-black p-1 grid ${expandedIndex !== null ? 'grid-cols-1 grid-rows-1' : gridClass} gap-1 min-h-0`}>
        {(expandedIndex !== null ? [expandedIndex] : Array.from({ length: layout }).map((_, i) => i)).map((i) => {
          const cam = activeMultiViews[i];
          return (
            <div 
              key={i} 
              className="relative bg-[#111] border border-[#222] overflow-hidden group flex items-center justify-center cursor-pointer"
              onClick={() => {
                if (cam) setExpandedIndex(i);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (expandedIndex !== null) setExpandedIndex(null);
                else toggleFullscreen();
              }}
            >
              {cam ? (
                <>
                  <WebRtcPlayer cameraId={cam.id} streamType="main" />
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-2 pointer-events-none">
                    <div className="text-[10px] font-bold text-white uppercase tracking-wider drop-shadow-md">
                      [{cam.id}] {cam.name}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeFromMultiView(cam.id); if(expandedIndex === i) setExpandedIndex(null); }}
                    className="absolute top-2 right-2 bg-black/60 p-1.5 rounded text-white opacity-0 group-hover:opacity-100 transition hover:bg-red-500 backdrop-blur-sm"
                    title="Remove from grid"
                  >
                    <Trash2 size={12} />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-[#333]">
                  <LayoutGrid size={24} />
                  <span className="text-[10px] font-bold tracking-widest">EMPTY</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
