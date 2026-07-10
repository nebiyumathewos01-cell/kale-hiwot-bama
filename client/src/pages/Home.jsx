import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function Home() {
  const [songs, setSongs]       = useState([])
  const [messages, setMessages] = useState([])
  const [media, setMedia]       = useState([])
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 400)
    api.get('/songs').then(r => setSongs(r.data.slice(0, 3))).catch(() => {})
    api.get('/messages').then(r => setMessages(r.data.slice(0, 2))).catch(() => {})
    api.get('/media').then(r => setMedia(r.data)).catch(() => {})
  }, [])

  const categoryColor = (cat) => ({
    Worship: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    Praise:  'bg-gold-500/20   text-gold-300   border-gold-500/30',
    Hymn:    'bg-blue-500/20   text-blue-300   border-blue-500/30',
    Special: 'bg-rose-500/20   text-rose-300   border-rose-500/30',
  }[cat] || 'bg-gray-500/20 text-gray-300')

  const images = media.filter(m => m.type === 'image')
  const videos = media.filter(m => m.type === 'video')

  return (
    <div className="min-h-screen">

      {/* ══════════════════════════════
          HERO
      ══════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden pt-16">

        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900"/>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full filter blur-3xl animate-pulse"/>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full filter blur-3xl animate-pulse" style={{animationDelay:'1.5s'}}/>
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2
                        border border-gold-500/5 rounded-full animate-spin" style={{animationDuration:'40s'}}/>
        <div className="absolute top-1/2 left-1/2 w-[380px] h-[380px] -translate-x-1/2 -translate-y-1/2
                        border border-gold-500/5 rounded-full animate-spin" style={{animationDuration:'25s', animationDirection:'reverse'}}/>

        <div className={`relative z-10 text-center max-w-3xl mx-auto transition-all duration-1000
                         ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* Music note icon */}
          <div className="w-20 h-20 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center
                          text-4xl mx-auto mb-8 animate-float">
            🎵
          </div>

          <div className="text-gold-500/50 text-sm tracking-[0.35em] uppercase mb-3 font-light">
            Kale Hiwot Church · Bama
          </div>

          <h1 className="font-amharic font-extrabold text-5xl md:text-7xl mb-3 leading-tight">
            <span className="gold-text">ቃለ ሕይወት</span>
          </h1>
          <h2 className="font-amharic text-3xl md:text-4xl text-gray-200 font-bold mb-2">
            ባማ Choir መዘምራን
          </h2>
          <p className="text-gray-500 text-lg mb-12 tracking-wide">Bama Choir</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/songs"
              className="btn-gold flex items-center justify-center gap-2 text-base px-8 py-3.5 rounded-xl">
              🎶 <span className="font-amharic">መዝሙሮችን ይመልከቱ</span>
            </Link>
            <Link to="/messages"
              className="btn-outline-gold flex items-center justify-center gap-2 text-base px-8 py-3.5 rounded-xl">
              📢 <span className="font-amharic">መልዕክቶች</span>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <div className="w-6 h-10 border-2 border-gold-500/40 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-gold-500/60 rounded-full"/>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          FEATURED SONGS
      ══════════════════════════════ */}
      {songs.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-amharic text-3xl font-bold text-gray-100 mb-2">የቅርብ ጊዜ መዝሙሮች</h2>
              <p className="text-gray-500">Recent Songs</p>
              <div className="w-16 h-0.5 bg-gold-500/50 mx-auto mt-4"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {songs.map((song, i) => (
                <Link key={song._id} to={`/songs/${song._id}`}
                  className="glass-card p-6 hover:border-gold-500/40 transition-all duration-300 group hover:-translate-y-1"
                  style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-gold-500/10 flex items-center justify-center text-xl group-hover:bg-gold-500/20 transition-colors">
                      🎶
                    </div>
                    {song.songNumber && (
                      <span className="text-xs text-gold-500/50 font-mono bg-gold-500/5 px-2 py-1 rounded-lg">
                        #{song.songNumber}
                      </span>
                    )}
                  </div>
                  <h3 className="font-amharic font-bold text-lg text-gray-100 group-hover:text-gold-300 transition-colors mb-1">
                    {song.title}
                  </h3>
                  {song.singer && (
                    <p className="font-amharic text-sm text-gray-500 mb-3">🎤 {song.singer}</p>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full border ${categoryColor(song.category)}`}>
                    {song.category}
                  </span>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/songs" className="btn-outline-gold font-amharic">
                ሁሉንም ይመልከቱ →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════
          PHOTO GALLERY
      ══════════════════════════════ */}
      <section className="py-20 px-4 bg-dark-800/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-amharic text-3xl font-bold text-gray-100 mb-2">ፎቶ ጋለሪ</h2>
            <p className="text-gray-500">Photo Gallery</p>
            <div className="w-16 h-0.5 bg-gold-500/50 mx-auto mt-4"/>
          </div>

          {images.length === 0 ? (
            /* Placeholder grid shown when no images are uploaded yet */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i}
                  className="glass-card aspect-square flex flex-col items-center justify-center gap-2
                             border-2 border-dashed border-gold-500/15 hover:border-gold-500/30 transition-all group">
                  <span className="text-3xl opacity-30 group-hover:opacity-50 transition-opacity">📷</span>
                  <span className="text-xs text-gray-600 font-amharic group-hover:text-gray-500 transition-colors">
                    ፎቶ
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map(img => (
                <div key={img._id} className="glass-card overflow-hidden aspect-square group cursor-pointer relative">
                  <img src={img.data} alt={img.caption || 'Choir photo'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                  {img.caption && (
                    <div className="absolute inset-0 bg-dark-900/70 opacity-0 group-hover:opacity-100 transition-opacity
                                    flex items-end p-3">
                      <p className="font-amharic text-xs text-gray-200">{img.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <p className="text-center text-gray-600 text-sm mt-6 font-amharic">
            {images.length === 0
              ? 'አስተዳዳሪ ፎቶዎችን ሲጨምሩ እዚህ ይታያሉ'
              : `${images.length} ፎቶዎች`}
          </p>
        </div>
      </section>

      {/* ══════════════════════════════
          VIDEO SECTION
      ══════════════════════════════ */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-amharic text-3xl font-bold text-gray-100 mb-2">ቪዲዮዎች</h2>
            <p className="text-gray-500">Videos</p>
            <div className="w-16 h-0.5 bg-gold-500/50 mx-auto mt-4"/>
          </div>

          {videos.length === 0 ? (
            /* Placeholder grid when no videos uploaded */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i}
                  className="glass-card aspect-video flex flex-col items-center justify-center gap-3
                             border-2 border-dashed border-gold-500/15 hover:border-gold-500/30 transition-all group">
                  <div className="w-14 h-14 rounded-full border-2 border-gold-500/20 flex items-center justify-center
                                  group-hover:border-gold-500/40 transition-all">
                    <span className="text-2xl">▶</span>
                  </div>
                  <span className="text-xs text-gray-600 font-amharic">ቪዲዮ</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map(vid => (
                <div key={vid._id} className="glass-card overflow-hidden">
                  {vid.youtubeId ? (
                    <div className="aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${vid.youtubeId}`}
                        title={vid.caption || 'Choir video'}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                  ) : vid.data ? (
                    <div className="aspect-video">
                      <video src={vid.data} controls className="w-full h-full object-cover"/>
                    </div>
                  ) : null}
                  {vid.caption && (
                    <p className="font-amharic text-sm text-gray-400 p-3 border-t border-gold-500/10">
                      {vid.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <p className="text-center text-gray-600 text-sm mt-6 font-amharic">
            {videos.length === 0
              ? 'አስተዳዳሪ ቪዲዮዎችን ሲጨምሩ እዚህ ይታያሉ'
              : `${videos.length} ቪዲዮዎች`}
          </p>
        </div>
      </section>

      {/* ══════════════════════════════
          MESSAGES
      ══════════════════════════════ */}
      {messages.length > 0 && (
        <section className="py-16 px-4 bg-dark-800/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-amharic text-3xl font-bold text-gray-100 mb-2">መልዕክቶች</h2>
              <p className="text-gray-500">Messages & Announcements</p>
              <div className="w-16 h-0.5 bg-gold-500/50 mx-auto mt-4"/>
            </div>
            <div className="space-y-4">
              {messages.map(msg => (
                <div key={msg._id} className="glass-card p-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-1">
                      {{ Announcement:'📢', Prayer:'🙏', Verse:'📖', Event:'🗓' }[msg.type] || '📢'}
                    </span>
                    <div>
                      <h3 className="font-amharic font-semibold text-gold-300 mb-1">{msg.title}</h3>
                      <p className="font-amharic text-gray-300 text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/messages" className="btn-outline-gold font-amharic">ሁሉንም ይመልከቱ →</Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gold-500/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="font-amharic text-gold-500/60 text-sm mb-1">ቃለ ሕይወት ባማ Choir መዘምራን</p>
            <p className="text-gray-600 text-xs">Kale Hiwot Bama Choir © {new Date().getFullYear()}</p>
          </div>
          <div className="w-full h-px bg-gold-500/10 mb-8"/>
          <div className="glass-card p-6 text-center">
            <p className="text-gray-600 text-xs uppercase tracking-widest mb-3">Developed by</p>
            <p className="font-bold text-gray-200 text-lg mb-1">Nebiyu Mathewos</p>
            <p className="text-gold-400/70 text-sm mb-4">Software Developer</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="tel:+251973991753"
                className="flex items-center gap-2 text-gray-400 hover:text-gold-300 transition-colors text-sm">
                <span>📞</span> +251 973 991 753
              </a>
              <a href="mailto:nebiyumathewos01@gmail.com"
                className="flex items-center gap-2 text-gray-400 hover:text-gold-300 transition-colors text-sm">
                <span>✉️</span> nebiyumathewos01@gmail.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
