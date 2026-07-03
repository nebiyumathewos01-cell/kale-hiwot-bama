import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { isAdmin, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const handleLogout = () => { logout(); navigate('/') }

  const links = [
    { to: '/',         label: 'መነሻ',   labelEn: 'Home' },
    { to: '/songs',    label: 'መዝሙሮች', labelEn: 'Songs' },
    { to: '/messages', label: 'መልዕክቶች', labelEn: 'Messages' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-800/90 backdrop-blur-md border-b border-gold-500/10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🎵</span>
          <div className="leading-tight">
            <div className="font-amharic font-bold text-gold-400 text-sm group-hover:text-gold-300 transition-colors">
              ቃለ ሕይወት ባማ
            </div>
            <div className="text-xs text-gray-500">Bama Choir</div>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 font-amharic
                ${isActive(l.to)
                  ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <>
              <Link to="/admin"
                className="hidden md:block text-xs text-gold-400 border border-gold-500/30 px-3 py-1.5 rounded-lg hover:bg-gold-500/10 transition-all">
                ⚙ Admin
              </Link>
              <button onClick={handleLogout}
                className="text-xs text-gray-400 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20">
                Logout
              </button>
            </>
          ) : (
            <Link to="/admin/login"
              className="text-gray-600 hover:text-gray-400 transition-colors text-lg"
              title="Admin Login">⚙</Link>
          )}

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(v => !v)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors">
            <div className={`w-5 h-0.5 bg-gray-400 mb-1 transition-transform ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}/>
            <div className={`w-5 h-0.5 bg-gray-400 mb-1 transition-opacity ${menuOpen ? 'opacity-0' : ''}`}/>
            <div className={`w-5 h-0.5 bg-gray-400 transition-transform ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}/>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-dark-700 border-t border-gold-500/10 px-4 py-3 flex flex-col gap-1">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
              className={`px-4 py-2.5 rounded-lg text-sm font-amharic transition-all
                ${isActive(l.to) ? 'bg-gold-500/10 text-gold-400' : 'text-gray-400 hover:text-gray-200'}`}>
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" onClick={() => setMenuOpen(false)}
              className="px-4 py-2.5 rounded-lg text-sm text-gold-400 hover:bg-gold-500/10">
              ⚙ Admin Panel
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
