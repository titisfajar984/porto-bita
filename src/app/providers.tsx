import { MotionConfig } from 'framer-motion'
import { useEffect, type ReactNode } from 'react'

import { I18nProvider } from '@/app/i18n-context'
import { CustomCursor } from '@/components/motion/CustomCursor'
import { useIsTouch } from '@/hooks/useIsTouch'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { createLenis } from '@/lib/lenis'
import { refreshScrollTrigger } from '@/lib/gsap'

/**
 * Smooth scrolling, but only where it belongs (AGENT.md §7.2): fine pointers
 * without reduced-motion. Touch devices keep native scrolling.
 */
function LenisProvider({ children }: { children: ReactNode }) {
  const isTouch = useIsTouch()
  const reduced = useReducedMotion()

  useEffect(() => {
    if (isTouch || reduced) return
    const lenis = createLenis()
    return () => lenis?.destroy()
  }, [isTouch, reduced])

  return <>{children}</>
}

/** Re-measure scroll positions once fonts and the hero image have settled (AGENT.md §7.5). */
function ScrollTriggerRefresher() {
  useEffect(() => {
    if (typeof document === 'undefined') return
    let cancelled = false

    const refresh = () => {
      if (!cancelled) refreshScrollTrigger()
    }

    const fontsReady = document.fonts?.ready
    if (fontsReady) void fontsReady.then(refresh).catch(() => undefined)

    const timer = window.setTimeout(refresh, 900)
    window.addEventListener('load', refresh)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      window.removeEventListener('load', refresh)
    }
  }, [])

  return null
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <MotionConfig reducedMotion="user">
        <LenisProvider>
          <ScrollTriggerRefresher />
          <CustomCursor />
          {children}
        </LenisProvider>
      </MotionConfig>
    </I18nProvider>
  )
}
