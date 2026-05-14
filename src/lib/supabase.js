import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

export function isSupabaseConfigured() {
  return !!supabase
}

export function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export async function hashPin(pin) {
  const encoder = new TextEncoder()
  const data = encoder.encode(pin)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyPin(storedHash, enteredPin) {
  const hash = await hashPin(enteredPin)
  return hash === storedHash
}

export function getPinCacheKey(code) {
  return `album-pin-${code}`
}

export function getCachedPinHash(code) {
  return localStorage.getItem(getPinCacheKey(code))
}

export function cachePinHash(code, hash) {
  localStorage.setItem(getPinCacheKey(code), hash)
}

export async function getOrCreateRoom(code, name = '', pinHash = null) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('id', code)
    .single()
  if (error && error.code === 'PGRST116') {
    // não encontrado — criar
    const insertPayload = { id: code, name, data: {} }
    if (pinHash) insertPayload.pin = pinHash
    const { data: created, error: createErr } = await supabase
      .from('collections')
      .insert(insertPayload)
      .select()
      .single()
    if (createErr) throw createErr
    return created
  }
  if (error) throw error
  return data
}

export async function saveCollection(code, collectionData) {
  if (!supabase) return
  await supabase
    .from('collections')
    .update({ data: collectionData, updated_at: new Date().toISOString() })
    .eq('id', code)
}

export function subscribeToRoom(code, onChange) {
  if (!supabase) return () => {}
  const channel = supabase
    .channel(`room-${code}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'collections', filter: `id=eq.${code}` },
      payload => onChange(payload.new.data)
    )
    .subscribe()
  return () => supabase.removeChannel(channel)
}
