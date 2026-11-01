import { useState } from 'react'

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number
}

/**
 * Heuristic for weak hardware (AGENT.md §8): ≤ 4 logical cores or ≤ 4 GB of
 * device memory means we serve the static 3D fallback instead of the canvas.
 * Read once on mount — the values never change during a session.
 */
export function useLowPower(): boolean {
  const [lowPower] = useState(() => {
    if (typeof navigator === 'undefined') return false
    const cores = navigator.hardwareConcurrency ?? 8
    const memory = (navigator as NavigatorWithMemory).deviceMemory
    return cores <= 4 || (typeof memory === 'number' && memory <= 4)
  })

  return lowPower
}
