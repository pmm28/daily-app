import { BookOpen, Rainbow, CalendarDays, HardDrive, Feather, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const features = [
  { icon: Feather, label: 'Write freely' },
  { icon: Rainbow, label: 'Track your mood' },
  { icon: CalendarDays, label: 'Calendar view' },
  { icon: HardDrive, label: 'Saved locally' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { enterGuest } = useAuth()

  const handleGuest = () => {
    enterGuest()
    navigate('/app/today')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 text-center relative z-[1]">
      <div className="max-w-md w-full animate-rise">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-36 h-36 rounded-3xl mb-3">
          <img
            src="/logo.png"
            alt="Dailog logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Headline */}
        <h1 className="font-serif text-6xl font-normal text-ink mb-2 tracking-tight">
          Dai<em className="italic text-rose-deep">log</em>
        </h1>
        <p className="text-ink-soft text-[15px] leading-relaxed mb-9 max-w-xs mx-auto">
          A gentle, private space to capture your days — what you did, how you felt, who you're becoming.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {features.map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-1.5 bg-white border border-border rounded-full px-4 py-2 text-[12.5px] font-medium text-ink-mid shadow-sm">
              <Icon size={13} className="text-rose-mid" />
              {label}
            </span>
          ))}
        </div>

        {/* button */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/auth/signup', { state: { from: '/' } })}
            className="flex items-center justify-center gap-2 py-4 px-7 rounded-2xl bg-gradient-to-r from-rose-mid to-rose-deep text-white font-semibold text-[14.5px] shadow-lg shadow-rose-deep/25 hover:-translate-y-0.5 hover:shadow-rose-deep/35 hover:shadow-xl transition-all"
          >
            <Feather size={16} />
            Start my journal
          </button>
          <button
            onClick={() => navigate('/auth/login', { state: { from: '/' } })}
            className="py-3.5 px-7 rounded-2xl bg-white border-[1.5px] border-border text-ink-mid font-semibold text-sm shadow-sm hover:bg-parchment hover:shadow-md transition-all"
          >
            Sign in to existing journal
          </button>
          <button
            onClick={handleGuest}
            className="py-3 text-ink-soft text-sm hover:text-ink transition-colors"
          >
            Experience as Guest →
          </button>
        </div>

        {/* Privacy note */}
        <p className="mt-8 flex items-center justify-center gap-1.5 text-xs text-ink-ghost">
          <Lock size={12} />
          Your diary stays on your device. We never read it.
        </p>
      </div>
    </div>
  )
}
