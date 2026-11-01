import { cn } from '@/lib/utils'
import { useGsapContext } from '@/hooks/useGsapContext'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { EASE, STAGGER } from '@/lib/motion-tokens'

interface SplitTextProps {
  /** One string per visual line — the caller controls the line breaks. */
  lines: string[]
  className?: string
  lineClassName?: string
  /** Delay before the first line starts. */
  delay?: number
  stagger?: number
  start?: string
  /** Reveal immediately instead of on scroll. */
  immediate?: boolean
  /** Hide the visual lines from assistive tech when an sr-only copy exists. */
  ariaHidden?: boolean
}

/**
 * Masked line reveal (DESIGN.md §9.2 M2/M5). Lines are supplied explicitly
 * rather than measured, which keeps the effect deterministic and avoids a
 * per-character split on mobile (AGENT.md §7 / DESIGN.md §9.2 M5).
 */
export function SplitText({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = STAGGER.base,
  start = 'top 88%',
  immediate = false,
  ariaHidden = false,
}: SplitTextProps) {
  const scopeRef = useGsapContext(
    (scope) => {
      const targets = scope.querySelectorAll<HTMLElement>('[data-split-line]')
      if (targets.length === 0) return

      const reduced = prefersReducedMotion()
      const trigger = immediate ? undefined : { trigger: scope, start, once: true }

      if (reduced) {
        gsap.fromTo(
          targets,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: 'none', stagger: 0.04, delay, scrollTrigger: trigger },
        )
        return
      }

      gsap.fromTo(
        targets,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          ease: EASE.outExpo,
          stagger,
          delay,
          scrollTrigger: trigger,
        },
      )
    },
    [lines.join('|'), delay, stagger, start, immediate],
  )

  return (
    <span
      ref={scopeRef as React.RefObject<HTMLSpanElement>}
      className={cn('block', className)}
      aria-hidden={ariaHidden || undefined}
    >
      {lines.map((line) => (
        <span key={line} className="block overflow-hidden pb-[0.06em]">
          <span data-split-line className={cn('block', lineClassName)}>
            {line}
          </span>
        </span>
      ))}
    </span>
  )
}
