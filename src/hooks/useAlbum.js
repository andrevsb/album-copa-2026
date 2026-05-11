import { useState, useEffect, useRef, useCallback } from 'react'
import { saveCollection, subscribeToRoom } from '../lib/supabase'

const MAX_QTY = 2
const SAVE_DEBOUNCE_MS = 1000
const LOCAL_KEY = 'album-copa-2026'

export function useAlbum(roomCode) {
  const [collection, setCollection] = useState({})
  const [loaded, setLoaded] = useState(false)
  const debounceRef = useRef(null)
  const isRemoteUpdate = useRef(false)

  // carrega do localStorage (fallback sem Supabase)
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY)
    if (saved) {
      try { setCollection(JSON.parse(saved)) } catch {}
    }
    setLoaded(true)
  }, [])

  // salva no localStorage sempre que mudar
  useEffect(() => {
    if (!loaded) return
    localStorage.setItem(LOCAL_KEY, JSON.stringify(collection))
  }, [collection, loaded])

  // sync Supabase: subscribe a atualizações remotas
  useEffect(() => {
    if (!roomCode) return
    const unsub = subscribeToRoom(roomCode, remoteData => {
      isRemoteUpdate.current = true
      setCollection(remoteData || {})
    })
    return unsub
  }, [roomCode])

  // debounce save no Supabase após mudanças locais
  const scheduleSave = useCallback((nextCollection) => {
    if (!roomCode || isRemoteUpdate.current) {
      isRemoteUpdate.current = false
      return
    }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      saveCollection(roomCode, nextCollection)
    }, SAVE_DEBOUNCE_MS)
  }, [roomCode])

  const setSticker = useCallback((id) => {
    setCollection(prev => {
      const current = prev[id] || 0
      const next = current >= MAX_QTY ? 0 : current + 1
      const nextCollection = next === 0
        ? Object.fromEntries(Object.entries(prev).filter(([k]) => k !== id))
        : { ...prev, [id]: next }
      scheduleSave(nextCollection)
      return nextCollection
    })
  }, [scheduleSave])

  const decrementSticker = useCallback((id) => {
    setCollection(prev => {
      const current = prev[id] || 0
      if (current === 0) return prev
      const next = current - 1
      const nextCollection = next === 0
        ? Object.fromEntries(Object.entries(prev).filter(([k]) => k !== id))
        : { ...prev, [id]: next }
      scheduleSave(nextCollection)
      return nextCollection
    })
  }, [scheduleSave])

  const resetCollection = useCallback(() => {
    if (!window.confirm('Tem certeza que deseja apagar toda a coleção? Esta ação não pode ser desfeita.')) return
    setCollection({})
    if (roomCode) saveCollection(roomCode, {})
  }, [roomCode])

  const loadFromSupabase = useCallback((data) => {
    setCollection(data || {})
  }, [])

  return { collection, setSticker, decrementSticker, resetCollection, loadFromSupabase, loaded }
}
