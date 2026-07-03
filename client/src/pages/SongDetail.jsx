import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

const categoryColor = (cat) => ({
  Worship: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Praise:  'bg-gold-500/20   text-gold-300   border-gold-500/30',
  Hymn:    'bg-blue-500/20   text-blue-300   border-blue-500/30',
  Special: 'bg-rose-500/20   text-rose-300   border-rose-500/30',
}[cat] || 'bg-gray-500/20 text-gray-300')

export default function SongDetail() {
  const { id }          = useParams()
  const navigate        = useNavigate()
  const [song, setSong] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab]   = useState('am') // 'am' | 'en'

  useEffect(() => {
    api.get(`/songs/${id}`)
      .then(r => setSong(r.data))
      .catch(() => navigate('/songs'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"/>
    </div>
  )

  if (!song) return null

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <Link to="/songs" className="inline-flex items-center gap-2 text-gray-500 hover:text-gold-400 transition-colors mb-8 text-sm">
          ← <span className="font-amharic">ወደኋላ ተመለስ</span>
        </Link>

        {/* Song Header */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gold-500/10 flex items-center justify-center text-3xl">
              🎶
            </div>
            {song.songNumber != null && (
              <span className="font-mono text-gold-500/50 text-sm bg-gold-500/5 px-3 py-1 rounded-lg">
                #{song.songNumber}
              </span>
            )}
          </div>

          <h1 className="font-amharic font-extrabold text-3xl md:text-4xl text-gray-100 mb-2">
            {song.title}
          </h1>
          {song.titleAmharic && song.titleAmharic !== song.title && (
            <h2 className="font-amharic text-xl text-gray-400 mb-3">{song.titleAmharic}</h2>
          )}
          {song.singer && (
            <p className="font-amharic text-gold-400/80 mb-4 flex items-center gap-2">
              <span>🎤</span> {song.singer}
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

        {/* Lyrics tabs */}
        <div className="glass-card overflow-hidden">
          {/* Tab bar */}
          {song.lyricsEnglish && (
            <div className="flex border-b border-gold-500/10">
              <button onClick={() => setTab('am')}
                className={`flex-1 py-3 text-sm font-amharic transition-colors ${tab === 'am' ? 'text-gold-400 bg-gold-500/5 border-b-2 border-gold-500' : 'text-gray-500 hover:text-gray-300'}`}>
                አማርኛ
              </button>
              <button onClick={() => setTab('en')}
                className={`flex-1 py-3 text-sm transition-colors ${tab === 'en' ? 'text-gold-400 bg-gold-500/5 border-b-2 border-gold-500' : 'text-gray-500 hover:text-gray-300'}`}>
                English
              </button>
            </div>
          )}

          {/* Lyrics content */}
          <div className="p-8">
            <div className="lyrics-text">
              {tab === 'am' ? song.lyrics : (song.lyricsEnglish || song.lyrics)}
            </div>
          </div>
        </div>

        {/* Bottom nav */}
        <div className="mt-8 flex justify-center">
          <Link to="/songs" className="btn-outline-gold font-amharic">
            ← ወደ መዝሙር ዝርዝር
          </Link>
        </div>
      </div>
    </div>
  )
}
