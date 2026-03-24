import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isGuest, setIsGuest] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('daily_token')
    const guestMode = localStorage.getItem('daily_guest') === 'true'
    if (token) {
      authAPI.getMe()
        .then(res => { setUser(res.data); setIsGuest(false) })
        .catch(() => { localStorage.removeItem('daily_token') })
        .finally(() => setLoading(false))
    } else if (guestMode) {
      setIsGuest(true)
      setUser({ name: 'Guest', joinDate: new Date().toISOString() })
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [])

  const signup = async (name, email, password) => {
    const res = await authAPI.signup({ name, email, password })
    localStorage.setItem('daily_token', res.data.token)
    localStorage.removeItem('daily_guest')
    setUser(res.data.user)
    setIsGuest(false)
  }

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password })
    localStorage.setItem('daily_token', res.data.token)
    localStorage.removeItem('daily_guest')
    setUser(res.data.user)
    setIsGuest(false)
  }

  const enterGuest = () => {
    localStorage.setItem('daily_guest', 'true')
    localStorage.removeItem('daily_token')
    setIsGuest(true)
    setUser({ name: 'Guest', joinDate: new Date().toISOString() })
  }

  const logout = (keepData = true) => {
    localStorage.removeItem('daily_token')
    localStorage.removeItem('daily_guest')
    if (!keepData) localStorage.removeItem('daily_guest_data')
    setUser(null)
    setIsGuest(false)
  }

  return (
    <AuthContext.Provider value={{ user, isGuest, loading, signup, login, enterGuest, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
