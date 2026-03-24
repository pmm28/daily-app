import { useState, useRef } from 'react'
import { GripVertical, Pencil, Trash2, ChevronUp, ChevronDown, BookOpen, Dumbbell, Gamepad2, Sunrise, Sun, Cloud, Moon, Stars } from 'lucide-react'
import { CAT_LBL, TP_LBL } from '../../utils/constants'

const CAT_ICONS = { study: BookOpen, exercise: Dumbbell, relax: Gamepad2 }
const CAT_COLORS = {
  study:    'bg-blue-50 border-blue-100 text-blue-600',
  exercise: 'bg-green-50 border-green-100 text-green-600',
  relax:    'bg-purple-50 border-purple-100 text-purple-600',
}
const CAT_TAG = {
  study:    'bg-blue-50 text-blue-700',
  exercise: 'bg-green-50 text-green-700',
  relax:    'bg-purple-50 text-purple-700',
}
const TP_ICONS = { morning: Sunrise, noon: Sun, afternoon: Cloud, night: Moon, late: Stars }

export default function ActivityList({ activities, onEdit, onDelete, onMove, onReorder, disabled }) {
  const dragId = useRef(null)
  const [dragOver, setDragOver] = useState(null)

  const handleDragStart = (id) => { dragId.current = id }
  const handleDragOver = (e, id) => { e.preventDefault(); setDragOver(id) }
  const handleDrop = (e, targetId) => {
    e.preventDefault(); setDragOver(null)
    if (!dragId.current || dragId.current === targetId) return
    const from = activities.findIndex(a => a.id === dragId.current)
    const to = activities.findIndex(a => a.id === targetId)
    if (from < 0 || to < 0) return
    const reordered = [...activities]
    const [item] = reordered.splice(from, 1)
    reordered.splice(to, 0, item)
    onReorder(reordered)
    dragId.current = null
  }
  const handleDragEnd = () => { setDragOver(null); dragId.current = null }

  if (!activities.length) {
    return (
      <div className="text-center py-10 px-5">
        <div className="w-12 h-12 rounded-2xl bg-sage/20 flex items-center justify-center mx-auto mb-3">
          <BookOpen size={22} className="text-sage-mid" />
        </div>
        <p className="text-sm text-ink-ghost leading-relaxed">No activities yet.<br />Add your first one above.</p>
      </div>
    )
  }

  return (
    <div className="py-1">
      {activities.map((a, i) => {
        const CatIcon = CAT_ICONS[a.cat] || BookOpen
        const TpIcon = TP_ICONS[a.tp] || Sun
        const isDragOver = dragOver === a.id

        return (
          <div
            key={a.id}
            draggable={!disabled}
            onDragStart={() => handleDragStart(a.id)}
            onDragOver={(e) => handleDragOver(e, a.id)}
            onDrop={(e) => handleDrop(e, a.id)}
            onDragEnd={handleDragEnd}
            className={`flex items-center gap-2.5 px-4 py-3 border-b border-border-soft last:border-b-0 transition-all animate-slide ${
              isDragOver ? 'bg-rose/10' : 'hover:bg-parchment'
            } ${disabled ? 'opacity-60' : ''}`}
          >
            {/* Drag handle */}
            {!disabled && (
              <GripVertical size={15} className="text-ink-ghost cursor-grab active:cursor-grabbing flex-shrink-0" />
            )}

            {/* Category icon */}
            <div className={`w-9 h-9 min-w-[36px] rounded-xl flex items-center justify-center border ${CAT_COLORS[a.cat]}`}>
              <CatIcon size={16} strokeWidth={1.5} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] font-semibold text-ink truncate">{a.title}</p>
              <div className="flex gap-1.5 mt-1 flex-wrap">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${CAT_TAG[a.cat]}`}>
                  {CAT_LBL[a.cat]}
                </span>
                <span className="flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                  <TpIcon size={9} strokeWidth={2} />
                  {TP_LBL[a.tp]}
                </span>
              </div>
            </div>

            {/* Move buttons */}
            {!disabled && (
              <div className="flex flex-col gap-0.5 flex-shrink-0">
                <button onClick={() => onMove(a.id, -1)} disabled={i === 0} className="w-5 h-5 flex items-center justify-center text-ink-ghost hover:text-ink-mid disabled:opacity-30 rounded transition-colors">
                  <ChevronUp size={13} />
                </button>
                <button onClick={() => onMove(a.id, 1)} disabled={i === activities.length - 1} className="w-5 h-5 flex items-center justify-center text-ink-ghost hover:text-ink-mid disabled:opacity-30 rounded transition-colors">
                  <ChevronDown size={13} />
                </button>
              </div>
            )}

            {/* Actions */}
            {!disabled && (
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => onEdit(a)} className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-soft hover:bg-blue-50 hover:text-blue-600 transition-all">
                  <Pencil size={13} />
                </button>
                <button onClick={() => onDelete(a.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-soft hover:bg-red-50 hover:text-red-500 transition-all">
                  <Trash2 size={13} />
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
