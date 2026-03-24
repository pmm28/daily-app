import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('daily_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
}

// Entries
export const entriesAPI = {
  getAll: () => api.get('/entries'),
  getByDate: (date) => api.get(`/entries/${date}`),
  upsert: (data) => api.post('/entries', data),
  delete: (date) => api.delete(`/entries/${date}`),
}

// Activities
export const activitiesAPI = {
  getByDate: (date) => api.get(`/activities/${date}`),
  create: (data) => api.post('/activities', data),
  update: (id, data) => api.put(`/activities/${id}`, data),
  delete: (id) => api.delete(`/activities/${id}`),
  reorder: (orderedIds) => api.put('/activities/reorder', { orderedIds }),
}

export default api
