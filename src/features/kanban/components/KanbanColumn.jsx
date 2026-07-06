import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const colorMap = {
  amber: {
    dot: 'bg-amber-400',
    badge: 'bg-amber-500/15 text-amber-400',
    dropzone: 'bg-amber-500/5',
    border: 'border-amber-500/20',
  },
  blue: {
    dot: 'bg-blue-400',
    badge: 'bg-blue-500/15 text-blue-400',
    dropzone: 'bg-blue-500/5',
    border: 'border-blue-500/20',
  },
  emerald: {
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-500/15 text-emerald-400',
    dropzone: 'bg-emerald-500/5',
    border: 'border-emerald-500/20',
  },
  rose: {
    dot: 'bg-rose-400',
    badge: 'bg-rose-500/15 text-rose-400',
    dropzone: 'bg-rose-500/5',
    border: 'border-rose-500/20',
  },
};

const KanbanColumn = ({ id, title, color = 'blue', tasks, isDropDisabled = false, onEditTask, onDeleteTask }) => {
  const colors = colorMap[color] || colorMap.blue;

  return (
    <div className="flex flex-col w-80 shrink-0">
      {/* Column Header */}
      <div className="flex items-center gap-2.5 mb-4 px-1">
        <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
        <h3
          className="font-semibold text-slate-200 text-sm"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >
          {title}
        </h3>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-auto ${colors.badge}`}>
          {tasks.length}
        </span>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={id} isDropDisabled={isDropDisabled}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 min-h-[500px] rounded-2xl p-2 transition-all duration-200 custom-scrollbar overflow-y-auto
              ${snapshot.isDraggingOver
                ? `${colors.dropzone} border ${colors.border}`
                : 'border border-transparent'
              }
            `}
          >
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center mb-3">
                  <span className="text-slate-600 text-lg">📋</span>
                </div>
                <p className="text-sm text-slate-600">Chưa có công việc</p>
                <p className="text-xs text-slate-700 mt-1">Kéo thả vào đây</p>
              </div>
            )}
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                color={color}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
