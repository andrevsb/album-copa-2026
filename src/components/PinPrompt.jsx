import { useState, useRef, useEffect } from 'react'

function PinDots({ value }) {
  return (
    <div className="flex gap-4 justify-center my-2">
      {[0, 1, 2, 3].map(i => (
        <div
          key={i}
          className={`w-4 h-4 rounded-full transition-all duration-150 ${
            i < value.length ? 'bg-amber-400 scale-110' : 'bg-gray-600'
          }`}
        />
      ))}
    </div>
  )
}

export default function PinPrompt({ roomName, onSubmit, onCancel }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    // Small delay so animation plays after mount
    const t = setTimeout(() => inputRef.current?.focus(), 100)
    return () => clearTimeout(t)
  }, [])

  function handlePinInput(e) {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4)
    setPin(val)
    setError('')
    if (val.length === 4) {
      // Auto-submit on 4 digits
      handleSubmit(val)
    }
  }

  async function handleSubmit(value = pin) {
    if (value.length !== 4) {
      setError('Digite os 4 dígitos do PIN.')
      return
    }
    setLoading(true)
    setError('')
    const ok = await onSubmit(value)
    setLoading(false)
    if (!ok) {
      setPin('')
      setError('PIN incorreto. Tente novamente.')
      setShake(true)
      setTimeout(() => setShake(false), 500)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm px-4">
      <div className={`w-full max-w-sm bg-gray-800 rounded-2xl p-6 shadow-2xl ${shake ? 'animate-shake' : ''}`}>
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 flex items-center justify-center">
            <svg className="w-7 h-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-white font-bold text-lg text-center mb-1">Coleção protegida</h2>
        {roomName && (
          <p className="text-gray-400 text-sm text-center mb-5">
            <span className="text-amber-400 font-mono">{roomName}</span> requer um PIN de acesso.
          </p>
        )}
        {!roomName && (
          <p className="text-gray-400 text-sm text-center mb-5">Digite o PIN para acessar.</p>
        )}

        {/* PIN dots */}
        <PinDots value={pin} />

        {/* Hidden input */}
        <input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          value={pin}
          onChange={handlePinInput}
          className="sr-only"
          aria-label="PIN de acesso"
          disabled={loading}
        />

        {/* Tap-to-focus hint */}
        <button
          type="button"
          onClick={() => inputRef.current?.focus()}
          className="w-full py-3 mt-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-gray-300 text-sm font-medium transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Verificando...
            </span>
          ) : pin.length === 0 ? (
            'Toque aqui e digite o PIN'
          ) : (
            `${pin.length}/4 dígitos`
          )}
        </button>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-xs text-center mt-3">{error}</p>
        )}

        {/* Manual submit if needed */}
        {pin.length === 4 && !loading && (
          <button
            type="button"
            onClick={() => handleSubmit()}
            className="w-full py-3 mt-3 bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold rounded-xl transition-colors"
          >
            Entrar
          </button>
        )}

        {/* Cancel */}
        <button
          type="button"
          onClick={onCancel}
          className="w-full py-2 mt-2 text-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
