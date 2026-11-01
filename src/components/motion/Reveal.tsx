import type { ReactNode } from 'react'

import { useGsapContext } from '@/hooks/useGsapContext'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { EASE, REVEAL } from '@/lib/motion-tokens'
import { cn } from '@/lib/utils'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Seconds before the tween starts. */
  delay?: number
  /** Vertical travel in px (DESIGN.md §9.2 M5). */
  y?: number
  /** ScrollTrigger start string. */
  start?: string
  /** Skip the scroll trigger and reveal immediately (used above the fold). */
  immediate?: boolean
}

/**
 * Generic scroll reveal — y 48 → 0, opacity 0 → 1, 0.9 s outExpo, once
 * (DESIGN.md §9.2 M5). Under reduced motion it degrades to a 250 ms fade
 * (DESIGN.md §9.3).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = REVEAL.y,
  start = 'top 85%',
  immediate = false,
}: RevealProps) {
  const scopeRef = useGsapContext(
    (scope) => {
      const reduced = prefersReducedMotion()

      if (reduced) {
        gsap.fromTo(
          scope,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.25,
            delay,
            ease: 'none',
            scrollTrigger: immediate ? undefined : { trigger: scope, start, once: true },
          },
        )
        return
      }

      gsap.fromTo(
        scope,
        { y, opacity: 0, filter: `blur(${REVEAL.blur}px)` },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          delay,
          ease: EASE.outExpo,
          scrollTrigger: immediate ? undefined : { trigger: scope, start, once: true },
          onStart: () => {
            scope.style.willChange = 'transform, opacity, filter'
          },
          onComplete: () => {
            scope.style.willChange = ''
          },
        },
      )
    },
    [delay, y, start, immediate],
  )

  return (
    <div ref={scopeRef as React.RefObject<HTMLDivElement>} className={cn(className)}>
      {children}
    </div>
  )
}
