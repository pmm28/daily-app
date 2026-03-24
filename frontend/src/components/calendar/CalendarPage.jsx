import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, BookOpen, Dumbbell, Gamepad2, Smile, Meh, Frown, ZapOff, Flame } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useJournal } from '../../context/JournalContext'
import { useToast } from '../../hooks/useToast'
import Modal from '../ui/Modal'
import Toast from '../ui/Toast'
import { todayKey, keyToDate, isFutureDate, dateToKey, pad, DAYS_S, MONTHS_L, DAYS_L, CAT_LBL, TP_LBL } from '../../utils/constants'

const MOOD_ICONS = { happy: Smile, neutral: Meh, sad: Frown, tired: ZapOff, angry: Flame }
const MOOD_COLORS = { happy: 'text-amber-500', neutral: 'text-sky-500', sad: 'text-blue-500', tired: 'text-purple-500', angry: 'text-red-500' }
const CAT_ICONS = { study: BookOpen, exercise: Dumbbell, relax: Gamepad2 }
const CAT_COLORS = { study: 'bg-blue-50 border-blue-100 text-blue-600', exercise: 'bg-green-50 border-green-100 text-green-600', relax: 'bg-purple-50 border-purple-100 text-purple-600' }

export default function CalendarPage() {
  const today = new Date()
  const [calY, setCalY] = useState(today.getFullYear())
  const [calM, setCalM] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState(null)
  const { entries, fetchAllEntries } = useJournal()
  const { toast, showToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => { fetchAllEntries() }, [])

  const navigate_ = (dir) => {
    let m = calM + dir, y = calY
    if (m < 0) { m = 11; y-- }
    if (m > 11) { m = 0; y++ }
    setCalM(m); setCalY(y)
  }

  const firstDay = new Date(calY, calM, 1).getDay()
  const daysInMonth = new Date(calY, calM + 1, 0).getDate()
  const prevDays = new Date(calY, calM, 0).getDate()
  const todayStr = todayKey()

  const openDay = (key) => {
    if (isFutureDate(key)) { showToast("Can't view future dates yet 🕰️"); return }
    setSelectedDay(key)
  }

  const selectedEntry = selectedDay ? (entries[selectedDay] || { diary: '', mood: '', activities: [] }) : null
  const sd = selectedDay ? keyToDate(selectedDay) : null

  return (
    <div className="p-9 pb-20 max-md:p-5 relative z-[1]">
      {/* Header */}
      <div className="flex items-center justify-between mb-7 flex-wrap gap-4">
        <h1 className="font-serif text-4xl font-normal text-ink">
          {MONTHS_L[calM]} <em className="italic text-rose-deep">{calY}</em>
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setCalY(today.getFullYear()); setCalM(today.getMonth()) }}
            className="px-4 py-2.5 rounded-xl border-[1.5px] border-border bg-white text-[12.5px] font-semibold text-ink-mid shadow-sm hover:bg-parchment transition-colors"
          >
            Today
          </button>
          <button onClick={() => navigate_(-1)} className="w-10 h-10 rounded-xl border-[1.5px] border-border bg-white shadow-sm flex items-center justify-center hover:bg-parchment transition-colors">
            <ChevronLeft size={18} className="text-ink-mid" />
          </button>
          <button onClick={() => navigate_(1)} className="w-10 h-10 rounded-xl border-[1.5px] border-border bg-white shadow-sm flex items-center justify-center hover:bg-parchment transition-colors">
            <ChevronRight size={18} className="text-ink-mid" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-white border border-border-soft rounded-2xl shadow-sm overflow-hidden">
        {/* Weekdays */}
        <div className="grid grid-cols-7 bg-parchment border-b border-border">
          {DAYS_S.map(d => (
            <div key={d} className="text-center py-3 text-[11px] font-bold uppercase tracking-wider text-ink-soft">{d}</div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {/* Prev month filler */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`prev-${i}`} className="cal-day border-r border-b border-border-soft opacity-30 p-2">
              <span className="text-[12.5px] font-medium text-ink-mid">{prevDays - firstDay + i + 1}</span>
            </div>
          ))}

          {/* Current month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const key = `${calY}-${pad(calM + 1)}-${pad(day)}`
            const entry = entries[key]
            const isToday = key === todayStr
            const isFuture = isFutureDate(key)
            const hasDiary = !!entry?.diary?.trim()
            const hasMood = !!entry?.mood
            const actCount = entry?.activities?.length || 0
            const hasAny = hasDiary || hasMood || actCount > 0
            const MoodIcon = entry?.mood ? MOOD_ICONS[entry.mood] : null
            const moodColor = entry?.mood ? MOOD_COLORS[entry.mood] : ''

            return (
              <div
                key={key}
                onClick={() => !isFuture && openDay(key)}
                className={`cal-day border-r border-b border-border-soft p-2.5 flex flex-col gap-1 relative transition-colors ${
                  isToday ? 'bg-gradient-to-br from-rose-50 to-rose-100/50' : ''
                } ${isFuture ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-parchment'}`}
              >
                {/* Day number */}
                <span className={`text-[12.5px] font-semibold leading-none ${
                  isToday
                    ? 'w-[22px] h-[22px] rounded-full bg-rose-deep text-white flex items-center justify-center text-[11.5px]'
                    : 'text-ink-mid'
                }`}>
                  {day}
                </span>

                {/* Mood icon */}
                {MoodIcon && <MoodIcon size={16} className={`${moodColor} mt-0.5`} strokeWidth={1.5} />}

                {/* Activity dot */}
                {actCount > 0 && (
                  <span className="text-[10px] text-ink-ghost font-medium max-sm:hidden">{actCount} act.</span>
                )}

                {/* Entry dot */}
                {hasAny && !hasMood && (
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-sage-mid" />
                )}
              </div>
            )
          })}

          {/* Next month filler */}
          {Array.from({ length: (7 - ((firstDay + daysInMonth) % 7)) % 7 }).map((_, i) => (
            <div key={`next-${i}`} className="cal-day border-r border-b border-border-soft opacity-30 p-2">
              <span className="text-[12.5px] font-medium text-ink-mid">{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Day detail modal */}
      {selectedDay && sd && (
        <Modal
          open={!!selectedDay}
          onClose={() => setSelectedDay(null)}
          title={selectedDay === todayStr ? "Today's Entry" : `${DAYS_L[sd.getDay()]}, ${MONTHS_L[sd.getMonth()]} ${sd.getDate()}, ${sd.getFullYear()}`}
          footer={
            <>
              <button onClick={() => setSelectedDay(null)} className="px-6 py-2.5 rounded-xl bg-parchment border-[1.5px] border-border text-ink-mid font-semibold text-sm hover:bg-parchment-2 transition-colors">Close</button>
              <button
                onClick={() => {
                  setSelectedDay(null)
                  navigate('/app/today', { state: { date: selectedDay } })
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-mid to-rose-deep text-white font-semibold text-sm shadow-md hover:-translate-y-px transition-all"
              >
                ✏️ Edit this day
              </button>
            </>
          }
        >
          {/* Mood */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <p className="font-serif text-lg italic text-ink">{`${DAYS_L[sd.getDay()]}, ${MONTHS_L[sd.getMonth()]} ${sd.getDate()}`}</p>
            {selectedEntry?.mood && (() => {
              const MI = MOOD_ICONS[selectedEntry.mood]
              return (
                <span className="flex items-center gap-1.5 bg-parchment border border-border rounded-full px-3 py-1.5 text-sm">
                  <MI size={16} className={MOOD_COLORS[selectedEntry.mood]} strokeWidth={1.5} />
                  <span className="font-medium capitalize text-ink-mid">{selectedEntry.mood}</span>
                </span>
              )
            })()}
          </div>

          {/* Diary */}
          <div className="bg-cream bg-line-texture rounded-2xl border border-border-soft p-5 mb-5 text-[15px] text-ink-mid leading-[1.85] whitespace-pre-wrap min-h-[80px]">
            {selectedEntry?.diary?.trim() || <span className="text-ink-ghost italic">No diary entry for this day yet.</span>}
          </div>

          {/* Activities */}
          {selectedEntry?.activities?.length > 0 && (
            <>
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft mb-3">Activities that day</p>
              <div className="flex flex-col gap-2">
                {selectedEntry.activities.map(a => {
                  const CatIcon = CAT_ICONS[a.cat] || BookOpen
                  return (
                    <div key={a.id} className="flex items-center gap-3 p-3 bg-parchment rounded-xl border border-border-soft">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${CAT_COLORS[a.cat]}`}>
                        <CatIcon size={14} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">{a.title}</p>
                        <p className="text-[11px] text-ink-ghost capitalize">{CAT_LBL[a.cat]} · {TP_LBL[a.tp]}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </Modal>
      )}

      <Toast msg={toast.msg} show={toast.show} />
    </div>
  )
}
