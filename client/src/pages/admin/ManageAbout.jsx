import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

export default function ManageAbout() {
  const [form, setForm]     = useState({
    churchName: '', tagline: '', description: '', vision: '',
    mission: '', founded: '', location: '', phone: '', email: '', members: []
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]   = useState('')
  const [newMember, setNewMember] = useState({ name: '', role: '' })

  useEffect(() => {
    api.get('/about').then(r => {
      const d = r.data
      setForm({
        churchName:  d.churchName  || '',
        tagline:     d.tagline     || '',
        description: d.description || '',
        vision:      d.vision      || '',
        mission:     d.mission     || '',
        founded:     d.founded     || '',
        location:    d.location    || '',
        phone:       d.phone       || '',
        email:       d.email       || '',
        members:     d.members     || [],
      })
    }).catch(() => {})
  }, [])

  const field = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const addMember = () => {
    if (!newMember.name.trim()) return
    setForm(f => ({ ...f, members: [...f.members, { ...newMember }] }))
    setNewMember({ name: '', role: '' })
  }

  const removeMember = (i) => {
    setForm(f => ({ ...f, members: f.members.filter((_, idx) => idx !== i) }))
  }

  const handleSave = async (e) => {
    e.preventDefault(); setError(''); setSaving(true); setSuccess(false)
    try {
      await api.put('/about', form)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed.')
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8">
          <Link to="/admin" className="text-gray-500 hover:text-gold-400 text-sm transition-colors">← Dashboard</Link>
          <h1 className="font-amharic font-bold text-3xl text-gray-100 mt-1">ስለ እኛ አስተዳድር</h1>
          <p className="text-gray-500 text-sm">Manage About Us page</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">

          {/* Basic Info */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-amharic font-semibold text-gold-400 text-lg mb-4">🏛 መሠረታዊ መረጃ</h2>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Church Name (Amharic)</label>
              <input type="text" value={form.churchName} onChange={e => field('churchName', e.target.value)}
                className="input-dark font-amharic" placeholder="ቃለ ሕይወት ባማ Choir መዘምራን" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Tagline (English)</label>
              <input type="text" value={form.tagline} onChange={e => field('tagline', e.target.value)}
                className="input-dark" placeholder="Kale Hiwot Bama Choir" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Founded / ተቋቁሞ</label>
                <input type="text" value={form.founded} onChange={e => field('founded', e.target.value)}
                  className="input-dark font-amharic" placeholder="e.g. 2010 ዓ.ም" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Location / አድራሻ</label>
                <input type="text" value={form.location} onChange={e => field('location', e.target.value)}
                  className="input-dark font-amharic" placeholder="ባማ፣ ሃዲያ ዞን" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Phone</label>
                <input type="text" value={form.phone} onChange={e => field('phone', e.target.value)}
                  className="input-dark" placeholder="+251..." />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => field('email', e.target.value)}
                  className="input-dark" placeholder="choir@example.com" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-amharic font-semibold text-gold-400 text-lg mb-4">📖 ታሪካችን</h2>
            <textarea value={form.description} onChange={e => field('description', e.target.value)}
              rows={6} className="input-dark font-amharic resize-y"
              placeholder="ስለ ቤተ ክርስቲያናችን ታሪክ ይፃፉ..." />
          </div>

          {/* Vision & Mission */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-amharic font-semibold text-gold-400 text-lg mb-4">🌟 ራዕይ እና ተልዕኮ</h2>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Vision / ራዕይ</label>
              <textarea value={form.vision} onChange={e => field('vision', e.target.value)}
                rows={3} className="input-dark font-amharic resize-y" placeholder="ራዕያችን..." />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Mission / ተልዕኮ</label>
              <textarea value={form.mission} onChange={e => field('mission', e.target.value)}
                rows={3} className="input-dark font-amharic resize-y" placeholder="ተልዕኮአችን..." />
            </div>
          </div>

          {/* Team Members */}
          <div className="glass-card p-6">
            <h2 className="font-amharic font-semibold text-gold-400 text-lg mb-4">👥 የቡድን አባላት</h2>

            {/* Existing members */}
            {form.members.length > 0 && (
              <div className="space-y-2 mb-4">
                {form.members.map((m, i) => (
                  <div key={i} className="flex items-center justify-between bg-dark-500 border border-dark-400 rounded-xl px-4 py-2.5">
                    <div>
                      <p className="font-amharic text-sm text-gray-200 font-medium">{m.name}</p>
                      <p className="font-amharic text-xs text-gold-400/70">{m.role}</p>
                    </div>
                    <button type="button" onClick={() => removeMember(i)}
                      className="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded-lg hover:bg-red-500/10 transition-colors">
                      🗑
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new member */}
            <div className="flex gap-2 flex-wrap">
              <input type="text" value={newMember.name} onChange={e => setNewMember(m => ({...m, name: e.target.value}))}
                className="input-dark font-amharic flex-1 min-w-32" placeholder="ስም" />
              <input type="text" value={newMember.role} onChange={e => setNewMember(m => ({...m, role: e.target.value}))}
                className="input-dark font-amharic flex-1 min-w-32" placeholder="ሚና (e.g. ዘማሪ)" />
              <button type="button" onClick={addMember}
                className="btn-gold px-4 whitespace-nowrap">➕ ጨምር</button>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl font-amharic">
              ✅ ተቀምጧል! Saved successfully.
            </div>
          )}

          <button type="submit" disabled={saving}
            className="btn-gold w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-60">
            {saving
              ? <div className="w-5 h-5 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin"/>
              : '💾 ለውጦችን አስቀምጥ / Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
