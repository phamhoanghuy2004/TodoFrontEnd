import api from '../../../config/axios';

const taskApi = {
    getTasksByWorkspace: (workspaceId, params) => api.get(`/tasks/workspace/${workspaceId}`, { params }),
    createTask: (data) => api.post('/tasks', data),
    updateTask: (id, data) => api.put(`/tasks/${id}`, data),
    deleteTask: (id) => api.delete(`/tasks/${id}`),
    reorderTask: (id, data) => api.put(`/tasks/${id}/reorder`, data),
};

export default taskApi;
