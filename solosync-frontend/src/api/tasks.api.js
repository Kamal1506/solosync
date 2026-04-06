import api from './axios'

export const getTasks      = (params) => api.get('/tasks', { params })
export const createTask    = (data)   => api.post('/tasks', data)
export const updateStatus  = (id, s)  => api.put(`/tasks/${id}/status`, { status: s })
export const deleteTask    = (id)     => api.delete(`/tasks/${id}`)