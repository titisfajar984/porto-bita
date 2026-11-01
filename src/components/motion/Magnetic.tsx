import { useEffect, useRef, type ReactNode } from 'react'

import { useIsTouch } from '@/hooks/useIsTouch'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { gsap, registerGsap } from '@/lib/gsap'
import { EASE } from '@/lib/motion-tokens'
import { cn } from '@/lib/utils'

interface MagneticProps {
  children: ReactNode
  className?: string
  /** How far the element follows the cursor (DESIGN.md §9.2 M9: 0.4). */
  strength?: number
  /** Max rotation in degrees. */
  maxRotate?: number
}

/**
 * Magnetic hover for primary buttons (DESIGN.md §9.2 M9).
 *
 * Strictly a no-op on touch devices and under reduced motion — AGENT.md §5.1 #10
 * and §7.7 both require it, and the element stays a plain wrapper there.
 */
export function Magnetic({
  children,
  className,
  strength = 0.4,
  maxRotate = 6,
}: MagneticProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const isTouch = useIsTouch()
  const reduced = useReducedMotion()
  const disabled = isTouch || reduced

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper || disabled) return
    registerGsap()

    const target = wrapper.firstElementChild as HTMLElement | null
    if (!target) return

    const xTo = gsap.quickTo(target, 'x', { duration: 0.6, ease: EASE.outExpo })
    const yTo = gsap.quickTo(target, 'y', { duration: 0.6, ease: EASE.outExpo })
    const rTo = gsap.quickTo(target, 'rotate', { duration: 0.6, ease: EASE.outExpo })

    const onMove = (event: PointerEvent) => {
      const rect = wrapper.getBoundingClientRect()
      const dx = event.clientX - (rect.left + rect.width / 2)
      const dy = event.clientY - (rect.top + rect.height / 2)
      xTo(dx * strength)
      yTo(dy * strength)
      rTo(gsap.utils.clamp(-maxRotate, maxRotate, (dx / rect.width) * maxRotate * 2))
    }

    const onLeave = () => {
      gsap.to(target, {
        x: 0,
        y: 0,
        rotate: 0,
        duration: 1.2,
        ease: EASE.elastic,
      })
    }

    wrapper.addEventListener('pointermove', onMove)
    wrapper.addEventListener('pointerleave', onLeave)
    wrapper.addEventListener('pointercancel', onLeave)

    return () => {
      wrapper.removeEventListener('pointermove', onMove)
      wrapper.removeEventListener('pointerleave', onLeave)
      wrapper.removeEventListener('pointercancel', onLeave)
      gsap.killTweensOf(target)
      gsap.set(target, { x: 0, y: 0, rotate: 0 })
    }
  }, [disabled, strength, maxRotate])

  return (
    <div
      ref={wrapperRef}
      className={cn('inline-block', className)}
      data-magnetic={disabled ? 'off' : 'on'}
    >
      {children}
    </div>
  )
}
