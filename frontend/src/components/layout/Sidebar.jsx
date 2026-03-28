import { BookOpen, CalendarDays, Sparkles, LogOut, LogIn , User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/app/today', icon: BookOpen, label: 'Today' },
  { path: '/app/calendar', icon: CalendarDays, label: 'Calendar' },
  { path: '/app/profile', icon: User, label: 'Profile' },
]

export default function Sidebar() {
  const { user, isGuest, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
  const isConfirm = confirm('Are you sure you want to log out?')

  if (isConfirm) {
    logout()
    navigate('/')
  }
}

  return (
    <aside className="w-[220px] min-w-[220px] bg-parchment border-r border-border flex flex-col py-7 fixed left-0 top-0 h-screen z-50 shadow-sm max-md:w-16 max-md:min-w-[64px]">

      {/* Brand */}
      <div className="flex items-center gap-3 px-5 pb-7 border-b border-border mb-4 max-md:justify-center max-md:px-3">
        
        {/* Logo */}
        <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
          <img
            src="/logo.png"
            alt="Dailog logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Text */}
        <span className="font-serif text-xl text-ink tracking-tight max-md:hidden">
          Dai<em className="italic text-rose-deep">log</em>
        </span>

      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all border-l-[3px] max-md:justify-center max-md:px-3 ${
                active
                  ? 'bg-white text-rose-deep border-rose-deep font-semibold'
                  : 'border-transparent text-ink-mid hover:bg-parchment-2 hover:text-ink'
              }`}
            >
              <Icon size={17} className="flex-shrink-0" />
              <span className="max-md:hidden">{label}</span>
            </button>
          )
        })}
      </nav>

      {/* Bottom user area */}
      <div className="mt-auto px-3 pt-4 border-t border-border">
        <div className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-border shadow-sm max-md:justify-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose to-lavender flex items-center justify-center flex-shrink-0">
            {isGuest
              ? <LogIn size={14} className="text-white" />
              : <span className="text-white text-xs font-bold">{user?.name?.[0]?.toUpperCase() || '?'}</span>
            }
          </div>
          <div className="flex-1 min-w-0 max-md:hidden">
            <p className="text-[12.5px] font-semibold text-ink truncate">{isGuest ? 'Guest' : user?.name}</p>
            <p className="text-[11px] text-ink-soft">{isGuest ? 'Guest mode' : 'Signed in'}</p>
          </div>
        </div>

        {!isGuest && (
          <button
            onClick={handleLogout}
            className="mt-2 w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-parchment border-[1.5px] border-border rounded-xl text-[12.5px] font-semibold text-ink-mid hover:border-rose-mid hover:text-rose-deep hover:bg-parchment-2 transition-all"
          >
            <LogOut size={14} />
            <span className="max-md:hidden">Log out</span>
          </button>
        )}

        {isGuest && (
          <button
            onClick={() => navigate('/')}
            className="mt-2 w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-rose-deep/10 border-[1.5px] border-rose-mid/40 rounded-xl text-[12.5px] font-semibold text-rose-deep hover:bg-rose-deep/20 transition-all"
          >
            <LogIn size={14} />
            <span className="max-md:hidden">Exit</span>
          </button>
        )}
      </div>
    </aside>
  )
}
