import { TOTAL_STICKERS, getAllStickerIds } from '../data/albumData'

const OFFICIAL_IDS = new Set(getAllStickerIds())

export default function StatsBar({ collection, activeFilter, onFilterChange }) {
  // Apenas figurinhas oficiais (980) — exclui Coca-Cola
  let owned = 0
  let duplicates = 0
  for (const [id, qty] of Object.entries(collection)) {
    if (!OFFICIAL_IDS.has(id)) continue
    if (qty >= 1) owned++
    if (qty >= 2) duplicates += qty - 1
  }
  const missing = TOTAL_STICKERS - owned

  const stats = [
    { key: 'todas',     label: 'Todas',     value: TOTAL_STICKERS, color: 'text-gray-300'   },
    { key: 'tenho',     label: 'Tenho',     value: owned,          color: 'text-green-400'  },
    { key: 'faltam',    label: 'Faltam',    value: missing,        color: 'text-red-400'    },
    { key: 'repetidas', label: 'Repetidas', value: duplicates,     color: 'text-orange-400' },
  ]

  return (
    <div className="grid grid-cols-4 gap-1 px-4 py-3 max-w-4xl mx-auto w-full">
      {stats.map(stat => (
        <button
          key={stat.key}
          onClick={() => onFilterChange(stat.key)}
          className={`
            flex flex-col items-center py-2 px-1 rounded-xl transition-all
            ${activeFilter === stat.key
              ? 'bg-gray-700 ring-1 ring-amber-500'
              : 'bg-gray-800 hover:bg-gray-750'
            }
          `}
        >
          <span className={`text-xl font-bold ${stat.color}`}>{stat.value}</span>
          <span className="text-xs text-gray-400 mt-0.5">{stat.label}</span>
        </button>
      ))}
    </div>
  )
}
