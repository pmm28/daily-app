import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { BookOpen, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function AuthCard({ title, subtitle, children, switchText, switchLink, switchLabel }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10 relative z-[1]">
      <div className="bg-white border border-border-soft rounded-3xl p-11 w-full max-w-md shadow-2xl animate-rise max-sm:p-7">
        <Link to="/" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-soft hover:text-rose-deep mb-7 transition-colors">
          <ArrowLeft size={15} /> Back
        </Link>
        <div className="flex items-center gap-2.5 mb-7">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-rose to-rose-mid flex items-center justify-center shadow-sm">
            <BookOpen size={18} className="text-white" />
          </div>
          <span className="font-serif text-xl italic text-ink">Daily</span>
        </div>
        <h2 className="font-serif text-3xl font-normal text-ink mb-1.5">{title}</h2>
        <p className="text-[13.5px] text-ink-soft mb-8 leading-relaxed">{subtitle}</p>
        {children}
        <p className="text-center mt-5 text-[13px] text-ink-soft">
          {switchText}{' '}
          <Link to={switchLink} className="text-rose-deep font-bold hover:underline">{switchLabel}</Link>
        </p>
      </div>
    </div>
  )
}

function Field({ label, type = 'text', value, onChange, placeholder, maxLength }) {
  const [show, setShow] = useState(false)
  const isPass = type === 'password'
  return (
    <div className="mb-4">
      <label className="block text-[12.5px] font-bold uppercase tracking-wider text-ink-soft mb-2">{label}</label>
      <div className="relative">
        <input
          type={isPass && show ? 'text' : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="w-full px-4 py-3.5 border-[1.5px] border-border rounded-xl text-sm bg-parchment text-ink placeholder-ink-ghost focus:border-rose-mid focus:bg-white focus:shadow-[0_0_0_3px_rgba(232,160,144,0.15)] transition-all outline-none"
        />
        {isPass && (
          <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-ghost hover:text-ink-soft transition-colors">
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  )
}

export function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!name || !email || !password) { setErr('Please fill all fields'); return }
    setLoading(true); setErr('')
    try {
      await signup(name, email, password)
      navigate('/app/today')
    } catch (e) {
      setErr(e.response?.data?.error || 'Something went wrong')
    } finally { setLoading(false) }
  }

  return (
    <AuthCard title="Begin your journal" subtitle="Just a name and email — your entries stay on your device." switchText="Already have an account?" switchLink="/auth/login" switchLabel="Sign in">
      <Field label="Your name" value={name} onChange={setName} placeholder="What should we call you?" maxLength={40} />
      <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="your@email.com" />
      <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="Something you'll remember" />
      {err && <p className="text-red-500 text-sm mb-3">{err}</p>}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-mid to-rose-deep text-white font-bold text-[14.5px] tracking-wide shadow-lg shadow-rose-deep/25 hover:-translate-y-px hover:shadow-rose-deep/35 transition-all disabled:opacity-60 mt-1"
      >
        {loading ? 'Creating…' : 'Create my journal →'}
      </button>
    </AuthCard>
  )
}

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!email || !password) { setErr('Please fill both fields'); return }
    setLoading(true); setErr('')
    try {
      await login(email, password)
      navigate('/app/today')
    } catch (e) {
      setErr(e.response?.data?.error || 'Invalid credentials')
    } finally { setLoading(false) }
  }

  return (
    <AuthCard title="Welcome back 🌸" subtitle="Your journal is right where you left it." switchText="New here?" switchLink="/auth/signup" switchLabel="Create a journal">
      <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="your@email.com" />
      <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="Your password" />
      {err && <p className="text-red-500 text-sm mb-3">{err}</p>}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-mid to-rose-deep text-white font-bold text-[14.5px] tracking-wide shadow-lg shadow-rose-deep/25 hover:-translate-y-px transition-all disabled:opacity-60 mt-1"
      >
        {loading ? 'Signing in…' : 'Sign in →'}
      </button>
    </AuthCard>
  )
}
