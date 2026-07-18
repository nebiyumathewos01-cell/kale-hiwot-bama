import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

const categoryColor = (cat) => ({
  Worship: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Praise:  'bg-gold-500/20   text-gold-300   border-gold-500/30',
  Hymn:    'bg-blue-500/20   text-blue-300   border-blue-500/30',
  Special: 'bg-rose-500/20   text-rose-300   border-rose-500/30',
}[cat] || 'bg-gray-500/20 text-gray-300 border-gray-500/20')

const categoryIcon = (cat) => ({
  Worship: '🙏', Praise: '🎺', Hymn: '📖', Special: '⭐'
}[cat] || '🎵')

export default function SongDetail() {
  const { id }          = useParams()
  const navigate        = useNavigate()
  const [song, setSong] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab]   = useState('am')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    api.get(`/songs/${id}`)
      .then(r => { setSong(r.data); setTimeout(() => setVisible(true), 100) })
      .catch(() => navigate('/songs'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 border-2 border-gold-500/60 border-t-transparent
                        rounded-full animate-spin mx-auto mb-4"/>
        <p className="font-amharic text-gray-600 text-sm animate-pulse">እየጫነ ነው...</p>
      </div>
    </div>
  )

  if (!song) return null

  return (
    <div className="min-h-screen pt-24 pb-16 px-4"
      style={{background:'linear-gradient(180deg, #0a0a0f 0%, #0d0d15 60%, #0a0a0f 100%)'}}>
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <Link to="/songs"
          className={`inline-flex items-center gap-2 text-gray-500 hover:text-gold-400
                      transition-all duration-300 mb-8 text-sm group
                      ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span className="font-amharic">ወደኋላ ተመለስ</span>
        </Link>

        {/* Song Header card */}
        <div className={`glass-card p-8 mb-6 transition-all duration-700
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{background:'linear-gradient(135deg, rgba(212,175,55,0.04) 0%, rgba(17,17,24,0.8) 100%)'}}>

          <div className="flex items-start justify-between mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-500/20 to-gold-500/5
                            border border-gold-500/25 flex items-center justify-center text-3xl
                            animate-glow-pulse">
              {categoryIcon(song.category)}
            </div>
            {song.songNumber != null && (
              <span className="stat-pill font-mono text-sm">#{song.songNumber}</span>
            )}
          </div>

          <h1 className="font-amharic font-extrabold text-3xl md:text-4xl text-gray-100 mb-1 leading-snug">
            {song.title}
          </h1>
          {song.titleAmharic && song.titleAmharic !== song.title && (
            <h2 className="font-amharic text-xl text-gray-500 mb-3">{song.titleAmharic}</h2>
          )}
          {song.singer && (
            <p className="font-amharic text-gold-400/80 mb-5 flex items-center gap-2 text-sm">
              <span className="text-base">🎤</span> {song.singer}
            </p>
          )}

          <div className="flex gap-2 flex-wrap">
            <span className={`text-xs px-3 py-1 rounded-full border ${categoryColor(song.category)}`}>
              {song.category}
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-dark-500 text-gray-400 border border-dark-400">
              {song.language}
            </span>
          </div>
        </div>

        {/* Lyrics card */}
        <div className={`glass-card overflow-hidden transition-all duration-700 delay-150
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

          {/* Tab bar */}
          {song.lyricsEnglish && (
            <div className="flex border-b border-gold-500/10">
              {[
                { key: 'am', label: 'አማርኛ' },
                { key: 'en', label: 'English' },
              ].map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`flex-1 py-3.5 text-sm font-amharic transition-all duration-200 relative
                    ${tab === t.key
                      ? 'text-gold-400 bg-gold-500/5'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-white/3'}`}>
                  {t.label}
                  {tab === t.key && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent"/>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Lyrics */}
          <div className="p-8 md:p-10">
            <div className="lyrics-text">
              {tab === 'am' ? song.lyrics : (song.lyricsEnglish || song.lyrics)}
            </div>
          </div>
        </div>

        {/* Bottom nav */}
        <div className={`mt-8 flex justify-center transition-all duration-700 delay-300
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Link to="/songs" className="btn-outline-gold font-amharic inline-flex items-center gap-2 px-8 py-3">
            ← ወደ መዝሙር ዝርዝር
          </Link>
        </div>
      </div>
    </div>
  )
}
