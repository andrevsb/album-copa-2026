import { useSnackbar } from '../context/SnackbarContext'
import { shareList } from '../lib/share'
import { SECTIONS, COCA_SECTION, getSectionIds } from '../data/albumData'

const WA_ICON = (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
)

export default function MissingList({ collection, showCoca }) {
  const showSnackbar = useSnackbar()
  const allSections = showCoca ? [...SECTIONS, COCA_SECTION] : SECTIONS

  const missingBySection = []
  for (const section of allSections) {
    const ids = getSectionIds(section)
    const missing = ids.filter(id => !(collection[id] >= 1))
    if (missing.length > 0) missingBySection.push({ section, missing })
  }

  const totalMissing = missingBySection.reduce((s, g) => s + g.missing.length, 0)

  function buildListText() {
    const lines = ['Figurinhas faltando - Copa do Mundo FIFA 2026', '']
    for (const { section, missing } of missingBySection) {
      const nums = missing.map(id => `${id.split('-')[0]} ${id.split('-')[1]}`)
      lines.push(`${section.name}: ${nums.join(', ')}`)
    }
    lines.push('', `Total: ${totalMissing} figurinhas faltando`)
    return lines.join('\n')
  }

  function copyList() {
    if (totalMissing === 0) return
    navigator.clipboard.writeText(buildListText()).then(() => showSnackbar('✓ Lista copiada!'))
  }

  async function handleShare() {
    if (totalMissing === 0) return
    await shareList(buildListText())
  }

  if (totalMissing === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <span className="text-4xl mb-3">🎉</span>
        <p className="text-sm font-semibold text-green-400">Álbum completo!</p>
        <p className="text-xs mt-1 text-gray-500">Parabéns, nenhuma figurinha faltando.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-400">
          <span className="text-red-400 font-bold">{totalMissing}</span> figurinhas faltando
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
      <div className="space-y-2">
        {missingBySection.map(({ section, missing }) => (
          <div key={section.id} className="bg-gray-800 rounded-xl px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-200">
                {section.emoji} {section.name}
              </p>
              <span className="text-xs text-red-400 font-medium">{missing.length} faltando</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {missing.map(id => {
                const [sig, n] = id.split('-')
                return (
                  <span key={id} className="bg-gray-700 text-gray-300 text-xs font-mono px-2 py-1 rounded-lg">
                    {sig} {n}
                  </span>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
