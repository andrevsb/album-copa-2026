export async function shareList(text) {
  if (navigator.share) {
    try {
      await navigator.share({ text })
      return true
    } catch (e) {
      if (e.name === 'AbortError') return false // usuário cancelou
    }
  }
  // Fallback: abre wa.me (desktop ou browser sem Web Share API)
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  return true
}
