import { useSnackbar } from '../context/SnackbarContext'
import { TOTAL_STICKERS } from '../data/albumData'

export default function Header({ collection, roomCode }) {
  const showSnackbar = useSnackbar()

  const owned = Object.values(collection).filter(q => q >= 1).length
  const pct = Math.round((owned / TOTAL_STICKERS) * 100)

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showSnackbar('🔗 Link copiado! Compartilhe com a família.')
    })
  }

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">
              🏆 Copa do Mundo FIFA 2026
            </h1>
            <p className="text-xs text-gray-400">Panini • {TOTAL_STICKERS} figurinhas</p>
          </div>
          {roomCode && (
            <button
              onClick={copyLink}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 px-3 py-2 rounded-xl transition-colors"
            >
              <span className="text-xs text-gray-300 font-medium">Compartilhar</span>
              <span className="text-base">🔗</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-green-500 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-amber-400 font-bold text-sm w-12 text-right">{pct}%</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">{owned} de {TOTAL_STICKERS} figurinhas coladas</p>
      </div>
    </div>
  )
}
