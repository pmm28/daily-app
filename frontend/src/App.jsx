import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { JournalProvider } from './context/JournalContext'
import LandingPage from './pages/LandingPage'
import { SignupPage, LoginPage } from './pages/AuthPage'
import TodayPage from './pages/TodayPage'
import CalendarPage from './components/calendar/CalendarPage'
import ProfilePage from './components/profile/ProfilePage'
import AppLayout from './components/layout/AppLayout'

function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose to-rose-mid flex items-center justify-center mx-auto mb-3 animate-pulse">
          <span className="text-white text-lg">📖</span>
        </div>
        <p className="text-sm text-ink-soft">Loading your journal…</p>
      </div>
    </div>
  )
  if (!user) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/signup" element={<SignupPage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route
        path="/app"
        element={
          <RequireAuth>
            <JournalProvider>
              <AppLayout />
            </JournalProvider>
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="today" replace />} />
        <Route path="today" element={<TodayPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
