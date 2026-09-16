import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import LoginPage from './components/auth/LoginPage';
import MapDashboard from './components/map/MapDashboard';
import MultiViewGrid from './components/multiview/MultiViewGrid';
import PortalHub from './components/portal/PortalHub';
import NocWallpanel from './components/wallpanel/NocWallpanel';
import axios from 'axios';

axios.defaults.withCredentials = true;

const ProtectedRoute = ({ children }) => {
  const user = useAuthStore(state => state.user);
  if (!user) return <Navigate to="/login" />;
  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-900 text-white relative font-sans">
      {children}
    </div>
  );
};

export default function App() {
  const login = useAuthStore(state => state.login);
  const [isChecking, setIsChecking] = React.useState(true);

  useEffect(() => {
    axios.get('/api/auth/me')
      .then(res => login(res.data.user))
      .catch(() => login(null))
      .finally(() => setIsChecking(false));
  }, [login]);

  if (isChecking) {
    return <div className="w-screen h-screen bg-slate-950 flex items-center justify-center text-white font-bold">Checking Secure Connection...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/portal" element={<ProtectedRoute><PortalHub /></ProtectedRoute>} />
        <Route path="/monitor/map" element={<ProtectedRoute><MapDashboard /></ProtectedRoute>} />
        <Route path="/monitor/grid" element={<ProtectedRoute><MultiViewGrid /></ProtectedRoute>} />
        <Route path="/monitor/wall" element={<ProtectedRoute><NocWallpanel /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/portal" replace />} />
        <Route path="*" element={<Navigate to="/portal" replace />} />
      </Routes>
    </Router>
  );
}
