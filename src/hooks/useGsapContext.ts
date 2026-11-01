import { useLayoutEffect, useRef, type RefObject } from 'react'

import { gsap, registerGsap } from '@/lib/gsap'

/**
 * Own `useGSAP` helper (AGENT.md §7.1 — no extra dependency). Every animation
 * is created inside `gsap.context()` scoped to `scopeRef` and reverted on
 * cleanup, so React StrictMode's double mount cannot leak timelines.
 *
 * Runs in a layout effect so the `from` values are applied before first paint —
 * no flash of un-animated content.
 */
export function useGsapContext(
  setup: (scope: HTMLElement) => void,
  deps: readonly unknown[] = [],
): RefObject<HTMLElement | null> {
  const scopeRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const scope = scopeRef.current
    if (!scope) return
    registerGsap()
    const ctx = gsap.context(() => setup(scope), scope)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return scopeRef
}
