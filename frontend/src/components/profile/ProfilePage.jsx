import { useEffect } from 'react'
import { Smile, Meh, Frown, ZapOff, Flame, Flame as StreakIcon, BookOpen, Activity, CalendarDays, UserCircle2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useJournal } from '../../context/JournalContext'
import { todayKey, dateToKey, keyToDate, MONTHS_S, DAYS_S } from '../../utils/constants'

const MOOD_ICONS = { happy: Smile, neutral: Meh, sad: Frown, tired: ZapOff, angry: Flame }
const MOOD_COLORS = { happy: 'text-amber-500', neutral: 'text-sky-500', sad: 'text-blue-500', tired: 'text-purple-500', angry: 'text-red-500' }

function StatBox({ icon: Icon, value, label, color = 'text-rose-deep' }) {
  return (
    <div className="bg-white border border-border-soft rounded-2xl p-5 text-center shadow-sm">
      <Icon size={18} className={`${color} mx-auto mb-2`} strokeWidth={1.5} />
      <p className={`font-serif text-4xl font-normal ${color} leading-none mb-1.5`}>{value}</p>
      <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">{label}</p>
    </div>
  )
}

export default function ProfilePage() {
  const { user, isGuest } = useAuth()
  const { entries, fetchAllEntries } = useJournal()

  useEffect(() => { fetchAllEntries() }, [])

  const today = new Date()
  const todayStr = todayKey()

  // Stats
  const allEntries = Object.values(entries).filter(e => e.diary?.trim() || e.mood || e.activities?.length)
  const totalActs = Object.values(entries).reduce((s, e) => s + (e.activities?.length || 0), 0)

  // Streak
  let streak = 0
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const k = dateToKey(d)
    const e = entries[k]
    if (e && (e.diary?.trim() || e.mood || e.activities?.length)) streak++
    else break
  }

  // Join date
  const joinDate = user?.joinDate ? new Date(user.joinDate) : null
  const joinStr = joinDate ? `${MONTHS_S[joinDate.getMonth()]} ${joinDate.getDate()}, ${joinDate.getFullYear()}` : ''

  // Last 7 days moods
  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (6 - i))
    const k = dateToKey(d)
    return { key: k, mood: entries[k]?.mood || null, label: DAYS_S[d.getDay()], isToday: k === todayStr }
  })

  return (
    <div className="p-9 pb-20 max-md:p-5 relative z-[1]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-rose-50 via-parchment to-lavender/30 border border-border-soft rounded-3xl p-8 text-center mb-6 shadow-sm">
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-white/80">
          {isGuest
            ? <UserCircle2 size={38} className="text-ink-ghost" strokeWidth={1} />
            : <span className="font-serif text-4xl font-normal text-rose-deep">{user?.name?.[0]?.toUpperCase() || '?'}</span>
          }
        </div>
        <h2 className="font-serif text-3xl font-normal text-ink mb-1">{isGuest ? 'Guest Explorer' : user?.name}</h2>
        <p className="text-sm text-ink-soft">{joinStr ? `Journaling since ${joinStr}` : 'Your personal diary'}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatBox icon={CalendarDays} value={allEntries.length} label="Days written" />
        <StatBox icon={Activity} value={totalActs} label="Activities" color="text-sage-deep" />
        <StatBox icon={StreakIcon} value={streak > 0 ? `${streak}🔥` : streak} label="Day streak" color="text-amber-500" />
      </div>

      {/* Streak card */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-5 mb-6 shadow-sm">
        <div className="text-5xl flex-shrink-0">🔥</div>
        <div>
          <p className="font-serif text-xl font-normal text-ink mb-1">
            {streak > 1 ? `${streak} day streak! 🎉` : 'Start your streak!'}
          </p>
          <p className="text-sm text-ink-soft">
            {streak > 0
              ? `You've journaled ${streak} day${streak > 1 ? 's' : ''} in a row. Keep it up!`
              : 'Write a diary entry today to begin your streak.'
            }
          </p>
        </div>
      </div>

      {/* Mood chart */}
      <div className="bg-white border border-border-soft rounded-2xl p-6 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft mb-5">Last 7 days — mood</p>
        <div className="flex gap-2 items-end">
          {last7.map(({ key, mood, label, isToday }) => {
            const MoodIcon = mood ? MOOD_ICONS[mood] : null
            return (
              <div key={key} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-parchment border border-border-soft flex items-center justify-center">
                  {MoodIcon
                    ? <MoodIcon size={18} className={MOOD_COLORS[mood]} strokeWidth={1.5} />
                    : <span className="text-ink-ghost text-sm">·</span>
                  }
                </div>
                <div className={`w-2 h-2 rounded-full ${mood ? 'bg-rose-mid' : 'bg-border'}`} />
                <span className={`text-[10px] font-semibold ${isToday ? 'text-rose-deep' : 'text-ink-ghost'}`}>{label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
