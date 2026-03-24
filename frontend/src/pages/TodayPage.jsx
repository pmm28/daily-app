import { useState, useEffect, useCallback } from 'react'
import { Save, Plus, AlertTriangle, Info, LogIn } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useJournal } from '../context/JournalContext'
import { useToast } from '../hooks/useToast'
import { todayKey, keyToDate, isFutureDate, DAYS_L, MONTHS_L, TP_ORDER } from '../utils/constants'
import MoodSelector from '../components/today/MoodSelector'
import ActivityList from '../components/today/ActivityList'
import EditActivityModal from '../components/today/EditActivityModal'
import Toast from '../components/ui/Toast'
import ChipGroup from '../components/ui/ChipGroup'

const CAT_OPTIONS = [
  { value: 'study',    label: '📖 Study',    activeClass: 'bg-blue-50 border-blue-400 text-blue-700' },
  { value: 'exercise', label: '💪 Exercise', activeClass: 'bg-green-50 border-green-400 text-green-700' },
  { value: 'relax',    label: '🎮 Relax',    activeClass: 'bg-purple-50 border-purple-400 text-purple-700' },
]
const TP_OPTIONS = [
  { value: 'morning',   label: '🌅 Morning',    activeClass: 'bg-amber-50 border-amber-400 text-amber-700' },
  { value: 'noon',      label: '☀️ Noon',       activeClass: 'bg-orange-50 border-orange-400 text-orange-700' },
  { value: 'afternoon', label: '🌤 Afternoon',  activeClass: 'bg-sky-50 border-sky-400 text-sky-700' },
  { value: 'night',     label: '🌙 Night',      activeClass: 'bg-indigo-50 border-indigo-400 text-indigo-700' },
  { value: 'late',      label: '🌌 Late night', activeClass: 'bg-violet-50 border-violet-400 text-violet-700' },
]

function SectionCard({ title, accent = 'rose', right, children }) {
  const bars = { rose: 'bg-rose-mid', gold: 'bg-gold', sage: 'bg-sage-mid' }
  return (
    <div className="bg-white border border-border-soft rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-soft">
        <div className="flex items-center gap-2">
          <span className={`w-0.5 h-3.5 rounded-full ${bars[accent]}`} />
          <span className="text-[11px] font-bold uppercase tracking-widest text-ink-soft">{title}</span>
        </div>
        {right && <div>{right}</div>}
      </div>
      {children}
    </div>
  )
}

