import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

const EMPTY = { title:'', titleAmharic:'', singer:'', lyrics:'', lyricsEnglish:'', category:'Praise', language:'Amharic', songNumber:'' }

export default function ManageSongs() {
  const [songs, setSongs]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [editing, setEditing]   = useState(null) // song object or null
  const [form, setForm]         = useState(EMPTY)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  const fetchSongs = async () => {
    setLoading(true)
    try { const r = await api.get('/songs'); setSongs(r.data) } catch {}
    setLoading(false)
  }
  useEffect(() => { fetchSongs() }, [])

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setError(''); setModal(true) }
  const openEdit = (song) => {
    setEditing(song)
    setForm({ title: song.title||'', titleAmharic: song.titleAmharic||'', singer: song.singer||'',
               lyrics: song.lyrics||'', lyricsEnglish: song.lyricsEnglish||'',
               category: song.category||'Praise', language: song.language||'Amharic',
               songNumber: song.songNumber||'' })
    setError(''); setModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      const payload = { ...form, songNumber: form.songNumber ? Number(form.songNumber) : undefined }
      if (editing) await api.put(`/songs/${editing._id}`, payload)
      else         await api.post('/songs', payload)
      setModal(false); fetchSongs()
    } catch (err) { setError(err.response?.data?.message || 'Save failed.') }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    setDeleteError('')
    try {
      await api.delete(`/songs/${id}`)
      setDeleteId(null)
      fetchSongs()
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Delete failed. Please try again.')
    }
  }

  const field = (key, val) => setForm(f => ({ ...f, [key]: val }))

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <Link to="/admin" className="text-gray-500 hover:text-gold-400 text-sm transition-colors">← Dashboard</Link>
            <h1 className="font-amharic font-bold text-3xl text-gray-100 mt-1">መዝሙሮችን አስተዳድር</h1>
            <p className="text-gray-500 text-sm">{songs.length} songs total</p>
          </div>
          <button onClick={openAdd} className="btn-gold flex items-center gap-2">
            ➕ <span className="font-amharic">አዲስ መዝሙር</span>
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"/>
          </div>
        ) : songs.length === 0 ? (
          <div className="text-center py-24 glass-card">
            <p className="text-4xl mb-3">🎵</p>
            <p className="font-amharic text-gray-400">ምንም መዝሙር የለም። አዲስ መዝሙር ይጨምሩ።</p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gold-500/10 bg-dark-500/50">
                  <tr>
                    {['#','Title','Singer','Category','Language','Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-400">
                  {songs.map(song => (
                    <tr key={song._id} className="hover:bg-dark-500/50 transition-colors">
                      <td className="px-4 py-3 text-xs text-gold-500/50 font-mono">{song.songNumber || '—'}</td>
                      <td className="px-4 py-3">
                        <p className="font-amharic font-medium text-gray-200">{song.title}</p>
                        {song.titleAmharic && song.titleAmharic !== song.title && (
                          <p className="font-amharic text-xs text-gray-500">{song.titleAmharic}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 font-amharic text-sm text-gray-400">{song.singer || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20">
                          {song.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{song.language}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(song)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-dark-400 text-gray-300 hover:bg-dark-300 hover:text-gold-300 transition-colors border border-dark-300">
                            ✏ Edit
                          </button>
                          <button onClick={() => setDeleteId(song._id)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20">
                            🗑 Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-dark-900/80 backdrop-blur-sm overflow-y-auto py-8 px-4">
          <div className="glass-card w-full max-w-2xl p-8 my-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-amharic font-bold text-xl text-gray-100">
                {editing ? 'መዝሙር አስተካክል' : 'አዲስ መዝሙር ጨምር'}
              </h2>
              <button onClick={() => setModal(false)} className="text-gray-500 hover:text-gray-300 text-2xl leading-none">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Song Number</label>
                  <input type="number" value={form.songNumber} onChange={e => field('songNumber', e.target.value)}
                    className="input-dark" placeholder="1" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Category</label>
                  <select value={form.category} onChange={e => field('category', e.target.value)} className="input-dark">
                    {['Praise','Worship','Hymn','Special'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Title (Amharic) *</label>
                <input type="text" value={form.title} onChange={e => field('title', e.target.value)}
                  className="input-dark font-amharic" placeholder="የመዝሙር ስም" required />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Title (English)</label>
                <input type="text" value={form.titleAmharic} onChange={e => field('titleAmharic', e.target.value)}
                  className="input-dark" placeholder="Song name in English" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Singer / Vocalist</label>
                  <input type="text" value={form.singer} onChange={e => field('singer', e.target.value)}
                    className="input-dark font-amharic" placeholder="ዘማሪ ስም" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Language</label>
                  <select value={form.language} onChange={e => field('language', e.target.value)} className="input-dark">
                    {['Amharic','English','Both'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Lyrics (Amharic) *</label>
                <textarea value={form.lyrics} onChange={e => field('lyrics', e.target.value)}
                  rows={10} className="input-dark font-amharic resize-y" placeholder="የመዝሙር ቃላቶች..." required />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Lyrics (English) — optional</label>
                <textarea value={form.lyricsEnglish} onChange={e => field('lyricsEnglish', e.target.value)}
                  rows={5} className="input-dark resize-y" placeholder="English lyrics..." />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-gold flex-1 py-3 disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving ? <div className="w-5 h-5 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin"/> : (editing ? '💾 Update' : '➕ Add Song')}
                </button>
                <button type="button" onClick={() => setModal(false)} className="btn-outline-gold px-6">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/80 backdrop-blur-sm px-4">
          <div className="glass-card p-8 max-w-sm w-full text-center">
            <p className="text-4xl mb-4">⚠️</p>
            <h3 className="font-amharic font-bold text-lg text-gray-100 mb-2">መዝሙር ሰርዝ?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
            {deleteError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
                {deleteError}
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors">
                Delete
              </button>
              <button onClick={() => { setDeleteId(null); setDeleteError('') }}
                className="flex-1 py-2.5 rounded-xl btn-outline-gold">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
