import { useMediaQuery } from '@/hooks/useMediaQuery'

/** True when the OS asks for reduced motion (DESIGN.md §9.3). */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
