import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { ShieldAlert, KeyRound, User, Loader2, MapPin, X, Maximize2, Video } from 'lucide-react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import WebRtcPlayer from '../player/WebRtcPlayer';

// Custom icons
const createIcon = (color) => new L.DivIcon({
  className: 'custom-div-icon',
  html: <div style="background-color: ; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ;"></div>,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

const getLocationColor = (loc) => {
  if (!loc) return { bg: 'bg-slate-500', border: 'border-slate-400', text: 'text-slate-400', hex: '#64748b' };
  const str = loc.toUpperCase();
  if (str.includes('AKHWAT')) return { bg: 'bg-pink-500', border: 'border-pink-400', text: 'text-pink-400', hex: '#ec4899' };
  if (str.includes('IKHWAN')) return { bg: 'bg-blue-500', border: 'border-blue-400', text: 'text-blue-400', hex: '#3b82f6' };
  if (str.includes('PUBLIC')) return { bg: 'bg-green-500', border: 'border-green-400', text: 'text-green-400', hex: '#22c55e' };
  if (str.includes('SDIT')) return { bg: 'bg-orange-500', border: 'border-orange-400', text: 'text-orange-400', hex: '#f97316' };
  if (str.includes('HOSPITALITY') || str.includes('KOMERSIAL')) return { bg: 'bg-purple-500', border: 'border-purple-400', text: 'text-purple-400', hex: '#a855f7' };
  if (str.includes('MASJID')) return { bg: 'bg-yellow-500', border: 'border-yellow-400', text: 'text-yellow-400', hex: '#eab308' };
  return { bg: 'bg-cyan-500', border: 'border-cyan-400', text: 'text-cyan-400', hex: '#06b6d4' };
};

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [publicCameras, setPublicCameras] = useState([]);
  const [mapConfig, setMapConfig] = useState(null);
  const [activeCam, setActiveCam] = useState(null);
  
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/public/cameras').then(res => {
      setPublicCameras(res.data);
    }).catch(err => console.error('Failed to fetch public cameras', err));
    
    axios.get('/api/public/map-settings').then(res => {
      setMapConfig(res.data);
    }).catch(err => setMapConfig({ lat: -6.808722, lng: 107.649002, zoom: 19 }));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      login(res.data.user);
      navigate('/monitor/map');
    } catch (err) {
      setError('Akses ditolak. Kredensial tidak valid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#050B14] relative overflow-hidden font-sans">
      
      {/* Background Underlay */}
      <div className="absolute inset-0 z-0 bg-slate-950">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-400/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full h-screen overflow-hidden flex">
        
        {/* Left Side: Public Map */}
        <div className="absolute inset-0 w-full h-full z-0 hidden md:flex">
          {mapConfig && (
            <MapContainer 
              center={[mapConfig.lat, mapConfig.lng]} 
              zoom={mapConfig.zoom} 
              className="w-full h-full z-0"
              maxZoom={22} zoomControl={false} dragging={false} scrollWheelZoom={false} doubleClickZoom={false} touchZoom={false}
            >
              <TileLayer url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" maxZoom={22} />
              <ZoomControl position="bottomright" />
              
              {publicCameras.map(cam => (
                <Marker 
                  key={cam.id} 
                  position={[cam.lat || mapConfig.lat, cam.lng || mapConfig.lng]}
                  icon={createIcon(getLocationColor(cam.location).hex, activeCam?.id === cam.id)}
                  eventHandlers={{ click: () => setActiveCam(cam) }}
                />
              ))}
            </MapContainer>
          )}

          {/* Map Overlay Header */}
          <div className="absolute top-8 left-8 z-10 pointer-events-none">
            <div className="glass-panel px-6 py-4 rounded-2xl pointer-events-auto shadow-2xl">
              <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-md">PUBLIC LIVE MAP</h1>
              <p className="text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase mt-1">Sistem Pemantauan Publik</p>
            </div>
          </div>
          
          {/* Active Camera Floating Popup */}
          {activeCam && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] glass-panel !border-white/10 !rounded-3xl shadow-2xl overflow-hidden z-20 pointer-events-auto transform transition-all animate-in zoom-in-95 duration-200">
              <div className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getLocationColor(activeCam.location).bg} border ${getLocationColor(activeCam.location).border}`}></div>
                      <h2 className="font-extrabold text-white text-lg leading-tight uppercase tracking-wide truncate w-56">{activeCam.location || 'Area Publik'}</h2>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => setActiveCam(null)} className="w-8 h-8 flex justify-center items-center glass-button !px-0 !py-0 hover:!text-red-400 !rounded-xl transition"><X size={14}/></button>
                  </div>
                </div>

                <div className="w-full aspect-video bg-black rounded-xl overflow-hidden relative border border-white/10">
                  <WebRtcPlayer cameraId={activeCam.id} streamType="sub" publicMode={true} />
                   <div className="absolute top-2 right-2 glass-panel !bg-black/60 px-2 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5 !border-white/10">
                     <div className={`w-2 h-2 rounded-full shadow-[0_0_5px_currentColor] ${!activeCam.is_active ? "bg-red-500 text-red-500" : "bg-green-500 text-green-500 animate-pulse"}`}></div> 
                     {!activeCam.is_active ? 'OFFLINE' : 'LIVE'}
                   </div>
                </div>
                
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl mt-1">
                  <span className="text-[10px] text-slate-400">Nama Kamera</span>
                  <div className="text-sm text-white font-semibold truncate mt-0.5">{activeCam.name}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Login Card Container */}
        <div className="w-full lg:w-[450px] p-4 lg:p-8 flex items-center justify-center shrink-0 bg-black/40 relative z-20 ml-auto border-l border-white/10">
          <div className="w-full max-w-[320px] p-8 bg-black/30 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10">
            <div className="flex flex-col items-center mb-8 text-center">
              <div className="mb-5 flex justify-center">
                <img src="/ais-logo.png" alt="AIS Logo" className="w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight leading-tight">ACCS <span className="font-light text-cyan-100">AIS</span></h2>
              <p className="text-[10px] uppercase tracking-[0.4em] text-cyan-400 mt-2 font-bold opacity-90">Area CCTV Control</p>
            </div>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-6 text-xs text-center font-bold flex items-center justify-center gap-2">
                <ShieldAlert size={14} /> {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-300/50 group-focus-within:text-cyan-400 transition-colors">
                  <User size={16} />
                </div>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Username" 
                  className="w-full bg-black/20 border border-white/10 rounded-2xl backdrop-blur-md py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-cyan-400/50 focus:bg-black/40 focus:ring-1 focus:ring-cyan-400/50 transition-all placeholder:text-slate-600"
                />
              </div>
              
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-300/50 group-focus-within:text-cyan-400 transition-colors">
                  <KeyRound size={16} />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password" 
                  className="w-full bg-black/20 border border-white/10 rounded-2xl backdrop-blur-md py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-cyan-400/50 focus:bg-black/40 focus:ring-1 focus:ring-cyan-400/50 transition-all placeholder:text-slate-600"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="mt-4 w-full bg-gradient-to-r from-cyan-600/80 to-blue-600/80 hover:from-cyan-500 hover:to-blue-500 backdrop-blur-md border border-white/10 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-[0_0_20px_rgba(0,200,255,0.3)] disabled:opacity-50 flex justify-center items-center gap-2 text-sm tracking-wider"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'SECURE LOGIN'}
              </button>
            </form>
            
            <div className="mt-8 text-center border-t border-white/5 pt-6">
              <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
                SECURE LOGIN PORTAL &copy; 2026<br/>
                Developed by <a href="https://creativedivisions.my.id/" target="_blank" rel="noreferrer" className="text-cyan-500 hover:text-cyan-400 transition-colors font-semibold">Creative Divisions</a>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
