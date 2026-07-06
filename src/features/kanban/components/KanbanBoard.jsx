import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';
import taskApi from '../services/taskApi';
import { useUndoRedo } from '../../../hooks/useUndoRedo';
import toast from 'react-hot-toast';
import { Plus, Undo2, X, FileText, Search, Filter } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { vi } from 'date-fns/locale/vi';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('vi', vi);

const STATUS_MAP = {
  TODO: { label: 'Chuẩn bị làm', color: 'amber' },
  IN_PROGRESS: { label: 'Đang làm', color: 'blue' },
  DONE: { label: 'Đã hoàn thành', color: 'emerald' },
};

const formatLocalDate = (date) => {
  if (!date) return null;
  const pad = (n) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const KanbanBoard = ({ workspaceId }) => {
  const [tasks, setTasks] = useState({ TODO: [], IN_PROGRESS: [], DONE: [] });
  const [loading, setLoading] = useState(true);
  const { executeAction, undo, canUndo } = useUndoRedo();

  // Search & Filter
  const [searchTitle, setSearchTitle] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStartDate, setNewStartDate] = useState(null);
  const [newEndDate, setNewEndDate] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Validation state
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTitle);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTitle]);

  const fetchTasks = useCallback(async () => {
    if (!workspaceId) return;
    setLoading(true);
    try {
      const params = {};
      if (debouncedSearch.trim()) params.title = debouncedSearch.trim();
      if (filterStatus !== 'ALL') params.status = filterStatus;

      const data = await taskApi.getTasksByWorkspace(workspaceId, params);
      const grouped = { TODO: [], IN_PROGRESS: [], DONE: [] };
      (data || []).forEach((task) => {
        if (grouped[task.status]) {
          grouped[task.status].push(task);
        }
      });
      Object.keys(grouped).forEach((key) => {
        grouped[key].sort((a, b) => a.priorityOrder - b.priorityOrder);
      });
      setTasks(grouped);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [workspaceId, debouncedSearch, filterStatus]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const validateForm = () => {
    const newErrors = {};
    if (!newTitle.trim()) {
      newErrors.title = 'Tên công việc không được để trống';
    } else if (newTitle.trim().length < 3 || newTitle.trim().length > 100) {
      newErrors.title = 'Tên công việc phải từ 3 đến 100 ký tự';
    }

    if (!newStartDate) {
      newErrors.startDate = 'Ngày bắt đầu là bắt buộc';
    }
    if (!newEndDate) {
      newErrors.endDate = 'Ngày kết thúc là bắt buộc';
    }

    if (newStartDate && newEndDate) {
      if (newEndDate < newStartDate) {
        newErrors.date = 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Optional: if currently filtering by status, dragging might be confusing.
    // Allow dragging but handle state carefully.
    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;
    const taskId = parseInt(draggableId);

    const sourceTasks = Array.from(tasks[sourceStatus]);
    const destTasks = sourceStatus === destStatus ? sourceTasks : Array.from(tasks[destStatus]);

    const [movedTask] = sourceTasks.splice(source.index, 1);
    movedTask.status = destStatus;
    destTasks.splice(destination.index, 0, movedTask);

    setTasks((prev) => ({
      ...prev,
      [sourceStatus]: sourceTasks,
      [destStatus]: destTasks,
    }));

    try {
      const newPriorityOrder = destination.index + 1;
      const response = await taskApi.reorderTask(taskId, {
        workspaceId,
        newStatus: destStatus,
        newPriorityOrder,
      });

      executeAction({
        taskId,
        workspaceId,
        oldState: response.oldState,
      });
    } catch (error) {
      fetchTasks();
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await taskApi.deleteTask(id);
      toast.success('Đã xóa công việc');
      fetchTasks();
    } catch (error) {}
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      await taskApi.createTask({
        title: newTitle.trim(),
        description: newDescription.trim() || null,
        workspaceId,
        status: 'TODO',
        startDate: formatLocalDate(newStartDate),
        endDate: formatLocalDate(newEndDate),
      });
      toast.success('Đã thêm công việc');
      setNewTitle('');
      setNewDescription('');
      setNewStartDate(null);
      setNewEndDate(null);
      setErrors({});
      setShowCreateModal(false);
      fetchTasks();
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setNewTitle(task.title);
    setNewDescription(task.description || '');
    setNewStartDate(task.startDate ? new Date(task.startDate) : null);
    setNewEndDate(task.endDate ? new Date(task.endDate) : null);
    setErrors({});
    setShowEditModal(true);
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await taskApi.updateTask(editingTask.id, {
        title: newTitle.trim(),
        description: newDescription.trim() || null,
        startDate: formatLocalDate(newStartDate),
        endDate: formatLocalDate(newEndDate),
      });
      toast.success('Đã cập nhật công việc');
      setShowEditModal(false);
      setEditingTask(null);
      setNewTitle('');
      setNewDescription('');
      setNewStartDate(null);
      setNewEndDate(null);
      setErrors({});
      fetchTasks();
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  const totalTasks = Object.values(tasks).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2
            className="text-2xl font-bold text-white"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Bảng Kanban
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {loading ? 'Đang tải...' : `${totalTasks} công việc`}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => undo(fetchTasks)}
            disabled={!canUndo}
            className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed text-sm"
          >
            <Undo2 size={16} />
            Hoàn tác
          </button>
          <button onClick={() => {
            setNewTitle('');
            setNewDescription('');
            setNewStartDate(null);
            setNewEndDate(null);
            setErrors({});
            setShowCreateModal(true);
          }} className="btn-primary text-sm">
            <Plus size={16} />
            Thêm công việc
          </button>
        </div>
      </div>

      {/* Control Bar (Search & Filter) */}
      <div className="glass-card !p-3 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Tìm kiếm công việc..."
            className="input-simple !pl-10 !py-2 w-full text-sm"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto custom-scrollbar pb-1 md:pb-0">
          <div className="flex bg-slate-800/50 p-1 rounded-xl">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                ${filterStatus === 'ALL' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}
              `}
            >
              Tất cả
            </button>
            {Object.entries(STATUS_MAP).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setFilterStatus(key)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                  ${filterStatus === key ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}
                `}
              >
                {value.label}
              </button>
            ))}
            <button
              onClick={() => setFilterStatus('OVERDUE')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                ${filterStatus === 'OVERDUE' ? 'bg-rose-500/20 text-rose-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'}
              `}
            >
              Trễ hạn
            </button>
          </div>
        </div>
      </div>

      {/* Loading State or Kanban Columns */}
      {loading && totalTasks === 0 ? (
        <div className="flex gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-80 shrink-0">
              <div className="skeleton h-8 w-32 mb-4" />
              <div className="space-y-3">
                <div className="skeleton h-24 rounded-xl" />
                <div className="skeleton h-20 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-5 items-start min-w-max">
              {filterStatus === 'OVERDUE' ? (
                <KanbanColumn
                  key="OVERDUE"
                  id="OVERDUE"
                  title="Trễ hạn"
                  color="rose"
                  isDropDisabled={true}
                  tasks={[...(tasks.TODO || []), ...(tasks.IN_PROGRESS || [])].sort((a, b) => a.priorityOrder - b.priorityOrder)}
                  onEditTask={openEditModal}
                  onDeleteTask={handleDeleteTask}
                />
              ) : (
                Object.keys(STATUS_MAP).map((statusKey) => {
                  if (filterStatus !== 'ALL' && filterStatus !== statusKey) return null;
                  return (
                    <KanbanColumn
                      key={statusKey}
                      id={statusKey}
                      title={STATUS_MAP[statusKey].label}
                      color={STATUS_MAP[statusKey].color}
                      tasks={tasks[statusKey]}
                      onEditTask={openEditModal}
                      onDeleteTask={handleDeleteTask}
                    />
                  );
                })
              )}
            </div>
          </DragDropContext>
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-xl font-bold text-white"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                Thêm công việc mới
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="btn-ghost p-1.5 hover:!bg-slate-700">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateTask}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">Tên công việc <span className="text-rose-400">*</span></label>
                <input
                  type="text"
                  className={`input-simple ${errors.title ? '!border-rose-500/50 focus:!ring-rose-500/20' : ''}`}
                  placeholder="Ví dụ: Thiết kế giao diện..."
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (errors.title) setErrors({...errors, title: null});
                  }}
                  autoFocus
                />
                {errors.title && <p className="text-rose-400 text-xs mt-1.5">{errors.title}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Mô tả <span className="text-slate-500">(không bắt buộc)</span>
                </label>
                <textarea
                  className="input-simple min-h-[80px] resize-none"
                  placeholder="Thêm chi tiết cho công việc này..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Ngày bắt đầu <span className="text-rose-400">*</span></label>
                  <DatePicker
                    selected={newStartDate}
                    onChange={(date) => {
                      setNewStartDate(date);
                      if (errors.startDate) setErrors({ ...errors, startDate: null });
                      if (errors.date) setErrors({ ...errors, date: null });
                    }}
                    dateFormat="dd/MM/yyyy"
                    locale="vi"
                    placeholderText="Chọn ngày"
                    className={`input-simple text-sm w-full min-h-[42px] ${errors.startDate ? '!border-rose-500/50 focus:!ring-rose-500/20' : ''}`}
                  />
                  {errors.startDate && <p className="text-rose-400 text-xs mt-1.5">{errors.startDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Ngày kết thúc <span className="text-rose-400">*</span></label>
                  <DatePicker
                    selected={newEndDate}
                    onChange={(date) => {
                      setNewEndDate(date);
                      if (errors.endDate) setErrors({ ...errors, endDate: null });
                      if (errors.date) setErrors({ ...errors, date: null });
                    }}
                    dateFormat="dd/MM/yyyy"
                    locale="vi"
                    placeholderText="Chọn ngày"
                    className={`input-simple text-sm w-full min-h-[42px] ${errors.endDate || errors.date ? '!border-rose-500/50 focus:!ring-rose-500/20' : ''}`}
                  />
                  {errors.endDate && <p className="text-rose-400 text-xs mt-1.5">{errors.endDate}</p>}
                </div>
                {errors.date && <p className="text-rose-400 text-xs col-span-2 mt-1">{errors.date}</p>}
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">
                  Hủy
                </button>
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Plus size={16} />
                      Thêm
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditModal && editingTask && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-xl font-bold text-white"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                Chỉnh sửa công việc
              </h2>
              <button onClick={() => setShowEditModal(false)} className="btn-ghost p-1.5 hover:!bg-slate-700">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleEditTask}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">Tên công việc <span className="text-rose-400">*</span></label>
                <input
                  type="text"
                  className={`input-simple ${errors.title ? '!border-rose-500/50 focus:!ring-rose-500/20' : ''}`}
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (errors.title) setErrors({...errors, title: null});
                  }}
                  autoFocus
                />
                {errors.title && <p className="text-rose-400 text-xs mt-1.5">{errors.title}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Mô tả <span className="text-slate-500">(không bắt buộc)</span>
                </label>
                <textarea
                  className="input-simple min-h-[80px] resize-none"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Ngày bắt đầu <span className="text-rose-400">*</span></label>
                  <DatePicker
                    selected={newStartDate}
                    onChange={(date) => {
                      setNewStartDate(date);
                      if (errors.startDate) setErrors({ ...errors, startDate: null });
                      if (errors.date) setErrors({ ...errors, date: null });
                    }}
                    dateFormat="dd/MM/yyyy"
                    locale="vi"
                    placeholderText="Chọn ngày"
                    className={`input-simple text-sm w-full min-h-[42px] ${errors.startDate ? '!border-rose-500/50 focus:!ring-rose-500/20' : ''}`}
                  />
                  {errors.startDate && <p className="text-rose-400 text-xs mt-1.5">{errors.startDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Ngày kết thúc <span className="text-rose-400">*</span></label>
                  <DatePicker
                    selected={newEndDate}
                    onChange={(date) => {
                      setNewEndDate(date);
                      if (errors.endDate) setErrors({ ...errors, endDate: null });
                      if (errors.date) setErrors({ ...errors, date: null });
                    }}
                    dateFormat="dd/MM/yyyy"
                    locale="vi"
                    placeholderText="Chọn ngày"
                    className={`input-simple text-sm w-full min-h-[42px] ${errors.endDate || errors.date ? '!border-rose-500/50 focus:!ring-rose-500/20' : ''}`}
                  />
                  {errors.endDate && <p className="text-rose-400 text-xs mt-1.5">{errors.endDate}</p>}
                </div>
                {errors.date && <p className="text-rose-400 text-xs col-span-2 mt-1">{errors.date}</p>}
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowEditModal(false)} className="btn-secondary">
                  Hủy
                </button>
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <FileText size={16} />
                      Cập nhật
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

export default KanbanBoard;