export default function TodayPage() {
  const { user, isGuest } = useAuth()
  const { fetchEntry, saveEntry, addActivity, updateActivity, deleteActivity, reorderActivities } = useJournal()
  const { toast, showToast } = useToast()
  const navigate = useNavigate()

  const [entryDate, setEntryDate] = useState(todayKey())
  const [diary, setDiary] = useState('')
  const [mood, setMood] = useState('')
  const [activities, setActivities] = useState([])
  const [loadingEntry, setLoadingEntry] = useState(false)

  // Add form state
  const [actTitle, setActTitle] = useState('')
  const [actCat, setActCat] = useState('study')
  const [actTp, setActTp] = useState('morning')

  // Edit modal
  const [editAct, setEditAct] = useState(null)
  const [editOpen, setEditOpen] = useState(false)

  const isFuture = isFutureDate(entryDate)

  // Load entry on date change
  useEffect(() => {
    setLoadingEntry(true)
    fetchEntry(entryDate).then(e => {
      if (e) {
        setDiary(e.diary || '')
        setMood(e.mood || '')
        setActivities(e.activities || [])
      } else {
        setDiary(''); setMood(''); setActivities([])
      }
      setLoadingEntry(false)
    })
  }, [entryDate])

  // Seed demo data for guest on first load
  useEffect(() => {
    if (!isGuest) return
    const guestData = localStorage.getItem('daily_guest_data')
    if (!guestData) {
      const today = new Date()
      const seeds = [
        { offset: 1, mood: 'happy', diary: 'Had a really productive day today. Finished my essay and went for a long walk in the evening. The sunset was beautiful 🌅', acts: [{ title: 'Finished essay draft', cat: 'study', tp: 'morning' }, { title: 'Evening walk', cat: 'exercise', tp: 'night' }] },
        { offset: 2, mood: 'neutral', diary: 'A quiet Wednesday. Nothing exciting happened but I felt at peace. Watched a documentary about nature.', acts: [{ title: 'Read lecture notes', cat: 'study', tp: 'afternoon' }, { title: 'Watched documentary', cat: 'relax', tp: 'night' }] },
        { offset: 3, mood: 'tired', diary: "Long day. Didn't sleep well the night before and it showed. Taking it easy tonight.", acts: [{ title: 'Library study session', cat: 'study', tp: 'morning' }, { title: 'Quick nap', cat: 'relax', tp: 'afternoon' }] },
      ]
      const pad = (n) => String(n).padStart(2, '0')
      const dateToKey = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
      const entries = {}
      seeds.forEach(s => {
        const d = new Date(today); d.setDate(d.getDate() - s.offset)
        const k = dateToKey(d)
        entries[k] = { date: k, diary: s.diary, mood: s.mood, activities: s.acts.map((a, i) => ({ id: `${Date.now()}${s.offset}${i}`, ...a })) }
      })
      localStorage.setItem('daily_guest_data', JSON.stringify({ entries }))
    }
  }, [isGuest])

  const handleSaveEntry = async () => {
    if (isFuture) { showToast("Can't save entries for future dates 🕰️"); return }
    try {
      await saveEntry(entryDate, diary, mood)
      showToast('Entry saved 💾')
    } catch (e) { showToast('Error saving entry') }
  }

  const handleMoodChange = async (m) => {
    if (isFuture) return
    setMood(m)
    try { await saveEntry(entryDate, diary, m) } catch {}
    showToast('Mood saved')
  }

  const handleAddActivity = async () => {
    if (isFuture) { showToast("Can't add activities for future dates 🕰️"); return }
    if (!actTitle.trim()) return
    try {
      const newAct = await addActivity(entryDate, { title: actTitle.trim(), cat: actCat, tp: actTp })
      // Insert in time-period order
      setActivities(prev => {
        const next = [...prev, newAct]
        return next.sort((a, b) => (TP_ORDER[a.tp] || 0) - (TP_ORDER[b.tp] || 0))
      })
      setActTitle('')
      showToast('Activity added ✓')
    } catch (e) { showToast('Error adding activity') }
  }

  const handleDeleteActivity = async (id) => {
    try {
      await deleteActivity(entryDate, id)
      setActivities(prev => prev.filter(a => a.id !== id))
      showToast('Activity removed')
    } catch { showToast('Error deleting activity') }
  }

  const handleEditSave = async (updated) => {
    try {
      await updateActivity(entryDate, updated.id, { title: updated.title, cat: updated.cat, tp: updated.tp })
      setActivities(prev => prev.map(a => a.id === updated.id ? { ...a, ...updated } : a))
      showToast('Activity updated ✓')
    } catch { showToast('Error updating activity') }
  }

  const handleMove = (id, dir) => {
    setActivities(prev => {
      const idx = prev.findIndex(a => a.id === id)
      if (idx < 0) return prev
      const ni = idx + dir
      if (ni < 0 || ni >= prev.length) return prev
      const next = [...prev]
      ;[next[idx], next[ni]] = [next[ni], next[idx]]
      reorderActivities(entryDate, next)
      return next
    })
  }

  const handleReorder = (newActs) => {
    setActivities(newActs)
    reorderActivities(entryDate, newActs)
  }

  // Header date display
  const d = keyToDate(entryDate)
  const isToday = entryDate === todayKey()
  const dateDisplay = isToday
    ? `${MONTHS_L[d.getMonth()]} ${d.getDate()}`
    : `${MONTHS_L[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
  const dayLabel = isToday ? `${DAYS_L[d.getDay()]} — Today` : DAYS_L[d.getDay()]

  return (
    <div className="p-9 pb-20 max-md:p-5 max-md:pb-16 relative z-[1]">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="font-serif text-4xl font-normal text-ink tracking-tight">
            {MONTHS_L[d.getMonth()]} <em className="italic text-rose-deep">{d.getDate()}</em>
            {!isToday && <span className="text-2xl">, {d.getFullYear()}</span>}
          </h1>
          <p className="text-sm text-ink-soft mt-1">{dayLabel}</p>
        </div>
        <div className="flex items-center gap-2 bg-white border-[1.5px] border-border rounded-xl px-4 py-2.5 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">Writing for</span>
          <input
            type="date"
            value={entryDate}
            max={todayKey()}
            onChange={e => e.target.value && setEntryDate(e.target.value)}
            className="text-sm text-ink bg-transparent cursor-pointer outline-none rounded px-1"
          />
        </div>
      </div>

      {/* Guest banner */}
      {isGuest && (
        <div className="flex items-center gap-4 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-2xl p-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
            <Info size={18} className="text-violet-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-violet-800">You're in guest mode</p>
            <p className="text-xs text-ink-soft">Entries saved locally. Create an account to back them up.</p>
          </div>
          <button onClick={() => navigate('/auth/signup')} className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-full text-xs font-bold hover:bg-violet-700 transition-colors shadow-md">
            <LogIn size={13} /> Save my journal
          </button>
        </div>
      )}

      {/* Future date warning */}
      {isFuture && (
        <div className="flex items-start gap-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-[1.5px] border-amber-200 rounded-2xl p-4 mb-6">
          <AlertTriangle size={22} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-700">You're viewing a future date</p>
            <p className="text-sm text-ink-mid mt-0.5">You can only write entries for today or past days.</p>
          </div>
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-2 gap-5 max-lg:grid-cols-1">

        {/* Left: Journal + Mood */}
        <div className="flex flex-col gap-5">

          {/* Journal */}
          <SectionCard
            title="My diary"
            right={<span className="text-xs text-ink-ghost">write freely, no rules ✦</span>}
          >
            <div className="bg-cream bg-line-texture">
              <textarea
                value={diary}
                onChange={e => setDiary(e.target.value)}
                disabled={isFuture || loadingEntry}
                placeholder="How was your day? What's on your mind? There's no right way to write here — just let it flow…"
                className="block w-full min-h-[260px] px-5 py-4 text-[15px] text-ink leading-[1.85] bg-transparent caret-rose-deep placeholder-ink-ghost outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-border-soft">
              <span className="text-[11.5px] text-ink-ghost">{diary.length ? `${diary.length.toLocaleString()} characters` : '0 characters'}</span>
              <button
                onClick={handleSaveEntry}
                disabled={isFuture}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-rose-mid to-rose-deep text-white text-xs font-bold tracking-wider shadow-md shadow-rose-deep/20 hover:-translate-y-px hover:shadow-rose-deep/30 transition-all disabled:opacity-50"
              >
                <Save size={13} /> Save entry
              </button>
            </div>
          </SectionCard>

          {/* Mood */}
          <SectionCard title="Today's mood" accent="gold">
            <MoodSelector value={mood} onChange={handleMoodChange} disabled={isFuture} />
          </SectionCard>
        </div>

        {/* Right: Activities */}
        <div>
          <SectionCard
            title="Activity timeline"
            accent="sage"
            right={activities.length ? <span className="text-xs text-ink-soft font-medium">{activities.length} activit{activities.length === 1 ? 'y' : 'ies'}</span> : null}
          >
            {/* Add form */}
            <div className="p-4 border-b border-border-soft space-y-3">
              <input
                value={actTitle}
                onChange={e => setActTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddActivity()}
                disabled={isFuture}
                placeholder="What did you do? (e.g. Morning run, Read chapter 4…)"
                maxLength={80}
                className="w-full px-4 py-3 border-[1.5px] border-border rounded-xl text-sm bg-parchment text-ink placeholder-ink-ghost focus:border-rose-mid focus:bg-white focus:shadow-[0_0_0_3px_rgba(232,160,144,0.12)] outline-none transition-all disabled:opacity-50"
              />
              <ChipGroup options={CAT_OPTIONS} value={actCat} onChange={setActCat} size="sm" />
              <ChipGroup options={TP_OPTIONS} value={actTp} onChange={setActTp} size="sm" />
              <button
                onClick={handleAddActivity}
                disabled={isFuture}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 bg-ink text-ivory rounded-xl text-[13px] font-bold tracking-wide hover:bg-ink/90 hover:shadow-md transition-all disabled:opacity-50"
              >
                <Plus size={15} /> Add to timeline
              </button>
            </div>

            {/* List */}
            <ActivityList
              activities={activities}
              onEdit={(a) => { setEditAct(a); setEditOpen(true) }}
              onDelete={handleDeleteActivity}
              onMove={handleMove}
              onReorder={handleReorder}
              disabled={isFuture}
            />
          </SectionCard>
        </div>
      </div>

      {/* Edit modal */}
      <EditActivityModal
        activity={editAct}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleEditSave}
      />

      <Toast msg={toast.msg} show={toast.show} />
    </div>
  )
}
