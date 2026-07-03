import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Login() {
  const { login }     = useAuth()
  const navigate      = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await login(form.username, form.password)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 -z-10"/>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/5 rounded-full filter blur-3xl -z-10"/>

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center text-3xl mx-auto mb-4 border border-gold-500/20">
            ⚙
          </div>
          <h1 className="font-amharic font-bold text-2xl text-gray-100 mb-1">የአስተዳዳሪ መግቢያ</h1>
          <p className="text-gray-500 text-sm">Admin Login</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Username</label>
            <input type="text" value={form.username} onChange={e => setForm(f => ({...f, username: e.target.value}))}
              className="input-dark" placeholder="admin" required />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Password</label>
            <input type="password" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))}
              className="input-dark" placeholder="••••••••" required />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="btn-gold w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60">
            {loading ? (
              <div className="w-5 h-5 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin"/>
            ) : '🔐 Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
