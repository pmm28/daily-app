import { Smile, Meh, Frown, ZapOff, Flame } from 'lucide-react'

const moods = [
  { key: 'happy',   Icon: Smile,   label: 'Happy',   active: 'bg-amber-50 border-amber-300 text-amber-600' },
  { key: 'neutral', Icon: Meh,     label: 'Okay',    active: 'bg-sky-50 border-sky-300 text-sky-600' },
  { key: 'sad',     Icon: Frown,   label: 'Sad',     active: 'bg-blue-50 border-blue-300 text-blue-600' },
  { key: 'tired',   Icon: ZapOff,  label: 'Tired',   active: 'bg-purple-50 border-purple-300 text-purple-600' },
  { key: 'angry',   Icon: Flame,   label: 'Angry',   active: 'bg-red-50 border-red-300 text-red-600' },
]

export default function MoodSelector({ value, onChange, disabled }) {
  return (
    <div className="grid grid-cols-5 gap-2 p-5">
      {moods.map(({ key, Icon, label, active }) => (
        <button
          key={key}
          type="button"
          disabled={disabled}
          onClick={() => onChange(key)}
          className={`flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-2xl border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            value === key
              ? `${active} shadow-sm`
              : 'border-border-soft bg-parchment hover:bg-rose/20 hover:border-rose-mid hover:-translate-y-0.5'
          }`}
        >
          <Icon size={22} strokeWidth={1.5} />
          <span className="text-[10.5px] font-semibold tracking-wide">{label}</span>
        </button>
      ))}
    </div>
  )
}
