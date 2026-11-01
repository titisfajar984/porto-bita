import { useEffect, useRef, type ReactNode } from 'react'

import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

interface TiltCardProps {
  children: ReactNode
  className?: string
  /** Max tilt in degrees (DESIGN.md §9.2 M10: 6). */
  max?: number
  /** Perspective distance in px. */
  perspective?: number
}

/**
 * 3D tilt with a specular highlight that follows the cursor (DESIGN.md §9.2 M10).
 * Desktop-only: the whole effect is skipped on touch and under reduced motion.
 */
export function TiltCard({ children, className, max = 6, perspective = 900 }: TiltCardProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const glowRef = useRef<HTMLDivElement | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    const glow = glowRef.current
    if (!root || !glow || reduced) return
    if (typeof window.matchMedia !== 'function') return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let frame = 0

    const onMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width
      const py = (event.clientY - rect.top) / rect.height

      if (frame) cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        root.style.setProperty('--tilt-x', `${((0.5 - py) * max).toFixed(2)}deg`)
        root.style.setProperty('--tilt-y', `${((px - 0.5) * max).toFixed(2)}deg`)
        glow.style.setProperty('--glow-x', `${(px * 100).toFixed(1)}%`)
        glow.style.setProperty('--glow-y', `${(py * 100).toFixed(1)}%`)
      })
    }

    const onLeave = () => {
      if (frame) cancelAnimationFrame(frame)
      root.style.setProperty('--tilt-x', '0deg')
      root.style.setProperty('--tilt-y', '0deg')
    }

    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerleave', onLeave)
    root.addEventListener('pointercancel', onLeave)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      root.removeEventListener('pointercancel', onLeave)
    }
  }, [max, reduced])

  return (
    <div
      ref={rootRef}
      className={cn('relative', className)}
      style={{ perspective: `${perspective}px` }}
    >
      <div
        className="relative h-full w-full transition-transform duration-500 [transform:rotateX(var(--tilt-x,0deg))_rotateY(var(--tilt-y,0deg))] [transform-style:preserve-3d] motion-reduce:transform-none"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
        <div
          ref={glowRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{
            background:
              'radial-gradient(420px circle at var(--glow-x,50%) var(--glow-y,50%), rgba(255,255,255,.18), transparent 60%)',
          }}
        />
      </div>
    </div>
  )
}
