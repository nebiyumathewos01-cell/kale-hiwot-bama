import axios from 'axios'

// In production (Netlify), VITE_API_URL points to your Render backend.
// In local dev, the Vite proxy handles /api → localhost:5000.
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
})

// Attach JWT token to every request if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('bama_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
