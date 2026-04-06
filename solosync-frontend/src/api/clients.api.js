import api from './axios'

export const getClients    = ()       => api.get('/clients')
export const createClient  = (data)   => api.post('/clients', data)
export const updateClient  = (id, d)  => api.put(`/clients/${id}`, d)
export const deleteClient  = (id)     => api.delete(`/clients/${id}`)