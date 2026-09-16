import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, Shield, Grid, Map, Settings, User } from 'lucide-react';
import axios from 'axios';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await axios.post('/api/auth/logout');
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200';

  return (
    <nav className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2 rounded-xl shadow-lg shadow-blue-900/20">
          <Shield className="text-white" size={20} />
        </div>
        <span className="font-extrabold text-xl tracking-tight text-white">Guardian <span className="text-blue-500">OS</span></span>
      </div>
      
      <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-xl border border-slate-800/50">
        <Link to="/monitor/map" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm ${isActive('/monitor/map')}`}>
          <Map size={16} /> Map View
        </Link>
        <Link to="/monitor/grid" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm ${isActive('/monitor/grid')}`}>
          <Grid size={16} /> Multi-View
        </Link>
        {user?.role === 'admin' && (
          <Link to="/settings" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm ${isActive('/settings')}`}>
            <Settings size={16} /> Config
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
          <div className="bg-slate-700 p-1 rounded-full"><User size={14} className="text-slate-300"/></div>
          <span className="font-medium text-slate-300 pr-1">{user?.username}</span>
        </div>
        <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition" title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}
