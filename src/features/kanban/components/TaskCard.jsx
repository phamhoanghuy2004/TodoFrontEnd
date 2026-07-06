import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { GripVertical, Trash2, Edit3, Calendar } from 'lucide-react';

const accentMap = {
  amber: {
    bar: 'bg-amber-400',
    drag: 'ring-amber-400/40 shadow-amber-500/20',
  },
  blue: {
    bar: 'bg-blue-400',
    drag: 'ring-blue-400/40 shadow-blue-500/20',
  },
  emerald: {
    bar: 'bg-emerald-400',
    drag: 'ring-emerald-400/40 shadow-emerald-500/20',
  },
  rose: {
    bar: 'bg-rose-400',
    drag: 'ring-rose-400/40 shadow-rose-500/20',
  },
};

const TaskCard = ({ task, index, color = 'blue', onEdit, onDelete }) => {
  const accent = accentMap[color] || accentMap.blue;
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirmDelete) {
      onDelete(task.id);
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`glass-card !p-0 mb-3 group overflow-hidden transition-all duration-200
            ${snapshot.isDragging
              ? `ring-2 ${accent.drag} shadow-lg !scale-[1.02] !bg-dark-700`
              : 'hover:!transform-none'
            }
          `}
        >
          <div className="flex">
            {/* Color Bar */}
            <div className={`w-1 shrink-0 ${accent.bar} rounded-l-2xl`} />

            <div className="flex-1 p-4">
              <div className="flex items-start gap-2.5">
                {/* Drag Handle */}
                <div
                  {...provided.dragHandleProps}
                  className="mt-0.5 text-slate-600 hover:text-slate-400 cursor-grab active:cursor-grabbing transition-colors"
                >
                  <GripVertical size={16} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-200 leading-snug text-sm">
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {task.description}
                    </p>
                  )}
                  
                  {(task.startDate || task.endDate) && (
                    <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-medium text-slate-500 bg-slate-800/50 w-fit px-2 py-1 rounded-md">
                      <Calendar size={12} className="text-slate-400" />
                      <span>
                        {task.startDate ? new Date(task.startDate).toLocaleDateString('vi-VN', { month: '2-digit', day: '2-digit' }) : '...'} 
                        {' - '} 
                        {task.endDate ? new Date(task.endDate).toLocaleDateString('vi-VN', { month: '2-digit', day: '2-digit' }) : '...'}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-3 flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                      className="p-1.5 text-slate-500 hover:text-accent-400 hover:bg-accent-500/10 rounded-lg transition-all"
                      title="Chỉnh sửa"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={handleDelete}
                      className={`p-1.5 rounded-lg transition-all text-xs
                        ${confirmDelete
                          ? 'text-rose-400 bg-rose-500/15 px-2.5 font-medium'
                          : 'text-slate-500 hover:text-rose-400 hover:bg-rose-500/10'
                        }
                      `}
                      title={confirmDelete ? 'Bấm lần nữa để xóa' : 'Xóa'}
                    >
                      {confirmDelete ? 'Xóa?' : <Trash2 size={13} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
