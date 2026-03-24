import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import ChipGroup from '../ui/ChipGroup'

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

export default function EditActivityModal({ activity, open, onClose, onSave }) {
  const [title, setTitle] = useState('')
  const [cat, setCat] = useState('study')
  const [tp, setTp] = useState('morning')

  useEffect(() => {
    if (activity) { setTitle(activity.title); setCat(activity.cat); setTp(activity.tp) }
  }, [activity])

  const handleSave = () => {
    if (!title.trim()) return
    onSave({ ...activity, title: title.trim(), cat, tp })
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit activity"
      footer={
        <>
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-parchment border-[1.5px] border-border text-ink-mid font-semibold text-sm hover:bg-parchment-2 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-mid to-rose-deep text-white font-semibold text-sm shadow-md shadow-rose-deep/20 hover:-translate-y-px transition-all">Save changes</button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-soft mb-2">Activity name</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={80}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            className="w-full px-4 py-3 border-[1.5px] border-border rounded-xl text-sm bg-parchment text-ink focus:border-rose-mid focus:bg-white focus:shadow-[0_0_0_3px_rgba(232,160,144,0.12)] outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-soft mb-2">Category</label>
          <ChipGroup options={CAT_OPTIONS} value={cat} onChange={setCat} size="sm" />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-soft mb-2">Time period</label>
          <ChipGroup options={TP_OPTIONS} value={tp} onChange={setTp} size="sm" />
        </div>
      </div>
    </Modal>
  )
}
