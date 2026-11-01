/**
 * Motion tokens — the single source of easing/duration values (DESIGN.md §9.1,
 * AGENT.md §7.9). No component may hard-code its own easing or duration.
 */

export const EASE = {
  outExpo: 'expo.out',
  outQuart: 'power4.out',
  inOut: 'power3.inOut',
  elastic: 'elastic.out(1, 0.35)',
  css: {
    outExpo: 'cubic-bezier(.16,1,.3,1)',
    inOutSoft: 'cubic-bezier(.65,0,.35,1)',
  },
} as const

export const DUR = {
  fast: 0.3,
  base: 0.6,
  slow: 1.1,
  hero: 1.4,
} as const

export const STAGGER = {
  tight: 0.06,
  base: 0.12,
  loose: 0.18,
} as const

export const REVEAL = {
  y: 48,
  blur: 6,
} as const

/** Cross-fade window when the liquid canvas hands over to the static fallback. */
export const CROSSFADE = 0.4
