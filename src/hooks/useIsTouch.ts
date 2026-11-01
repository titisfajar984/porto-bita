import { useMediaQuery } from '@/hooks/useMediaQuery'

/** True on touch-first devices (`pointer: coarse`) — gates magnetic/tilt/cursor. */
export function useIsTouch(): boolean {
  return useMediaQuery('(pointer: coarse)')
}
