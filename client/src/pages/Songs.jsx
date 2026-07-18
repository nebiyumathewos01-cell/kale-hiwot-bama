import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const CATEGORIES = ['', 'Praise', 'Worship', 'Hymn', 'Special']
const LANGUAGES  = ['', 'Amharic', 'English', 'Both']

const categoryColor = (cat) => ({
  Worship: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Praise:  'bg-gold-500/20   text-gold-300   border-gold-500/30',
  Hymn:    'bg-blue-500/20   text-blue-300   border-blue-500/30',
  Special: 'bg-rose-500/20   text-rose-300   border-rose-500/30',
}[cat] || 'bg-gray-500/20 text-gray-300 border-gray-500/30')

const categoryIcon = (cat) => ({
  Worship: '🙏', Praise: '🎺', Hymn: '📖', Special: '⭐'
}[cat] || '🎵')

export default function Songs() {
  const [songs,    setSongs]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('')
  const [language, setLanguage] = useState('')
  const [visible,  setVisible]  = useState(false)
  const headerRef = useRef(null)

  const fetchSongs = async () => {
    setLoading(true)
    try {
      const params = {}
      if (search)   params.search   = search
      if (category) params.category = category
      if (language) params.language = language
      const res = await api.get('/songs', { params })
      setSongs(res.data)
    } catch { setSongs([]) }
    setLoading(false)
  }

  useEffect(() => { fetchSongs() }, [search, category, language])

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-16 px-4"
      style={{background:'linear-gradient(180deg, #0a0a0f 0%, #0d0d15 50%, #0a0a0f 100%)'}}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div ref={headerRef}
          className={`text-center mb-14 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-gold-500/50 text-xs tracking-[0.35em] uppercase mb-3">Collection</p>
          <h1 className="font-amharic font-extrabold text-5xl md:text-6xl gold-text mb-3">
            መዝሙሮች
          </h1>
          <p className="text-gray-500 text-base mb-1">Song Collection</p>
          <span className="stat-pill">
            {loading ? '...' : songs.length} songs
          </span>
          <div className="section-divider"/>
        </div>

        {/* Filters */}
        <div className={`glass-card p-4 mb-10 transition-all duration-700 delay-200
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="ፈልግ... Search songs..."
                className="input-dark pl-10 font-amharic"
              />
            </div>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="input-dark md:w-48 font-amharic">
              <option value="">ሁሉም ዓይነት</option>
              {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{categoryIcon(c)} {c}</option>)}
            </select>
            <select value={language} onChange={e => setLanguage(e.target.value)}
              className="input-dark md:w-44 font-amharic">
              <option value="">ሁሉም ቋንቋ</option>
              {LANGUAGES.slice(1).map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Active filters display */}
          {(search || category || language) && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs text-gray-600">Active:</span>
              {search && (
                <span className="stat-pill cursor-pointer hover:bg-gold-500/15 transition-colors"
                  onClick={() => setSearch('')}>
                  "{search}" ✕
                </span>
              )}
              {category && (
                <span className="stat-pill cursor-pointer hover:bg-gold-500/15 transition-colors"
                  onClick={() => setCategory('')}>
                  {category} ✕
                </span>
              )}
              {language && (
                <span className="stat-pill cursor-pointer hover:bg-gold-500/15 transition-colors"
                  onClick={() => setLanguage('')}>
                  {language} ✕
                </span>
              )}
            </div>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card p-6 h-44"
                style={{animation:`pulse 1.5s ease-in-out ${i*0.1}s infinite`}}>
                <div className="flex gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-dark-400 animate-pulse"/>
                  <div className="flex-1">
                    <div className="w-3/4 h-3 bg-dark-400 rounded animate-pulse mb-2"/>
                    <div className="w-1/2 h-2 bg-dark-400 rounded animate-pulse"/>
                  </div>
                </div>
                <div className="w-full h-3 bg-dark-400 rounded animate-pulse mb-2"/>
                <div className="w-2/3 h-3 bg-dark-400 rounded animate-pulse"/>
              </div>
            ))}
          </div>
        ) : songs.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-6xl mb-4 animate-float inline-block">🎵</div>
            <p className="font-amharic text-gray-400 text-xl mb-1">ምንም መዝሙር አልተገኘም</p>
            <p className="text-gray-600 text-sm">No songs found matching your search</p>
            {(search || category || language) && (
              <button onClick={() => { setSearch(''); setCategory(''); setLanguage('') }}
                className="btn-outline-gold mt-6 text-sm font-amharic">
                ማጣሪያ አጽዳ
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {songs.map((song, i) => (
              <Link key={song._id} to={`/songs/${song._id}`}
                className="glass-card card-shine p-6 group flex flex-col
                           hover:border-gold-500/40 hover:-translate-y-2
                           hover:shadow-[0_20px_60px_rgba(212,175,55,0.1)]
                           transition-all duration-500 animate-fade-up"
                style={{ animationDelay: `${(i % 9) * 60}ms` }}>

                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-500/15 to-transparent
                                  border border-gold-500/15 flex items-center justify-center text-2xl
                                  group-hover:from-gold-500/25 group-hover:border-gold-500/30
                                  group-hover:scale-110 transition-all duration-300">
                    {categoryIcon(song.category)}
                  </div>
                  {song.songNumber != null && (
                    <span className="stat-pill font-mono text-[10px]">#{song.songNumber}</span>
                  )}
                </div>

                <h3 className="font-amharic font-bold text-lg text-gray-100
                               group-hover:text-gold-300 transition-colors mb-1 flex-1 leading-snug">
                  {song.title}
                </h3>
                {song.singer && (
                  <p className="font-amharic text-xs text-gray-500 mb-4 flex items-center gap-1.5">
                    <span className="text-sm">🎤</span> {song.singer}
                  </p>
                )}

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gold-500/5 group-hover:border-gold-500/10 transition-colors">
                  <div className="flex gap-1.5 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${categoryColor(song.category)}`}>
                      {song.category}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-dark-500 text-gray-500 border border-dark-400">
                      {song.language}
                    </span>
                  </div>
                  <span className="text-gold-500/0 group-hover:text-gold-500/60 text-xs transition-all
                                   duration-300 -translate-x-1 group-hover:translate-x-0">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
