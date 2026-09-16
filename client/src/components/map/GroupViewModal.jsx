import React from 'react';
import { X, Move } from 'lucide-react';
import WebRTCPlayer from '../player/WebRtcPlayer';

export default function GroupViewModal({ cameras, onClose }) {
  if (!cameras || cameras.length === 0) return null;

  const count = cameras.length;
  let gridCols = 1;
  let gridRows = 1;
  
  if (count > 1) { gridCols = 2; gridRows = Math.ceil(count / 2); }
  if (count > 4) { gridCols = 3; gridRows = Math.ceil(count / 3); }
  if (count > 9) { gridCols = 4; gridRows = Math.ceil(count / 4); }
  if (count > 16) { gridCols = 5; gridRows = Math.ceil(count / 5); }
  if (count > 25) { gridCols = 6; gridRows = Math.ceil(count / 6); }

  const mdColsClass = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
    6: 'md:grid-cols-6'
  }[gridCols] || 'md:grid-cols-3';

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col pointer-events-auto animate-in fade-in duration-300">
      <div className="h-14 bg-[#111827] border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-900/50 border border-blue-500/30 flex items-center justify-center">
            <Move size={16} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-bold tracking-wider text-sm">{cameras[0]?.location || 'Kamera Grup'}</h3>
            <p className="text-[10px] text-slate-400 uppercase">{cameras.length} Kamera Aktif</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors border border-transparent shadow-lg font-bold text-xs flex items-center gap-2 px-4 tracking-widest">
          <X size={16} /> TUTUP
        </button>
      </div>
      <div className="flex-1 p-2 bg-black overflow-hidden flex flex-col">
        <div 
          className={`grid gap-2 w-full h-full overflow-y-auto md:overflow-hidden auto-rows-[300px] md:auto-rows-fr grid-cols-1 ${mdColsClass}`}
        >
          {cameras.map(cam => (
            <div 
              key={cam.id} 
              className="bg-[#050505] border border-slate-800 rounded-xl overflow-hidden relative group"
              onDoubleClick={(e) => {
                if (!document.fullscreenElement) {
                  e.currentTarget.requestFullscreen().catch(err => console.log(err));
                } else {
                  document.exitFullscreen();
                }
              }}
            >
              <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10 text-[10px] font-bold text-white max-w-[80%] truncate">
                <span className="text-cyan-400 mr-1">CH {cam.channel}</span> {cam.name}
              </div>
              <WebRTCPlayer cameraId={cam.id} streamType="sub" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
