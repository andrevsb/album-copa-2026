export default function StickerCard({ id, qty, onClick }) {
  const [sigla, num] = id.split('-')
  const isMissing = !qty || qty === 0
  const isDuplicate = qty >= 2

  function handleClick(e) {
    const btn = e.currentTarget
    const circle = document.createElement('span')
    const diameter = Math.max(btn.clientWidth, btn.clientHeight)
    const radius = diameter / 2
    const rect = btn.getBoundingClientRect()
    circle.style.width = circle.style.height = `${diameter}px`
    circle.style.left = `${e.clientX - rect.left - radius}px`
    circle.style.top = `${e.clientY - rect.top - radius}px`
    circle.classList.add('ripple')
    const existing = btn.querySelector('.ripple')
    if (existing) existing.remove()
    btn.appendChild(circle)
    onClick(id)
  }

  return (
    <button
      onClick={handleClick}
      title={`${sigla} ${num}`}
      className={`
        relative flex flex-col items-center justify-center rounded-lg overflow-hidden
        aspect-square select-none
        transition-all duration-100 active:scale-90 cursor-pointer
        ${isMissing
          ? 'bg-gray-700 text-gray-500 hover:bg-gray-600'
          : 'bg-green-600 text-white shadow-lg shadow-green-900/40'
        }
      `}
    >
      <span className={`text-[10px] leading-none font-medium ${isDuplicate ? 'opacity-70 mb-2' : 'opacity-60'}`}>
        {sigla}
      </span>
      <span className={`text-sm font-bold leading-tight ${isDuplicate ? 'mt-0 mb-2' : 'mt-0.5'}`}>
        {num}
      </span>

      {!isMissing && !isDuplicate && (
        <span className="absolute top-1 right-1.5 text-green-300 text-[10px] font-black leading-none">✓</span>
      )}

      {isDuplicate && (
        <div className="absolute bottom-0 left-0 right-0 bg-orange-500 flex items-center justify-center py-1">
          <span className="text-white text-[11px] font-black tracking-wide">×{qty}</span>
        </div>
      )}
    </button>
  )
}
