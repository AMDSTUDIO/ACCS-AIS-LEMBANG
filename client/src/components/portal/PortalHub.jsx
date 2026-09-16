import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Map, Grid, MonitorPlay, LogOut, Activity, Server, Clock, User } from 'lucide-react';
import axios from 'axios';

export default function PortalHub() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [time, setTime] = useState(new Date());
  const [serverStatus, setServerStatus] = useState('Checking...');
  const [activeCameras, setActiveCameras] = useState('0/0');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setServerStatus('Online');
    
    // Fetch actual camera status
    axios.get('/api/cameras')
      .then(res => {
        const cams = res.data;
        const activeCount = cams.filter(c => c.is_active).length;
        setActiveCameras(`${activeCount}/${cams.length} Online`);
      })
      .catch(err => {
        setActiveCameras('0/0 Online');
        setServerStatus('Error');
      });
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (e) {}
    logout();
    navigate('/login');
  };

  const cards = [
    {
      title: 'GIS Mapping Map',
      description: 'Pantau persebaran titik kamera secara spasial berbasis peta wilayah interaktif, pengelompokan zona gedung, serta inspeksi cepat per titik lokasi.',
      icon: <Map className="w-12 h-12 mb-4 text-cyan-400" />,
      buttonText: 'Buka GIS Map →',
      route: '/monitor/map',
      gradient: 'from-cyan-500/20 to-blue-600/20',
      hoverBorder: 'hover:border-cyan-400/50',
      hoverShadow: 'hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]',
    },
    {
      title: 'Operator Multi-View Grid',
      description: 'Matriks live stream responsif dengan fleksibilitas layout (2x2, 3x3, 4x4) dan kendali kanal langsung untuk kebutuhan patroli harian.',
      icon: <Grid className="w-12 h-12 mb-4 text-emerald-400" />,
      buttonText: 'Buka Grid Monitor →',
      route: '/monitor/grid',
      gradient: 'from-emerald-500/20 to-teal-600/20',
      hoverBorder: 'hover:border-emerald-400/50',
      hoverShadow: 'hover:shadow-[0_0_30px_rgba(52,211,153,0.3)]',
    },
    {
      title: 'NOC Wallpanel Display',
      description: 'Mode tayang layar lebar/TV monitor tanpa sidebar kontrol, mendukung rotasi otomatis (auto-sequence cycling) untuk ruang kontrol dan monitoring pasif.',
      icon: <MonitorPlay className="w-12 h-12 mb-4 text-purple-400" />,
      buttonText: 'Luncurkan Wallpanel →',
      route: '/monitor/wall',
      gradient: 'from-purple-500/20 to-pink-600/20',
      hoverBorder: 'hover:border-purple-400/50',
      hoverShadow: 'hover:shadow-[0_0_30px_rgba(192,132,252,0.3)]',
    }
  ];

  return (
    <div className="min-h-screen bg-[#050B14] text-white flex flex-col font-sans relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: 'url(/bg-cctv.jpg)' }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#050B14]/80 via-[#050B14]/60 to-[#050B14] z-0 pointer-events-none"></div>

      {/* Header Bar */}
      <header className="relative z-10 bg-[#0a1220]/60 backdrop-blur-xl border-b border-white/10 p-4 px-8 flex flex-col md:flex-row justify-between items-center gap-4 shadow-2xl shadow-blue-900/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            <Activity size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ACCS
            </h1>
            <p className="text-[9px] text-cyan-400 tracking-[0.3em] uppercase font-bold">Area CCTV Control System</p>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-black/40 backdrop-blur-md px-6 py-2.5 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock size={16} className="text-cyan-400" />
            <span className="font-mono text-sm font-bold tracking-widest">{time.toLocaleTimeString()}</span>
          </div>
          <div className="w-px h-6 bg-white/10"></div>
          <div className="flex items-center gap-2 text-slate-300">
            <Server size={16} className={serverStatus === 'Online' ? 'text-emerald-400' : 'text-red-400'} />
            <span className="text-xs font-bold uppercase tracking-wider"><strong className={serverStatus === 'Online' ? 'text-emerald-400' : 'text-red-400'}>{serverStatus}</strong></span>
          </div>
          <div className="w-px h-6 bg-white/10"></div>
          <div className="flex items-center gap-2 text-slate-300">
            <Activity size={16} className="text-blue-400" />
            <span className="text-xs font-bold tracking-wider">CCTV: <strong className="text-white">{activeCameras}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 px-4 py-2 rounded-xl border border-cyan-500/30">
            <User size={16} className="text-cyan-400" />
            <span className="text-xs font-bold tracking-widest uppercase">{user?.username || 'Operator'}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-900/50 px-4 py-2 rounded-xl transition-all border border-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
          >
            <LogOut size={16} />
            LOGOUT
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center mb-16 max-w-3xl">
          <h2 className="text-5xl font-black mb-6 tracking-tight text-white drop-shadow-2xl">
            COMMAND CENTER <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">PORTAL</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Pilih mode operasional sistem untuk memulai monitoring. Akses ke setiap mode disesuaikan dengan peran dan hak akses Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          {cards.map((card, idx) => (
            <div 
              key={idx}
              className={`group flex flex-col bg-[#0a1220]/70 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 ${card.hoverBorder} ${card.hoverShadow} relative overflow-hidden`}
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${card.gradient}`}></div>
              
              <div className="relative z-10 flex-1">
                <div className="bg-black/40 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform duration-500">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-wide">{card.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  {card.description}
                </p>
              </div>
              
              <button 
                onClick={() => navigate(card.route)}
                className="relative z-10 mt-8 w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black tracking-widest flex items-center justify-center gap-3 transition-all group-hover:border-white/30 group-hover:bg-white/10"
              >
                {card.buttonText}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity group-hover:translate-x-1 duration-300">→</span>
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
