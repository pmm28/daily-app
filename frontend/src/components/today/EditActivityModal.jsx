import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import ChipGroup from '../ui/ChipGroup'
import { BookOpen, Dumbbell, Smile, Sunrise, Sun, SunDim, Moon, Stars } from 'lucide-react'

const CAT_OPTIONS = [
  { value: 'study',    label: 'Study',     icon: BookOpen },
  { value: 'exercise', label: 'Exercise',  icon: Dumbbell },
  { value: 'relax',    label: 'Relax',     icon: Smile },
]
const TP_OPTIONS = [
  { value: 'morning',   label: 'Morning',    icon: Sunrise },
  { value: 'noon',      label: 'Noon',       icon: Sun },
  { value: 'afternoon', label: 'Afternoon',  icon: SunDim },
  { value: 'night',     label: 'Night',      icon: Moon },
  { value: 'late',      label: 'Late night', icon: Stars },
]

export default function EditActivityModal({ activity, open, onClose, onSave }) {
  const [title, setTitle] = useState('')
  const [cat, setCat] = useState('study')
  const [tp, setTp] = useState('')

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
          <div className="grid grid-cols-3 gap-1.5">
            {CAT_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setCat(value)}
                className={`flex flex-col items-center gap-1 py-2 rounded-lg border text-[11px] font-medium transition-all ${
                  cat === value
                    ? value === 'study'    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : value === 'exercise' ? 'bg-green-50 border-green-300 text-green-700'
                    :                        'bg-purple-50 border-purple-300 text-purple-700'
                    : 'bg-white border-border text-ink-soft hover:text-ink'
                }`}
              >
                <Icon size={15} strokeWidth={1.5} />
                {label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-soft mb-2">
            Time of day <span className="font-normal normal-case tracking-normal text-ink-ghost">— optional</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {TP_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTp(tp === value ? '' : value)}
                className={`flex flex-col items-center gap-1 py-2 rounded-lg border text-[11px] font-medium transition-all ${
                  tp === value
                    ? 'bg-amber-50 border-amber-300 text-amber-700'
                    : 'bg-white border-border text-ink-soft hover:text-ink'
                }`}
              >
                <Icon size={15} strokeWidth={1.5} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
