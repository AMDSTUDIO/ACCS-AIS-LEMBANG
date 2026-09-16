import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import Login from './components/auth/Login';
import MapDashboard from './components/map/MapDashboard';
import MultiViewGrid from './components/multiview/MultiViewGrid';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStore();
  if (loading) return <div className="h-screen w-screen bg-black flex items-center justify-center text-white font-bold">Memuat Sistem...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
    
    // Interceptor for 401 Unauthorized globally
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          useAuthStore.getState().logout();
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/monitor/map" element={<ProtectedRoute><MapDashboard /></ProtectedRoute>} />
        <Route path="/monitor/grid" element={<ProtectedRoute><MultiViewGrid /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/monitor/map" replace />} />
        <Route path="*" element={<Navigate to="/monitor/map" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
