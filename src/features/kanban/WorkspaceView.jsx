import React from 'react';
import { useParams } from 'react-router-dom';
import KanbanBoard from './components/KanbanBoard';
import { AlertCircle } from 'lucide-react';

const WorkspaceView = () => {
  const { id } = useParams();

  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <AlertCircle size={48} className="text-slate-600 mb-4" />
        <p className="text-slate-400 text-lg font-medium">Không tìm thấy không gian làm việc</p>
        <p className="text-slate-600 text-sm mt-1">Vui lòng chọn một workspace từ menu bên trái.</p>
      </div>
    );
  }

  return <KanbanBoard workspaceId={parseInt(id)} />;
};

export default WorkspaceView;
