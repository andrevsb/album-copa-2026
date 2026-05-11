import StickerCard from './StickerCard'

export default function StickerGrid({ sectionId, count, collection, onStickerClick, filteredIds }) {
  const allIds = Array.from({ length: count }, (_, i) => `${sectionId}-${i + 1}`)
  const ids = filteredIds || allIds

  return (
    <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-10 gap-2 p-3">
      {ids.map(id => (
        <StickerCard
          key={id}
          id={id}
          qty={collection[id] || 0}
          onClick={onStickerClick}
        />
      ))}
    </div>
  )
}
