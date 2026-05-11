import { useState } from 'react'
import { isSupabaseConfigured } from '../lib/supabase'

function toRoomId(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // remove acentos
    .replace(/[^a-z0-9-]/g, '-')                      // caracteres especiais → hífen
    .replace(/-+/g, '-')                               // hifens duplos → um
    .replace(/^-|-$/g, '')                             // remove hifens nas pontas
    .slice(0, 40)
}

export default function RoomSetup({ onEnterRoom, onLocalMode }) {
  const [mode, setMode] = useState('home')   // 'home' | 'create' | 'enter'
  const [name, setName]   = useState('')
  const [code, setCode]   = useState('')
  const [error, setError] = useState('')
  const supabaseReady = isSupabaseConfigured()

  function handleCreate(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed.length < 2) { setError('Digite pelo menos 2 caracteres.'); return }
    const roomId = toRoomId(trimmed)
    if (!roomId) { setError('Nome inválido. Use letras e números.'); return }
    onEnterRoom(roomId, true)
  }

  function handleEnter(e) {
    e.preventDefault()
    const trimmed = code.trim().toLowerCase()
    if (trimmed.length < 2) { setError('Digite o nome da coleção.'); return }
    onEnterRoom(toRoomId(trimmed))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-2xl font-bold text-white mb-1">Copa do Mundo FIFA 2026</h1>
          <p className="text-gray-400 text-sm">Panini • 980 figurinhas</p>
        </div>

        {!supabaseReady ? (
          <div className="bg-gray-800 rounded-2xl p-6 space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-sm text-amber-300">
              <p className="font-semibold mb-1">Modo local ativo</p>
              <p className="text-amber-400/80">Os dados ficam salvos neste dispositivo.</p>
            </div>
            <button
              onClick={onLocalMode}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold rounded-xl transition-colors"
            >
              Abrir meu álbum
            </button>
          </div>

        ) : mode === 'home' ? (
          <div className="bg-gray-800 rounded-2xl p-6 space-y-3">
            <button
              onClick={() => { setMode('create'); setError('') }}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold rounded-xl transition-colors"
            >
              ✨ Criar nova coleção
            </button>
            <button
              onClick={() => { setMode('enter'); setError('') }}
              className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
            >
              Entrar em uma coleção existente
            </button>
          </div>

        ) : mode === 'create' ? (
          <div className="bg-gray-800 rounded-2xl p-6 space-y-4">
            <div>
              <p className="text-white font-semibold mb-1">Nome da coleção</p>
              <p className="text-gray-400 text-xs mb-3">Este nome vira o endereço para compartilhar. Ex: <span className="text-amber-400">familia-silva</span></p>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                autoFocus
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setError('') }}
                placeholder="familia-silva"
                maxLength={40}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
              {name && (
                <p className="text-xs text-gray-500">
                  URL: <span className="text-amber-400 font-mono">?sala={toRoomId(name) || '...'}</span>
                </p>
              )}
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold rounded-xl transition-colors"
              >
                Criar coleção
              </button>
              <button type="button" onClick={() => { setMode('home'); setName(''); setError('') }}
                className="w-full py-2 text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                Voltar
              </button>
            </form>
          </div>

        ) : (
          <div className="bg-gray-800 rounded-2xl p-6 space-y-4">
            <div>
              <p className="text-white font-semibold mb-1">Entrar em uma coleção</p>
              <p className="text-gray-400 text-xs mb-3">Digite o nome da coleção que foi compartilhada com você.</p>
            </div>
            <form onSubmit={handleEnter} className="space-y-3">
              <input
                autoFocus
                type="text"
                value={code}
                onChange={e => { setCode(e.target.value); setError('') }}
                placeholder="familia-silva"
                maxLength={40}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button
                type="submit"
                className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
              >
                Entrar
              </button>
              <button type="button" onClick={() => { setMode('home'); setCode(''); setError('') }}
                className="w-full py-2 text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                Voltar
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
