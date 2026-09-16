import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import Clock from './Clock';
import { useCctvStore } from '../../store/useCctvStore';
import { useAuthStore } from '../../store/useAuthStore';
import WebRtcPlayer from '../player/WebRtcPlayer';
import { Search, MapPin, X, Settings, LogOut, Maximize2, Shield, Eye, ShieldAlert, Target, Video, Grid, Menu } from 'lucide-react';
import SettingsModal from '../settings/SettingsModal';

function CctvMarkers({ cameras, activeCam, setActiveCam, groupColors = {} }) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useMapEvents({
    zoomend: () => setZoom(map.getZoom())
  });

  const createCustomIcon = (isActive, currentZoom, camColor = '#3b82f6') => {
    // Determine scale based on zoom level
    const scale = Math.max(0.4, Math.min(1.0, (currentZoom - 12) / 6));
    const baseSize = 32 * scale;  // Balanced size
    const innerSize = 24 * scale; 
    const iconSize = 14 * scale;

    return new L.divIcon({
      className: 'bg-transparent border-0',
      html: `
        <div class="relative flex items-center justify-center group cursor-pointer transition-transform duration-300 hover:scale-110" style="width:${baseSize}px; height:${baseSize}px;">
          ${isActive ? `<span class="absolute inline-flex rounded-full opacity-40 animate-ping" style="background-color: ${camColor}; width:${baseSize*1.2}px; height:${baseSize*1.2}px;"></span>` : ''}
          <div class="relative z-10 rounded-full border-2 flex items-center justify-center backdrop-blur-md drop-shadow-lg" 
               style="width:${innerSize}px; height:${innerSize}px; border-color: ${camColor}; background-color: ${camColor}40; ${isActive ? `box-shadow: 0 0 10px ${camColor};` : ''}">
            <img src="https://unpkg.com/lucide-static@0.321.0/icons/cctv.svg" class="filter invert brightness-0 sepia-0 hue-rotate-180" style="width:${iconSize}px; height:${iconSize}px; ${isActive ? `filter: drop-shadow(0 0 8px ${camColor});` : ''}" />
          </div>
        </div>
      `,
      iconSize: [baseSize, baseSize],
      iconAnchor: [baseSize / 2, baseSize / 2],
    });
  };

  return (
    <>
      {cameras.filter(c => c.is_active).map(cam => (
        <Marker 
          key={cam.id} 
          position={[cam.lat || -6.808722, cam.lng || 107.649002]} 
          icon={createCustomIcon(activeCam?.id === cam.id, zoom, groupColors[cam.location || 'Area Lainnya'])}
          eventHandlers={{
            click: () => setActiveCam(cam)
          }}
        />
      ))}
    </>
  );
}

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] != null && center[1] != null && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

import { useNavigate } from 'react-router-dom';

