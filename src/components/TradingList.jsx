import { useSnackbar } from '../context/SnackbarContext'
import { shareList } from '../lib/share'
import { SECTIONS, COCA_SECTION, getSectionIds } from '../data/albumData'

const ALL_SECTIONS = [...SECTIONS, COCA_SECTION]

function fmtId(id) {
  const [sig, num] = id.split('-')
  return `${sig} ${num}`
}

const WA_ICON = (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
)

export default function TradingList({ collection, onStickerTrade }) {
  const showSnackbar = useSnackbar()

  const duplicates = []
  for (const section of ALL_SECTIONS) {
    for (const id of getSectionIds(section)) {
      const qty = collection[id] || 0
      if (qty >= 2) duplicates.push({ id, section })
    }
  }

  function buildListText() {
    const grouped = {}
    for (const d of duplicates) {
      const key = d.section.name
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(fmtId(d.id))
    }
    const lines = ['Figurinhas para troca - Copa do Mundo FIFA 2026', '']
    for (const [name, ids] of Object.entries(grouped)) {
      lines.push(`${name}: ${ids.join(', ')}`)
    }
    lines.push('', `Total: ${duplicates.length} figurinhas para troca`)
    return lines.join('\n')
  }

  function copyList() {
    if (duplicates.length === 0) return
    navigator.clipboard.writeText(buildListText()).then(() => showSnackbar('✓ Lista copiada!'))
  }

  async function handleShare() {
    if (duplicates.length === 0) return
    await shareList(buildListText())
  }

  function handleTrade(id) {
    onStickerTrade(id)
    showSnackbar(`✓ ${fmtId(id)} marcada como trocada`)
  }

  if (duplicates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <span className="text-4xl mb-3">🔄</span>
        <p className="text-sm">Nenhuma figurinha repetida ainda.</p>
        <p className="text-xs mt-1 text-center px-6">Clique mais de uma vez em uma figurinha para marcá-la como repetida.</p>
      </div>
    )
  }

  const grouped = {}
  for (const d of duplicates) {
    const key = `${d.section.emoji} ${d.section.name}`
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(d)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 w-full">
      {/* Header: título + botões numa linha, instrução abaixo */}
      <div className="mb-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-gray-400">
            <span className="text-orange-400 font-bold">{duplicates.length}</span> figurinhas para troca
          </p>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={copyList}
              className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
            >
              📋 Copiar
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 bg-green-700 hover:bg-green-600 active:bg-green-800 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
            >
              {WA_ICON}
              WhatsApp
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-1">Toque em uma figurinha para marcar como trocada</p>
      </div>

      <div className="space-y-2">
        {Object.entries(grouped).map(([label, items]) => (
          <div key={label} className="bg-gray-800 rounded-xl px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-200">{label}</p>
              <span className="text-xs text-orange-400 font-medium">{items.length} para trocar</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {items.map(d => (
                <button
                  key={d.id}
                  onClick={() => handleTrade(d.id)}
                  className="group relative bg-orange-500/20 hover:bg-green-500/20 active:bg-green-500/30 text-orange-300 hover:text-green-300 text-xs font-mono px-3 py-1.5 rounded-lg transition-colors border border-orange-500/20 hover:border-green-500/30"
                >
                  <span className="group-hover:invisible">{fmtId(d.id)}</span>
                  <span className="absolute inset-0 hidden group-hover:flex items-center justify-center text-green-300 text-xs font-semibold">
                    ✓ trocada
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
