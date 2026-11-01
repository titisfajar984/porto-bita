import { useEffect, useRef, useState } from 'react'

import { useIsTouch } from '@/hooks/useIsTouch'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

type CursorState = 'default' | 'link' | 'project' | 'text'

const LINK_SELECTOR = 'a, button, [role="button"], [data-cursor="link"]'
const PROJECT_SELECTOR = '[data-cursor="project"]'
const TEXT_SELECTOR = 'p, h1, h2, h3, h4, li, [data-cursor="text"]'

/**
 * Custom cursor — 8 px dot + 36 px ring (DESIGN.md §9.2 M19).
 *
 * Desktop only: nothing is rendered on touch devices or under reduced motion,
 * and the native cursor is only hidden while the replacement is actually drawn.
 * `mix-blend-mode: difference` is deliberately avoided (DESIGN.md §9.2 M19) so
 * contrast stays predictable over the blue gradients.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)
  const [mode, setMode] = useState<CursorState>('default')
  const isTouch = useIsTouch()
  const reduced = useReducedMotion()
  const enabled = !isTouch && !reduced

  useEffect(() => {
    if (!enabled) return
    if (typeof window.matchMedia !== 'function') return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.body.dataset.cursor = 'custom'

    let pointerX = window.innerWidth / 2
    let pointerY = window.innerHeight / 2
    let ringX = pointerX
    let ringY = pointerY
    let frame = 0
    let visible = false

    const setState = (state: CursorState) => {
      if (ring.dataset.state === state) return
      ring.dataset.state = state
      dot.dataset.state = state
      setMode(state)
    }

    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX
      pointerY = event.clientY
      if (!visible) {
        visible = true
        dot.style.opacity = '1'
        ring.style.opacity = '1'
        ringX = pointerX
        ringY = pointerY
      }
      const target = event.target as Element | null
      if (!target) return
      if (target.closest(PROJECT_SELECTOR)) setState('project')
      else if (target.closest(LINK_SELECTOR)) setState('link')
      else if (target.closest(TEXT_SELECTOR)) setState('text')
      else setState('default')
    }

    const onLeave = () => {
      visible = false
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }

    const render = () => {
      ringX += (pointerX - ringX) * 0.18
      ringY += (pointerY - ringY) * 0.18
      dot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`
      frame = requestAnimationFrame(render)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    frame = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      delete document.body.dataset.cursor
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] hidden lg:block">
      <div
        ref={dotRef}
        data-state="default"
        className="absolute left-0 top-0 h-2 w-2 rounded-full bg-primary opacity-0 transition-opacity duration-200 data-[state=project]:opacity-0 data-[state=text]:h-5 data-[state=text]:w-[2px] data-[state=text]:rounded-none"
      />
      <div
        ref={ringRef}
        data-state="default"
        className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-primary/50 text-[10px] font-medium uppercase tracking-[0.12em] text-primary opacity-0 transition-[width,height,opacity,background-color] duration-200 data-[state=link]:h-14 data-[state=link]:w-14 data-[state=link]:bg-primary/10 data-[state=project]:h-16 data-[state=project]:w-16 data-[state=project]:border-transparent data-[state=project]:bg-primary data-[state=project]:text-primary-foreground"
      >
        <span className={cn('transition-opacity duration-200', mode === 'project' ? 'opacity-100' : 'opacity-0')}>
          View
        </span>
      </div>
    </div>
  )
}
