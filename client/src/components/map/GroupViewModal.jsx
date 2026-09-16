import React from 'react';
import { X, Maximize2, Move } from 'lucide-react';
import WebRTCPlayer from '../multiview/WebRTCPlayer';

export default function GroupViewModal({ cameras, onClose }) {
  if (!cameras || cameras.length === 0) return null;

  const count = cameras.length;
  let gridCols = 1;
  let gridRows = 1;
  
  if (count > 1) { gridCols = 2; gridRows = 2; }
  if (count > 4) { gridCols = 3; gridRows = 2; }
  if (count > 6) { gridCols = 3; gridRows = 3; }
  if (count > 9) { gridCols = 4; gridRows = 3; }
  if (count > 12) { gridCols = 4; gridRows = 4; }

  return (
    <div className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 pointer-events-auto animate-in fade-in duration-300">
      <div className="bg-[#0a0f1c] border border-slate-700/50 shadow-2xl rounded-2xl w-full h-full max-w-7xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
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
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 p-2 md:p-4 bg-black overflow-y-auto">
          <div 
            className="grid gap-2 h-full"
            style={{
              gridTemplateColumns: epeat(, minmax(0, 1fr)),
              gridTemplateRows: count > 2 ? epeat(, minmax(200px, 1fr)) : '1fr',
              minHeight: 'min-content'
            }}
          >
            {cameras.map(cam => (
              <div key={cam.id} className="bg-[#050505] border border-slate-800 rounded-xl overflow-hidden relative group">
                <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10 text-[10px] font-bold text-white max-w-[80%] truncate">
                  <span className="text-cyan-400 mr-1">CH {cam.channel}</span> {cam.name}
                </div>
                <WebRTCPlayer url={cam.rtsp_url} isMuted={true} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
