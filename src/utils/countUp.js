/**
 * Count-up animation utility
 */
export function animateCountUp(element, start, end, duration = 2000) {
  if (!element) return

  const startTime = performance.now()
  const range = end - start

  function update(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3)
    const current = Math.round(start + range * easeOut)
    
    element.textContent = current
    
    if (progress < 1) {
      requestAnimationFrame(update)
    } else {
      element.textContent = end
    }
  }

  requestAnimationFrame(update)
}






