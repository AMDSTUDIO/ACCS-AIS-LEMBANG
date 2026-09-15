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
      navigate('/');
    } catch (err) {
      setError('Akses ditolak. Kredensial tidak valid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050B14] relative overflow-hidden font-sans">
      
      {/* Futuristic Clean Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Deep background */}
        <div className="absolute inset-0 bg-[#050B14]"></div>
        
        {/* Glowing Cyber Orbs */}
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-[150px]"></div>
        
        {/* Futuristic Grid (Perspective) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-70" style={{ transform: 'perspective(1000px) rotateX(60deg) scale(2) translateY(-200px)' }}></div>
        
        {/* Subtle overlay to fade the grid at the top */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050B14] via-transparent to-[#050B14]/80"></div>
      </div>

      {/* Login Card - Smaller and Sleeker */}
      <div className="relative z-10 w-full max-w-[340px] p-8 bg-[#0A1220]/70 backdrop-blur-3xl border border-blue-500/20 shadow-[0_0_40px_rgba(0,120,255,0.1)] rounded-3xl">
        
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="bg-gradient-to-b from-cyan-400 to-blue-600 p-3.5 rounded-2xl shadow-[0_0_20px_rgba(0,180,255,0.3)] mb-5">
            <ShieldAlert size={28} className="text-white" />
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
              className="w-full bg-[#050B14]/80 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(0,255,255,0.1)] transition-all placeholder:text-slate-600"
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
              className="w-full bg-[#050B14]/80 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(0,255,255,0.1)] transition-all placeholder:text-slate-600"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-2 w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(0,180,255,0.2)] hover:shadow-[0_0_30px_rgba(0,180,255,0.4)] disabled:opacity-50 flex justify-center items-center gap-2 text-xs tracking-wider"
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
