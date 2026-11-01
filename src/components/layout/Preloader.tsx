import { useEffect, useRef, useState } from 'react'

import { useI18n } from '@/app/i18n-context'
import { gsap, prefersReducedMotion, registerGsap } from '@/lib/gsap'
import { EASE } from '@/lib/motion-tokens'

const SESSION_KEY = 'adinda.preloader.seen'

/** Reduced motion or a repeat visit in this session means: don't show it at all. */
function shouldSkip(): boolean {
  if (typeof window === 'undefined') return true
  if (prefersReducedMotion()) return true
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Preloader (DESIGN.md §9.2 M1) — counter 0 → 100, then the white panel slides
 * up (yPercent -100, 0.9 s power3.inOut). Never longer than 1.6 s, and skipped
 * entirely under reduced motion or on a repeat visit within the session.
 */
export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [skip] = useState(shouldSkip)
  const [visible, setVisible] = useState(!skip)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const counterRef = useRef<HTMLSpanElement | null>(null)
  const completeRef = useRef(onComplete)

  const { t } = useI18n()

  useEffect(() => {
    completeRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (skip) {
      completeRef.current()
      return
    }

    registerGsap()
    const root = rootRef.current
    const counter = counterRef.current
    if (!root || !counter) return

    const state = { value: 0 }

    const timeline = gsap.timeline({
      onComplete: () => {
        try {
          window.sessionStorage.setItem(SESSION_KEY, '1')
        } catch {
          /* private mode — the preloader simply shows again */
        }
        setVisible(false)
        completeRef.current()
      },
    })

    timeline
      .to(state, {
        value: 100,
        duration: 0.68,
        ease: EASE.outQuart,
        onUpdate: () => {
          counter.textContent = String(Math.round(state.value)).padStart(3, '0')
        },
      })
      .to(
        root,
        {
          yPercent: -100,
          duration: 0.9,
          ease: EASE.inOut,
        },
        '>-0.08',
      )

    return () => {
      timeline.kill()
    }
  }, [skip])

  if (!visible) return null

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[90] flex items-end justify-between bg-card px-6 pb-8 md:px-10 md:pb-12"
      role="status"
      aria-live="polite"
      aria-label={t.common.loading}
    >
      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {t.hero.ghost}
      </span>
      <span ref={counterRef} className="text-[12px] font-medium tabular-nums text-foreground">
        000
      </span>
    </div>
  )
}
