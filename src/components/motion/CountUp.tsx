import { useEffect, useRef } from 'react'

import { useInViewOnce } from '@/hooks/useInViewOnce'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { EASE } from '@/lib/motion-tokens'
import { cn } from '@/lib/utils'

interface CountUpProps {
  /** Target number. */
  to: number
  /** Decimal places (DESIGN.md §9.2 M7: 2 for "3,82"). */
  decimals?: number
  /** BCP-47 tag used for locale-aware formatting. */
  locale?: string
  suffix?: string
  className?: string
  /** Seconds. */
  duration?: number
}

/**
 * Count-up that runs exactly once when the number scrolls into view
 * (DESIGN.md §9.2 M7). Uses `tabular-nums` so digits never shift width, and
 * under reduced motion the final value is rendered immediately.
 */
export function CountUp({
  to,
  decimals = 0,
  locale = 'id-ID',
  suffix = '',
  className,
  duration = 1.6,
}: CountUpProps) {
  const [ref, seen] = useInViewOnce<HTMLSpanElement>({ rootMargin: '0px 0px -10% 0px' })
  const valueRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    const node = valueRef.current
    if (!node || !seen) return

    const format = (value: number) =>
      value.toLocaleString(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })

    if (prefersReducedMotion()) {
      node.textContent = `${format(to)}${suffix}`
      return
    }

    const state = { value: 0 }
    const tween = gsap.to(state, {
      value: to,
      duration,
      ease: EASE.outQuart,
      onUpdate: () => {
        node.textContent = format(state.value)
      },
      onComplete: () => {
        node.textContent = `${format(to)}${suffix}`
      },
    })

    return () => {
      tween.kill()
    }
  }, [seen, to, decimals, locale, suffix, duration])

  const initial = `${(0).toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`

  return (
    <span ref={ref} className={cn('inline-flex items-baseline tabular-nums', className)}>
      <span ref={valueRef}>{initial}</span>
      {suffix ? <span aria-hidden="true">{suffix}</span> : null}
    </span>
  )
}
