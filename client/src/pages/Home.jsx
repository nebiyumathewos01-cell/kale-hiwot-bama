import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

/* ── Scroll-reveal hook ── */
function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

/* ── Floating musical notes ── */
const NOTES = ['♩','♪','♫','♬','𝅘𝅥𝅮','🎵','🎶']
function FloatingNotes() {
  const [notes, setNotes] = useState([])
  useEffect(() => {
    const spawn = () => {
      setNotes(prev => {
        if (prev.length > 14) return prev
        return [...prev, {
          id:       Date.now(),
          note:     NOTES[Math.floor(Math.random() * NOTES.length)],
          left:     Math.random() * 95,
          size:     14 + Math.random() * 18,
          duration: 7 + Math.random() * 9,
          delay:    0,
        }]
      })
      setTimeout(() => setNotes(p => p.slice(1)), 15000)
    }
    const t = setInterval(spawn, 1400)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {notes.map(n => (
        <span key={n.id} className="note-float text-gold-500/40 absolute"
          style={{
            left:            `${n.left}%`,
            bottom:          '-40px',
            fontSize:        `${n.size}px`,
            animationDuration: `${n.duration}s`,
            animationDelay:  `${n.delay}s`,
          }}>
          {n.note}
        </span>
      ))}
    </div>
  )
}

const categoryColor = (cat) => ({
  Worship: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Praise:  'bg-gold-500/20   text-gold-300   border-gold-500/30',
  Hymn:    'bg-blue-500/20   text-blue-300   border-blue-500/30',
  Special: 'bg-rose-500/20   text-rose-300   border-rose-500/30',
}[cat] || 'bg-gray-500/20 text-gray-300 border-gray-500/20')

export default function Home() {
  const [songs,    setSongs]    = useState([])
  const [messages, setMessages] = useState([])
  const [heroVisible, setHeroVisible] = useState(false)

  const songsRef    = useReveal()
  const messagesRef = useReveal()
  const statsRef    = useReveal()

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 200)
    api.get('/songs').then(r => setSongs(r.data.slice(0, 3))).catch(() => {})
    api.get('/messages').then(r => setMessages(r.data.slice(0, 2))).catch(() => {})
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden pt-16">

        {/* Deep background gradient */}
        <div className="absolute inset-0"
          style={{background: 'radial-gradient(ellipse 120% 80% at 50% 40%, rgba(30,20,5,0.95) 0%, #0a0a0f 70%)' }}/>

        {/* Orbs */}
        <div className="hero-orb w-[500px] h-[500px] top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/3"
          style={{background:'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)'}}/>
        <div className="hero-orb w-80 h-80 top-1/3 left-1/4 animate-pulse"
          style={{background:'rgba(212,175,55,0.04)', animationDuration:'4s'}}/>
        <div className="hero-orb w-64 h-64 bottom-1/4 right-1/4 animate-pulse"
          style={{background:'rgba(139,92,246,0.04)', animationDuration:'5s', animationDelay:'1.5s'}}/>

        {/* Rings */}
        <div className="absolute top-1/2 left-1/2 w-[640px] h-[640px] -translate-x-1/2 -translate-y-1/2
                        border border-gold-500/[0.04] rounded-full animate-rotate-slow"/>
        <div className="absolute top-1/2 left-1/2 w-[430px] h-[430px] -translate-x-1/2 -translate-y-1/2
                        border border-gold-500/[0.06] rounded-full"
          style={{animation:'rotateSlow 18s linear infinite reverse'}}/>
        <div className="absolute top-1/2 left-1/2 w-[250px] h-[250px] -translate-x-1/2 -translate-y-1/2
                        border border-gold-500/[0.08] rounded-full animate-rotate-slow"
          style={{animationDuration:'12s'}}/>

        {/* Floating notes */}
        <FloatingNotes />

        {/* Hero content */}
        <div className={`relative z-10 text-center max-w-3xl mx-auto
                         transition-all duration-1000 ease-out
                         ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

          {/* Icon badge */}
          <div className="relative inline-block mb-8">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gold-500/20 to-gold-600/5
                            border border-gold-500/25 flex items-center justify-center text-5xl
                            mx-auto animate-float animate-glow-pulse shadow-[0_0_50px_rgba(212,175,55,0.2)]">
              🎵
            </div>
            {/* Ripple rings */}
            <div className="absolute inset-0 rounded-3xl border border-gold-500/20"
              style={{animation:'ripple 2.5s ease-out infinite'}}/>
            <div className="absolute inset-0 rounded-3xl border border-gold-500/10"
              style={{animation:'ripple 2.5s ease-out infinite', animationDelay:'0.8s'}}/>
          </div>

          <p className="text-gold-500/60 text-xs tracking-[0.45em] uppercase mb-4 font-light animate-fade-down delay-200">
            Kale Hiwot Church · Bama
          </p>

          <h1 className="font-amharic font-extrabold text-6xl md:text-8xl mb-2 leading-none animate-fade-up delay-300">
            <span className="gold-text">ቃለ ሕይወት</span>
          </h1>
          <h2 className="font-amharic text-2xl md:text-4xl text-gray-300 font-bold mb-2 animate-fade-up delay-400">
            ባማ Choir መዘምራን
          </h2>
          <p className="text-gray-600 text-base mb-3 tracking-widest uppercase animate-fade-up delay-500">
            Bama Choir
          </p>

          {/* Animated divider */}
          <div className="flex items-center justify-center gap-3 mb-10 animate-fade-up delay-500">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-500/50"/>
            <span className="text-gold-500/40 text-xs">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-500/50"/>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-600">
            <Link to="/songs"
              className="btn-gold flex items-center justify-center gap-2 text-base px-10 py-4 rounded-2xl font-amharic">
              🎶 <span>መዝሙሮችን ይመልከቱ</span>
            </Link>
            <Link to="/messages"
              className="btn-outline-gold flex items-center justify-center gap-2 text-base px-10 py-4 rounded-2xl font-amharic">
              📢 <span>መልዕክቶች</span>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce
                         transition-opacity duration-1000 ${heroVisible ? 'opacity-30' : 'opacity-0'}`}>
          <div className="w-6 h-10 border-2 border-gold-500/40 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2.5 bg-gold-500/60 rounded-full animate-fade-down"
              style={{animation:'fadeInDown 1.5s ease infinite'}}/>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════ */}
      {songs.length > 0 && (
        <div ref={statsRef} className="reveal py-6 px-4 border-y border-gold-500/10"
          style={{background:'linear-gradient(90deg, rgba(212,175,55,0.03), rgba(212,175,55,0.06), rgba(212,175,55,0.03))'}}>
          <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 md:gap-12">
            {[
              { icon:'🎵', label:'Songs',    value:'100+' },
              { icon:'🙏', label:'Worship',  value:'Daily' },
              { icon:'📢', label:'Messages', value:'Weekly' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <span className="text-2xl group-hover:scale-110 transition-transform">{s.icon}</span>
                <div>
                  <p className="font-bold text-gold-400 text-xl leading-none">{s.value}</p>
                  <p className="text-gray-600 text-xs tracking-wide uppercase mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          FEATURED SONGS
      ══════════════════════════════════════ */}
      {songs.length > 0 && (
        <section className="py-24 px-4" style={{background:'linear-gradient(180deg, #0a0a0f 0%, #0f0f18 100%)'}}>
          <div className="max-w-6xl mx-auto">

            <div ref={songsRef} className="reveal text-center mb-14">
              <p className="text-gold-500/50 text-xs tracking-[0.3em] uppercase mb-3">Featured</p>
              <h2 className="font-amharic text-4xl md:text-5xl font-extrabold text-gray-100 mb-3">
                የቅርብ ጊዜ <span className="gold-text">መዝሙሮች</span>
              </h2>
              <p className="text-gray-500">Recent Songs</p>
              <div className="section-divider"/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {songs.map((song, i) => (
                <Link key={song._id} to={`/songs/${song._id}`}
                  className="reveal glass-card card-shine p-6 group flex flex-col
                             hover:border-gold-500/40 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(212,175,55,0.12)]
                             transition-all duration-500"
                  style={{ transitionDelay: `${i * 120}ms` }}>

                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-500/20 to-gold-500/5
                                    border border-gold-500/20 flex items-center justify-center text-2xl
                                    group-hover:scale-110 group-hover:from-gold-500/30 transition-all duration-300">
                      🎶
                    </div>
                    {song.songNumber != null && (
                      <span className="stat-pill font-mono">#{song.songNumber}</span>
                    )}
                  </div>

                  <h3 className="font-amharic font-bold text-lg text-gray-100
                                 group-hover:text-gold-300 transition-colors mb-1 flex-1">
                    {song.title}
                  </h3>
                  {song.singer && (
                    <p className="font-amharic text-sm text-gray-500 mb-4 flex items-center gap-1.5">
                      <span>🎤</span> {song.singer}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-auto">
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${categoryColor(song.category)}`}>
                      {song.category}
                    </span>
                    <span className="text-gold-500/0 group-hover:text-gold-500/60 text-sm transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/songs" className="btn-outline-gold font-amharic inline-flex items-center gap-2 px-8 py-3">
                ሁሉንም ይመልከቱ <span className="text-gold-500/60">→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          MESSAGES
      ══════════════════════════════════════ */}
      {messages.length > 0 && (
        <section className="py-24 px-4"
          style={{background:'linear-gradient(180deg, #0f0f18 0%, rgba(212,175,55,0.02) 50%, #0a0a0f 100%)'}}>
          <div className="max-w-4xl mx-auto">

            <div ref={messagesRef} className="reveal text-center mb-14">
              <p className="text-gold-500/50 text-xs tracking-[0.3em] uppercase mb-3">Announcements</p>
              <h2 className="font-amharic text-4xl md:text-5xl font-extrabold text-gray-100 mb-3">
                <span className="gold-text">መልዕክቶች</span>
              </h2>
              <p className="text-gray-500">Messages & Announcements</p>
              <div className="section-divider"/>
            </div>

            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div key={msg._id}
                  className="reveal glass-card p-6 hover:border-gold-500/30 hover:-translate-y-0.5
                             transition-all duration-300 group"
                  style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-dark-500 border border-gold-500/10
                                    flex items-center justify-center text-2xl flex-shrink-0
                                    group-hover:border-gold-500/25 group-hover:bg-dark-400 transition-all">
                      {{ Announcement:'📢', Prayer:'🙏', Verse:'📖', Event:'🗓' }[msg.type] || '📢'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-amharic font-bold text-gold-300 mb-1.5 text-lg group-hover:text-gold-200 transition-colors">
                        {msg.title}
                      </h3>
                      <p className="font-amharic text-gray-400 text-sm leading-relaxed line-clamp-2">
                        {msg.content}
                      </p>
                    </div>
                    <span className="text-gold-500/0 group-hover:text-gold-500/50 transition-all text-sm flex-shrink-0 mt-1">
                      →
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link to="/messages" className="btn-outline-gold font-amharic inline-flex items-center gap-2 px-8 py-3">
                ሁሉንም ይመልከቱ <span className="text-gold-500/60">→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="py-16 px-4 border-t border-gold-500/10"
        style={{background:'linear-gradient(180deg, #0a0a0f 0%, #06060a 100%)'}}>
        <div className="max-w-4xl mx-auto">

          {/* Top */}
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/20
                            flex items-center justify-center text-3xl mx-auto mb-4 animate-float">
              🎵
            </div>
            <p className="font-amharic text-gold-400/70 text-base font-semibold mb-1">
              ቃለ ሕይወት ባማ Choir መዘምራን
            </p>
            <p className="text-gray-600 text-xs tracking-widest uppercase">
              Kale Hiwot Bama Choir
            </p>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px"
                style={{background:'linear-gradient(90deg, transparent, rgba(212,175,55,0.3) 40%, rgba(212,175,55,0.3) 60%, transparent)'}}/>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-dark-900 px-4 text-gold-500/30 text-xs">✦</span>
            </div>
          </div>

          {/* Developer card */}
          <div className="glass-card p-8 text-center"
            style={{background:'linear-gradient(135deg, rgba(212,175,55,0.04), rgba(212,175,55,0.01))'}}>
            <p className="text-gray-600 text-[10px] uppercase tracking-[0.3em] mb-3">Developed by</p>
            <p className="font-bold text-gray-100 text-xl mb-0.5">Nebiyu Mathewos</p>
            <p className="text-gold-400/60 text-sm mb-6">Software Developer</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="tel:+251973991753"
                className="flex items-center gap-2 text-gray-500 hover:text-gold-300
                           transition-colors text-sm px-4 py-2 rounded-xl hover:bg-gold-500/5 border border-transparent hover:border-gold-500/15">
                📞 +251 973 991 753
              </a>
              <a href="mailto:nebiyumathewos01@gmail.com"
                className="flex items-center gap-2 text-gray-500 hover:text-gold-300
                           transition-colors text-sm px-4 py-2 rounded-xl hover:bg-gold-500/5 border border-transparent hover:border-gold-500/15">
                ✉️ nebiyumathewos01@gmail.com
              </a>
            </div>
          </div>

          <p className="text-center text-gray-700 text-xs mt-6">
            © {new Date().getFullYear()} Kale Hiwot Bama Choir
          </p>
        </div>
      </footer>
    </div>
  )
}
