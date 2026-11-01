import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * GSAP is registered exactly once, and only in the browser (AGENT.md §7.1).
 * Every animation must be created inside a `gsap.context()` and reverted on
 * cleanup so React StrictMode double-invocation is safe.
 */
let registered = false

export function registerGsap(): void {
  if (registered || typeof window === 'undefined') return
  gsap.registerPlugin(ScrollTrigger)
  registered = true
}

export function refreshScrollTrigger(): void {
  if (typeof window === 'undefined') return
  ScrollTrigger.refresh()
}

/** Whether the user asked the OS to reduce motion. Read live, never cached. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Coarse pointer = touch-first device (AGENT.md §7.7, PRD §9). */
export function isCoarsePointer(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true
  return window.matchMedia('(pointer: coarse)').matches
}

export { gsap, ScrollTrigger }
