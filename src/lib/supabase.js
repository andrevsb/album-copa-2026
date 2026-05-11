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

export async function getOrCreateRoom(code, name = '') {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('id', code)
    .single()
  if (error && error.code === 'PGRST116') {
    // não encontrado — criar
    const { data: created, error: createErr } = await supabase
      .from('collections')
      .insert({ id: code, name, data: {} })
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
