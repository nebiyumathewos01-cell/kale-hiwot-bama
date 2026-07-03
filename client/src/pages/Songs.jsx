import { useState, useEffect } from 'react'
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

export default function Songs() {
  const [songs, setSongs]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [category, setCategory] = useState('')
  const [language, setLanguage] = useState('')

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

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-amharic font-extrabold text-4xl md:text-5xl gold-text mb-2">መዝሙሮች</h1>
          <p className="text-gray-500 text-lg">Song Collection · {songs.length} songs</p>
          <div className="w-16 h-0.5 bg-gold-500/50 mx-auto mt-4"/>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 mb-8 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="ፈልግ... Search..."
              className="input-dark pl-9 font-amharic"
            />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)} className="input-dark md:w-44 font-amharic">
            <option value="">ሁሉም ዓይነት</option>
            {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={language} onChange={e => setLanguage(e.target.value)} className="input-dark md:w-44 font-amharic">
            <option value="">ሁሉም ቋንቋ</option>
            {LANGUAGES.slice(1).map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card p-6 animate-pulse h-44">
                <div className="w-3/4 h-4 bg-dark-400 rounded mb-3"/>
                <div className="w-1/2 h-3 bg-dark-400 rounded mb-6"/>
                <div className="w-1/3 h-3 bg-dark-400 rounded"/>
              </div>
            ))}
          </div>
        ) : songs.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🎵</p>
            <p className="font-amharic text-gray-400 text-lg">ምንም መዝሙር አልተገኘም</p>
            <p className="text-gray-600 text-sm mt-1">No songs found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {songs.map((song, i) => (
              <Link key={song._id} to={`/songs/${song._id}`}
                className="glass-card p-6 hover:border-gold-500/40 transition-all duration-300 group hover:-translate-y-1 flex flex-col"
                style={{ animationDelay: `${i * 50}ms` }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-xl group-hover:bg-gold-500/20 transition-colors">
                    🎶
                  </div>
                  {song.songNumber != null && (
                    <span className="text-xs text-gold-500/50 font-mono bg-gold-500/5 px-2 py-1 rounded-lg">
                      #{song.songNumber}
                    </span>
                  )}
                </div>
                <h3 className="font-amharic font-bold text-lg text-gray-100 group-hover:text-gold-300 transition-colors mb-1 flex-1">
                  {song.title}
                </h3>
                {song.singer && (
                  <p className="font-amharic text-sm text-gray-500 mb-3">🎤 {song.singer}</p>
                )}
                <div className="flex items-center gap-2 mt-auto flex-wrap">
                  <span className={`text-xs px-2 py-1 rounded-full border ${categoryColor(song.category)}`}>
                    {song.category}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-dark-500 text-gray-500 border border-dark-400">
                    {song.language}
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
