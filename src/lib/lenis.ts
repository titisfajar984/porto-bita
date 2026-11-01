import Lenis from 'lenis'

import { gsap, registerGsap, ScrollTrigger } from '@/lib/gsap'

/**
 * Lenis is only ever created for fine pointers without reduced-motion
 * (AGENT.md §7.2). Touch devices keep native scrolling.
 */
export function createLenis(): Lenis | null {
  registerGsap()

  const raf = (time: number) => lenis.raf(time * 1000)
  const lenis = new Lenis({
    duration: 1.05,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6,
  })

  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  return Object.assign(lenis, {
    /** Detach the GSAP ticker hook before destroying, otherwise the ticker keeps a dead ref. */
    destroy: () => {
      gsap.ticker.remove(raf)
      gsap.ticker.lagSmoothing(500, 33)
      Lenis.prototype.destroy.call(lenis)
    },
  })
}
