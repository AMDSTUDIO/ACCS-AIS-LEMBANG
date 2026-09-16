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
    // Mocking status fetch for now, replace with actual API
    setServerStatus('Online');
    setActiveCameras('32/32 Online');
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
      {/* Background accents */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Header Bar */}
      <header className="relative z-10 bg-[#0a1220]/80 backdrop-blur-md border-b border-white/10 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-lg">
            <Activity size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ACCS
            </h1>
            <p className="text-[10px] text-cyan-400 tracking-[0.2em] uppercase font-semibold">Area CCTV Control System</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock size={16} className="text-cyan-400" />
            <span className="font-mono text-xs">{time.toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Server size={16} className={serverStatus === 'Online' ? 'text-emerald-400' : 'text-red-400'} />
            <span className="text-xs">Server: <strong className={serverStatus === 'Online' ? 'text-emerald-400' : 'text-red-400'}>{serverStatus}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Activity size={16} className="text-blue-400" />
            <span className="text-xs">Cam: <strong className="text-white">{activeCameras}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <User size={14} className="text-cyan-400" />
            <span className="text-xs font-semibold">{user?.username || 'Operator'}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-400/10 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-red-400/30"
          >
            <LogOut size={16} />
            LOGOUT
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Command Center Portal</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Pilih mode operasional sistem untuk memulai monitoring. Sistem dioptimalkan untuk meminimalkan beban resources dengan mengatur pembukaan stream.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          {cards.map((card, idx) => (
            <div 
              key={idx}
              className={`group flex flex-col bg-[#0a1220]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 transition-all duration-300 ${card.hoverBorder} ${card.hoverShadow} bg-gradient-to-b ${card.gradient}`}
            >
              <div className="flex-1">
                {card.icon}
                <h3 className="text-2xl font-bold mb-3">{card.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {card.description}
                </p>
              </div>
              
              <button 
                onClick={() => navigate(card.route)}
                className="mt-8 w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors group-hover:border-white/20"
              >
                {card.buttonText}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
