import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppLayout } from '@/components/layout/AppLayout';
import { Dashboard } from '@/pages/Dashboard';

import { Students } from '@/pages/Students';

import { Rooms } from '@/pages/Rooms';

import { Analytics } from '@/pages/Analytics';
import { Reports } from '@/pages/Reports';
import { Settings } from '@/pages/Settings';
import { Login } from '@/pages/Login';

import { useStore } from '@/store/useStore';

function App() {
  const { rooms, bootstrapData } = useStore();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  useEffect(() => {
    if (rooms.length === 0 && isAuthenticated) {
      bootstrapData();
    }
  }, [rooms.length, bootstrapData, isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  if (!isAuthenticated) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Toaster position="bottom-left" />
      </>
    );
  }

  return (
    <>
      <HashRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </AppLayout>
      </HashRouter>
      <Toaster 
        position="bottom-left" 
        toastOptions={{
          className: 'glass-panel !rounded-xl !border-white/60 !shadow-lg',
          style: {
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(20px)',
            color: '#0f172a',
            fontWeight: 600,
          },
        }}
      />
    </>
  );
}

export default App;
