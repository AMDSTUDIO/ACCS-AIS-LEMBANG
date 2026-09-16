import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { ShieldAlert, KeyRound, User, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

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
    <div className="min-h-screen flex items-center justify-center bg-[#050B14] relative overflow-hidden font-sans">
      
      {/* Background Image & Overlays */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* The CCTV Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] ease-linear hover:scale-110"
          style={{ backgroundImage: `url('/bg-cctv.jpg')` }}
        ></div>
        
        {/* Darkening & Color Overlay for Readability */}
        <div className="absolute inset-0 bg-slate-950/70 mix-blend-multiply backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
        
        {/* Glowing Accents */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-400/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Login Card - Sleeker with better Glassmorphism */}
      <div className="relative z-10 w-full max-w-[280px] sm:max-w-[300px] p-6 glass-panel rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="mb-4 flex justify-center">
            <img src="/ais-logo.png" alt="AIS Logo" className="w-14 h-14 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight leading-tight">ACCS <span className="font-light text-cyan-100">AIS</span></h2>
          <p className="text-[9px] uppercase tracking-[0.4em] text-cyan-400 mt-2 font-bold opacity-90">Area CCTV Control</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-6 text-xs text-center font-bold flex items-center justify-center gap-2">
            <ShieldAlert size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-300/50 group-focus-within:text-cyan-400 transition-colors">
              <User size={16} />
            </div>
            <input 
              type="text" 
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username" 
              className="w-full bg-black/20 border border-white/10 rounded-2xl backdrop-blur-md py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-cyan-400/50 focus:bg-black/40 focus:ring-1 focus:ring-cyan-400/50 transition-all placeholder:text-slate-600"
            />
          </div>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-300/50 group-focus-within:text-cyan-400 transition-colors">
              <KeyRound size={16} />
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password" 
              className="w-full bg-black/20 border border-white/10 rounded-2xl backdrop-blur-md py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-cyan-400/50 focus:bg-black/40 focus:ring-1 focus:ring-cyan-400/50 transition-all placeholder:text-slate-600"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-2 w-full bg-gradient-to-r from-cyan-600/80 to-blue-600/80 hover:from-cyan-500 hover:to-blue-500 backdrop-blur-md border border-white/10 text-white font-bold py-3 rounded-2xl transition-all shadow-lg hover:shadow-[0_0_20px_rgba(0,200,255,0.3)] disabled:opacity-50 flex justify-center items-center gap-2 text-xs tracking-wider"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'SECURE LOGIN'}
          </button>
        </form>
        
        <div className="mt-6 text-center border-t border-white/5 pt-5">
          <p className="text-[9px] text-slate-500 font-mono leading-relaxed">
            SECURE LOGIN PORTAL &copy; {new Date().getFullYear()}<br/>
            Developed by <a href="https://creativedivisions.my.id/" target="_blank" rel="noreferrer" className="text-cyan-500 hover:text-cyan-400 transition-colors font-semibold">Creative Divisions</a>
          </p>
        </div>
      </div>
    </div>
  );
}
