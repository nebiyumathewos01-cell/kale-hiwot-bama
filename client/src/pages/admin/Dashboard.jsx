import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../api/axios'

export default function Dashboard() {
  const { username } = useAuth()
  const [stats, setStats] = useState({ songs: 0, messages: 0, media: 0 })

  useEffect(() => {
    Promise.all([
      api.get('/songs'),
      api.get('/messages/all'),
      api.get('/media/all')
    ]).then(([s, m, med]) => setStats({ songs: s.data.length, messages: m.data.length, media: med.data.length }))
      .catch(() => {})
  }, [])

  const cards = [
    { icon: '🎵', label: 'Total Songs',    labelAm: 'ጠቅላላ መዝሙሮች', value: stats.songs,    link: '/admin/songs',    action: 'Manage Songs',    actionAm: 'መዝሙሮችን አስተዳድር' },
    { icon: '📢', label: 'Total Messages', labelAm: 'ጠቅላላ መልዕክቶች', value: stats.messages, link: '/admin/messages', action: 'Manage Messages', actionAm: 'መልዕክቶችን አስተዳድር' },
    { icon: '🖼', label: 'Media Items',    labelAm: 'ፎቶ እና ቪዲዮ',    value: stats.media,    link: '/admin/media',    action: 'Manage Media',    actionAm: 'ሚዲያ አስተዳድር' },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-gray-500 text-sm mb-1">Welcome back,</p>
          <h1 className="font-bold text-3xl text-gray-100">
            {username} <span className="text-gold-400">⚡</span>
          </h1>
          <p className="font-amharic text-gray-500 mt-1">የቃለ ሕይወት ባማ ዘማሪዎች - Admin Panel</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {cards.map(c => (
            <div key={c.label} className="glass-card p-8 hover:border-gold-500/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <span className="text-4xl">{c.icon}</span>
                <span className="font-bold text-5xl text-gold-400">{c.value}</span>
              </div>
              <p className="font-amharic text-gray-300 font-semibold mb-1">{c.labelAm}</p>
              <p className="text-gray-500 text-sm mb-6">{c.label}</p>
              <Link to={c.link} className="btn-gold w-full flex items-center justify-center gap-2 py-2.5">
                <span className="font-amharic text-sm">{c.actionAm}</span>
              </Link>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="glass-card p-6">
          <h2 className="font-amharic font-semibold text-gray-300 mb-4">ፈጣን ማስፈጸሚያ</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { to: '/admin/songs',    icon: '➕', label: 'Add Song',    am: 'መዝሙር ጨምር' },
              { to: '/admin/messages', icon: '📝', label: 'Add Message', am: 'መልዕክት ጨምር' },
              { to: '/admin/media',    icon: '📷', label: 'Add Media',   am: 'ሚዲያ ጨምር' },
              { to: '/songs',          icon: '👁',  label: 'View Songs',  am: 'መዝሙሮችን ይዩ' },
              { to: '/',               icon: '🏠',  label: 'Home',        am: 'መነሻ' },
              { to: '/admin/media',    icon: '🖼',  label: 'Gallery',     am: 'ጋለሪ' },
            ].map(l => (
              <Link key={l.to} to={l.to}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-dark-500 hover:bg-dark-400 border border-dark-400 hover:border-gold-500/30 transition-all duration-200 text-center">
                <span className="text-2xl">{l.icon}</span>
                <span className="font-amharic text-xs text-gray-400">{l.am}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
