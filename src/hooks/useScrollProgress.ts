import { useEffect, useRef } from 'react'

import { gsap, prefersReducedMotion, registerGsap, ScrollTrigger } from '@/lib/gsap'

/**
 * Scroll progress (0 → 1) of an element, written into a ref so the R3F frame
 * loop can read it without triggering React renders (AGENT.md §8).
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const progress = useRef(0)

  useEffect(() => {
    const element = ref.current
    if (!element || prefersReducedMotion()) return
    registerGsap()

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        progress.current = self.progress
      },
    })

    const ctx = gsap.context(() => {}, element)
    return () => {
      trigger.kill()
      ctx.revert()
    }
  }, [])

  return { ref, progress }
}
