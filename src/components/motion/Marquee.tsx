import { type ReactNode } from 'react'

import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

interface MarqueeProps {
  children: ReactNode
  className?: string
  /** Seconds for one full loop. DESIGN.md §9.2 M8: 40 s desktop, 28 s mobile. */
  duration?: number
  reverse?: boolean
  /** Accessible label for the duplicated (hidden) copy. */
  ariaLabel?: string
}

/**
 * CSS marquee (DESIGN.md §9.2 M8). Two identical sets are rendered and the
 * track translates -50%; the duplicate is `aria-hidden` so screen readers hear
 * the list once. Pauses on hover/focus, and stops entirely under reduced motion
 * (where the first set simply becomes a static row).
 */
export function Marquee({
  children,
  className,
  duration = 40,
  reverse = false,
  ariaLabel,
}: MarqueeProps) {
  const reduced = useReducedMotion()

  return (
    <div
      className={cn('group relative overflow-hidden', className)}
      role="group"
      aria-label={ariaLabel}
      data-marquee={reduced ? 'static' : 'running'}
    >
      <div
        className={cn(
          'marquee-track motion-reduce:transform-none!',
          'group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]',
        )}
        style={{
          animation: reduced
            ? undefined
            : `${reverse ? 'hm-marquee-right' : 'hm-marquee-left'} ${duration}s linear infinite`,
        }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
