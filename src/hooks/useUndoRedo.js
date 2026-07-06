import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import taskApi from '../features/kanban/services/taskApi';

export const useUndoRedo = () => {
    const [actionStack, setActionStack] = useState([]);

    const executeAction = useCallback((action) => {
        setActionStack((prev) => [...prev, action]);
    }, []);

    const undo = useCallback(async (refreshBoard) => {
        if (actionStack.length === 0) return;

        const lastAction = actionStack[actionStack.length - 1];
        try {
            await taskApi.reorderTask(lastAction.taskId, {
                workspaceId: lastAction.workspaceId,
                newStatus: lastAction.oldState.status,
                newPriorityOrder: lastAction.oldState.priorityOrder
            });

            setActionStack((prev) => prev.slice(0, -1));
            toast.success('Đã hoàn tác thao tác cuối cùng!');
            
            if (refreshBoard) refreshBoard();
        } catch (error) {
            console.error('Lỗi khi hoàn tác:', error);
            toast.error('Hoàn tác thất bại.');
        }
    }, [actionStack]);

    return {
        executeAction,
        undo,
        canUndo: actionStack.length > 0,
        actionStack
    };
};
