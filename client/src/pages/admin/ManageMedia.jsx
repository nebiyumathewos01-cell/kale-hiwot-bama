import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

const EMPTY_IMAGE = { type: 'image', caption: '', sortOrder: 0, isActive: true }
const EMPTY_VIDEO = { type: 'video', caption: '', sortOrder: 0, isActive: true, youtubeId: '' }

function extractYoutubeId(input) {
  if (!input) return ''
  const match = input.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  return match ? match[1] : input.trim()
}

// Read a File object → base64 data URI
function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = e => resolve(e.target.result)   // "data:image/jpeg;base64,..."
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// ─── UPLOAD DROPZONE component ─────────────────────────────────────────────
function FileDropZone({ accept, preview, onFile, onClear, hint }) {
  const inputRef = useRef()
  const [dragging, setDragging] = useState(false)

  const handleFiles = async (files) => {
    if (!files || !files[0]) return
    const file = files[0]
    const base64 = await readFileAsBase64(file)
    onFile({ base64, mimeType: file.type, fileName: file.name })
  }

  return (
    <div>
      {preview ? (
        /* ── Preview state ── */
        <div className="relative rounded-xl overflow-hidden border border-gold-500/30 bg-dark-500">
          {preview.startsWith('data:image') ? (
            <img src={preview} alt="preview"
              className="w-full max-h-56 object-cover"/>
          ) : (
            <video src={preview} controls className="w-full max-h-56"/>
          )}
          <button type="button" onClick={onClear}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-dark-900/80 text-red-400
                       hover:bg-red-500/20 flex items-center justify-center text-sm transition-colors">
            ✕
          </button>
          <div className="px-3 py-1.5 text-xs text-gray-500 border-t border-gold-500/10">
            {preview.fileName || 'File selected ✓'}
          </div>
        </div>
      ) : (
        /* ── Drop zone ── */
        <div
          onClick={() => inputRef.current.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => {
            e.preventDefault(); setDragging(false)
            handleFiles(e.dataTransfer.files)
          }}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                      transition-all duration-200 select-none
                      ${dragging
                        ? 'border-gold-400 bg-gold-500/10'
                        : 'border-gold-500/20 bg-dark-500/50 hover:border-gold-500/40 hover:bg-dark-500'}`}>
          <div className="text-4xl mb-3 opacity-60">{accept.includes('image') ? '📷' : '🎬'}</div>
          <p className="text-gray-300 text-sm mb-1 font-amharic">
            {accept.includes('image') ? 'ፎቶ ምረጥ ወይም እዚህ ጣል' : 'ቪዲዮ ምረጥ ወይም እዚህ ጣል'}
          </p>
          <p className="text-gray-600 text-xs">{hint}</p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg
                          bg-gold-500/10 border border-gold-500/20 text-gold-400 text-sm
                          hover:bg-gold-500/20 transition-colors">
            📁 <span className="font-amharic">ፋይል ምረጥ</span>
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />
    </div>
  )
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────
export default function ManageMedia() {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null)   // 'image' | 'video' | null
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState({})
  const [fileData, setFileData] = useState(null)   // { base64, mimeType, fileName }
  const [preview, setPreview]   = useState(null)   // base64 string for preview
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [tab, setTab]           = useState('image')

  const fetchItems = async () => {
    setLoading(true)
    try { const r = await api.get('/media/all'); setItems(r.data) } catch {}
    setLoading(false)
  }
  useEffect(() => { fetchItems() }, [])

  const openAdd = (type) => {
    setEditing(null)
    setForm(type === 'image' ? { ...EMPTY_IMAGE } : { ...EMPTY_VIDEO })
    setFileData(null); setPreview(null); setError('')
    setModal(type)
  }

  const openEdit = (item) => {
    setEditing(item)
    setForm({
      type:      item.type,
      caption:   item.caption   || '',
      sortOrder: item.sortOrder ?? 0,
      isActive:  item.isActive,
      youtubeId: item.youtubeId || '',
    })
    // Show existing file as preview
    setPreview(item.data || null)
    setFileData(null); setError('')
    setModal(item.type)
  }

  const handleSave = async (e) => {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      const payload = { ...form }

      if (modal === 'image') {
        if (!fileData && !editing?.data) { setError('Please select an image file.'); setSaving(false); return }
        if (fileData) {
          payload.data     = fileData.base64
          payload.mimeType = fileData.mimeType
          payload.fileName = fileData.fileName
        }
      }

      if (modal === 'video') {
        const isYoutube = !!payload.youtubeId.trim()
        const hasFile   = !!fileData

        if (!isYoutube && !hasFile && !editing?.data) {
          setError('Please select a video file or enter a YouTube link.'); setSaving(false); return
        }
        if (isYoutube) {
          payload.youtubeId = extractYoutubeId(payload.youtubeId)
          payload.data      = null
        }
        if (fileData) {
          payload.data     = fileData.base64
          payload.mimeType = fileData.mimeType
          payload.fileName = fileData.fileName
          payload.youtubeId = ''
        }
      }

      if (editing) await api.put(`/media/${editing._id}`, payload)
      else         await api.post('/media', payload)

      setModal(null); fetchItems()
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed.')
    }
    setSaving(false)
  }

  const toggleActive = async (item) => {
    try { await api.put(`/media/${item._id}`, { ...item, isActive: !item.isActive }); fetchItems() } catch {}
  }

  const handleDelete = async (id) => {
    try { await api.delete(`/media/${id}`); fetchItems() } catch {}
    setDeleteId(null)
  }

  const field = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const filtered = items.filter(i => i.type === tab)

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <Link to="/admin" className="text-gray-500 hover:text-gold-400 text-sm transition-colors">
              ← Dashboard
            </Link>
            <h1 className="font-amharic font-bold text-3xl text-gray-100 mt-1">ሚዲያ አስተዳድር</h1>
            <p className="text-gray-500 text-sm">Manage Photos & Videos</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => openAdd('image')} className="btn-gold flex items-center gap-2">
              📷 <span className="font-amharic">ፎቶ ጨምር</span>
            </button>
            <button onClick={() => openAdd('video')} className="btn-outline-gold flex items-center gap-2">
              🎬 <span className="font-amharic">ቪዲዮ ጨምር</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 glass-card p-1 w-fit">
          {['image', 'video'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all
                ${tab === t
                  ? 'bg-gold-500/20 text-gold-300 border border-gold-500/30'
                  : 'text-gray-500 hover:text-gray-300'}`}>
              {t === 'image' ? '📷 ፎቶዎች' : '🎬 ቪዲዮዎች'}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"/>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 glass-card border-2 border-dashed border-gold-500/15">
            <p className="text-5xl mb-3">{tab === 'image' ? '📷' : '🎬'}</p>
            <p className="font-amharic text-gray-400 mb-4">
              {tab === 'image' ? 'ምንም ፎቶ የለም' : 'ምንም ቪዲዮ የለም'}
            </p>
            <button onClick={() => openAdd(tab)} className="btn-gold">
              ➕ {tab === 'image' ? 'ፎቶ ጨምር' : 'ቪዲዮ ጨምር'}
            </button>
          </div>
        ) : tab === 'image' ? (
          /* Image grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(item => (
              <div key={item._id}
                className={`glass-card overflow-hidden group relative ${!item.isActive ? 'opacity-50' : ''}`}>
                <div className="aspect-square bg-dark-500">
                  {item.data
                    ? <img src={item.data} alt={item.caption || ''} className="w-full h-full object-cover"/>
                    : <div className="w-full h-full flex items-center justify-center text-4xl text-gray-700">📷</div>
                  }
                </div>
                {item.caption && (
                  <p className="font-amharic text-xs text-gray-400 px-2 py-1.5 truncate">{item.caption}</p>
                )}
                {/* Hover controls */}
                <div className="absolute inset-0 bg-dark-900/75 opacity-0 group-hover:opacity-100
                                transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => openEdit(item)}
                    className="px-3 py-1.5 rounded-lg bg-dark-600 hover:bg-gold-500/20 text-gray-200 text-xs transition-colors">
                    ✏ Edit
                  </button>
                  <button onClick={() => toggleActive(item)}
                    className="px-3 py-1.5 rounded-lg bg-dark-600 hover:bg-gold-500/20 text-gray-200 text-xs transition-colors">
                    {item.isActive ? '🚫 Hide' : '👁 Show'}
                  </button>
                  <button onClick={() => setDeleteId(item._id)}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400 text-xs transition-colors">
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Video grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map(item => (
              <div key={item._id} className={`glass-card overflow-hidden ${!item.isActive ? 'opacity-50' : ''}`}>
                <div className="aspect-video bg-dark-500">
                  {item.youtubeId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${item.youtubeId}`}
                      className="w-full h-full" allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  ) : item.data ? (
                    <video src={item.data} controls className="w-full h-full object-cover"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-700">🎬</div>
                  )}
                </div>
                <div className="p-3 flex items-center justify-between gap-2">
                  <p className="font-amharic text-sm text-gray-300 truncate flex-1">
                    {item.caption || item.fileName || (item.youtubeId ? `YouTube: ${item.youtubeId}` : '—')}
                  </p>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => openEdit(item)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-dark-400 text-gray-300 hover:text-gold-300 transition-colors border border-dark-300">
                      ✏
                    </button>
                    <button onClick={() => toggleActive(item)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-dark-400 text-gray-300 transition-colors border border-dark-300">
                      {item.isActive ? '🚫' : '👁'}
                    </button>
                    <button onClick={() => setDeleteId(item._id)}
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

      {/* ── ADD / EDIT MODAL ── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center
                        bg-dark-900/85 backdrop-blur-sm overflow-y-auto py-8 px-4">
          <div className="glass-card w-full max-w-md p-8 my-auto">

            <div className="flex items-center justify-between mb-6">
              <h2 className="font-amharic font-bold text-xl text-gray-100">
                {editing
                  ? (modal === 'image' ? '📷 ፎቶ አስተካክል' : '🎬 ቪዲዮ አስተካክል')
                  : (modal === 'image' ? '📷 አዲስ ፎቶ ጨምር' : '🎬 አዲስ ቪዲዮ ጨምር')}
              </h2>
              <button onClick={() => setModal(null)}
                className="text-gray-500 hover:text-gray-300 text-2xl leading-none">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">

              {/* ── IMAGE upload ── */}
              {modal === 'image' && (
                <div>
                  <label className="block text-xs text-gray-500 mb-2 font-medium">
                    ፎቶ ምረጥ <span className="text-red-400">*</span>
                  </label>
                  <FileDropZone
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    hint="JPG, PNG, WebP — ከፍተኛ 10MB"
                    preview={preview}
                    onFile={fd => { setFileData(fd); setPreview(fd.base64) }}
                    onClear={() => { setFileData(null); setPreview(null) }}
                  />
                </div>
              )}

              {/* ── VIDEO upload or YouTube ── */}
              {modal === 'video' && (
                <div className="space-y-4">
                  {/* Option A: Upload file */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-2 font-medium">
                      ቪዲዮ ፋይል ምረጥ
                    </label>
                    <FileDropZone
                      accept="video/mp4,video/webm,video/ogg,video/quicktime"
                      hint="MP4, WebM, MOV — ከፍተኛ 50MB"
                      preview={preview && !form.youtubeId ? preview : null}
                      onFile={fd => {
                        setFileData(fd); setPreview(fd.base64)
                        field('youtubeId', '') // clear YouTube if file chosen
                      }}
                      onClear={() => { setFileData(null); setPreview(null) }}
                    />
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-dark-400"/>
                    <span className="text-xs text-gray-600">ወይም / OR</span>
                    <div className="flex-1 h-px bg-dark-400"/>
                  </div>

                  {/* Option B: YouTube link */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-2 font-medium">
                      YouTube ሊንክ
                    </label>
                    <input
                      type="text"
                      value={form.youtubeId}
                      onChange={e => {
                        field('youtubeId', e.target.value)
                        if (e.target.value.trim()) {
                          setFileData(null); setPreview(null) // clear file if YouTube entered
                        }
                      }}
                      className="input-dark"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Full YouTube URL or just the video ID
                    </p>
                  </div>
                </div>
              )}

              {/* Caption */}
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">
                  Caption <span className="text-gray-600 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.caption}
                  onChange={e => field('caption', e.target.value)}
                  className="input-dark font-amharic"
                  placeholder="የምስሉ / ቪዲዮው መግለጫ"
                />
              </div>

              {/* Sort + Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 font-medium">Sort Order</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={e => field('sortOrder', Number(e.target.value))}
                    className="input-dark"
                    placeholder="0"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={e => field('isActive', e.target.checked)}
                      className="w-4 h-4 accent-yellow-500"
                    />
                    <span className="text-sm text-gray-400">Active / Visible</span>
                  </label>
                </div>
              </div>

              {/* Upload progress hint */}
              {saving && (
                <div className="glass-card px-4 py-3 flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-gold-500 border-t-transparent rounded-full animate-spin flex-shrink-0"/>
                  <p className="font-amharic text-sm text-gray-400">
                    {modal === 'video' ? 'ቪዲዮ እየተጫነ ነው... ትንሽ ጊዜ ይወስዳል' : 'ፎቶ እየተጫነ ነው...'}
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="btn-gold flex-1 py-3 disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving
                    ? <div className="w-5 h-5 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin"/>
                    : (editing ? '💾 Update' : '⬆ Upload')}
                </button>
                <button type="button" onClick={() => setModal(null)} className="btn-outline-gold px-6">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/80 backdrop-blur-sm px-4">
          <div className="glass-card p-8 max-w-sm w-full text-center">
            <p className="text-4xl mb-4">⚠️</p>
            <h3 className="font-amharic font-bold text-lg text-gray-100 mb-2">ሚዲያ ሰርዝ?</h3>
            <p className="text-gray-500 text-sm mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors">
                Delete
              </button>
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl btn-outline-gold">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
