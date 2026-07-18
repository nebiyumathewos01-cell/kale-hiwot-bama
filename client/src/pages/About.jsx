import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function About() {
  const [about, setAbout] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/about').then(r => setAbout(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"/>
    </div>
  )

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-amharic font-extrabold text-5xl gold-text mb-3">ስለ እኛ</h1>
          <p className="text-gray-500 text-lg">About Us</p>
          <div className="section-divider"/>
        </div>

        {/* Church name + tagline */}
        <div className="glass-card p-8 text-center mb-8">
          <div className="text-5xl mb-4">🎵</div>
          <h2 className="font-amharic font-bold text-3xl text-gold-300 mb-2">
            {about?.churchName || 'ቃለ ሕይወት ባማ Choir መዘምራን'}
          </h2>
          {about?.tagline && (
            <p className="text-gray-400 text-lg">{about.tagline}</p>
          )}
          {about?.founded && (
            <p className="font-amharic text-gray-500 text-sm mt-2">📅 {about.founded}</p>
          )}
        </div>

        {/* Description */}
        {about?.description && (
          <div className="glass-card p-8 mb-6">
            <h3 className="font-amharic font-bold text-xl text-gold-400 mb-4">ታሪካችን</h3>
            <p className="font-amharic text-gray-300 leading-loose whitespace-pre-line">{about.description}</p>
          </div>
        )}

        {/* Vision & Mission */}
        {(about?.vision || about?.mission) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {about?.vision && (
              <div className="glass-card p-6">
                <div className="text-3xl mb-3">🌟</div>
                <h3 className="font-amharic font-bold text-lg text-gold-400 mb-3">ራዕያችን</h3>
                <p className="font-amharic text-gray-300 text-sm leading-loose">{about.vision}</p>
              </div>
            )}
            {about?.mission && (
              <div className="glass-card p-6">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-amharic font-bold text-lg text-gold-400 mb-3">ተልዕኮአችን</h3>
                <p className="font-amharic text-gray-300 text-sm leading-loose">{about.mission}</p>
              </div>
            )}
          </div>
        )}

        {/* Contact info */}
        {(about?.location || about?.phone || about?.email) && (
          <div className="glass-card p-8 mb-8">
            <h3 className="font-amharic font-bold text-xl text-gold-400 mb-6">አድራሻ</h3>
            <div className="space-y-3">
              {about?.location && (
                <div className="flex items-center gap-3 text-gray-300">
                  <span className="text-xl">📍</span>
                  <span className="font-amharic">{about.location}</span>
                </div>
              )}
              {about?.phone && (
                <div className="flex items-center gap-3 text-gray-300">
                  <span className="text-xl">📞</span>
                  <a href={`tel:${about.phone}`} className="hover:text-gold-300 transition-colors">{about.phone}</a>
                </div>
              )}
              {about?.email && (
                <div className="flex items-center gap-3 text-gray-300">
                  <span className="text-xl">✉️</span>
                  <a href={`mailto:${about.email}`} className="hover:text-gold-300 transition-colors">{about.email}</a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Team members */}
        {about?.members?.length > 0 && (
          <div>
            <h3 className="font-amharic font-bold text-2xl text-center text-gray-100 mb-8">የቡድናችን አባላት</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {about.members.map((m, i) => (
                <div key={i} className="glass-card p-6 text-center hover:border-gold-500/40 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-2xl mx-auto mb-3">
                    {m.imageUrl ? <img src={m.imageUrl} alt={m.name} className="w-full h-full object-cover rounded-full"/> : '🎤'}
                  </div>
                  <p className="font-amharic font-semibold text-gray-200">{m.name}</p>
                  <p className="font-amharic text-xs text-gold-400/70 mt-1">{m.role}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!about?.description && !about?.vision && !about?.mission && !about?.members?.length && (
          <div className="text-center py-16 glass-card">
            <p className="text-5xl mb-4">🏛</p>
            <p className="font-amharic text-gray-400 text-lg">ይዘቱ በቅርቡ ይጨምራሉ</p>
            <p className="text-gray-600 text-sm">Content coming soon</p>
          </div>
        )}
      </div>
    </div>
  )
}
