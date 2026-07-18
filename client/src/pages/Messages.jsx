import { useState, useEffect } from 'react'
import api from '../api/axios'

const TYPE_ICON = { Announcement: '📢', Prayer: '🙏', Verse: '📖', Event: '🗓' }
const TYPE_COLOR = {
  Announcement: 'border-l-gold-500/60   bg-gold-500/4',
  Prayer:       'border-l-purple-500/60  bg-purple-500/4',
  Verse:        'border-l-blue-500/60    bg-blue-500/4',
  Event:        'border-l-green-500/60   bg-green-500/4',
}
const TYPE_BADGE = {
  Announcement: 'bg-gold-500/15   text-gold-300   border-gold-500/30',
  Prayer:       'bg-purple-500/15  text-purple-300  border-purple-500/30',
  Verse:        'bg-blue-500/15    text-blue-300    border-blue-500/30',
  Event:        'bg-green-500/15   text-green-300   border-green-500/30',
}

export default function Messages() {
  const [messages, setMessages] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [visible,  setVisible]  = useState(false)

  useEffect(() => {
    api.get('/messages')
      .then(r => setMessages(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-16 px-4"
      style={{background:'linear-gradient(180deg, #0a0a0f 0%, #0d0d15 50%, #0a0a0f 100%)'}}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className={`text-center mb-14 transition-all duration-700
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-gold-500/50 text-xs tracking-[0.35em] uppercase mb-3">Board</p>
          <h1 className="font-amharic font-extrabold text-5xl md:text-6xl gold-text mb-3">
            መልዕክቶች
          </h1>
          <p className="text-gray-500">Messages & Announcements</p>
          <div className="section-divider"/>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-card p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-dark-400 animate-pulse flex-shrink-0"/>
                  <div className="flex-1">
                    <div className="w-1/3 h-3 bg-dark-400 rounded animate-pulse mb-3"/>
                    <div className="w-full h-2.5 bg-dark-400 rounded animate-pulse mb-2"/>
                    <div className="w-3/4 h-2.5 bg-dark-400 rounded animate-pulse"/>
                  </div>
                </div>
              </div>
            ))}
          </div>

        ) : messages.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-6xl mb-4 animate-float inline-block">📭</div>
            <p className="font-amharic text-gray-400 text-xl mb-1">ምንም መልዕክት የለም</p>
            <p className="text-gray-600 text-sm">No messages yet</p>
          </div>

        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={msg._id}
                className={`glass-card border-l-4 p-6 group
                            hover:border-gold-500/25 hover:-translate-y-0.5
                            transition-all duration-400 animate-fade-up
                            ${TYPE_COLOR[msg.type] || 'border-l-gold-500/40'}`}
                style={{ animationDelay: `${i * 80}ms` }}>

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-dark-500 border border-dark-400
                                  flex items-center justify-center text-2xl flex-shrink-0
                                  group-hover:scale-105 group-hover:border-gold-500/20
                                  transition-all duration-300">
                    {TYPE_ICON[msg.type] || '📢'}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                      <h3 className="font-amharic font-bold text-gray-100 text-lg
                                     group-hover:text-gold-300 transition-colors leading-snug">
                        {msg.title}
                      </h3>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full border flex-shrink-0
                        ${TYPE_BADGE[msg.type] || 'bg-dark-500 text-gray-500 border-dark-400'}`}>
                        {msg.type}
                      </span>
                    </div>

                    {/* Content */}
                    <p className="font-amharic text-gray-400 text-sm leading-relaxed">
                      {msg.content}
                    </p>

                    {/* Date */}
                    <p className="text-xs text-gray-600 mt-3 flex items-center gap-1.5">
                      <span>🕐</span>
                      {new Date(msg.createdAt).toLocaleDateString('am-ET', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
