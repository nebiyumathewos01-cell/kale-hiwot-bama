import { useState, useEffect } from 'react'
import api from '../api/axios'

const TYPE_ICON = { Announcement: '📢', Prayer: '🙏', Verse: '📖', Event: '🗓' }
const TYPE_COLOR = {
  Announcement: 'border-gold-500/30   bg-gold-500/5',
  Prayer:       'border-purple-500/30  bg-purple-500/5',
  Verse:        'border-blue-500/30    bg-blue-500/5',
  Event:        'border-green-500/30   bg-green-500/5',
}

export default function Messages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    api.get('/messages')
      .then(r => setMessages(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="font-amharic font-extrabold text-4xl md:text-5xl gold-text mb-2">መልዕክቶች</h1>
          <p className="text-gray-500 text-lg">Messages & Announcements</p>
          <div className="w-16 h-0.5 bg-gold-500/50 mx-auto mt-4"/>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="w-1/2 h-4 bg-dark-400 rounded mb-3"/>
                <div className="w-full h-3 bg-dark-400 rounded mb-2"/>
                <div className="w-3/4 h-3 bg-dark-400 rounded"/>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">📭</p>
            <p className="font-amharic text-gray-400 text-lg">ምንም መልዕክት የለም</p>
            <p className="text-gray-600 text-sm">No messages yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={msg._id}
                className={`glass-card p-6 border ${TYPE_COLOR[msg.type] || 'border-gold-500/20'} transition-all duration-300 hover:-translate-y-0.5`}
                style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl mt-1">{TYPE_ICON[msg.type] || '📢'}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-amharic font-semibold text-gold-300 text-lg">{msg.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-dark-500 text-gray-500 border border-dark-400">
                        {msg.type}
                      </span>
                    </div>
                    <p className="font-amharic text-gray-300 leading-relaxed">{msg.content}</p>
                    <p className="text-xs text-gray-600 mt-3">
                      {new Date(msg.createdAt).toLocaleDateString('am-ET', { year:'numeric', month:'long', day:'numeric' })}
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
