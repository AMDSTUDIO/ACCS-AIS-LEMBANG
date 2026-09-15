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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans">
      
      {/* Clean Modern Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-slate-950"></div>
        {/* Soft Glowing Orbs */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[120px]"></div>
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[420px] p-10 bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl">
        
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 rounded-2xl shadow-lg shadow-blue-500/20 mb-6">
            <ShieldAlert size={36} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight leading-tight">ACCS <span className="font-light">AIS LEMBANG</span></h2>
          <p className="text-[11px] uppercase tracking-[0.3em] text-blue-400 mt-2 font-bold opacity-80">Area CCTV Control System</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-xl mb-6 text-xs text-center font-bold flex items-center justify-center gap-2">
            <ShieldAlert size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
              <User size={18} />
            </div>
            <input 
              type="text" 
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username" 
              className="w-full bg-slate-950/50 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
            />
          </div>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
              <KeyRound size={18} />
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password" 
              className="w-full bg-slate-950/50 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'LOGIN'}
          </button>
        </form>
        
        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-[10px] text-slate-500 font-mono">
            SECURE LOGIN PORTAL &copy; {new Date().getFullYear()}<br/>
            Developed by <a href="https://creativedivisions.my.id/" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">Creative Divisions</a>
          </p>
        </div>
      </div>
    </div>
  );
}