export default function MapDashboard() {
  const { cameras, setCameras, settings, setSettings } = useCctvStore();
  const { user, logout } = useAuthStore();
  const [activeCam, setActiveCam] = useState(null);
  const [search, setSearch] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const [cams, sets] = await Promise.all([
        axios.get('/api/cameras'),
        axios.get('/api/settings')
      ]);
      setCameras(cams.data);
      if (sets.data.map_config) {
        setSettings(sets.data);
      } else {
        setSettings({ ...sets.data, map_config: { lat: -6.808722, lng: 107.649002, zoom: 19 } });
      }
    };
    fetchData();
  }, [setCameras, setSettings]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRelatedCameras = (centerCam, count) => {
    // If it belongs to a group, return cameras in that group
    if (centerCam.location && centerCam.location !== 'Area Lainnya') {
      const groupCams = cameras.filter(c => c.is_active && c.location === centerCam.location && c.id !== centerCam.id);
      return [centerCam, ...groupCams].slice(0, 9); // Limit to 9 for multiview grid
    }

    // Otherwise fallback to nearest coordinates
    const p = 0.017453292519943295;
    const c = Math.cos;
    const distance = (cam) => {
      const a = 0.5 - c((cam.lat - centerCam.lat) * p)/2 + c(centerCam.lat * p) * c(cam.lat * p) * (1 - c((cam.lng - centerCam.lng) * p))/2;
      return 12742 * Math.asin(Math.sqrt(a));
    };
    return [...cameras].filter(c => c.is_active && c.id !== centerCam.id)
      .sort((a, b) => distance(a) - distance(b))
      .slice(0, count - 1)
      .concat(centerCam);
  };

  const openMultiView = (camsToOpen) => {
    useCctvStore.setState({ activeMultiViews: camsToOpen });
    navigate('/monitor/grid');
  };

  const mapConfig = settings.map_config || { lat: -6.808722, lng: 107.649002, zoom: 19 };
  const groupColors = settings.group_colors || {};
  const center = [mapConfig.lat, mapConfig.lng];
  const initialZoom = Math.max(19, mapConfig.zoom || 20);
  
  const sortedCams = [...cameras].sort((a, b) => (a.channel || 0) - (b.channel || 0));
  const filteredCams = sortedCams.filter(c => c.is_active && c.name.toLowerCase().includes(search.toLowerCase()));

  const updateGroupColor = async (groupName, color) => {
    const newColors = { ...groupColors, [groupName]: color };
    setSettings({ ...settings, group_colors: newColors });
    try {
      await axios.post('/api/settings', { key: 'group_colors', value: newColors });
    } catch (e) { console.error(e); }
  };

  const toggleGroup = (group) => {
    setCollapsedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const handleDragStart = (e, camId) => {
    if (search) return;
    e.dataTransfer.setData('camId', camId);
  };

  const handleDragOver = (e) => {
    if (search) return;
    e.preventDefault();
  };

  const handleDrop = async (e, dropCamId) => {
    if (search) return;
    e.preventDefault();
    e.stopPropagation(); // Prevent triggering group drop
    const dragId = parseInt(e.dataTransfer.getData('camId'), 10);
    if (dragId === dropCamId || isNaN(dragId)) return;

    const dragIndex = filteredCams.findIndex(c => c.id === dragId);
    const dropIndex = filteredCams.findIndex(c => c.id === dropCamId);
    if (dragIndex === -1 || dropIndex === -1) return;

    const newList = [...filteredCams];
    const [draggedItem] = newList.splice(dragIndex, 1);
    newList.splice(dropIndex, 0, draggedItem);
    
    const updatedCams = newList.map((cam, idx) => ({ ...cam, channel: idx + 1 }));
    
    const newCamerasState = cameras.map(c => {
       const updated = updatedCams.find(uc => uc.id === c.id);
       return updated ? updated : c;
    });
    setCameras(newCamerasState);

    updatedCams.forEach(async (cam) => {
       try {
         await axios.put(`/api/cameras/${cam.id}`, cam);
       } catch (err) {
         console.error(err);
       }
    });
  };

  const handleGroupDragStart = (e, groupName) => {
    if (search) return;
    e.dataTransfer.setData('groupName', groupName);
  };

  const handleGroupDrop = async (e, dropGroupName) => {
    if (search) return;
    e.preventDefault();
    e.stopPropagation();
    const dragName = e.dataTransfer.getData('groupName');
    if (!dragName || dragName === dropGroupName) return;

    const dragCams = groupedCams[dragName];
    if (!dragCams) return;

    let newList = [...filteredCams];
    const isDragCam = c => (c.location || 'Area Lainnya') === dragName;
    newList = newList.filter(c => !isDragCam(c));

    const dropIndex = newList.findIndex(c => (c.location || 'Area Lainnya') === dropGroupName);
    if (dropIndex === -1) return;

    newList.splice(dropIndex, 0, ...dragCams);

    const updatedCams = newList.map((cam, idx) => ({ ...cam, channel: idx + 1 }));
    
    const newCamerasState = cameras.map(c => {
       const updated = updatedCams.find(uc => uc.id === c.id);
       return updated ? updated : c;
    });
    setCameras(newCamerasState);
  };

  const groupedCams = filteredCams.reduce((acc, cam) => {
    const groupName = cam.location || 'Area Lainnya';
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(cam);
    return acc;
  }, {});

  // On first load, default all groups to collapsed if we aren't searching
  useEffect(() => {
    if (!search && Object.keys(collapsedGroups).length === 0 && Object.keys(groupedCams).length > 0) {
      const initialCollapsed = {};
      Object.keys(groupedCams).forEach(g => initialCollapsed[g] = true);
      setCollapsedGroups(initialCollapsed);
    }
  }, [groupedCams, search, collapsedGroups]);

  return (
    <div className="w-full h-full relative">
      {/* 1. MAP BACKGROUND */}
      <MapContainer center={center} zoom={initialZoom} maxZoom={22} zoomControl={false} className="w-full h-full absolute inset-0 z-0 bg-slate-900">
        <MapController center={activeCam ? [activeCam.lat || center[0], activeCam.lng || center[1]] : center} zoom={activeCam ? 19 : initialZoom} />
        <TileLayer url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" maxZoom={22} />
        <CctvMarkers cameras={cameras} activeCam={activeCam} setActiveCam={setActiveCam} groupColors={groupColors} />
      </MapContainer>

      {/* 2. OVERLAYS */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start pointer-events-none">
        
        {/* Header Information Overlay */}
        <div className="flex gap-4 pointer-events-auto items-center">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden w-10 h-10 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-2xl flex items-center justify-center text-white hover:bg-slate-800 hover:scale-105 transition-all"
          >
            <Menu size={20} />
          </button>

          <div className="bg-[#111111]/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/5 shadow-xl flex items-center gap-4">
            <div>
              <h1 className="text-white font-extrabold text-sm tracking-widest leading-tight">ACCS <span className="font-light text-slate-400">AIS LEMBANG</span></h1>
              <p className="text-[8px] text-slate-500 font-bold tracking-[0.2em] mt-0.5 uppercase">AREA CCTV CONTROL SYSTEM</p>
            </div>
            
            <div className="ml-2 pl-4 border-l border-white/10 hidden md:flex items-center">
              <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700/50 flex items-center shadow-inner">
                <span className="text-cyan-400 font-mono font-bold text-xs tracking-wider"><Clock /></span>
              </div>
            </div>
            
            <div className="ml-1 hidden md:block pl-2 border-l border-white/10">
               <button onClick={() => openMultiView(cameras.filter(c => c.is_active).slice(0, 36))} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-[10px] uppercase font-extrabold transition flex items-center gap-1.5 shadow-[0_0_10px_rgba(37,99,235,0.4)] border border-blue-400/30 tracking-wider">
                  <Grid size={12} /> FULL CAMERA
               </button>
            </div>
            
            <div className="ml-1 pl-2 border-l border-white/10 hidden md:flex items-center gap-2">
              <button 
                onClick={() => navigate('/portal')}
                className="bg-slate-900/50 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/50 text-[10px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                PORTAL
              </button>
              {user?.role === 'superadmin' && (
                <button onClick={() => setShowSettings(true)} className="p-1.5 bg-slate-900/50 hover:bg-slate-800 rounded-lg border border-slate-700/50 transition text-slate-300 hover:text-white" title="Pengaturan">
                  <Settings size={14} />
                </button>
              )}
              <button onClick={handleLogout} className="p-1.5 bg-slate-900/50 hover:bg-red-500/20 rounded-lg border border-slate-700/50 transition text-slate-300 hover:text-red-400" title="Logout">
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && <div className="absolute inset-0 bg-black/60 z-[30] md:hidden backdrop-blur-sm pointer-events-auto" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* 3. SIDEBAR - DAFTAR KAMERA */}
      <div className={`absolute top-24 w-72 max-h-[calc(100vh-8rem)] h-fit bg-[#111111]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-[40] flex flex-col overflow-hidden transition-all duration-300 pointer-events-auto ${isSidebarOpen ? 'left-4' : '-left-80 md:left-4'}`}>
        <div className="p-3 border-b border-[#222] shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Cari lokasi..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg py-1.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-blue-500 transition placeholder:text-slate-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-slate-700">
          <div className="px-3 py-1.5 flex justify-between items-center">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Daftar Kamera ({filteredCams.length})</div>
          </div>
          
          {Object.entries(groupedCams).map(([group, groupCameras]) => {
            const isCollapsed = search ? false : collapsedGroups[group];
            const gColor = groupColors[group] || '#3b82f6';
            return (
              <div 
                key={group} 
                className="mb-2"
                draggable={!search}
                onDragStart={(e) => handleGroupDragStart(e, group)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleGroupDrop(e, group)}
              >
                <div className={`flex items-center justify-between px-3 py-1.5 mt-1 border-b border-white/5 mx-1 mb-1 hover:bg-white/5 cursor-pointer rounded transition ${!search ? 'active:cursor-grabbing' : ''}`} onClick={() => toggleGroup(group)}>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Video size={12} className={`text-slate-400 shrink-0 transition-all ${isCollapsed ? 'opacity-50' : 'text-blue-400'}`} />
                    <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest truncate">{group}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[9px] text-slate-500">{groupCameras.length}</span>
                    {user?.role === 'superadmin' && (
                      <input 
                        type="color" 
                        value={gColor} 
                        onClick={(e) => e.stopPropagation()} 
                        onChange={(e) => updateGroupColor(group, e.target.value)}
                        className="w-4 h-4 rounded cursor-pointer p-0 bg-transparent border-0 shrink-0" 
                        title="Ubah Warna Grup"
                      />
                    )}
                  </div>
                </div>
                {!isCollapsed && groupCameras.map((cam) => (
                  <div 
                    key={cam.id} 
                    draggable={!search}
                    onDragStart={(e) => handleDragStart(e, cam.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, cam.id)}
                    onClick={() => { setActiveCam(cam); setIsSidebarOpen(false); }}
                    className={`mx-1 my-0.5 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 border ${!search ? 'cursor-grab active:cursor-grabbing' : ''} ${activeCam?.id === cam.id ? 'bg-white/10 border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.05)]' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-[2px] font-mono text-[9px] text-slate-600 w-3">{cam.channel}</div>
                      <div className={`mt-[4px] w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor] shrink-0 ${activeCam?.id === cam.id ? 'animate-pulse' : ''}`} style={{ backgroundColor: gColor, color: gColor }}></div>
                      <div className="min-w-0 flex-1">
                        <div className={`font-bold text-xs truncate leading-tight ${activeCam?.id === cam.id ? 'text-white' : 'text-slate-300'}`}>{cam.name}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. ADVANCED FLOATING VIDEO PLAYER MODAL */}
      {activeCam && (
        <div className="absolute top-24 right-6 w-[400px] bg-[#111111]/85 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-20 pointer-events-auto transform transition-all animate-in slide-in-from-right-8 duration-300">
          <div className="p-4 flex flex-col gap-3">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-extrabold text-white text-lg leading-tight uppercase tracking-wide truncate w-64">{activeCam.location || 'Area Lainnya'}</h2>
                <div className="inline-block mt-1 bg-[#222] text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded border border-[#333]">CCTV</div>
              </div>
              <div className="flex gap-1.5">
                <button className="w-8 h-8 flex justify-center items-center bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg border border-[#333] text-slate-400 transition"><Shield size={14}/></button>
                <button 
                  onClick={() => {
                    const elem = document.getElementById(`vid-container-${activeCam.id}`);
                    if (elem) {
                      if (!document.fullscreenElement) elem.requestFullscreen().catch(e=>console.log(e));
                      else document.exitFullscreen();
                    }
                  }} 
                  className="w-8 h-8 flex justify-center items-center bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg border border-[#333] text-slate-400 transition"
                  title="Fullscreen Camera"
                >
                  <Maximize2 size={14}/>
                </button>
                <button onClick={() => setActiveCam(null)} className="w-8 h-8 flex justify-center items-center bg-[#1a1a1a] hover:bg-[#2a2a2a] hover:text-red-400 rounded-lg border border-[#333] text-slate-400 transition"><X size={14}/></button>
              </div>
            </div>

            {/* Video Area */}
            <div id={`vid-container-${activeCam.id}`} className="w-full aspect-video bg-black rounded-xl overflow-hidden relative border border-[#333]">
               <WebRtcPlayer cameraId={activeCam.id} streamType="sub" />
               <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5 border border-white/10">
                 <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> LIVE
               </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 mt-1">
              <button onClick={() => openMultiView([activeCam])} className="w-full bg-[#161622] hover:bg-[#1e1e2d] border border-[#2d2d44] text-[#8e8eba] py-2.5 rounded-xl text-xs font-bold flex justify-center items-center gap-2 transition">
                <Video size={14} /> ADD TO MULTI-VIEW
              </button>
                <button onClick={() => openMultiView(getRelatedCameras(activeCam, 4))} className="w-full bg-[#0d1623] hover:bg-[#131f32] border border-[#1e2d44] text-[#6090d8] py-2.5 rounded-xl text-xs font-bold flex justify-center items-center gap-2 transition">
                  <Target size={14} /> {(activeCam.location && activeCam.location !== 'Area Lainnya') ? 'OPEN GROUP IN MULTI-VIEW' : 'OPEN WITH NEAREST CAMERAS'}
                </button>
            </div>

            {/* Status & Location */}
            <div className="bg-[#0a110d] border border-[#132d1e] text-[#2db26a] px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-[#2db26a] rounded-full shadow-[0_0_5px_#2db26a]"></div> LIVE
            </div>

            <div className="bg-[#151515] border border-[#222] p-3 rounded-lg flex flex-col gap-1 mt-1">
              <span className="text-[10px] text-slate-500">Nama Kamera</span>
              <span className="text-xs text-slate-200 font-semibold">{activeCam.name}</span>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end mt-2 pt-3 border-t border-[#222]">
              <div className="flex gap-4 text-[10px] text-slate-500 font-mono">
                <span>LAT: {activeCam.lat?.toFixed(4)}</span>
                <span>LNG: {activeCam.lng?.toFixed(4)}</span>
              </div>
              <button onClick={() => setActiveCam(null)} className="bg-[#0d1623] text-[#6090d8] px-3 py-1.5 rounded text-[10px] font-bold flex items-center gap-1 hover:bg-[#131f32] transition border border-[#1e2d44]">
                <MapPin size={10}/> MAPS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. SETTINGS OVERLAY MODAL */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
