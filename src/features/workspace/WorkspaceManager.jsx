import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import api from '../../config/axios';
import toast from 'react-hot-toast';
import {
  PlusCircle,
  ArrowRight,
  FolderKanban,
  Calendar,
  X,
  Sparkles,
} from 'lucide-react';

const WorkspaceManager = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const { refreshWorkspaces } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const data = await api.get('/workspaces');
      setWorkspaces(data || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error('Vui lòng nhập tên không gian làm việc.');
      return;
    }
    setCreating(true);
    try {
      await api.post('/workspaces', { name: newName.trim() });
      toast.success('Đã tạo không gian làm việc mới!');
      setNewName('');
      setShowModal(false);
      fetchWorkspaces();
      if (refreshWorkspaces) refreshWorkspaces();
    } catch (error) {
    } finally {
      setCreating(false);
    }
  };

  // Gradient colors for workspace cards
  const cardGradients = [
    'from-accent-500/20 to-blue-500/10',
    'from-cyan-500/20 to-teal-500/10',
    'from-emerald-500/20 to-cyan-500/10',
    'from-amber-500/20 to-rose-500/10',
    'from-rose-500/20 to-accent-500/10',
    'from-blue-500/20 to-accent-500/10',
  ];

  const dotColors = [
    'bg-accent-400',
    'bg-cyan-400',
    'bg-emerald-400',
    'bg-amber-400',
    'bg-rose-400',
    'bg-blue-400',
  ];

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="skeleton h-10 w-48 mb-3" />
        <div className="skeleton h-5 w-72 mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-40 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
        <div>
          <h1
            className="text-3xl font-bold text-white mb-1"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Tổng quan
          </h1>
          <p className="text-slate-400">Quản lý các không gian làm việc của bạn</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <PlusCircle size={18} />
          Tạo không gian mới
        </button>
      </div>

      {/* Content */}
      {workspaces.length === 0 ? (
        /* Empty State */
        <div className="glass-card !p-12 text-center animate-scale-in cursor-default hover:!transform-none">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-500/20 to-cyan-500/10 flex items-center justify-center mx-auto mb-6 border border-accent-500/20">
            <FolderKanban size={36} className="text-accent-400" />
          </div>
          <h3
            className="text-xl font-semibold text-white mb-2"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Chưa có không gian làm việc
          </h3>
          <p className="text-slate-400 mb-8 max-w-sm mx-auto">
            Hãy tạo không gian làm việc đầu tiên để bắt đầu quản lý công việc với bảng Kanban.
          </p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Sparkles size={18} />
            Tạo ngay
          </button>
        </div>
      ) : (
        /* Workspace Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {workspaces.map((ws, index) => (
            <div
              key={ws.id}
              onClick={() => navigate(`/dashboard/workspace/${ws.id}`)}
              className="group glass-card !p-0 cursor-pointer overflow-hidden"
            >
              {/* Top gradient bar */}
              <div className={`h-1.5 bg-gradient-to-r ${cardGradients[index % cardGradients.length]}`} />

              <div className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-3 h-3 rounded-full mt-1.5 ${dotColors[index % dotColors.length]} shrink-0`} />
                  <h3
                    className="text-lg font-semibold text-white group-hover:text-accent-300 transition-colors line-clamp-2"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    {ws.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500 mb-5">
                  <Calendar size={14} />
                  <span>
                    {new Date(ws.createdAt).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex items-center text-accent-400 font-medium text-sm gap-1 group-hover:gap-2 transition-all">
                  Mở bảng Kanban
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}

          {/* Add New Card */}
          <div
            onClick={() => setShowModal(true)}
            className="glass-card !p-6 cursor-pointer flex flex-col items-center justify-center min-h-[160px] border-dashed !border-slate-700 hover:!border-accent-500/40"
          >
            <div className="w-12 h-12 rounded-2xl bg-accent-500/10 flex items-center justify-center mb-3 border border-accent-500/20">
              <PlusCircle size={24} className="text-accent-400" />
            </div>
            <p className="text-sm font-medium text-slate-400">Tạo không gian mới</p>
          </div>
        </div>
      )}

      {/* Create Workspace Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-xl font-bold text-white"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                Tạo không gian làm việc
              </h2>
              <button onClick={() => setShowModal(false)} className="btn-ghost p-1.5 hover:!bg-slate-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateWorkspace}>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tên không gian</label>
              <input
                type="text"
                className="input-simple mb-6"
                placeholder="Ví dụ: Dự án Website, Công việc cá nhân..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Hủy
                </button>
                <button type="submit" disabled={creating} className="btn-primary">
                  {creating ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <PlusCircle size={16} />
                      Tạo mới
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceManager;
