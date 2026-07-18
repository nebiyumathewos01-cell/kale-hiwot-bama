import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { isAdmin, logout } = useAuth()
  const location  = useLocation()
  const navigate  = useNavigate()
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [scrolled,  setScrolled]  = useState(false)

  const isActive = (path) => location.pathname === path

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location.pathname])

  const handleLogout = () => { logout(); navigate('/') }

  const links = [
    { to: '/',         label: 'መነሻ',    icon: '🏠' },
    { to: '/songs',    label: 'መዝሙሮች',  icon: '🎵' },
    { to: '/messages', label: 'መልዕክቶች', icon: '📢' },
    { to: '/about',    label: 'ስለ እኛ',   icon: '🏛' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
      ${scrolled
        ? 'bg-dark-900/97 backdrop-blur-xl shadow-[0_4px_40px_rgba(0,0,0,0.6),0_1px_0_rgba(212,175,55,0.12)]'
        : 'bg-dark-800/80 backdrop-blur-md border-b border-gold-500/8'}`}>

      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg
            transition-all duration-500 group-hover:scale-110
            ${scrolled ? 'bg-gold-500/15 border border-gold-500/30' : 'bg-gold-500/10 border border-gold-500/20'}`}>
            🎵
          </div>
          <div className="leading-tight">
            <div className="font-amharic font-bold text-gold-400 text-sm
                            group-hover:text-gold-300 transition-colors tracking-wide">
              ቃለ ሕይወት ባማ
            </div>
            <div className="text-[10px] text-gray-600 tracking-widest uppercase">Bama Choir</div>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 font-amharic
                flex items-center gap-1.5 group
                ${isActive(l.to)
                  ? 'bg-gold-500/12 text-gold-400'
                  : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'}`}>
              <span className="text-base">{l.icon}</span>
              {l.label}
              {isActive(l.to) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1
                                 rounded-full bg-gold-400 animate-glow-pulse"/>
              )}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <>
              <Link to="/admin"
                className="hidden md:flex items-center gap-1.5 text-xs text-gold-400
                           border border-gold-500/30 px-3 py-1.5 rounded-lg
                           hover:bg-gold-500/10 hover:border-gold-500/50 transition-all">
                ⚙ Admin
              </Link>
              <button onClick={handleLogout}
                className="text-xs text-gray-500 hover:text-red-400 px-3 py-1.5 rounded-lg
                           hover:bg-red-500/10 transition-all border border-transparent
                           hover:border-red-500/20">
                Logout
              </button>
            </>
          ) : (
            <Link to="/admin/login"
              className="text-gray-600 hover:text-gold-400 transition-colors text-lg p-1.5 rounded-lg hover:bg-gold-500/8"
              title="Admin Login">⚙</Link>
          )}

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(v => !v)}
            className="md:hidden p-2 rounded-xl hover:bg-white/5 transition-colors"
            aria-label="Toggle menu">
            <span className={`block w-5 h-0.5 bg-gray-400 mb-1.5 transition-all duration-300
              ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}/>
            <span className={`block w-5 h-0.5 bg-gray-400 mb-1.5 transition-all duration-300
              ${menuOpen ? 'opacity-0 scale-x-0' : ''}`}/>
            <span className={`block w-5 h-0.5 bg-gray-400 transition-all duration-300
              ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}/>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300
        ${menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-dark-800/98 border-t border-gold-500/10 px-4 py-3 flex flex-col gap-1">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-amharic transition-all
                ${isActive(l.to)
                  ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}>
              <span>{l.icon}</span>
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin"
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm text-gold-400 hover:bg-gold-500/10 transition-all">
              ⚙ Admin Panel
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
