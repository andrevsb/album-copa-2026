import { useEffect } from 'react'

export default function SettingsSheet({ open, onClose, onReset }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  function handleReset() {
    if (window.confirm('Isso vai apagar todas as figurinhas marcadas. Tem certeza?')) {
      onReset()
      onClose()
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-800 rounded-t-2xl border-t border-gray-700 p-6 space-y-3 animate-slide-up">
        <div className="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-4" />
        <h3 className="text-white font-bold text-base mb-4">Configurações</h3>

        <button
          onClick={handleReset}
          className="w-full flex items-center gap-4 py-4 px-4 bg-red-500/10 hover:bg-red-500/20 active:bg-red-500/30 text-red-400 rounded-xl transition-colors"
        >
          <span className="text-xl">🗑️</span>
          <div className="text-left">
            <p className="font-semibold text-sm">Resetar álbum</p>
            <p className="text-xs text-red-400/60 mt-0.5">Remove todas as figurinhas marcadas</p>
          </div>
        </button>

        <button
          onClick={onClose}
          className="w-full py-3 text-gray-400 hover:text-gray-200 text-sm rounded-xl transition-colors mt-2"
        >
          Cancelar
        </button>
      </div>
    </>
  )
}
