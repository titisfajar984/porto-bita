import { useEffect } from 'react'

let lockCount = 0

/** Freeze background scrolling while a modal surface is open (AGENT.md §11). */
export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active || typeof document === 'undefined') return

    lockCount += 1
    const { body } = document
    const previousOverflow = body.style.overflow
    const previousPadding = body.style.paddingRight
    const scrollbar = window.innerWidth - document.documentElement.clientWidth

    body.style.overflow = 'hidden'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`

    return () => {
      lockCount -= 1
      if (lockCount <= 0) {
        lockCount = 0
        body.style.overflow = previousOverflow
        body.style.paddingRight = previousPadding
      }
    }
  }, [active])
}
