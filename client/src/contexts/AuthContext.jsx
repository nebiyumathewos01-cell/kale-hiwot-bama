import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken]     = useState(() => localStorage.getItem('bama_token'))
  const [username, setUsername] = useState(() => localStorage.getItem('bama_user'))

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password })
    localStorage.setItem('bama_token', res.data.token)
    localStorage.setItem('bama_user',  res.data.username)
    setToken(res.data.token)
    setUsername(res.data.username)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('bama_token')
    localStorage.removeItem('bama_user')
    setToken(null)
    setUsername(null)
  }

  return (
    <AuthContext.Provider value={{ token, username, isAdmin: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
