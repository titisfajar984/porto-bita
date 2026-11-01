import { useEffect, useState } from 'react'

import { NAV_ITEMS } from '@/content/site'

/**
 * Scroll-spy for the navbar (PRD N-03). Picks the section whose top edge is
 * closest to the anchor offset, falling back to the first section.
 */
export function useActiveSection(offset = 140): string {
  const [active, setActive] = useState<string>(NAV_ITEMS[0]?.id ?? 'home')

  useEffect(() => {
    if (typeof window === 'undefined') return

    let frame = 0

    const measure = () => {
      frame = 0
      let current = NAV_ITEMS[0]?.id ?? 'home'
      let bestDistance = Number.POSITIVE_INFINITY

      for (const item of NAV_ITEMS) {
        const element = document.getElementById(item.id)
        if (!element) continue
        const top = element.getBoundingClientRect().top
        const distance = Math.abs(top - offset)
        if (top - offset <= 8 && distance < bestDistance) {
          bestDistance = distance
          current = item.id
        }
      }

      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 4
      if (atBottom) current = NAV_ITEMS[NAV_ITEMS.length - 1]?.id ?? current

      setActive(current)
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [offset])

  return active
}
