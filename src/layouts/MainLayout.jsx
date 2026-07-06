import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LogOut,
  LayoutDashboard,
  Sparkles,
  FolderKanban,
  Plus,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import api from '../config/axios';

const MainLayout = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [workspaces, setWorkspaces] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }
    if (user) {
      api.get('/workspaces').then((data) => setWorkspaces(data || [])).catch(() => {});
    }
  }, [user, loading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark-800">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-accent-500/30 border-t-accent-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-dark-800 overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative z-50 lg:z-auto w-72 h-full flex flex-col transition-transform duration-300 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Background */}
        <div className="absolute inset-0 bg-dark-900/95 backdrop-blur-xl border-r border-slate-800/50" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Logo + Close */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-accent-500/20">
                <Sparkles size={18} className="text-white" />
              </div>
              <span
                className="text-lg font-bold text-white"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                TodoPro
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden btn-ghost p-1.5"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation */}
          <div className="px-4 py-4">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2 px-3">
              Menu chính
            </p>
            <nav className="space-y-1">
              <button
                onClick={() => { navigate('/dashboard'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium
                  ${isActive('/dashboard')
                    ? 'bg-accent-500/15 text-accent-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
              >
                <LayoutDashboard size={18} />
                Tổng quan
              </button>
            </nav>
          </div>

          {/* Workspaces */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-2">
            <div className="flex items-center justify-between mb-2 px-3">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                Workspace
              </p>
              <span className="text-[11px] text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded-md">
                {workspaces.length}
              </span>
            </div>
            <div className="space-y-0.5">
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => { navigate(`/dashboard/workspace/${ws.id}`); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm group
                    ${location.pathname === `/dashboard/workspace/${ws.id}`
                      ? 'bg-slate-800/80 text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                >
                  <FolderKanban size={16} className="shrink-0" />
                  <span className="truncate flex-1 text-left">{ws.name}</span>
                  <ChevronRight
                    size={14}
                    className="shrink-0 opacity-0 group-hover:opacity-50 transition-opacity"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* User Section */}
          <div className="p-4 border-t border-slate-800/50">
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-500/30 to-cyan-500/30 flex items-center justify-center text-accent-400 font-semibold text-sm border border-accent-500/20">
                {(user.username || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{user.fullName || user.username}</p>
                <p className="text-xs text-slate-500 truncate">@{user.username}</p>
              </div>
              <button
                onClick={handleLogout}
                className="btn-ghost p-2 text-slate-500 hover:!text-rose-400 hover:!bg-rose-500/10"
                title="Đăng xuất"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar (mobile) */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-slate-800/50 bg-dark-900/80 backdrop-blur-md">
          <button onClick={() => setSidebarOpen(true)} className="btn-ghost p-2">
            <Menu size={20} />
          </button>
          <span
            className="text-sm font-semibold text-white"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            TodoPro
          </span>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-mesh-subtle">
          <div className="p-6 md:p-8 lg:p-10">
            <Outlet context={{ refreshWorkspaces: () => api.get('/workspaces').then((d) => setWorkspaces(d || [])) }} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
