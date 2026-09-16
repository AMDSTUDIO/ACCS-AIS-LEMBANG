import React, { useState, useEffect } from 'react';
import { useCctvStore } from '../../store/useCctvStore';
import WebRtcPlayer from '../player/WebRtcPlayer';
import { Maximize, Minimize, Play, Pause, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NocWallpanel() {
  const { cameras } = useCctvStore();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [page, setPage] = useState(0);

  const activeCameras = cameras.filter(c => c.is_active);
  const CAMERAS_PER_PAGE = 8;
  const totalPages = Math.ceil(activeCameras.length / CAMERAS_PER_PAGE);
  const intervalSeconds = 15;

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

  useEffect(() => {
    if (!isPlaying || totalPages <= 1) return;
    const timer = setInterval(() => {
      setPage(p => (p + 1) % totalPages);
    }, intervalSeconds * 1000);
    return () => clearInterval(timer);
  }, [isPlaying, totalPages]);

  const currentCameras = activeCameras.slice(page * CAMERAS_PER_PAGE, (page + 1) * CAMERAS_PER_PAGE);

  return (
    <div className="flex flex-col h-screen bg-black font-sans text-white overflow-hidden relative group">
      
      {/* Floating Header - Visible on Hover */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={() => navigate('/portal')}
          className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 shadow-xl flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={14} /> Kembali ke Portal
        </button>
        
        <div className="flex items-center gap-2">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 text-xs font-bold">
            <span className="text-slate-400">ROTASI:</span>
            <span className="text-cyan-400">{page + 1} / {totalPages || 1}</span>
          </div>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/10 text-white hover:text-cyan-400 hover:bg-white/5 transition-colors"
            title={isPlaying ? 'Pause Auto-Sequence' : 'Play Auto-Sequence'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button 
            onClick={toggleFullscreen}
            className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
          >
            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen (F11)'}
          </button>
        </div>
      </div>

      {/* Grid Layout 4x2 */}
      <div className="flex-1 grid grid-cols-4 grid-rows-2 gap-1 p-1 bg-black">
        {Array.from({ length: CAMERAS_PER_PAGE }).map((_, i) => {
          const cam = currentCameras[i];
          return (
            <div key={i} className="relative bg-[#111] overflow-hidden border border-[#222]">
              {cam ? (
                <>
                  <WebRtcPlayer cameraId={cam.id} streamType="sub" />
                  <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-[11px] font-bold tracking-widest text-white border border-white/10 shadow-md">
                    {cam.name}
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(239,68,68,0.8)]"></div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-[#333] text-sm font-bold tracking-widest">N/A</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
