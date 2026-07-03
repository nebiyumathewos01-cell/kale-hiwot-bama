import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

const EMPTY = { title: '', content: '', type: 'Announcement', isActive: true }
const TYPES = ['Announcement', 'Prayer', 'Verse', 'Event']
const TYPE_ICON = { Announcement: '📢', Prayer: '🙏', Verse: '📖', Event: '🗓' }

export default function ManageMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(EMPTY)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')
  const [deleteId, setDeleteId] = useState(null)

  const fetchMessages = async () => {
    setLoading(true)
    try { const r = await api.get('/messages/all'); setMessages(r.data) } catch {}
    setLoading(false)
  }
  useEffect(() => { fetchMessages() }, [])

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setError(''); setModal(true) }
  const openEdit = (msg) => {
    setEditing(msg)
    setForm({ title: msg.title, content: msg.content, type: msg.type, isActive: msg.isActive })
    setError(''); setModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      if (editing) await api.put(`/messages/${editing._id}`, form)
      else         await api.post('/messages', form)
      setModal(false); fetchMessages()
    } catch (err) { setError(err.response?.data?.message || 'Save failed.') }
    setSaving(false)
  }

  const toggleActive = async (msg) => {
    try { await api.put(`/messages/${msg._id}`, { ...msg, isActive: !msg.isActive }); fetchMessages() } catch {}
  }

  const handleDelete = async (id) => {
    try { await api.delete(`/messages/${id}`); fetchMessages() } catch {}
    setDeleteId(null)
  }

  const field = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <Link to="/admin" className="text-gray-500 hover:text-gold-400 text-sm transition-colors">← Dashboard</Link>
            <h1 className="font-amharic font-bold text-3xl text-gray-100 mt-1">መልዕክቶችን አስተዳድር</h1>
            <p className="text-gray-500 text-sm">{messages.length} messages total</p>
          </div>
          <button onClick={openAdd} className="btn-gold flex items-center gap-2">
            ➕ <span className="font-amharic">አዲስ መልዕክት</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"/>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-24 glass-card">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-amharic text-gray-400">ምንም መልዕክት የለም</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(msg => (
              <div key={msg._id} className={`glass-card p-5 transition-all ${!msg.isActive ? 'opacity-50' : ''}`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">{TYPE_ICON[msg.type] || '📢'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-amharic font-semibold text-gray-200">{msg.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-dark-400 text-gray-500 border border-dark-300">{msg.type}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${msg.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-500/10 text-gray-500 border-gray-500/20'}`}>
                        {msg.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                    <p className="font-amharic text-sm text-gray-400 line-clamp-2">{msg.content}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                    <button onClick={() => toggleActive(msg)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-dark-400 text-gray-400 hover:text-gray-200 transition-colors border border-dark-300">
                      {msg.isActive ? '👁 Hide' : '👁 Show'}
                    </button>
                    <button onClick={() => openEdit(msg)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-dark-400 text-gray-300 hover:text-gold-300 transition-colors border border-dark-300">
                      ✏ Edit
                    </button>
                    <button onClick={() => setDeleteId(msg._id)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20">
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/80 backdrop-blur-sm overflow-y-auto py-8 px-4">
          <div className="glass-card w-full max-w-lg p-8 my-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-amharic font-bold text-xl text-gray-100">
                {editing ? 'መልዕክት አስተካክል' : 'አዲስ መልዕክት'}
              </h2>
              <button onClick={() => setModal(false)} className="text-gray-500 hover:text-gray-300 text-2xl leading-none">✕</button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">Title *</label>
                  <input type="text" value={form.title} onChange={e => field('title', e.target.value)}
                    className="input-dark font-amharic" placeholder="የመልዕክት ርዕስ" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Type</label>
                  <select value={form.type} onChange={e => field('type', e.target.value)} className="input-dark">
                    {TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex items-end pb-0.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={e => field('isActive', e.target.checked)}
                      className="w-4 h-4 accent-yellow-500" />
                    <span className="text-sm text-gray-400">Active / Visible</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Content *</label>
                <textarea value={form.content} onChange={e => field('content', e.target.value)}
                  rows={5} className="input-dark font-amharic resize-y" placeholder="የመልዕክት ይዘት..." required />
              </div>
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-gold flex-1 py-3 disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving ? <div className="w-5 h-5 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin"/> : (editing ? '💾 Update' : '➕ Add')}
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
            <h3 className="font-amharic font-bold text-lg text-gray-100 mb-2">መልዕክት ሰርዝ?</h3>
            <p className="text-gray-500 text-sm mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors">Delete</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl btn-outline-gold">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
