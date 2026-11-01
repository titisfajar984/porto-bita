import type { ReactNode } from 'react'

import { useGsapContext } from '@/hooks/useGsapContext'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { cn } from '@/lib/utils'

interface ParallaxProps {
  children: ReactNode
  className?: string
  /** Total vertical travel across the scroll range, in px. */
  distance?: number
  /** Optional horizontal travel, e.g. for the hero ghost text drift (M3). */
  xPercent?: number
}

/**
 * Scroll-scrubbed parallax (DESIGN.md §9.2 M3/M4/M16). Transform-only, so it
 * stays on the compositor. Reduced motion renders the children untouched.
 */
export function Parallax({ children, className, distance = 60, xPercent = 0 }: ParallaxProps) {
  const scopeRef = useGsapContext(
    (scope) => {
      if (prefersReducedMotion()) return

      const tween: gsap.TweenVars = { y: -distance, ease: 'none' }
      if (xPercent !== 0) tween.xPercent = xPercent

      gsap.fromTo(scope, { y: distance / 2, xPercent: 0 }, {
        ...tween,
        scrollTrigger: {
          trigger: scope,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
        onStart: () => {
          scope.style.willChange = 'transform'
        },
        onComplete: () => {
          scope.style.willChange = ''
        },
      })
    },
    [distance, xPercent],
  )

  return (
    <div ref={scopeRef as React.RefObject<HTMLDivElement>} className={cn(className)}>
      {children}
    </div>
  )
}
