import { useState } from 'react'
import { isSupabaseConfigured } from '../lib/supabase'

function PinDots({ value }) {
  return (
    <div className="flex gap-3 justify-center my-1">
      {[0, 1, 2, 3].map(i => (
        <div key={i} className={`w-3 h-3 rounded-full transition-colors duration-150 ${i < value.length ? 'bg-amber-400' : 'bg-gray-600'}`} />
      ))}
    </div>
  )
}

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
  const [pin, setPin]     = useState('')
  const [error, setError] = useState('')
  const supabaseReady = isSupabaseConfigured()

  function handlePinInput(e) {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4)
    setPin(val)
    setError('')
  }

  function handleCreate(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed.length < 2) { setError('Digite pelo menos 2 caracteres.'); return }
    if (pin && pin.length !== 4) { setError('O PIN deve ter exatamente 4 dígitos.'); return }
    const roomId = toRoomId(trimmed)
    if (!roomId) { setError('Nome inválido. Use letras e números.'); return }
    onEnterRoom(roomId, true, pin || null)
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
              <p className="text-white font-semibold mb-1">Nova coleção</p>
              <p className="text-gray-400 text-xs mb-3">Dê um nome para identificar e compartilhar. Ex: <span className="text-amber-400">familia-silva</span></p>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">Nome da coleção</label>
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
                  <p className="text-xs text-gray-500 px-1">
                    URL: <span className="text-amber-400 font-mono">?sala={toRoomId(name) || '...'}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">PIN de acesso <span className="text-gray-600 normal-case font-normal">(opcional)</span></label>
                <div className="bg-gray-700/60 border border-gray-600 rounded-xl px-4 py-3 space-y-2">
                  <PinDots value={pin} />
                  <input
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={pin}
                    onChange={handlePinInput}
                    placeholder="4 dígitos"
                    className="w-full bg-transparent text-center text-white placeholder-gray-600 text-lg tracking-[0.5em] focus:outline-none"
                  />
                </div>
                <p className="text-xs text-gray-600 px-1">Se definir um PIN, quem abrir o link precisará digitá-lo.</p>
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold rounded-xl transition-colors"
              >
                Criar coleção
              </button>
              <button type="button" onClick={() => { setMode('home'); setName(''); setPin(''); setError('') }}
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
              <button type="button" onClick={() => { setMode('home'); setCode(''); setPin(''); setError('') }}
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
