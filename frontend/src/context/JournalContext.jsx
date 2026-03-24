import React, { createContext, useContext, useState, useCallback } from 'react'
import { entriesAPI, activitiesAPI } from '../utils/api'
import { todayKey } from '../utils/constants'
import { useAuth } from './AuthContext'

// Local storage helpers for guest mode
const GK = 'daily_guest_data'
const loadGuest = () => { try { return JSON.parse(localStorage.getItem(GK)) || { entries: {} } } catch { return { entries: {} } } }
const saveGuest = (data) => localStorage.setItem(GK, JSON.stringify(data))

const JournalContext = createContext(null)

export function JournalProvider({ children }) {
  const { isGuest } = useAuth()
  const [entries, setEntries] = useState({}) // keyed by date
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all entries (for profile/calendar stats)
  const fetchAllEntries = useCallback(async () => {
    if (isGuest) {
      const gd = loadGuest()
      setEntries(gd.entries || {})
      return
    }
    setLoading(true)
    try {
      const res = await entriesAPI.getAll()
      const map = {}
      res.data.forEach(e => { map[e.date] = e })
      setEntries(map)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [isGuest])

  // Fetch single entry by date
  const fetchEntry = useCallback(async (date) => {
    if (isGuest) {
      const gd = loadGuest()
      return gd.entries[date] || { date, diary: '', mood: '', activities: [] }
    }
    setLoading(true)
    try {
      const res = await entriesAPI.getByDate(date)
      const entry = res.data || { date, diary: '', mood: '', activities: [] }
      setEntries(prev => ({ ...prev, [date]: entry }))
      return entry
    } catch (e) { setError(e.message); return null }
    finally { setLoading(false) }
  }, [isGuest])

  // Save diary + mood for a date
  const saveEntry = useCallback(async (date, diary, mood) => {
    if (isGuest) {
      const gd = loadGuest()
      gd.entries[date] = { ...(gd.entries[date] || {}), date, diary, mood, activities: gd.entries[date]?.activities || [] }
      saveGuest(gd)
      setEntries(prev => ({ ...prev, [date]: gd.entries[date] }))
      return
    }
    const res = await entriesAPI.upsert({ date, diary, mood })
    setEntries(prev => ({ ...prev, [date]: { ...(prev[date] || {}), ...res.data } }))
  }, [isGuest])

  // Add activity
  const addActivity = useCallback(async (date, activity) => {
    if (isGuest) {
      const gd = loadGuest()
      if (!gd.entries[date]) gd.entries[date] = { date, diary: '', mood: '', activities: [] }
      const newAct = { id: Date.now().toString(), ...activity }
      gd.entries[date].activities = [...(gd.entries[date].activities || []), newAct]
      saveGuest(gd)
      setEntries(prev => ({
        ...prev,
        [date]: { ...(prev[date] || { date, diary: '', mood: '' }), activities: gd.entries[date].activities }
      }))
      return newAct
    }
    const res = await activitiesAPI.create({ date, ...activity })
    const newAct = res.data
    setEntries(prev => ({
      ...prev,
      [date]: { ...(prev[date] || { date, diary: '', mood: '' }), activities: [...(prev[date]?.activities || []), newAct] }
    }))
    return newAct
  }, [isGuest])

  // Update activity
  const updateActivity = useCallback(async (date, id, updates) => {
    if (isGuest) {
      const gd = loadGuest()
      if (gd.entries[date]) {
        gd.entries[date].activities = gd.entries[date].activities.map(a => a.id === id ? { ...a, ...updates } : a)
        saveGuest(gd)
        setEntries(prev => ({ ...prev, [date]: { ...prev[date], activities: gd.entries[date].activities } }))
      }
      return
    }
    await activitiesAPI.update(id, updates)
    setEntries(prev => ({
      ...prev,
      [date]: { ...prev[date], activities: prev[date]?.activities?.map(a => a.id === id ? { ...a, ...updates } : a) || [] }
    }))
  }, [isGuest])

  // Delete activity
  const deleteActivity = useCallback(async (date, id) => {
    if (isGuest) {
      const gd = loadGuest()
      if (gd.entries[date]) {
        gd.entries[date].activities = gd.entries[date].activities.filter(a => a.id !== id)
        saveGuest(gd)
        setEntries(prev => ({ ...prev, [date]: { ...prev[date], activities: gd.entries[date].activities } }))
      }
      return
    }
    await activitiesAPI.delete(id)
    setEntries(prev => ({
      ...prev,
      [date]: { ...prev[date], activities: prev[date]?.activities?.filter(a => a.id !== id) || [] }
    }))
  }, [isGuest])

  // Reorder activities
  const reorderActivities = useCallback(async (date, newActivities) => {
    if (isGuest) {
      const gd = loadGuest()
      if (gd.entries[date]) { gd.entries[date].activities = newActivities; saveGuest(gd) }
      setEntries(prev => ({ ...prev, [date]: { ...prev[date], activities: newActivities } }))
      return
    }
    setEntries(prev => ({ ...prev, [date]: { ...prev[date], activities: newActivities } }))
    await activitiesAPI.reorder(newActivities.map(a => a.id))
  }, [isGuest])

  return (
    <JournalContext.Provider value={{
      entries, loading, error,
      fetchAllEntries, fetchEntry, saveEntry,
      addActivity, updateActivity, deleteActivity, reorderActivities,
    }}>
      {children}
    </JournalContext.Provider>
  )
}

export const useJournal = () => useContext(JournalContext)
