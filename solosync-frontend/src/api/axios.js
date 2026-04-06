import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,   // from .env file
  headers: { 'Content-Type': 'application/json' }
})

// REQUEST interceptor — runs before every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('solosync_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// RESPONSE interceptor — runs after every response
api.interceptors.response.use(
  (response) => response,   // success — pass through
  (error) => {
    // If 401 (expired token) — log user out automatically
    if (error.response?.status === 401) {
      localStorage.removeItem('solosync_token')
      localStorage.removeItem('solosync_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api