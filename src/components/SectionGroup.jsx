import { useState } from 'react'
import StickerGrid from './StickerGrid'

export default function SectionGroup({ section, collection, onStickerClick, forceOpen, filteredIds }) {
  const [open, setOpen] = useState(false)
  const isOpen = forceOpen || open

  const ids = Array.from({ length: section.count }, (_, i) => `${section.id}-${i + 1}`)
  const owned = ids.filter(id => (collection[id] || 0) >= 1).length
  const allDone = owned === section.count

  return (
    <div className="border border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 hover:bg-gray-750 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{section.emoji}</span>
          <span className="font-semibold text-gray-100 text-sm">{section.name}</span>
          {allDone && <span className="text-green-400 text-xs font-bold">✓ Completo</span>}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-400">
            <span className={owned === section.count ? 'text-green-400 font-bold' : 'text-amber-400 font-semibold'}>
              {owned}
            </span>
            <span className="text-gray-600">/{section.count}</span>
          </div>
          <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all"
              style={{ width: `${(owned / section.count) * 100}%` }}
            />
          </div>
          <span className="text-gray-500 text-xs">{isOpen ? '▲' : '▼'}</span>
        </div>
      </button>

      {isOpen && (
        <StickerGrid
          sectionId={section.id}
          count={section.count}
          collection={collection}
          onStickerClick={onStickerClick}
          filteredIds={filteredIds}
        />
      )}
    </div>
  )
}
