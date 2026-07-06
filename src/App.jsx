import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './features/landing/LandingPage';
import Auth from './features/auth/Auth';
import MainLayout from './layouts/MainLayout';
import WorkspaceManager from './features/workspace/WorkspaceManager';
import WorkspaceView from './features/kanban/WorkspaceView';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid rgba(148, 163, 184, 0.15)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              fontSize: '14px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#f8fafc' },
            },
            error: {
              iconTheme: { primary: '#f43f5e', secondary: '#f8fafc' },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/dashboard" element={<MainLayout />}>
            <Route index element={<WorkspaceManager />} />
            <Route path="workspace/:id" element={<WorkspaceView />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
